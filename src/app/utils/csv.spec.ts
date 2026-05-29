import { describe, it, expect } from 'vitest';
import { parseCsv, parseCsvToObjects } from './csv';

describe('parseCsv', () => {
  it('parses a simple comma-separated grid', () => {
    expect(parseCsv('a,b,c\n1,2,3')).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });

  it('keeps commas that are inside double-quoted fields', () => {
    const rows = parseCsv('title,url\n"Crayons, 24-pack",https://x');
    expect(rows[1]).toEqual(['Crayons, 24-pack', 'https://x']);
  });

  it('unescapes doubled quotes inside a quoted field', () => {
    const rows = parseCsv('note\n"She said ""hi"""');
    expect(rows[1]).toEqual(['She said "hi"']);
  });

  it('handles CRLF line endings', () => {
    expect(parseCsv('a,b\r\n1,2\r\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('flushes a final row with no trailing newline', () => {
    expect(parseCsv('a\n1')).toEqual([['a'], ['1']]);
  });

  it('allows newlines inside a quoted field', () => {
    const rows = parseCsv('note\n"line one\nline two"');
    expect(rows[1]).toEqual(['line one\nline two']);
  });
});

describe('parseCsvToObjects', () => {
  it('maps rows to objects keyed by lower-cased header', () => {
    const objs = parseCsvToObjects('Title,URL\nCrayons,https://x');
    expect(objs).toEqual([{ title: 'Crayons', url: 'https://x' }]);
  });

  it('trims whitespace from headers and cells', () => {
    const objs = parseCsvToObjects(' Title , URL \n  Crayons , https://x ');
    expect(objs[0]).toEqual({ title: 'Crayons', url: 'https://x' });
  });

  it('skips fully blank rows', () => {
    const objs = parseCsvToObjects('title\nCrayons\n\n   \nPaint');
    expect(objs.map((o) => o['title'])).toEqual(['Crayons', 'Paint']);
  });

  it('fills missing trailing cells with empty strings', () => {
    const objs = parseCsvToObjects('title,url,note\nCrayons,https://x');
    expect(objs[0]).toEqual({ title: 'Crayons', url: 'https://x', note: '' });
  });

  it('returns an empty array for empty input', () => {
    expect(parseCsvToObjects('')).toEqual([]);
  });
});
