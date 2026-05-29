import { computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, merge, of, pipe, switchMap, tap } from 'rxjs';

import { DonationItem } from '../../services/interfaces/donation-item';
import { LINK_STORAGE } from '../../services/storage/link-storage';
import { AmazonEnrichmentService } from '../../services/amazon-enrichment';
import { humanizeSlug } from '../../utils/affiliate';

// ---------------------------------------------------------------------------
// DonationsStore — a small, complete example of NgRx SignalStore.
//
// A "store" is one place that owns a slice of state, the values derived from
// it, and the actions that change it. The donations page then just *reads* the
// store, so the page stays about layout and the store stays about state. This
// is the pattern to reach for once an app grows past a couple of pages.
//
// It is built from four composable blocks:
//   withState   — the raw state (items, loading, error)
//   withComputed — values derived from state (totalItems, grouped list)
//   withMethods  — the actions that load data and patch state
//   withHooks    — lifecycle (kick off the first load when the store is created)
// ---------------------------------------------------------------------------

interface DonationGroup {
  category: string;
  label: string;
  items: DonationItem[];
}

interface DonationsState {
  items: DonationItem[];
  loading: boolean;
  error: boolean;
}

const initialState: DonationsState = {
  items: [],
  loading: true,
  error: false,
};

const UNCATEGORIZED = 'misc';

/** Buckets items by category, alphabetises within each, and sorts the
 *  "misc" bucket last. Pure function so it is trivial to unit-test. */
function groupByCategory(items: DonationItem[]): DonationGroup[] {
  const byCategory = new Map<string, DonationItem[]>();

  for (const item of items) {
    const category = item.category?.trim() || UNCATEGORIZED;
    const bucket = byCategory.get(category) ?? [];
    bucket.push(item);
    byCategory.set(category, bucket);
  }

  return Array.from(byCategory.entries())
    .map(([category, bucket]) => ({
      category,
      label: humanizeSlug(category),
      items: [...bucket].sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => {
      if (a.category === UNCATEGORIZED) return 1;
      if (b.category === UNCATEGORIZED) return -1;
      return a.label.localeCompare(b.label);
    });
}

export const DonationsStore = signalStore(
  withState(initialState),

  // Derived values recompute automatically whenever `items` changes.
  withComputed((store) => ({
    totalItems: computed(() => store.items().length),
    groups: computed(() => groupByCategory(store.items())),
  })),

  withMethods((store) => {
    const storage = inject(LINK_STORAGE);
    const enrichment = inject(AmazonEnrichmentService);
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    // Non-blocking PAAPI enrichment: the list already shows from storage; for
    // any item with an ASIN we ask the server for a live price (and an image,
    // only when the teacher left one blank). It is a no-op until PAAPI is
    // configured, and runs in the browser only so prerendering stays static.
    const enrich = rxMethod<DonationItem[]>(
      pipe(
        map((items) => (isBrowser ? items.filter((item) => item.asin) : [])),
        switchMap((items) =>
          merge(
            ...items.map((item) =>
              enrichment.enrich(item.asin!).pipe(
                tap((result) => {
                  if (!result.available) return;
                  patchState(store, (state) => ({
                    items: state.items.map((existing) =>
                      existing.id === item.id
                        ? {
                            ...existing,
                            // The teacher's own image always wins.
                            imageUrl: existing.imageUrl || result.imageUrl || undefined,
                            price: result.price || existing.price,
                          }
                        : existing,
                    ),
                  }));
                }),
              ),
            ),
          ),
        ),
      ),
    );

    // Loads the wish list from whichever storage provider is configured.
    // rxMethod wires up (and tears down) the subscription for us.
    const load = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: store.items().length === 0, error: false })),
        switchMap(() =>
          storage.getItems().pipe(
            map((items) => ({ items, ok: true as const })),
            catchError(() => of({ items: [] as DonationItem[], ok: false as const })),
            tap((result) => {
              if (result.ok) {
                patchState(store, { items: result.items, loading: false, error: false });
                enrich(result.items);
              } else {
                patchState(store, { loading: false, error: true });
              }
            }),
          ),
        ),
      ),
    );

    return { load, enrich };
  }),

  // Load once, automatically, as soon as the store comes to life.
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
