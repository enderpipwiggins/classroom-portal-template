import { RenderMode, ServerRoute } from '@angular/ssr';

// Every page is static, so prerender the whole site to fast CDN-served HTML.
// The donations page also re-fetches its data on the client after hydration,
// so spreadsheet edits show up on the next refresh without a redeploy.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
