import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface EnrichmentResult {
  imageUrl: string | null;
  price: string | null;
  available: boolean;
}

const UNAVAILABLE: EnrichmentResult = { imageUrl: null, price: null, available: false };

/**
 * Client for the server-side PAAPI enrichment endpoint. When PAAPI is not
 * configured the server returns an unavailable result, so callers can treat a
 * failure and a not-configured response identically — the page still renders
 * fine from storage.
 */
@Injectable({ providedIn: 'root' })
export class AmazonEnrichmentService {
  private http = inject(HttpClient);

  enrich(asin: string): Observable<EnrichmentResult> {
    if (!asin) return of(UNAVAILABLE);
    const params = new HttpParams().set('asin', asin);
    return this.http
      .get<EnrichmentResult>('/api/amazon/enrich', { params })
      .pipe(catchError(() => of(UNAVAILABLE)));
  }
}
