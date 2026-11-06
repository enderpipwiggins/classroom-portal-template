# Classroom Portal

A free, ready-to-deploy website template for **classroom supply wish lists**. It
gives you two pages — a friendly **landing page** and a **donations page** that
lists items on Amazon — so families and community members can buy supplies for
your class directly. When you become an Amazon Associate, qualifying purchases
earn a small commission (at no extra cost to the buyer) that you can put toward
more classroom needs.

Built with Angular and designed to run on **Vercel's free Hobby tier**
. One
honest caveat: that free tier is for *non-commercial* use, so once your links
start earning commissions, Vercel expects you to move to its **Pro** plan
(about **$20/month**) — the kind of cost the classroom fund is meant to cover.
See [Costs Over Time](docs/costs.md) for the full picture.

> **New to all this?** Start with the **[Teacher's Guide](docs/teacher-guide.md)** —
> a step-by-step, plain-language walkthrough with no jargon. You do **not** need
> to know how to code to use this template.

---

## What you get

- **Landing page** — a welcoming hero and a simple "how it works" section.
- **Donations page** — your supply list, grouped by category, each item linking
  to Amazon. Optionally enriched with live images and prices once you have
  Amazon's Product Advertising API (PAAPI) access.
- **Five themes** — pick a look with one setting, or design your own.
- **Two easy ways to manage your list** — a Google Sheet (recommended) or a file
  you edit on GitHub. No database, no API keys to start.
- **Affiliate disclosure page** and footer notice, included for compliance.

---

## Make it yours (a private copy)

The GitHub **Fork** button isn't quite what you want here: a fork of a public
repo is itself public and stays linked to the original. To get a **private** copy
that's fully your own, create a new repository *from this template* instead.

**No terminal (recommended for most teachers):** on this template's GitHub page,
click **Use this template → Create a new repository**, give it a name like
`classroom-portal`, choose **Private**, and click **Create repository**. Done.
(The [Teacher's Guide](docs/teacher-guide.md#procedure-1-create-a-github-account-and-repository)
walks through this with screenshots-level detail.)

**With a terminal:** the helper script does the same thing via the
[GitHub CLI](https://cli.github.com/) — it creates a private repo from the
template and clones it for you:

```bash
bash scripts/fork-private.sh        # prompts for a name, then creates + clones
```

It checks that `gh` is installed and signed in (walking you through login if
not). You can also pass a name directly: `bash scripts/fork-private.sh my-room`.

> Both paths rely on this repo being marked as a **template repository** on
> GitHub (Settings → General → "Template repository"). If you're the maintainer
> and the option above is missing, enable that first.

---

## Quick start (the short version)

**Prerequisite — Node.js.** The terminal commands below need
[Node.js](https://nodejs.org/) installed on your computer (it bundles `npm`, used
to install and run everything). Use an active **LTS** release — version
**20.19+**, **22.12+**, or **24+**:

- **Easiest:** download the **LTS** installer for your operating system from
  [nodejs.org](https://nodejs.org/) and run it.
- **Managing several versions?** Use [nvm](https://github.com/nvm-sh/nvm)
  (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows).
- **Check it worked:** `node -v` and `npm -v` should each print a version number.

> **You only need Node to edit or run the site on your own computer.** The
> website-only path (GitHub + Vercel) builds everything in the cloud, so a
> teacher who just wants to launch and manage their list doesn't have to install
> anything — see the [Teacher's Guide](docs/teacher-guide.md).

If you're comfortable with a terminal:

```bash
npm install
npm start          # dev server at http://localhost:4200
npm run build      # production build
npm test           # run the unit tests
```

With zero configuration the site runs on bundled sample data and the default
theme. To personalize it, run the guided setup:

```bash
npm run setup      # asks a few questions and writes your .env
```

Prefer to do it by hand? Copy `.env.example` to `.env` and edit the values, or
set them in Vercel. Every variable is optional.

**Not comfortable with a terminal? That's expected.** The
[Teacher's Guide](docs/teacher-guide.md) shows you how to do everything through
the GitHub and Vercel websites instead — no terminal required.

---

## Configuration (environment variables)

All personalization is done through environment variables, baked in at build
time. See [`.env.example`](.env.example) for the annotated source of truth.

> **The JSON values (`HOW_IT_WORKS_JSON`, `SOCIAL_LINKS_JSON`) look intimidating?**
> You don't have to hand-write them. Copy the example from `.env.example` into any
> AI assistant (ChatGPT, Claude, etc.), describe in plain words what you want it to
> say, and ask it to hand you the finished line. Fiddly formatting like this is
> exactly what those tools are good at — no prior coding knowledge needed.

| Variable | What it does | Default |
| --- | --- | --- |
| `SITE_TITLE` | Site name in the header and browser tab | `Our Classroom Portal` |
| `SITE_TAGLINE` | Short phrase under the title on the landing page | `A little help goes a long way` |
| `SITE_DESCRIPTION` | Description for search engines and social shares | (sample text) |
| `SITE_URL` | Your live address, used for SEO/social previews. Optional on Vercel — defaults to your Vercel production domain (and your custom domain once added); set only to override. | Vercel domain, else `https://example.com` |
| `DONATIONS_TITLE` | Heading on the donations page | `Our Classroom Wish List` |
| `DONATIONS_INTRO` | Intro paragraph on the donations page | (sample text) |
| `HOW_IT_WORKS_JSON` | Landing-page "how it works" steps, as a JSON array of `{title, body}`. `[]` hides the section. A good spot to disclose where commissions go (e.g. a class party). | (three default steps) |
| `CONTACT_EMAIL` | Address shown on the contact page | `teacher@example.com` |
| `SHIPPING_ADDRESS` | Optional public address shown on the donations page for shipping donations. Hidden when empty. **Use a school address, never a home one** (it's public). `\n` for line breaks. | empty |
| `SOCIAL_LINKS_JSON` | Optional footer social links (JSON array) | none |
| `THEME_INDEX` | Which theme to compile, `0`–`4` (`0` = your custom theme) | `0` |
| `STORAGE_PROVIDER` | `static-json` or `google-sheets` | `static-json` |
| `GOOGLE_SHEET_CSV_URL` | Published-CSV link (only for `google-sheets`) | empty |
| `AMAZON_ASSOCIATE_TAG` | Your Associates tracking tag | empty |
| `PAAPI_ACCESS_KEY` | PAAPI key — optional, advanced (secret) | empty |
| `PAAPI_SECRET_KEY` | PAAPI secret — optional, advanced (secret) | empty |
| `PAAPI_PARTNER_TAG` | PAAPI partner tag — optional, advanced | empty |
| `PAAPI_HOST` | PAAPI host (non-US marketplaces only) | `webservices.amazon.com` |
| `PAAPI_REGION` | PAAPI region (non-US marketplaces only) | `us-east-1` |

> **Themes need a redeploy.** `THEME_INDEX` is read when the site is built, so
> changing it takes effect after Vercel rebuilds.

---

## Documentation

- **[Teacher's Guide](docs/teacher-guide.md)** — the complete, beginner-friendly
  walkthrough: Amazon Associates, getting links, GitHub, Vercel, env vars,
  domains, and a glossary.
- **[Link Storage Options](docs/link-storage-options.md)** — compares Google
  Sheets, a JSON file, Airtable, Supabase, Notion, and Thirsty Affiliates.
- **[Importing Your Amazon Wish List](docs/from-amazon-wishlist.md)** — turn an
  existing Amazon Wish List into your donations page, one tracking link at a time.
- **[Using Other Affiliate Programs](docs/other-affiliate-programs.md)** — use
  Walmart or other retailers' affiliate links (only Amazon gets auto images/prices).
- **[Customizing the Look](docs/customizing-css.md)** — choosing a theme and
  editing your own colors and fonts through the GitHub website.
- **[Adding a New Page](docs/adding-a-page.md)** — for developers: the
  copy-this-example pattern for adding a component and route to your fork.
- **[Costs Over Time](docs/costs.md)** — what's free, what costs money later, and
  what's out of scope.
- **[Disclosures](docs/disclosures.md)** — FTC and Amazon Associates compliance,
  the license, and intended use.

---

## For developers (and teaching it)

This template is also meant to be a clean, modern Angular reference you can learn
from or teach with. It uses Angular's current building blocks — standalone
components, **zoneless** change detection, **signals**, and SSR with
prerendering — so the patterns here are the ones worth carrying into bigger apps.

State management is handled with **[NgRx SignalStore](https://ngrx.io/guide/signals/signal-store)**.
The donations page is the worked example: instead of scattering `loading`,
`error`, and `items` signals through the component, a single store owns them.

- **[`donations.store.ts`](src/app/pages/donations/donations.store.ts)** — a
  small, heavily-commented store showing the four SignalStore blocks:
  `withState` (the data), `withComputed` (derived values like the grouped list),
  `withMethods` (the `load` action, written with `rxMethod`), and `withHooks`
  (load once on init).
- **[`donations.ts`](src/app/pages/donations/donations.ts)** — the component now
  just *reads* the store, so it stays focused on layout.
- **[`donations.store.spec.ts`](src/app/pages/donations/donations.store.spec.ts)** —
  shows how to unit-test a store by swapping in a fake storage provider.

The store is provided at the component level (a *feature-scoped* store), and the
async load flows through the same pluggable `LINK_STORAGE` provider the rest of
the app uses — so the pattern stays the same whether your list lives in a Google
Sheet or a JSON file. For a two-page site this is admittedly more structure than
strictly necessary; it's here on purpose, as a foundation to grow into.

---

## License

Released under the [MIT License](LICENSE). Please read [NOTICE.md](NOTICE.md) for
the intended use — this template was made to help elementary-school teachers, and
it's free for anyone to use.
