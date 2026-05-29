/**
 * Server-side wrapper around the Amazon Product Advertising API v5 (PAAPI).
 *
 * SECURITY NOTE — paapi5-nodejs-sdk transitive vulnerabilities:
 *   This module depends on `paapi5-nodejs-sdk` (Amazon's official SDK), which
 *   pulls in `superagent` and `formidable` versions that trigger advisories on
 *   `npm audit`. We accept the risk because:
 *     - The SDK is server-only and never enters the browser bundle.
 *     - The endpoint is env-gated; the SDK is not exercised at all until
 *       PAAPI_ACCESS_KEY / PAAPI_SECRET_KEY / PAAPI_PARTNER_TAG are set.
 *     - The only input we hand the SDK is a validated 10-char ASIN from our
 *       own endpoint — no untrusted multipart uploads, no redirect-following.
 *   If the vulnerable transitive deps ever become exploitable in this usage
 *   pattern, swap for a community wrapper (e.g. `amazon-paapi`) or implement
 *   AWS SigV4 directly (~150 LOC).
 */
import PAAPI, { type PaapiItem, type PaapiGetItemsResponse } from 'paapi5-nodejs-sdk';

export interface PaapiConfig {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  host: string;
  region: string;
}

function readConfig(): PaapiConfig | null {
  const accessKey = process.env['PAAPI_ACCESS_KEY'];
  const secretKey = process.env['PAAPI_SECRET_KEY'];
  const partnerTag = process.env['PAAPI_PARTNER_TAG'];
  if (!accessKey || !secretKey || !partnerTag) return null;
  return {
    accessKey,
    secretKey,
    partnerTag,
    host: process.env['PAAPI_HOST'] || 'webservices.amazon.com',
    region: process.env['PAAPI_REGION'] || 'us-east-1',
  };
}

export function isPaapiConfigured(): boolean {
  return readConfig() !== null;
}

export const DEFAULT_RESOURCES = [
  'Images.Primary.Large',
  'ItemInfo.Title',
  'Offers.Listings.Price',
];

export interface GetItemsParams {
  asin: string;
  resources?: string[];
}

interface CacheEntry {
  value: PaapiItem[];
  expiresAt: number;
}

export const SUCCESS_TTL_MS = 24 * 60 * 60 * 1000;
// Errors are cached briefly so a transient PAAPI hiccup doesn't trigger
// hammering on retry, but never long enough to lock out for the day.
export const ERROR_TTL_MS = 60 * 1000;
export const CACHE_MAX_ENTRIES = 500;

const cache = new Map<string, CacheEntry>();

function cacheGet(key: string): PaapiItem[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  // Move to the end of insertion order to mark as recently used (true LRU).
  cache.delete(key);
  cache.set(key, entry);
  return entry.value;
}

function cacheSet(key: string, value: PaapiItem[], ok: boolean): void {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    // Evict the least-recently-used entry (head of insertion order).
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  const ttl = ok ? SUCCESS_TTL_MS : ERROR_TTL_MS;
  cache.set(key, { value, expiresAt: Date.now() + ttl });
}

/** Test helper. Not for production use. */
export function _resetCacheForTests(): void {
  cache.clear();
}

export interface GetItemsOutcome {
  items: PaapiItem[];
  /** False when the call errored or PAAPI returned a response-level Errors array. */
  ok: boolean;
}

export type CallGetItemsFn = (
  params: GetItemsParams,
  config: PaapiConfig,
) => Promise<GetItemsOutcome>;

/**
 * Default implementation that actually invokes the SDK. Exported so tests can
 * substitute their own implementation without resorting to module mocking.
 */
export const callSdkGetItems: CallGetItemsFn = (params, config) => {
  const client = PAAPI.ApiClient.instance;
  client.accessKey = config.accessKey;
  client.secretKey = config.secretKey;
  client.host = config.host;
  client.region = config.region;

  const request = new PAAPI.GetItemsRequest();
  request['PartnerTag'] = config.partnerTag;
  request['PartnerType'] = 'Associates';
  request['ItemIds'] = [params.asin];
  request['Resources'] = params.resources ?? DEFAULT_RESOURCES;

  const api = new PAAPI.DefaultApi();

  return new Promise<GetItemsOutcome>((resolve) => {
    try {
      api.getItems(request, (error, data) => {
        if (error) {
          console.error('[paapi] getItems error:', error);
          resolve({ items: [], ok: false });
          return;
        }
        try {
          const parsed: PaapiGetItemsResponse = PAAPI.GetItemsResponse.constructFromObject(data);
          if (parsed.Errors?.length) {
            console.error('[paapi] response Errors:', parsed.Errors);
            resolve({ items: parsed.ItemsResult?.Items ?? [], ok: false });
            return;
          }
          resolve({ items: parsed.ItemsResult?.Items ?? [], ok: true });
        } catch (parseErr) {
          console.error('[paapi] parse error:', parseErr);
          resolve({ items: [], ok: false });
        }
      });
    } catch (ex) {
      console.error('[paapi] thrown:', ex);
      resolve({ items: [], ok: false });
    }
  });
};

export async function getItems(
  params: GetItemsParams,
  callFn: CallGetItemsFn = callSdkGetItems,
): Promise<{ items: PaapiItem[] }> {
  const config = readConfig();
  if (!config) return { items: [] };

  const cacheKey = JSON.stringify({ ...params, partnerTag: config.partnerTag, host: config.host });
  const cached = cacheGet(cacheKey);
  if (cached) return { items: cached };

  const { items, ok } = await callFn(params, config);
  cacheSet(cacheKey, items, ok);
  return { items };
}
