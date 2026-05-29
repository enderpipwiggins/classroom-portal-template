import { describe, it, expect, vi } from 'vitest';
import { lookupProduct } from './product-lookup-service';
import type { PaapiItem } from 'paapi5-nodejs-sdk';

function itemWith(imageUrl?: string, price?: string): PaapiItem {
  return {
    ASIN: 'B00000000A',
    Images: imageUrl ? { Primary: { Large: { URL: imageUrl } } } : undefined,
    Offers: price ? { Listings: [{ Price: { DisplayAmount: price } }] } : undefined,
  } as PaapiItem;
}

describe('lookupProduct — default dependencies', () => {
  const PAAPI_VARS = ['PAAPI_ACCESS_KEY', 'PAAPI_SECRET_KEY', 'PAAPI_PARTNER_TAG'] as const;

  it('uses the real (unconfigured) PAAPI gate when no deps are passed', async () => {
    for (const key of PAAPI_VARS) delete process.env[key];
    // With no env vars and no deps, it falls through to isPaapiConfigured()/getItems.
    const result = await lookupProduct('B00000000A');
    expect(result).toEqual({ imageUrl: null, price: null, available: false });
  });
});

describe('lookupProduct — PAAPI gating', () => {
  it('is inert (returns unavailable) when PAAPI is not configured', async () => {
    const fetch = vi.fn();
    const result = await lookupProduct('B00000000A', { isConfigured: () => false, fetch });
    expect(result).toEqual({ imageUrl: null, price: null, available: false });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns unavailable for a blank ASIN even when configured', async () => {
    const fetch = vi.fn();
    const result = await lookupProduct('   ', { isConfigured: () => true, fetch });
    expect(result.available).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('lookupProduct — when configured', () => {
  const isConfigured = () => true;

  it('maps image and price from the first item', async () => {
    const fetch = vi.fn().mockResolvedValue({ items: [itemWith('https://img/x.jpg', '$4.99')] });
    const result = await lookupProduct('B00000000A', { isConfigured, fetch });
    expect(result).toEqual({ imageUrl: 'https://img/x.jpg', price: '$4.99', available: true });
  });

  it('returns available with a null field when only one of image/price exists', async () => {
    const fetch = vi.fn().mockResolvedValue({ items: [itemWith(undefined, '$4.99')] });
    const result = await lookupProduct('B00000000A', { isConfigured, fetch });
    expect(result).toEqual({ imageUrl: null, price: '$4.99', available: true });
  });

  it('returns unavailable when PAAPI returns no items', async () => {
    const fetch = vi.fn().mockResolvedValue({ items: [] });
    const result = await lookupProduct('B00000000A', { isConfigured, fetch });
    expect(result.available).toBe(false);
  });

  it('returns unavailable when the item has neither image nor price', async () => {
    const fetch = vi.fn().mockResolvedValue({ items: [itemWith()] });
    const result = await lookupProduct('B00000000A', { isConfigured, fetch });
    expect(result.available).toBe(false);
  });
});
