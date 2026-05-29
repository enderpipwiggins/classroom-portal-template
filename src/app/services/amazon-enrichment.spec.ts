import { describe, it, expect, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { AmazonEnrichmentService } from './amazon-enrichment';

describe('AmazonEnrichmentService', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AmazonEnrichmentService],
    });
    return {
      service: TestBed.inject(AmazonEnrichmentService),
      http: TestBed.inject(HttpTestingController),
    };
  }

  afterEach(() => TestBed.resetTestingModule());

  it('returns an unavailable result without a request for an empty ASIN', async () => {
    const { service, http } = setup();
    const result = await firstValueFrom(service.enrich(''));
    expect(result).toEqual({ imageUrl: null, price: null, available: false });
    http.verify();
  });

  it('passes the ASIN as a query param and returns the server result', async () => {
    const { service, http } = setup();
    const promise = firstValueFrom(service.enrich('B00000000A'));

    const req = http.expectOne((r) => r.url === '/api/amazon/enrich');
    expect(req.request.params.get('asin')).toBe('B00000000A');
    req.flush({ imageUrl: 'https://img', price: '$4.99', available: true });

    expect(await promise).toEqual({ imageUrl: 'https://img', price: '$4.99', available: true });
  });

  it('maps a transport error to an unavailable result', async () => {
    const { service, http } = setup();
    const promise = firstValueFrom(service.enrich('B00000000B'));
    http.expectOne('/api/amazon/enrich?asin=B00000000B').error(new ProgressEvent('network'));
    expect(await promise).toEqual({ imageUrl: null, price: null, available: false });
  });
});
