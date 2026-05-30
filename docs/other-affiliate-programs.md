# Using Other Affiliate Programs

This template is built around **Amazon Associates** because that's the program
most teachers start with — and it's the only one with *automatic* product images
and prices (via Amazon's PAAPI). But your wish list isn't locked to Amazon: the
list stores a plain web address for each item, so **any retailer's affiliate link
works** — Walmart, Target, and others — and you can mix programs freely.

---

## The one rule: a link is a link

Adding a Walmart (or any other) affiliate link is **exactly the same** as adding
an Amazon one — see
[Procedure 7 in the Teacher's Guide](teacher-guide.md#procedure-7-add-a-link-to-your-donations-page).
You paste the tracking link into the **`url`** column of your Google Sheet (or
the JSON file). That's it.

The **only** thing that's Amazon-specific is **PAAPI enrichment** (the automatic
image and live price). For non-Amazon links:

- **Image:** there's no automatic image. Add your own photo or a generic icon in
  the **`imageUrl`** column, or leave it blank for a clean text-only item. (As
  with Amazon, don't hot-link a retailer's own product images unless their terms
  allow it — use your own picture or leave it empty.)
- **Price:** no price is shown. The template never lets you hand-type prices (a
  stale price violates most programs' rules), so non-Amazon items simply show no
  price. That's fine and expected.
- **`asin`:** that column is Amazon-only — leave it blank for other retailers.

Everything else is identical: category grouping, notes, and the affiliate
`rel` attributes on the links all work the same regardless of retailer.

---

## Update your disclosure wording

Whatever programs you use, U.S. **FTC rules require a clear disclosure**, and each
program has its own required wording. This template ships with **Amazon-specific**
text in two spots — if you add another program (or replace Amazon), update them so
they're accurate:

- The footer line in
  [`footer.html`](../src/app/layout/footer/footer.html) ("As an Amazon Associate,
  we earn from qualifying purchases.").
- The [Affiliate Disclosure page](../src/app/components/affiliate-disclosure/affiliate-disclosure.html),
  which names Amazon throughout.

The short disclosure on the donations page itself is already retailer-neutral
("These are affiliate links…"). See [Disclosures](disclosures.md) for the FTC and
program-compliance basics.

---

## Walmart Affiliate Program

A common second option. Quick facts (confirm current details on Walmart's site):

- **Free to join**, run through the **Impact** platform (impact.com); the official
  home is **[affiliates.walmart.com](https://affiliates.walmart.com/)**.
- **Commission:** roughly **1–4%** depending on category (higher for home, baby,
  apparel, sports; lower for electronics and groceries), on the net sale price.
- **Cookie window:** **3 days (72 hours)** — longer than Amazon's ~24 hours.
- There's also an **invite-only Walmart Creator Program** with higher rates,
  aimed at social creators.

**How to join and add items:**

1. Go to **[affiliates.walmart.com](https://affiliates.walmart.com/)** and apply
   (you'll create/sign in through Impact). Having a real, live site helps approval
   — use your Vercel URL or custom domain.
2. Once approved, open the affiliate dashboard (Impact) and **generate a tracking
   link** for the product you want.
3. Paste that link into the **`url`** column of your list, just like an Amazon
   item. Leave **`asin`** blank, and add an **`imageUrl`** yourself if you want a
   picture.
4. Make sure your disclosure wording (above) mentions Walmart too.

---

## Target Affiliate Program

Another natural fit for classroom supplies. Quick facts (confirm current details
on Target's site):

- **Free to join**, run through the **Impact** network; apply at
  **[partners.target.com](https://partners.target.com/)** (the program is called
  "Target Partners").
- **Commission:** varies a lot by category — roughly **1–8%**. Home & outdoor
  living and apparel are the highest; note that **electronics, toys, and video
  games earn no commission**, and health & beauty is about 1%.
- **Cookie window:** **7 days** — the most generous of the programs here.
- Target also runs **Club Target**, a creator community program (points, tiers,
  and rewards) that replaced its older commission-based Creator Program in 2026.

**How to join and add items:**

1. Apply at **[partners.target.com](https://partners.target.com/)** (you'll sign
   in through Impact). Describe your site and audience; a real, live site helps
   approval — use your Vercel URL or custom domain.
2. Once approved, generate a **tracking link** for the product in the Impact
   dashboard.
3. Paste it into the **`url`** column like any other item — leave **`asin`**
   blank, and add your own **`imageUrl`** if you want a picture.
4. Make sure your disclosure wording (above) mentions Target too.

---

## Other programs and networks

The same pattern covers most retailers. Beyond Amazon, Walmart, and Target, many
stores are reachable through affiliate **networks** like Impact, CJ (Commission
Junction), Rakuten, ShareASale, or Skimlinks. As long as a program gives you an
ordinary tracking **URL**, it drops straight into your list — only Amazon gets the
automatic images and prices.
