import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { PaapiConfig } from './paapi-client';

// Shared mock fns, hoisted so the vi.mock factory can close over them.
const mocks = vi.hoisted(() => ({
  getItems: vi.fn(),
  constructFromObject: vi.fn((data: unknown) => data),
}));

vi.mock('paapi5-nodejs-sdk', () => ({
  default: {
    ApiClient: { instance: {} as Record<string, unknown> },
    GetItemsRequest: class {},
    DefaultApi: class {
      getItems = mocks.getItems;
    },
    GetItemsResponse: { constructFromObject: mocks.constructFromObject },
  },
}));

// Imported after the mock is registered.
const { callSdkGetItems } = await import('./paapi-client');

const CONFIG: PaapiConfig = {
  accessKey: 'ak',
  secretKey: 'sk',
  partnerTag: 'tag-20',
  host: 'webservices.amazon.com',
  region: 'us-east-1',
};

describe('callSdkGetItems (SDK boundary)', () => {
  beforeEach(() => {
    mocks.getItems.mockReset();
    mocks.constructFromObject.mockReset();
    mocks.constructFromObject.mockImplementation((data: unknown) => data);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => vi.restoreAllMocks());

  it('resolves ok with the returned items on success', async () => {
    const item = { ASIN: 'B00000000A' };
    mocks.getItems.mockImplementation((_req, cb) => cb(null, { ItemsResult: { Items: [item] } }));

    const out = await callSdkGetItems({ asin: 'B00000000A' }, CONFIG);
    expect(out).toEqual({ items: [item], ok: true });
  });

  it('honors a custom resources list and threads partner config onto the request', async () => {
    let captured: Record<string, unknown> | undefined;
    mocks.getItems.mockImplementation((req, cb) => {
      captured = req;
      cb(null, { ItemsResult: { Items: [] } });
    });

    await callSdkGetItems({ asin: 'B0', resources: ['ItemInfo.Title'] }, CONFIG);
    expect(captured?.['ItemIds']).toEqual(['B0']);
    expect(captured?.['PartnerTag']).toBe('tag-20');
    expect(captured?.['Resources']).toEqual(['ItemInfo.Title']);
  });

  it('resolves not-ok when the SDK reports an error', async () => {
    mocks.getItems.mockImplementation((_req, cb) => cb(new Error('sdk down'), null));
    expect(await callSdkGetItems({ asin: 'B0' }, CONFIG)).toEqual({ items: [], ok: false });
  });

  it('resolves not-ok (but keeps any items) on a response-level Errors array', async () => {
    mocks.getItems.mockImplementation((_req, cb) =>
      cb(null, { Errors: [{ Code: 'TooManyRequests' }], ItemsResult: { Items: [] } }),
    );
    expect(await callSdkGetItems({ asin: 'B0' }, CONFIG)).toEqual({ items: [], ok: false });
  });

  it('resolves not-ok when parsing the response throws', async () => {
    mocks.getItems.mockImplementation((_req, cb) => cb(null, { junk: true }));
    mocks.constructFromObject.mockImplementation(() => {
      throw new Error('bad shape');
    });
    expect(await callSdkGetItems({ asin: 'B0' }, CONFIG)).toEqual({ items: [], ok: false });
  });

  it('resolves not-ok when the SDK call throws synchronously', async () => {
    mocks.getItems.mockImplementation(() => {
      throw new Error('boom');
    });
    expect(await callSdkGetItems({ asin: 'B0' }, CONFIG)).toEqual({ items: [], ok: false });
  });
});
