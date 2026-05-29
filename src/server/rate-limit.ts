import type { Request, Response, NextFunction, RequestHandler } from 'express';

export interface RateLimitOptions {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Max requests allowed per key within the window. */
  max: number;
  /** Cap on tracked keys; oldest entries are pruned past this. Defaults to 10_000. */
  maxKeys?: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Minimal per-IP fixed-window rate limiter middleware.
 *
 * Lives in-memory: each serverless invocation has its own counter, so the
 * effective limit is (max * number-of-warm-instances). That's fine for our
 * use case — the goal is "stop a single client from exhausting the PAAPI
 * quota," not strict global enforcement.
 */
export function rateLimit(opts: RateLimitOptions): RequestHandler {
  const max = opts.max;
  const windowMs = opts.windowMs;
  const maxKeys = opts.maxKeys ?? 10_000;
  const buckets = new Map<string, Bucket>();

  function prune(now: number): void {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const key = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count++;
    if (bucket.count > max) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.set('Retry-After', String(retryAfter));
      res.status(429).json({ error: 'Too many requests' });
      return;
    }
    if (buckets.size > maxKeys) prune(now);
    next();
  };
}
