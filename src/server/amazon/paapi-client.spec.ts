import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getItems,
  isPaapiConfigured,
  _resetCacheForTests,
  CACHE_MAX_ENTRIES,
  ERROR_TTL_MS,
  type CallGetItemsFn,
} from './paapi-client';
import type { PaapiItem } from 'paapi5-nodejs-sdk';

const PAAPI_VARS = ['PAAPI_ACCESS_KEY', 'PAAPI_SECRET_KEY', 'PAAPI_PARTNER_TAG'] as const;

function clearPaapiEnv(): void {
  for (const key of PAAPI_VARS) delete process.env[key];
}

function setPaapiEnv(): void {
  process.env['PAAPI_ACCESS_KEY'] = 'ak';
  process.env['PAAPI_SECRET_KEY'] = 'sk';
  process.env['PAAPI_PARTNER_TAG'] = 'tag-20';
}

const sampleItem = { ASIN: 'B00000000A' } as PaapiItem;

describe('isPaapiConfigured', () => {
  beforeEach(() => {
    clearPaapiEnv();
    _resetCacheForTests();
  });
  afterEach(clearPaapiEnv);

  it('is false when the PAAPI env vars are absent', () => {
    expect(isPaapiConfigured()).toBe(false);
  });

  it('is false when only some PAAPI env vars are set', () => {
    process.env['PAAPI_ACCESS_KEY'] = 'ak';
    expect(isPaapiConfigured()).toBe(false);
  });

  it('is true once all three required PAAPI env vars are set', () => {
    setPaapiEnv();
    expect(isPaapiConfigured()).toBe(true);
  });
});

describe('getItems', () => {
  beforeEach(() => {
    clearPaapiEnv();
    _resetCacheForTests();
  });
  afterEach(clearPaapiEnv);

  it('returns no items and never calls the SDK when not configured', async () => {
    const callFn = vi.fn();
    const result = await getItems({ asin: 'B00000000A' }, callFn as unknown as CallGetItemsFn);
    expect(result.items).toEqual([]);
    expect(callFn).not.toHaveBeenCalled();
  });

  it('invokes the call function and returns its items when configured', async () => {
    setPaapiEnv();
    const callFn: CallGetItemsFn = vi.fn().mockResolvedValue({ items: [sampleItem], ok: true });
    const result = await getItems({ asin: 'B00000000A' }, callFn);
    expect(result.items).toEqual([sampleItem]);
    expect(callFn).toHaveBeenCalledTimes(1);
  });

  it('caches a successful lookup so a repeat ASIN does not call the SDK again', async () => {
    setPaapiEnv();
    const callFn: CallGetItemsFn = vi.fn().mockResolvedValue({ items: [sampleItem], ok: true });
    await getItems({ asin: 'B00000000A' }, callFn);
    await getItems({ asin: 'B00000000A' }, callFn);
    expect(callFn).toHaveBeenCalledTimes(1);
  });

  it('also caches an errored lookup (briefly) to avoid hammering on retry', async () => {
    setPaapiEnv();
    const callFn: CallGetItemsFn = vi.fn().mockResolvedValue({ items: [], ok: false });
    await getItems({ asin: 'B00000000A' }, callFn);
    await getItems({ asin: 'B00000000A' }, callFn);
    expect(callFn).toHaveBeenCalledTimes(1);
  });

  it('re-fetches once a cached entry has expired', async () => {
    vi.useFakeTimers();
    try {
      setPaapiEnv();
      const callFn: CallGetItemsFn = vi.fn().mockResolvedValue({ items: [], ok: false });
      await getItems({ asin: 'B00000000A' }, callFn);
      vi.advanceTimersByTime(ERROR_TTL_MS + 1);
      await getItems({ asin: 'B00000000A' }, callFn);
      expect(callFn).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('evicts the least-recently-used entry past the cache cap', async () => {
    setPaapiEnv();
    const callFn: CallGetItemsFn = vi.fn().mockResolvedValue({ items: [sampleItem], ok: true });

    // Fill the cache to its cap, then one more to trigger an eviction.
    for (let i = 0; i <= CACHE_MAX_ENTRIES; i++) {
      await getItems({ asin: `ASIN-${i}` }, callFn);
    }
    expect(callFn).toHaveBeenCalledTimes(CACHE_MAX_ENTRIES + 1);

    // The very first ASIN should have been evicted, so it re-fetches.
    vi.mocked(callFn).mockClear();
    await getItems({ asin: 'ASIN-0' }, callFn);
    expect(callFn).toHaveBeenCalledTimes(1);
  });
});
