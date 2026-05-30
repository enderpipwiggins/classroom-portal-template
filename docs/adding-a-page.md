# Adding a New Page

This template uses plain Angular routing — no NgRx router, no special framework
layer. A page is just a **standalone component** that's lazy-loaded by a route.
This guide walks through adding one, end to end. It's written so a developer
*or* an AI assistant working on a fork can follow it as a repeatable pattern.

> **Start from the example.** The folder
> [`src/app/pages/example/`](../src/app/pages/example/) is a complete, working
> page built to be copied. Its route is already written (commented out) in
> [`src/app/app.routes.ts`](../src/app/app.routes.ts). The fastest path is:
> copy that folder, rename things, and uncomment the route.

---

## The five steps

### 1. Create the component

Copy the example folder and rename it:

```bash
cp -r src/app/pages/example src/app/pages/my-page
```

Then in `src/app/pages/my-page/`, rename the files and update the class. The
conventions (all shown in the example) are:

- a **standalone** component (no NgModule) with an `app-` selector
- `imports: [RouterLink]` if the template links to other pages
- read configured values from `environment` (see
  [`.env.example`](../.env.example))
- set the page title and preview tags in `ngOnInit` via `SeoService` (step 4)

Prefer the CLI? `npx ng generate component pages/my-page` scaffolds the same
shape; you then add the `SeoService` call yourself.

### 2. Register the route

Add an entry to the `routes` array in
[`src/app/app.routes.ts`](../src/app/app.routes.ts). **Put it above the `'**'`
wildcard** — that wildcard is the catch-all 404 page, so anything after it never
matches:

```ts
{
  path: 'page/my-page',
  loadComponent: () => import('./pages/my-page/my-page').then((m) => m.MyPage),
},
```

`loadComponent` lazy-loads the page, so it ships as its own small chunk and
doesn't bloat the initial bundle.

### 3. Link to it (optional)

A route works as soon as it's registered — you can visit `/page/my-page`
directly. To make it discoverable, add it to the navigation:

- **Header menu:** add `{ label: 'My Page', path: '/page/my-page' }` to the
  `navLinks` array in
  [`src/app/layout/header/header.ts`](../src/app/layout/header/header.ts).
- **Footer:** add a `<li>` to the footer nav in
  [`src/app/layout/footer/footer.html`](../src/app/layout/footer/footer.html).

Use `routerLink` (not `href`) for in-app links so navigation stays instant and
client-side.

### 4. Set the page's SEO

In `ngOnInit`, call `SeoService.setPage(title, description, url)` — this sets the
`<title>` and the Open Graph / Twitter preview tags. Pass the page's own URL:

```ts
this.seoService.setPage(
  'My Page',
  'A short description for search engines and social shares.',
  `${environment.siteUrl}/page/my-page`,
);
```

### 5. Test it

Copy the example's spec ([`example.spec.ts`](../src/app/pages/example/example.spec.ts))
and adjust the class name. Then:

```bash
npm test           # runs the unit tests
npm start          # preview locally at http://localhost:4200/page/my-page
```

---

## What you do *not* need to do

- **Server-side rendering / prerendering is automatic.** The SSR config in
  [`src/app/app.routes.server.ts`](../src/app/app.routes.server.ts) prerenders
  every route (`path: '**'`), so your new page is statically generated with no
  extra step.
- **No route module or registration elsewhere.** The single `routes` array in
  `app.routes.ts` is the whole routing map.

---

## A note on state (NgRx Signals)

Most pages don't need shared state — read what you need from `environment` and
render it, like the example does. The one place this template uses a store is the
donations page ([`donations.store.ts`](../src/app/pages/donations/donations.store.ts)),
built with **`@ngrx/signals`** (a lightweight signal store — *not* an NgRx
router; this project has no router-store). Reach for that pattern only if a page
has genuinely dynamic, fetched, or shared state. A static page never needs it.
