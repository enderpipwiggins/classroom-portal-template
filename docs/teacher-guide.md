# The Teacher's Guide

Welcome! This guide walks you through everything needed to put your classroom
wish list online — in plain language, with no coding required. You'll do almost
everything through ordinary websites (GitHub, Vercel, Amazon), clicking buttons
and filling in forms.

Take it one section at a time. You can stop after any step and come back later;
nothing breaks if you take a week between steps.

**The big picture, in five moves:**

1. Put your website's files online (GitHub).
2. Turn those files into a live website (Vercel) — **free to launch.**
3. Add your supply list (a Google Sheet or a file you edit on GitHub).
4. Sign up for Amazon Associates so your links can earn for the classroom.
5. (Later, optional) Turn on automatic prices and pictures (PAAPI).

> **One cost to know up front:** launching and running the site is free, but
> Vercel's free **Hobby** tier is for *non-commercial* use. Once your Amazon
> links start earning commissions, Vercel expects you to move to its **Pro**
> plan (about **$20/month**) — which is exactly what the classroom fund is meant
> to cover. It's not free forever once it's earning; see
> [Costs Over Time](costs.md) for the full picture.

**A quick note on order:** this guide is arranged the way it actually unfolds.
Get your site **live** first (Procedures 1, 3, and 4), then create your Amazon
Associates account and add your tracking links (Procedures 5–7). Full Amazon
**approval** comes *last* (Procedure 9) for a good reason: Amazon only approves
you after your live links make a few sales, so you can't finish it until
everything else is up and running. A custom domain (Procedure 8) is optional
polish, and Procedure 2 (installing the developer tools) is **optional** too —
skip it unless you want to edit the code on your own computer.

There's a [glossary](#glossary-of-terms) at the end. Any time a word looks
unfamiliar, jump down and look it up.

---

## Table of contents

1. [Create a GitHub account and repository](#procedure-1-create-a-github-account-and-repository)
2. [Set up a local development environment (optional)](#procedure-2-set-up-a-local-development-environment-optional)
3. [Create a Vercel account and connect your repo](#procedure-3-create-a-vercel-account-and-connect-your-repo)
4. [Add or update environment variables in Vercel](#procedure-4-add-or-update-environment-variables-in-vercel)
5. [Create an Amazon Associates account](#procedure-5-create-an-amazon-associates-account)
6. [Get a tracking link for a product](#procedure-6-get-a-tracking-link-for-a-product)
7. [Add a link so it appears on your donations page](#procedure-7-add-a-link-to-your-donations-page)
8. [Reserve a domain name and connect it](#procedure-8-reserve-a-domain-name-and-connect-it)
9. [Getting approved & qualifying for PAAPI](#procedure-9-getting-approved-and-qualifying-for-paapi)

[Glossary of terms](#glossary-of-terms)

---

## Procedure 1: Create a GitHub account and repository

GitHub is a free website that stores your project's files. "Pushing" or
"uploading" your template here is what lets Vercel build your site.

1. Go to **https://github.com** and click **Sign up**. Choose the free plan.
2. Verify your email address.
3. Get this template's files onto your computer or directly into your account:
   - **Easiest (no terminal):** open this template's page on GitHub and click
     **Use this template → Create a new repository**. Give it a name like
     `classroom-portal`, choose **Public** or **Private**, and click
     **Create repository**. You're done — skip to Procedure 3.
   - **If you have the files on your computer:** click the **+** in the top-right
     of GitHub → **New repository**, name it, and follow GitHub's "push an
     existing repository" instructions shown on the new repo page.

**What you'll see next:** a page listing all the project's files (folders like
`src`, `docs`, and files like `README.md`). That means your files are safely
stored and ready to deploy.

---

## Procedure 2: Set up a local development environment (optional)

**Most teachers can skip this.** Every step in this guide works in your web
browser, and Vercel builds the site in the cloud. Do this **only if you want to
edit or run the code on your own computer** — for example, to preview design
changes before they go live.

To run the project's tools you need **Node.js** (which also installs `npm`, the
helper that downloads and runs the project's parts).

1. **Install Node.js.** Download the **LTS** version for your operating system
   from [nodejs.org](https://nodejs.org/) and run the installer. You need version
   **20.19+**, **22.12+**, or **24+** — the LTS download is always a safe choice.
   - *Managing several versions?* [nvm](https://github.com/nvm-sh/nvm)
     (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows)
     handle that. Optional.
2. **Get the files onto your computer.** On your GitHub repository page, click
   **Code → Download ZIP** and unzip it (or *clone* the repo if you use Git).
3. **Open a terminal** in the project folder and run:
   ```bash
   node -v            # should print a version number (confirms Node installed)
   npm install        # download the project's building blocks (one time)
   npm run setup      # answer a few questions to personalize your site
   npm start          # preview at http://localhost:4200
   ```

When you're happy with a change, save the files back to GitHub and Vercel
redeploys automatically. The project's [`README`](../README.md) lists the full
set of commands.

---

## Procedure 3: Create a Vercel account and connect your repo

Vercel turns your GitHub files into a real, live website — for free on the
**Hobby** tier.

> **Heads-up:** the Hobby tier is free for *non-commercial* use. Once your site
> is earning Amazon commissions, Vercel expects you to upgrade to **Pro** (about
> **$20/month**). Budget for it as your site starts to earn — see
> [Costs Over Time](costs.md#stage-1--approved-and-earning).

1. Go to **https://vercel.com** and click **Sign up**.
2. Choose **Continue with GitHub** and authorize Vercel to see your
   repositories. Pick the **Hobby** (free) plan when asked.
3. On your Vercel dashboard, click **Add New… → Project**.
4. Find your `classroom-portal` repository in the list and click **Import**.
5. Vercel auto-detects the settings (it recognizes Angular). You can leave the
   build settings as-is.
6. *(Optional)* Click **Environment Variables** and add any you want now — or do
   it later in [Procedure 4](#procedure-4-add-or-update-environment-variables-in-vercel).
7. Click **Deploy** and wait a minute or two.

**What you'll see next:** a celebration screen with a preview and a link like
`https://classroom-portal-yourname.vercel.app`. That's your live site! Visit it,
and use that address for your Amazon Associates profile. (You don't need to set
`SITE_URL` — Vercel tells the site its own address automatically; see Procedure
4.)

> **Automatic updates:** from now on, any change you save on GitHub makes Vercel
> rebuild and publish your site automatically, usually within a minute.

---

## Procedure 4: Add or update environment variables in Vercel

"Environment variables" are the settings that personalize your site — its title,
which theme to use, where your list lives, and (later) your secret PAAPI keys.
You manage them in Vercel without touching any code.

1. In Vercel, open your project and go to **Settings → Environment Variables**.
2. For each setting you want, type the **Key** (the variable name) and its
   **Value**, then click **Save**. The full list of available names is in this
   project's [`.env.example`](../.env.example) and the README table.

**Common ones to set first:**

| Key | Example value |
| --- | --- |
| `SITE_TITLE` | `Room 12 Wish List` |
| `CONTACT_EMAIL` | `you@school.org` |
| `THEME_INDEX` | `2` |
| `STORAGE_PROVIDER` | `google-sheets` |
| `GOOGLE_SHEET_CSV_URL` | (your published-CSV link) |
| `AMAZON_ASSOCIATE_TAG` | `myclassroom-20` |

> **You don't need to set `SITE_URL` on Vercel.** It's used for search-engine and
> social-share previews, and Vercel supplies your site's own production address
> automatically — including your custom domain once you add one (Procedure 8).
> Set `SITE_URL` yourself only to override that (for example, when hosting
> somewhere other than Vercel).

**Turning on PAAPI later** — add these three (mark them as **secret**; Vercel
hides their values):

| Key | Where it comes from |
| --- | --- |
| `PAAPI_ACCESS_KEY` | Amazon PAAPI credentials |
| `PAAPI_SECRET_KEY` | Amazon PAAPI credentials |
| `PAAPI_PARTNER_TAG` | usually the same as your Associates tag |

3. **Important:** after adding or changing a variable, you must **redeploy** for
   it to take effect. Go to the **Deployments** tab → open the latest deployment
   → **⋯ menu → Redeploy**. (Editing your Google Sheet contents does *not* need a
   redeploy — only changing these settings does.)

**What you'll see next:** after the redeploy finishes, reload your site and your
changes appear — the new title, the new theme, your real wish list.

---

## Procedure 5: Create an Amazon Associates account

Amazon Associates is Amazon's free affiliate program. When someone buys through
your link, you earn a small commission and the buyer pays the same price as
always.

**What you'll need first:** a regular Amazon account, and ideally your live
website address (you'll have that after [Procedure 3](#procedure-3-create-a-vercel-account-and-connect-your-repo)
— Amazon likes to see a real site).

**Steps:**

1. Go to **https://affiliate-program.amazon.com** and click **Sign up**.
2. Sign in with your normal Amazon account (or create one).
3. **Account info** — confirm your name, address, and phone number.
4. **Website list** — enter the address of your classroom site (your Vercel URL
   or custom domain). You can add it now or after launching.
5. **Profile** — Amazon asks what your site is about, who visits it, and how you
   drive traffic. Answer honestly: *"A classroom supply wish list shared with
   students' families and our school community."*
6. **Tracking ID** — Amazon gives you a tracking ID like `myclassroom-20`. Write
   it down; this is your `AMAZON_ASSOCIATE_TAG`.
7. **Payment & tax info** — you can fill this in now or later, but you'll need it
   before Amazon can pay you.

**What you'll see next:** your account is created immediately, but it is *not yet
fully approved*. That's normal — full approval comes after your links make a few
sales, which is why it's the last step (see Procedure 9).

---

## Procedure 6: Get a tracking link for a product

A "tracking link" is just an Amazon product link with your tracking ID attached,
so Amazon knows the sale came from you. There are two ways to get one.

### Way 1 — From the Amazon website (works as soon as you join)

1. Make sure you're logged in to Amazon **with the same account** as your
   Associates account. A black **Amazon Associates SiteStripe** bar appears at
   the top of every product page.
2. Find your product (e.g., "washable crayons 24 pack").
3. In the SiteStripe bar, click **Get Link → Text**.
4. Copy the link it gives you. It already contains your tracking ID.
   - Tip: the **"Short link"** option is tidier for a spreadsheet.
5. Note the product's **ASIN** — the 10-character code (letters/numbers) in the
   product URL after `/dp/`, e.g. `.../dp/B08XYZ1234`. You'll use this later if
   you turn on PAAPI.

### Way 2 — Through PAAPI (only after you have keys)

Once PAAPI is enabled on your site, you don't fetch links by hand — the site
does the lookup for you. You just put the **ASIN** in your list and the site
fills in the picture and price. (You still need a destination link; the ASIN is
what powers the automatic details.)

---

## Procedure 7: Add a link to your donations page

How you add items depends on which storage method you chose. The recommended,
no-code method is **Google Sheets**. (For the full comparison of methods, see
[Link Storage Options](link-storage-options.md).)

> **Already keep an Amazon Wish List?** See
> [Importing Your Amazon Wish List](from-amazon-wishlist.md) for a batch-friendly
> way to turn an existing list into your donations page.

> **Want donations shipped to you?** You can display a shipping address on this
> page by setting the `SHIPPING_ADDRESS` variable
> ([Procedure 4](#procedure-4-add-or-update-environment-variables-in-vercel)).
> **Use your school's address with your name and room — never a home address**,
> since it's publicly visible to anyone. Leave it unset to hide the address.

### Using Google Sheets (recommended)

**One-time setup:**

1. Create a **new, dedicated** Google Sheet — one used *only* for this wish list.
   Don't reuse a spreadsheet that also holds gradebooks, rosters, or anything
   private (more on why below).
2. In the **first row**, type these column headers exactly (lower-case is fine):
   `title`, `url`, `category`, `asin`, `imageUrl`, `note`
3. Publish **just this sheet** as a CSV: **File → Share → Publish to web**. On
   the *Link* tab, choose your sheet (e.g. `Sheet1`) and the **Comma-separated
   values (.csv)** format, then click **Publish**. Copy the link it gives you.
   (Choosing CSV publishes only that one tab — not the whole document.)
4. Put that link into Vercel as `GOOGLE_SHEET_CSV_URL` and set
   `STORAGE_PROVIDER` to `google-sheets` (see
   [Procedure 4](#procedure-4-add-or-update-environment-variables-in-vercel)).

> **Does this expose my Google Drive? No.** "Publish to web" is a *separate*
> thing from "Share." It creates a read-only, public snapshot of **only this one
> published sheet**, at its own link. It does **not** make your Drive public,
> does **not** expose your other files, and does **not** change who can open the
> spreadsheet itself. To keep everything else private:
> - Put the list in a **dedicated** spreadsheet with nothing sensitive in it —
>   the published columns are readable by anyone who has the link.
> - You do **not** need to "Share" the file or set it to *Anyone with the link*.
>   Leave its normal sharing **private**; publishing is all the site needs.
> - Changed your mind? Stop it any time via **File → Share → Publish to web →
>   Published content & settings → Stop publishing.**

**Adding an item (any time after that):**

1. Open your sheet and add a new row.
2. Fill in the columns:
   - **title** — what families see, e.g. `Washable Crayons, 24-pack`
   - **url** — the tracking link from Procedure 6
   - **category** — a group name like `art-supplies` (items group together)
   - **asin** — the 10-character code (optional; powers PAAPI later)
   - **imageUrl** — *optional.* A link to your own photo or a generic icon. Leave
     it blank and PAAPI will fill it in once enabled. **Do not paste Amazon's own
     image links here** — Amazon's rules don't allow that; let PAAPI supply
     Amazon images instead.
   - **note** — *optional* short note, e.g. `We go through these fast!`
3. Save. Your live site shows the new item on the next page refresh — **no
   redeploy needed.**

> **Why there's no "price" column:** prices change, and showing an old price
> violates Amazon's rules. Prices are filled in automatically by PAAPI (when
> enabled) so they're always current. Never type a price by hand.

### Using the JSON file instead

If you chose the `static-json` method, you edit the file
`src/app/data/donations.json` directly on the GitHub website. See
[Customizing the Look](customizing-css.md) for how to edit files on GitHub; the
pattern is the same. Saving the file triggers an automatic redeploy.

---

## Procedure 8: Reserve a domain name and connect it

Your free Vercel address (`...vercel.app`) works perfectly. A custom domain (like
`room12wishlist.org`) is optional — it just looks tidier and is easier to share.
**This is the one step that costs money** (typically $10–$20 per year). See
[Costs Over Time](costs.md).

**Step A — Buy a domain:**

1. Go to a domain registrar — Vercel sells them directly
   (**Project → Settings → Domains → Buy**), or use a registrar like Namecheap,
   Cloudflare, or Google Domains.
2. Search for an available name and purchase it. Buying through Vercel is the
   simplest because it connects automatically.

**Step B — Connect it to your site:**

1. In Vercel, open your project → **Settings → Domains**.
2. Type your domain (e.g., `room12wishlist.org`) and click **Add**.
3. - **Bought through Vercel?** It connects automatically. Done.
   - **Bought elsewhere?** Vercel shows you the DNS records to enter. Log in to
     your registrar, find the **DNS settings**, and add the records exactly as
     Vercel lists them (usually an `A` record and/or a `CNAME`).
4. Wait for it to verify (a few minutes to a few hours while DNS updates).

**Step C — Tell your site its new address:**

Good news: you usually don't have to. Once your custom domain is your Vercel
**production** domain, the site picks it up automatically on the next deploy, so
its previews point at the new address on their own. (If you *did* set `SITE_URL`
by hand earlier, update it to the new domain and redeploy —
[Procedure 4](#procedure-4-add-or-update-environment-variables-in-vercel) — so it
doesn't override the new one.) Either way, add the new domain to your Amazon
Associates website list.

**What you'll see next:** your site now answers at your custom domain, with a
secure padlock (HTTPS) that Vercel sets up for you automatically.

---

## Procedure 9: Getting approved and qualifying for PAAPI

This is the last step because it can only happen *after* your site is live and
your links are out in the world. There are **two** approval milestones. Don't
worry — your website works at every stage, even before any of this is done.

### Milestone A — Associates approval (the 180-day / 3-sale rule)

When you join, Amazon gives you **180 days** to make at least **three qualifying
sales** through your links. Make three sales and Amazon reviews your account for
full acceptance. Make zero and the account is closed (you can re-apply).

**How to qualify:** simply share your site. Send the link home in a class
newsletter, post it in a parent group, add it to your email signature. Three
purchases from supportive families usually comes quickly.

### Milestone B — PAAPI access (Product Advertising API)

PAAPI is the *optional, advanced* feature that lets your donations page show
**live prices and product photos automatically**. You do **not** need it to
launch, and your list looks great without it.

**The catch:** Amazon only grants PAAPI keys **after** you've made those first
three qualifying sales. So the path is:

1. Launch your site (Procedures 1, 3, and 4).
2. Add links and share it (Procedures 6–7).
3. Make 3 sales → get fully approved.
4. *Then* request PAAPI keys from your Associates dashboard
   (**Tools → Product Advertising API → Join / Request credentials**).
5. Add the keys to Vercel ([Procedure 4](#procedure-4-add-or-update-environment-variables-in-vercel)).
   Prices and images turn on automatically.

> **Until PAAPI is on, nothing is broken.** The site is built so the price/image
> feature simply stays dormant. Your links still work and still earn.

---

## Glossary of terms

**Affiliate link** — a normal product link with your tracking ID attached, so
the store knows a sale came from you and can pay you a commission.

**Amazon Associates** — Amazon's free affiliate program. It's how your links can
earn money for the classroom.

**ASIN** — Amazon Standard Identification Number. The 10-character code that
identifies a product (found in the product's web address after `/dp/`). Used to
look up live prices and pictures.

**CSV** — "Comma-Separated Values," a plain-text spreadsheet format. When you
"publish a Google Sheet as CSV," you're giving your site a simple, automatic feed
of your list.

**Deploy** — to publish your website so it's live on the internet. Vercel
deploys your site automatically whenever your files change.

**Domain / DNS** — a domain is your custom web address (like `room12.org`). DNS
is the internet's phone book that points your domain at your Vercel site.

**Environment variable** — a named setting (like `SITE_TITLE`) that personalizes
your site without changing code. You manage these in Vercel.

**GitHub** — a free website that stores your project's files and tracks changes.
Vercel reads your files from here.

**Node.js** — the program that runs the project's build tools on a computer
(it comes bundled with `npm`). You only need it if you choose to edit or run the
site **on your own computer** (Procedure 2); the GitHub + Vercel path builds
everything in the cloud without it. Use an LTS version (20.19+, 22.12+, or 24+).

**npm** — the "Node package manager" that installs the project's building blocks
and runs its commands (like `npm start`). It's installed automatically with
Node.js.

**PAAPI (Product Advertising API)** — an optional Amazon service that lets your
site fetch live prices and product images automatically. Available only after
you've made your first three sales.

**Repository ("repo")** — a single project's folder of files on GitHub.

**SSR (Server-Side Rendering)** — a technical detail of how this site is built so
it loads fast and shows up well in search engines and link previews. You don't
need to do anything about it.

**Vercel** — the hosting service that turns your GitHub files into a live
website. Free on the **Hobby** tier for non-commercial use; once your site earns
commissions, Vercel expects you to move to **Pro** (about **$20/month**). See
[Costs Over Time](costs.md#stage-1--approved-and-earning).

---

That's everything. Launch when you're ready, share the link widely, and welcome
to running your own classroom portal. 🎒
