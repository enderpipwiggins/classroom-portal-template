import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError, NEVER } from 'rxjs';
import { Donations } from './donations';
import { DonationItem } from '../../services/interfaces/donation-item';
import { LINK_STORAGE } from '../../services/storage/link-storage';
import { AmazonEnrichmentService } from '../../services/amazon-enrichment';
import { environment } from '../../../environments/environment';

const ITEMS: DonationItem[] = [
  { id: '1', title: 'Glue Sticks', url: 'https://a', category: 'art-supplies' },
  { id: '2', title: 'Pencils', url: 'https://b', category: 'art-supplies' },
];

describe('Donations (component)', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: LINK_STORAGE, useValue: { getItems: () => of(ITEMS) } },
        {
          provide: AmazonEnrichmentService,
          useValue: { enrich: () => of({ imageUrl: null, price: null, available: false }) },
        },
      ],
    }),
  );

  // `store`/`retry` are protected on the component; reach them via a cast.
  type Probe = {
    store: { error(): boolean; totalItems(): number };
    retry(): void;
    skeletonItems: number[];
  };

  it('renders donation links from the store once loaded', () => {
    const fixture = TestBed.createComponent(Donations);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a.donation-link');
    expect(links.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Glue Sticks');
    const probe = fixture.componentInstance as unknown as Probe;
    expect(probe.skeletonItems.length).toBeGreaterThan(0);
  });

  it('retry() re-triggers a load without error', () => {
    const fixture = TestBed.createComponent(Donations);
    fixture.detectChanges();
    const probe = fixture.componentInstance as unknown as Probe;
    probe.retry();
    fixture.detectChanges();
    expect(probe.store.error()).toBe(false);
    expect(probe.store.totalItems()).toBe(2);
  });

  it('shows the error state with a retry button when the store fails', () => {
    TestBed.overrideProvider(LINK_STORAGE, {
      useValue: { getItems: () => throwError(() => new Error('boom')) },
    });
    const fixture = TestBed.createComponent(Donations);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.error-state button')).toBeTruthy();
  });

  it('shows skeleton placeholders while the first load is in flight', () => {
    TestBed.overrideProvider(LINK_STORAGE, { useValue: { getItems: () => NEVER } });
    const fixture = TestBed.createComponent(Donations);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.skeleton-item').length).toBeGreaterThan(0);
  });

  it('shows the empty state when no items are returned', () => {
    TestBed.overrideProvider(LINK_STORAGE, { useValue: { getItems: () => of([]) } });
    const fixture = TestBed.createComponent(Donations);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();
  });

  it('hides the shipping address callout when none is configured', () => {
    const fixture = TestBed.createComponent(Donations);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.shipping-box')).toBeFalsy();
  });

  it('shows the shipping address callout when one is configured', () => {
    const original = environment.shippingAddress;
    (environment as { shippingAddress: string }).shippingAddress = 'Ms. Smith — Room 12';
    try {
      const fixture = TestBed.createComponent(Donations);
      fixture.detectChanges();
      const box = fixture.nativeElement.querySelector('.shipping-box');
      expect(box).toBeTruthy();
      expect(box.textContent).toContain('Ms. Smith — Room 12');
    } finally {
      (environment as { shippingAddress: string }).shippingAddress = original;
    }
  });

  it('renders the image, price, and note for a fully populated item', () => {
    const rich: DonationItem[] = [
      {
        id: '1',
        title: 'Glue Sticks',
        url: 'https://a',
        category: 'art-supplies',
        imageUrl: 'https://img.example/glue.png',
        price: '$5.00',
        note: 'The best glue',
      },
    ];
    TestBed.overrideProvider(LINK_STORAGE, { useValue: { getItems: () => of(rich) } });
    const fixture = TestBed.createComponent(Donations);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('img.donation-thumb')?.getAttribute('src')).toBe(
      'https://img.example/glue.png',
    );
    expect(el.querySelector('.donation-price')?.textContent).toContain('$5.00');
    expect(el.querySelector('.donation-note')?.textContent).toContain('The best glue');
  });
});
