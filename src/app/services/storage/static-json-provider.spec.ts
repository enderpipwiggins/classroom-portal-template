import { describe, it, expect } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { StaticJsonProvider } from './static-json-provider';

describe('StaticJsonProvider', () => {
  it('returns the bundled sample donation items', async () => {
    const items = await firstValueFrom(new StaticJsonProvider().getItems());
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.url).toBeTruthy();
    }
  });

  it('never ships a hand-typed price (prices come only from PAAPI)', async () => {
    const items = await firstValueFrom(new StaticJsonProvider().getItems());
    expect(items.every((item) => item.price === undefined)).toBe(true);
  });
});
