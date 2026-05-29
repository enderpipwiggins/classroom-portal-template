import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DonationItem } from '../interfaces/donation-item';
import { parseCsvToObjects } from '../../utils/csv';

/**
 * Loads the donations list from a Google Sheet that has been
 * "Published to the web" as CSV (File → Share → Publish to web → CSV).
 *
 * No API key or authentication is needed, and edits go live on the next page
 * load. The expected columns are: title, url, category, asin, imageUrl, note.
 * There is intentionally no `price` column — prices come only from PAAPI.
 */
@Injectable({ providedIn: 'root' })
export class GoogleSheetsProvider {
  private http = inject(HttpClient);

  getItems(): Observable<DonationItem[]> {
    const url = environment.googleSheetCsvUrl;
    if (!url) return of([]);

    return this.http
      .get(url, { responseType: 'text' })
      .pipe(map((csv) => mapRows(parseCsvToObjects(csv))));
  }
}

function mapRows(rows: Record<string, string>[]): DonationItem[] {
  return rows
    .map((row, index) => toItem(row, index))
    .filter((item): item is DonationItem => item !== null);
}

function toItem(row: Record<string, string>, index: number): DonationItem | null {
  const title = row['title'] ?? '';
  const url = row['url'] ?? '';
  if (!title || !url) return null;

  const asin = row['asin'] || undefined;
  const item: DonationItem = {
    id: asin || `row-${index}`,
    title,
    url,
  };
  if (row['category']) item.category = row['category'];
  if (asin) item.asin = asin;
  if (row['imageurl']) item.imageUrl = row['imageurl'];
  if (row['note']) item.note = row['note'];
  return item;
}
