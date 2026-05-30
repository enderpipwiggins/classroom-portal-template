# Link Storage Options

Your wish list has to live *somewhere* that the website can read. This template
ships with two methods built in (Google Sheets and a JSON file) and is designed
so others could be added. This page compares the realistic choices so you can
pick what fits your comfort level and budget.

**Short answer:** use **Google Sheets**. It's free, requires no coding, edits go
live instantly, and a spreadsheet is something most teachers already know.

---

## At a glance

| Method | Cost | Ease for non-coders | Edits go live without a redeploy? | API key / account needed? | Built into this template? |
| --- | --- | --- | --- | --- | --- |
| **Google Sheets** | Free | ★★★★★ Easiest | ✅ Yes (on refresh) | Just a Google account | ✅ Yes (recommended) |
| **Static JSON file** | Free | ★★★☆☆ Moderate | ❌ No (auto-redeploys) | No | ✅ Yes |
| **Airtable** | Free tier, then paid | ★★★★☆ Easy | ✅ Yes | Yes (API key) | ➖ Documented only |
| **Supabase** | Free tier, then paid | ★★☆☆☆ Technical | ✅ Yes | Yes (keys) | ➖ Documented only |
| **Notion** | Free for personal | ★★★★☆ Easy | ✅ Yes | Yes (integration token) | ➖ Documented only |
| **Thirsty Affiliates** | Needs WordPress (paid) | ★★★☆☆ Moderate | ✅ Yes | WordPress site | ➖ Not included |

---

## Google Sheets — recommended

**How it works:** you keep your list in an ordinary Google Sheet and use *File →
Share → Publish to web → CSV*. That gives a public link to a plain-text version
of your sheet, which your site reads each time someone visits.

- **Why it's great for teachers:** it's a spreadsheet. You already know how to
  add a row. Edits appear on the site the moment you save — no rebuilding, no
  GitHub.
- **Limits:** the published sheet is publicly readable (don't put anything
  private in it). That's fine for a public wish list. Publishing exposes *only
  that one sheet* — not your Drive or any other file — so keep the list in a
  dedicated spreadsheet. See
  [Procedure 7 in the Teacher's Guide](teacher-guide.md#procedure-7-add-a-link-to-your-donations-page)
  for how to publish safely (and how to stop).
- **Cost:** free.
- **Setup:** see [Procedure 7 in the Teacher's Guide](teacher-guide.md#procedure-7-add-a-link-to-your-donations-page).

Columns: `title, url, category, asin, imageUrl, note` (no `price` column —
prices come from PAAPI).

---

## Static JSON file — the simplest fallback

**How it works:** your list lives in the file `src/app/data/donations.json`
inside your project. You edit it on the GitHub website; saving triggers an
automatic redeploy.

- **Why you might pick it:** zero external accounts, and it's what the template
  uses out of the box so the site runs immediately.
- **Trade-off:** the format (JSON) is fussier than a spreadsheet — a missing
  comma or quote breaks it — and every edit waits ~1 minute for a redeploy.
- **Cost:** free.

---

## Airtable — a friendlier database

**How it works:** Airtable is a spreadsheet-database hybrid with a polished
editing app. You'd read it through Airtable's API.

- **Pros:** lovely editing experience, attachments, multiple editors.
- **Cons:** needs an API key; the generous free tier has row caps and Airtable
  has trimmed free features over time, so it may eventually cost money.
- **Status here:** not built in, but the storage system is designed to accept a
  new provider if you want to add one.

---

## Supabase — a real database (for the technically inclined)

**How it works:** Supabase is a hosted PostgreSQL database with an auto-generated
API.

- **Pros:** powerful, scalable, proper database features.
- **Cons:** the most technical option here — you manage tables, keys, and access
  rules. Overkill for a single wish list.
- **Cost:** free tier, then paid as you grow.

---

## Notion — if you already live in Notion

**How it works:** keep the list in a Notion database and read it via Notion's
API using an integration token.

- **Pros:** pleasant editing if you already use Notion; easy sharing.
- **Cons:** needs an integration token; the API is rate-limited and a little
  slower; another account to manage.
- **Cost:** free for personal use.

---

## Thirsty Affiliates — the WordPress origin

This template's link-handling was modeled on a WordPress site that used the
**Thirsty Affiliates** plugin to "cloak" and manage links.

- **Why it's listed:** for completeness, and in case you already run WordPress.
- **Why it's probably not for you:** it requires a (typically paid) WordPress
  site and hosting. If you don't already have WordPress, this is far more
  overhead than a Google Sheet.

---

## Switching methods later

You're not locked in. Changing your mind is just two environment variables in
Vercel (`STORAGE_PROVIDER` and, for Sheets, `GOOGLE_SHEET_CSV_URL`) plus a
redeploy. Your data lives outside the code, so you can move it whenever you like.
