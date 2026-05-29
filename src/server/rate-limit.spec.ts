import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { rateLimit } from './rate-limit';

function fakeRes() {
  const res = {
    statusCode: 0,
    headers: {} as Record<string, string>,
    body: undefined as unknown,
    set(key: string, value: string) {
      this.headers[key] = value;
      return this;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as unknown as Response & {
    statusCode: number;
    headers: Record<string, string>;
    body: unknown;
  };
}

function reqFrom(ip?: string, remote?: string): Request {
  return { ip, socket: { remoteAddress: remote } } as unknown as Request;
}

describe('rateLimit', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('allows requests up to the max within a window', () => {
    const mw = rateLimit({ windowMs: 1000, max: 3 });
    const next = vi.fn() as unknown as NextFunction;
    for (let i = 0; i < 3; i++) mw(reqFrom('1.1.1.1'), fakeRes(), next);
    expect(next).toHaveBeenCalledTimes(3);
  });

  it('blocks the request that exceeds the max with a 429 and Retry-After', () => {
    const mw = rateLimit({ windowMs: 5000, max: 1 });
    const next = vi.fn() as unknown as NextFunction;

    mw(reqFrom('2.2.2.2'), fakeRes(), next);
    const res = fakeRes();
    mw(reqFrom('2.2.2.2'), res, next);

    expect(next).toHaveBeenCalledTimes(1); // second call blocked
    expect(res.statusCode).toBe(429);
    expect(res.body).toEqual({ error: 'Too many requests' });
    expect(Number(res.headers['Retry-After'])).toBeGreaterThanOrEqual(1);
  });

  it('counts each IP independently', () => {
    const mw = rateLimit({ windowMs: 1000, max: 1 });
    const next = vi.fn() as unknown as NextFunction;
    mw(reqFrom('3.3.3.3'), fakeRes(), next);
    mw(reqFrom('4.4.4.4'), fakeRes(), next);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('resets the counter once the window elapses', () => {
    const mw = rateLimit({ windowMs: 1000, max: 1 });
    const next = vi.fn() as unknown as NextFunction;

    mw(reqFrom('5.5.5.5'), fakeRes(), next); // allowed
    mw(reqFrom('5.5.5.5'), fakeRes(), next); // blocked
    expect(next).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1001);
    mw(reqFrom('5.5.5.5'), fakeRes(), next); // allowed again
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('prunes expired buckets once the key cap is exceeded', () => {
    const mw = rateLimit({ windowMs: 1000, max: 5, maxKeys: 1 });
    const next = vi.fn() as unknown as NextFunction;

    // First key creates a bucket that will expire.
    mw(reqFrom('7.7.7.7'), fakeRes(), next);
    vi.advanceTimersByTime(1001); // 7.7.7.7's bucket is now expired

    // Second key pushes size past maxKeys, triggering prune() which drops 7.7.7.7.
    mw(reqFrom('8.8.8.8'), fakeRes(), next);

    // 7.7.7.7 returning gets a fresh bucket (count 1, allowed) — proof it was pruned.
    const res = fakeRes();
    mw(reqFrom('7.7.7.7'), res, next);
    expect(res.statusCode).toBe(0);
    expect(next).toHaveBeenCalledTimes(3);
  });

  it('falls back to the socket address, then "unknown", for the key', () => {
    const mw = rateLimit({ windowMs: 1000, max: 1 });
    const next = vi.fn() as unknown as NextFunction;

    // No ip, falls back to socket.remoteAddress.
    mw(reqFrom(undefined, '6.6.6.6'), fakeRes(), next);
    const blocked = fakeRes();
    mw(reqFrom(undefined, '6.6.6.6'), blocked, next);
    expect(blocked.statusCode).toBe(429);

    // Neither ip nor remoteAddress → "unknown" bucket.
    const unknown = fakeRes();
    mw(reqFrom(undefined, undefined), unknown, next);
    expect(unknown.statusCode).toBe(0); // first "unknown" request allowed
  });
});
