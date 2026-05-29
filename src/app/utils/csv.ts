/**
 * Minimal, dependency-free CSV parser.
 *
 * Handles the cases a teacher's Google Sheet actually produces:
 *   • fields quoted with double quotes (so titles can contain commas)
 *   • escaped quotes inside a quoted field ("" → ")
 *   • CRLF or LF line endings
 *   • a trailing newline at the end of the file
 *
 * Returns an array of rows, each row an array of cell strings. The first row
 * is the header; mapping headers to fields is the caller's job.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++; // skip the escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char === '\r') {
      // swallow; the paired \n (or end of input) closes the row
    } else {
      field += char;
    }
  }

  // Flush the final field/row if the file didn't end with a newline.
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/**
 * Parses CSV text into objects keyed by header name (lower-cased and trimmed).
 * Blank rows are skipped.
 */
export function parseCsvToObjects(text: string): Record<string, string>[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());

  return rows
    .slice(1)
    .filter((cells) => cells.some((c) => c.trim() !== ''))
    .map((cells) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = (cells[index] ?? '').trim();
      });
      return obj;
    });
}
