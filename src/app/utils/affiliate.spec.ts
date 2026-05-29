import { describe, it, expect } from 'vitest';
import { humanizeSlug, resolveRel } from './affiliate';

describe('resolveRel', () => {
  it('includes nofollow by default', () => {
    expect(resolveRel()).toBe('nofollow sponsored noopener noreferrer');
  });

  it('omits nofollow when asked', () => {
    expect(resolveRel(false)).toBe('sponsored noopener noreferrer');
  });

  it('always emits sponsored, noopener, and noreferrer', () => {
    const rel = resolveRel();
    expect(rel).toContain('sponsored');
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });
});

describe('humanizeSlug', () => {
  it('capitalizes a single word', () => {
    expect(humanizeSlug('books')).toBe('Books');
  });

  it('title-cases a hyphenated slug', () => {
    expect(humanizeSlug('art-supplies')).toBe('Art Supplies');
  });

  it('also splits on underscores and spaces', () => {
    expect(humanizeSlug('paper_and notebooks')).toBe('Paper and Notebooks');
  });

  it('lowercases small joining words mid-slug', () => {
    expect(humanizeSlug('paper-and-notebooks')).toBe('Paper and Notebooks');
  });

  it('capitalizes a small word when it leads the slug', () => {
    expect(humanizeSlug('and-the-rest')).toBe('And the Rest');
  });
});
