import { describe, it, expect, afterEach } from 'vitest';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { DonationsStore } from './donations.store';
import { DonationItem } from '../../services/interfaces/donation-item';
import { LINK_STORAGE, LinkStorageProvider } from '../../services/storage/link-storage';
import { AmazonEnrichmentService, EnrichmentResult } from '../../services/amazon-enrichment';

const SAMPLE: DonationItem[] = [
  { id: '1', title: 'Watercolors', url: 'https://a', category: 'art-supplies' },
  { id: '2', title: 'Crayons', url: 'https://b', category: 'art-supplies' },
  { id: '3', title: 'Tissues', url: 'https://c' }, // no category → "misc"
  { id: '4', title: 'Notebooks', url: 'https://d', category: 'paper' },
];

class FakeStorage implements LinkStorageProvider {
  constructor(private result: Observable<DonationItem[]>) {}
  getItems(): Observable<DonationItem[]> {
    return this.result;
  }
}

// PAAPI is irrelevant to most tests — default to "unavailable".
const inertEnrichment: Pick<AmazonEnrichmentService, 'enrich'> = {
  enrich: (): Observable<EnrichmentResult> =>
    of({ imageUrl: null, price: null, available: false }),
};

function createStore(
  storage: Observable<DonationItem[]>,
  enrichment: Pick<AmazonEnrichmentService, 'enrich'> = inertEnrichment,
  platformId: 'browser' | 'server' = 'browser',
): InstanceType<typeof DonationsStore> {
  TestBed.configureTestingModule({
    providers: [
      DonationsStore,
      { provide: LINK_STORAGE, useValue: new FakeStorage(storage) },
      { provide: AmazonEnrichmentService, useValue: enrichment },
      { provide: PLATFORM_ID, useValue: platformId },
    ],
  });
  // Injecting the store fires its onInit hook, which loads synchronously here.
  return TestBed.inject(DonationsStore);
}

describe('DonationsStore', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('loads items and clears the loading flag', () => {
    const store = createStore(of(SAMPLE));
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(false);
    expect(store.totalItems()).toBe(4);
  });

  it('groups items by category, alphabetised, with "misc" last', () => {
    const store = createStore(of(SAMPLE));
    const groups = store.groups();

    expect(groups.map((g) => g.category)).toEqual(['art-supplies', 'paper', 'misc']);
    // "Art Supplies" group is sorted alphabetically by title.
    expect(groups[0].items.map((i) => i.title)).toEqual(['Crayons', 'Watercolors']);
    // Slugs are humanised for display.
    expect(groups[0].label).toBe('Art Supplies');
  });

  it('sets the error flag when storage fails', () => {
    const store = createStore(throwError(() => new Error('network')));
    expect(store.error()).toBe(true);
    expect(store.loading()).toBe(false);
    expect(store.totalItems()).toBe(0);
  });

  it('enriches items that have an ASIN, but never overwrites a teacher image', () => {
    const items: DonationItem[] = [
      { id: 'a', title: 'Has ASIN, no image', url: 'https://a', asin: 'B00000000A' },
      {
        id: 'b',
        title: 'Has ASIN and own image',
        url: 'https://b',
        asin: 'B00000000B',
        imageUrl: 'https://teacher-photo',
      },
      { id: 'c', title: 'No ASIN', url: 'https://c' },
    ];
    const enrichment: Pick<AmazonEnrichmentService, 'enrich'> = {
      enrich: () => of({ imageUrl: 'https://amazon-img', price: '$3.99', available: true }),
    };

    const store = createStore(of(items), enrichment);
    const byId = Object.fromEntries(store.items().map((i) => [i.id, i]));

    // Blank image gets filled from PAAPI; price applied.
    expect(byId['a'].imageUrl).toBe('https://amazon-img');
    expect(byId['a'].price).toBe('$3.99');
    // Teacher's own image is preserved; price still applied.
    expect(byId['b'].imageUrl).toBe('https://teacher-photo');
    expect(byId['b'].price).toBe('$3.99');
    // No ASIN → untouched.
    expect(byId['c'].imageUrl).toBeUndefined();
    expect(byId['c'].price).toBeUndefined();
  });

  it('does not enrich during server-side rendering', () => {
    const items: DonationItem[] = [
      { id: 'a', title: 'Has ASIN', url: 'https://a', asin: 'B00000000A' },
    ];
    let called = false;
    const enrichment: Pick<AmazonEnrichmentService, 'enrich'> = {
      enrich: () => {
        called = true;
        return of({ imageUrl: 'https://amazon-img', price: '$1', available: true });
      },
    };

    const store = createStore(of(items), enrichment, 'server');
    expect(called).toBe(false);
    expect(store.items()[0].imageUrl).toBeUndefined();
    expect(store.items()[0].price).toBeUndefined();
  });

  it('ignores an enrichment result that reports the item as unavailable', () => {
    const items: DonationItem[] = [
      { id: 'a', title: 'Has ASIN', url: 'https://a', asin: 'B00000000A' },
    ];
    const enrichment: Pick<AmazonEnrichmentService, 'enrich'> = {
      enrich: () => of({ imageUrl: 'https://amazon-img', price: '$9', available: false }),
    };

    const store = createStore(of(items), enrichment);
    expect(store.items()[0].imageUrl).toBeUndefined();
    expect(store.items()[0].price).toBeUndefined();
  });

  it('leaves image and price untouched when PAAPI returns blanks', () => {
    const items: DonationItem[] = [
      { id: 'a', title: 'Has ASIN', url: 'https://a', asin: 'B00000000A' },
    ];
    const enrichment: Pick<AmazonEnrichmentService, 'enrich'> = {
      enrich: () => of({ imageUrl: null, price: null, available: true }),
    };

    const store = createStore(of(items), enrichment);
    expect(store.items()[0].imageUrl).toBeUndefined();
    expect(store.items()[0].price).toBeUndefined();
  });
});
