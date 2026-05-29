import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { lookupProduct } from './server/amazon/product-lookup-service';
import { rateLimit } from './server/rate-limit';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Honor X-Forwarded-For from Vercel's edge so rate limiting and req.ip see
// the actual client address rather than the proxy.
app.set('trust proxy', true);

const amazonEnrichRateLimit = rateLimit({ windowMs: 60_000, max: 30 });

/**
 * Enriches a donation item with Amazon imagery/price by ASIN, via the Product
 * Advertising API. Returns { imageUrl, price, available }. Stays inert
 * (available: false) until the PAAPI_* env vars are configured, so the site
 * works the same before and after Amazon grants API access.
 *
 * Rate-limited to 30 req/min/IP so a single client can't bypass the 24h cache
 * by varying inputs and exhaust the PAAPI quota (which starts at 1 TPS).
 */
app.get('/api/amazon/enrich', amazonEnrichRateLimit, async (req, res) => {
  const asin = typeof req.query['asin'] === 'string' ? req.query['asin'].trim() : '';
  if (!/^[A-Za-z0-9]{10}$/.test(asin)) {
    res.status(400).json({ error: 'asin query param required (10 alphanumeric chars)' });
    return;
  }
  try {
    const result = await lookupProduct(asin);
    res.set('Cache-Control', 'public, max-age=86400');
    res.json(result);
  } catch (err) {
    console.error('[api/amazon/enrich] unexpected error:', err);
    res.json({ imageUrl: null, price: null, available: false });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is run via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
