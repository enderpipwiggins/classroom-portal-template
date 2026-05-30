import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'page/donations',
    loadComponent: () => import('./pages/donations/donations').then((m) => m.Donations),
  },
  {
    path: 'page/about',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'page/contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'page/affiliate-disclosure',
    loadComponent: () =>
      import('./components/affiliate-disclosure/affiliate-disclosure').then(
        (m) => m.AffiliateDisclosure,
      ),
  },
  // ─── Example route (disabled) ─────────────────────────────────────────────
  // A ready-made pattern for adding your own page. Uncomment to enable it at
  // /page/example, then see docs/adding-a-page.md for the full walkthrough.
  // Keep new routes ABOVE the '**' wildcard below, or they'll never match.
  // {
  //   path: 'page/example',
  //   loadComponent: () => import('./pages/example/example').then((m) => m.Example),
  // },

  {
    path: '**',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found').then((m) => m.PageNotFound),
  },
];
