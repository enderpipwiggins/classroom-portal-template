# Disclosures

This page collects the legal and ethical disclosures relevant to running a site
built from this template. It is provided for your convenience and is **not legal
advice** — when in doubt, read the source agreements linked below or consult a
professional.

---

## 1. FTC affiliate disclosure

In the United States, the Federal Trade Commission (FTC) requires that affiliate
relationships be disclosed **clearly and conspicuously** wherever affiliate links
appear, so visitors know you may earn a commission.

This template helps you comply out of the box:

- A dedicated **[Affiliate Disclosure page](../src/app/components/affiliate-disclosure/)**
  is included and linked in the site footer on every page.
- The donations page carries a short, plain-language disclosure line right with
  the links.

**Your responsibilities:**

- Keep these disclosures in place — don't remove them.
- Make sure the wording stays accurate for how *you* use the site.
- If you also promote links elsewhere (email, social media), disclose there too.

See the FTC's guidance: *"Disclosures 101 for Social Media Influencers"* and
*".com Disclosures"* at [ftc.gov](https://www.ftc.gov).

---

## 2. Amazon Associates Operating Agreement

By joining Amazon Associates you agree to Amazon's
[Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement)
and
[Program Policies](https://affiliate-program.amazon.com/help/operating/policies).
Key points that affect this template:

- **Required disclosure language.** Amazon requires a statement substantially
  like *"As an Amazon Associate I earn from qualifying purchases."* This exact
  phrasing is built into the disclosure page and footer.
- **Links must be identifiable as Amazon.** This template links directly to
  Amazon product pages using your tracking tag.
- **No caching or storing of prices and images outside PAAPI terms.** This is
  why the template **never lets you hand-type a price**, and why prices/images
  are fetched live from the Product Advertising API only:
  - **Do not paste Amazon's own product image URLs** into your Google Sheet or
    JSON file. Use your own photos or generic icons, or leave the image blank and
    let PAAPI supply Amazon's image when enabled.
  - Prices shown come only from PAAPI (when configured) so they stay current;
    the price the customer sees on Amazon at checkout always governs.
- **PAAPI eligibility.** Product Advertising API access requires qualifying
  sales first and continued compliance. See
  [Procedure 2 in the Teacher's Guide](teacher-guide.md#procedure-2-getting-approved-and-qualifying-for-paapi).
- **Honesty.** Don't encourage misleading clicks, and follow Amazon's rules on
  where and how links may be used (e.g., restrictions around email and offline
  use).

Amazon updates these terms periodically; the agreements linked above are the
authoritative, current source.

---

## 3. License and intended use

This template is released under the **[MIT License](../LICENSE)** — you are free
to use, modify, and share it.

It was created with a specific purpose in mind: **helping elementary-school
teachers fund classroom supplies.** That intent is described in
**[NOTICE.md](../NOTICE.md)**. The intent is offered as context and a good-faith
ask, not as a legal restriction on the MIT grant.

---

## 4. Cost disclosure

Running this site is free to launch, but can incur costs as it grows (notably
Vercel Pro once you're earning, and an optional custom domain). The full,
staged breakdown is in **[Costs Over Time](costs.md)**.

**Scope limitation (restated):** the cost analysis covers only the template's
*intended function* as described in these docs. Costs outside that intended
function — excess traffic beyond hobby limits, custom development, paid
advertising, third-party services you add, or taxes on commissions you earn —
are **out of scope and are not estimated**. You are responsible for any such
costs and for any taxes owed on affiliate income.
