import { describe, it, expect } from 'vitest';
import { decodeHtml } from './decode-html';

describe('decodeHtml', () => {
  it('strips HTML tags', () => {
    expect(decodeHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('decodes named entities', () => {
    expect(decodeHtml('Tom &amp; Jerry &lt;3 &quot;quotes&quot; &apos;apos&apos;')).toBe(
      'Tom & Jerry <3 "quotes" \'apos\'',
    );
  });

  it('decodes decimal and hex numeric entities', () => {
    expect(decodeHtml('caf&#233; &#x26; tea')).toBe('café & tea');
  });

  it('converts &nbsp; to a space and trims the result', () => {
    expect(decodeHtml('&nbsp;  spaced &nbsp;')).toBe('spaced');
  });

  it('returns an empty string for tag-only input', () => {
    expect(decodeHtml('<br/>')).toBe('');
  });
});
