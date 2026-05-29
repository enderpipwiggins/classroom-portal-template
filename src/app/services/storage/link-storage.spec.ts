import { describe, it, expect, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { LINK_STORAGE, provideLinkStorage } from './link-storage';
import { GoogleSheetsProvider } from './google-sheets-provider';
import { StaticJsonProvider } from './static-json-provider';

describe('provideLinkStorage', () => {
  const original = environment.storageProvider;

  function inject(provider: string) {
    TestBed.resetTestingModule();
    (environment as { storageProvider: string }).storageProvider = provider;
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideLinkStorage()],
    });
    return TestBed.inject(LINK_STORAGE);
  }

  afterEach(() => {
    (environment as { storageProvider: string }).storageProvider = original;
    TestBed.resetTestingModule();
  });

  it('selects the Google Sheets provider when configured', () => {
    expect(inject('google-sheets')).toBeInstanceOf(GoogleSheetsProvider);
  });

  it('falls back to the static JSON provider otherwise', () => {
    expect(inject('static-json')).toBeInstanceOf(StaticJsonProvider);
    expect(inject('anything-else')).toBeInstanceOf(StaticJsonProvider);
  });
});
