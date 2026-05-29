/**
 * A single item on the donations page.
 *
 * `title` and `url` are required; everything else is optional. `imageUrl` and
 * `price` can be filled in later by the Amazon Product Advertising API (PAAPI)
 * once it's configured — see the donations page for how enrichment works.
 */
export interface DonationItem {
  id: string;
  title: string;
  /** The affiliate destination (an Amazon tracking link). */
  url: string;
  /** Optional grouping label, e.g. "Art Supplies". */
  category?: string;
  /** Amazon Standard Identification Number — enables PAAPI enrichment later. */
  asin?: string;
  /** Optional image. A teacher-supplied value always wins over PAAPI. */
  imageUrl?: string;
  /** Populated only by PAAPI — never hand-typed, so prices are never stale. */
  price?: string;
  /** Optional free-text note shown under the title. */
  note?: string;
}
