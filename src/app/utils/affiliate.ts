const BASE_REL = ['sponsored', 'noopener', 'noreferrer'];
const SMALL_WORDS = new Set(['and', 'or', 'the', 'of', 'a', 'an', 'to', 'in', 'on', 'for']);

/**
 * Builds the `rel` attribute for an affiliate link. "sponsored", "noopener",
 * and "noreferrer" are always applied. "nofollow" is included by default,
 * which is the safe choice for affiliate links; pass `false` to omit it.
 */
export function resolveRel(nofollow = true): string {
  return (nofollow ? ['nofollow', ...BASE_REL] : [...BASE_REL]).join(' ');
}

/**
 * Turns a slug like "art-supplies" into a display label like "Art Supplies",
 * leaving small joining words lowercase when they aren't the first word.
 */
export function humanizeSlug(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && SMALL_WORDS.has(word.toLowerCase())) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
