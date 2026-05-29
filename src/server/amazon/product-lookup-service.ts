import { getItems, isPaapiConfigured, type GetItemsParams } from './paapi-client';
import type { PaapiItem } from 'paapi5-nodejs-sdk';

export interface ProductLookupResult {
  imageUrl: string | null;
  price: string | null;
  available: boolean;
}

const UNAVAILABLE: ProductLookupResult = { imageUrl: null, price: null, available: false };

export interface LookupProductDeps {
  isConfigured?: () => boolean;
  fetch?: (params: GetItemsParams) => Promise<{ items: PaapiItem[] }>;
}

/**
 * Looks up a single product by ASIN and returns the bits the donations page can
 * use to enrich a link (image + display price). Returns an inert result until
 * PAAPI is configured, so callers never need to special-case "not approved yet."
 */
export async function lookupProduct(
  asin: string,
  deps: LookupProductDeps = {},
): Promise<ProductLookupResult> {
  const isConfigured = deps.isConfigured ?? isPaapiConfigured;
  const fetch = deps.fetch ?? getItems;

  if (!isConfigured()) return UNAVAILABLE;
  if (!asin.trim()) return UNAVAILABLE;

  const { items } = await fetch({ asin: asin.trim() });
  const item = items[0];
  if (!item) return UNAVAILABLE;

  const imageUrl = item.Images?.Primary?.Large?.URL ?? null;
  const price = item.Offers?.Listings?.[0]?.Price?.DisplayAmount ?? null;

  if (!imageUrl && !price) return UNAVAILABLE;
  return { imageUrl, price, available: true };
}
