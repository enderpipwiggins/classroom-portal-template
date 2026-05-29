import { describe, it, expect, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GoogleSheetsProvider } from './google-sheets-provider';

const CSV_URL = 'https://docs.google.com/spreadsheets/test/pub?output=csv';

describe('GoogleSheetsProvider', () => {
  const originalUrl = environment.googleSheetCsvUrl;

  function setup(): { provider: GoogleSheetsProvider; http: HttpTestingController } {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), GoogleSheetsProvider],
    });
    return {
      provider: TestBed.inject(GoogleSheetsProvider),
      http: TestBed.inject(HttpTestingController),
    };
  }

  afterEach(() => {
    (environment as { googleSheetCsvUrl: string }).googleSheetCsvUrl = originalUrl;
    TestBed.resetTestingModule();
  });

  it('returns an empty list without making a request when no CSV URL is set', async () => {
    (environment as { googleSheetCsvUrl: string }).googleSheetCsvUrl = '';
    const { provider, http } = setup();
    const items = await firstValueFrom(provider.getItems());
    expect(items).toEqual([]);
    http.verify(); // no outstanding requests
  });

  it('fetches the published CSV and maps rows to donation items', async () => {
    (environment as { googleSheetCsvUrl: string }).googleSheetCsvUrl = CSV_URL;
    const { provider, http } = setup();

    const promise = firstValueFrom(provider.getItems());
    const req = http.expectOne(CSV_URL);
    expect(req.request.responseType).toBe('text');
    req.flush(
      'title,url,category,asin,imageUrl,note\n' +
        '"Crayons, 24-pack",https://a,art-supplies,B00000000A,,The classic pack\n' +
        'Watercolors,https://b,art-supplies,,,',
    );

    const items = await promise;
    expect(items).toEqual([
      {
        id: 'B00000000A',
        title: 'Crayons, 24-pack',
        url: 'https://a',
        category: 'art-supplies',
        asin: 'B00000000A',
        note: 'The classic pack',
      },
      {
        id: 'row-1',
        title: 'Watercolors',
        url: 'https://b',
        category: 'art-supplies',
      },
    ]);
  });

  it('keeps a teacher-supplied imageUrl from the sheet', async () => {
    (environment as { googleSheetCsvUrl: string }).googleSheetCsvUrl = CSV_URL;
    const { provider, http } = setup();

    const promise = firstValueFrom(provider.getItems());
    http
      .expectOne(CSV_URL)
      .flush('title,url,imageUrl\nMarkers,https://m,https://cdn.example/markers.png');

    const items = await promise;
    expect(items[0].imageUrl).toBe('https://cdn.example/markers.png');
  });

  it('skips rows missing a title or url', async () => {
    (environment as { googleSheetCsvUrl: string }).googleSheetCsvUrl = CSV_URL;
    const { provider, http } = setup();

    const promise = firstValueFrom(provider.getItems());
    http
      .expectOne(CSV_URL)
      .flush('title,url\nGood,https://ok\n,https://no-title\nNo URL,');

    const items = await promise;
    expect(items.map((i) => i.title)).toEqual(['Good']);
  });

  it('returns nothing when the sheet has no title/url columns at all', async () => {
    (environment as { googleSheetCsvUrl: string }).googleSheetCsvUrl = CSV_URL;
    const { provider, http } = setup();

    const promise = firstValueFrom(provider.getItems());
    http.expectOne(CSV_URL).flush('name,link\nCrayons,https://x');

    expect(await promise).toEqual([]);
  });
});
