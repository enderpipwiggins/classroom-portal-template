# Importing Your Amazon Wish List

Lots of teachers already keep an **Amazon Wish List** of classroom supplies. This
page shows how to turn that list into your portal's donations list — getting a
proper **tracking link** for each item so qualifying purchases can earn a little
for the classroom (at no extra cost to the buyer).

There's no magic "export" button (more on that [below](#why-theres-no-one-click-export)),
but the copy-each-item process is straightforward, and for a long list you can
do a handful at a time.

> **New here?** This page assumes you've read
> [Procedure 3 — Get a tracking link for a product](teacher-guide.md#procedure-3-get-a-tracking-link-for-a-product)
> and [Procedure 4 — Add a link to your donations page](teacher-guide.md#procedure-4-add-a-link-to-your-donations-page).
> This page is just those two steps, done in a row for a whole list.

---

## Before you start

- **Be signed in to your Amazon Associates account.** That's what makes the
  black **SiteStripe** bar appear on product pages and puts *your* tracking ID
  on the links you copy. (See
  [Procedure 1](teacher-guide.md#procedure-1-create-an-amazon-associates-account).)
- **Have your list open where the site reads it.** For most teachers that's the
  Google Sheet from
  [Procedure 4](teacher-guide.md#procedure-4-add-a-link-to-your-donations-page).
  Keep it open beside your browser.
- **Know what goes in the `url` column.** The site stores the *whole* tracking
  link you paste — it does **not** build a link for you from the ASIN. So each
  item needs a real SiteStripe link, not just its product code. (The `asin`
  column is separate; it only powers automatic pictures and prices through PAAPI
  later.)

---

## The process, one item at a time

1. **Open your Wish List.** On Amazon, go to **Accounts & Lists → Your Lists**,
   or visit `https://www.amazon.com/hz/wishlist/ls`. Confirm the SiteStripe bar
   is showing at the top — if it isn't, you're not signed in to the Associates
   account.
2. **Open an item's product page** by clicking its title.
3. **Copy its tracking link.** In SiteStripe, click **Get Link → Text**, choose
   the tidier **Short link**, and copy it. This link already has your tracking ID
   in it.
4. **Grab the ASIN** — the 10-character code in the product's web address right
   after `/dp/` (e.g. `.../dp/B08XYZ1234`). Optional, but it's what turns on the
   automatic picture and price later.
5. **Add a row to your Google Sheet:**
   - **title** — what families see, e.g. `Washable Crayons, 24-pack`
   - **url** — paste the tracking link from step 3
   - **category** — a group name like `art-supplies` (items with the same
     category group together)
   - **asin** — paste the code from step 4 (optional)
   - **imageUrl** / **note** — leave blank, or add your own. *Don't* paste
     Amazon's own image links — let PAAPI supply those once it's enabled.
6. **Save.** Your live site shows the item on the next page refresh — no redeploy
   needed.

Repeat for each item. There's no need to do them all at once; the site happily
shows however many rows you've added so far.

---

## Tips for a longer list

- **Open items in tabs.** Middle-click (or Ctrl/Cmd-click) each item on the Wish
  List to open them all in background tabs, then work through the tabs copying
  links — fewer back-and-forth clicks.
- **Set the category once and fill down.** In your Sheet, type the category for
  the first item, then drag the little square at the cell's corner down a few
  rows to copy it. Re-type only when the category changes.
- **The Wish List item link is *not* a tracking link.** Right-clicking an item's
  title and choosing *Copy link* gives you a plain product URL with no tracking
  ID. It's handy for reading off the ASIN, but you still need the SiteStripe link
  from step 3 for the `url` column.
- **A few a day is fine.** Each saved row goes live on its own, so there's no
  reason to block out an afternoon for the whole list.

---

## A note on shipping to your classroom

You picked the tracking-link approach, which means a buyer clicking an item lands
on Amazon and **chooses their own shipping** at checkout — so they'd need your
classroom's address to send it your way.

If hands-off shipping matters more to you than the small commission, Amazon's
**Wish List itself** can do that: attach a **delivery address** to the list (in
the list's settings), and gift-buyers can ship items straight to you *without*
ever seeing your full street address. You could share that Wish List link
alongside your portal. Just know it's a *separate* path from the tracking links
on your site — and that Amazon's Associates rules restrict earning commission on
purchases that benefit you directly, so treat any commission on classroom
supplies as a happy bonus rather than the goal. See
[Disclosures](disclosures.md) for the compliance details.

---

## Why there's no one-click export

Amazon doesn't offer an official way to export a Wish List to a spreadsheet, and
tools that *scrape* the page tend to break the moment Amazon changes its layout —
and brush up against Amazon's terms of use. The copy-each-item method above is
the reliable, within-the-rules way to do it. It's a bit of typing up front, but
once your list is in your Sheet, keeping it current is just editing a row.
