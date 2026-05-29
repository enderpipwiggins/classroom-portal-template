import { InjectionToken, Provider, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DonationItem } from '../interfaces/donation-item';
import { GoogleSheetsProvider } from './google-sheets-provider';
import { StaticJsonProvider } from './static-json-provider';

/** Contract every link-storage backend implements. */
export interface LinkStorageProvider {
  getItems(): Observable<DonationItem[]>;
}

export const LINK_STORAGE = new InjectionToken<LinkStorageProvider>('LINK_STORAGE');

/**
 * Selects the storage backend from the STORAGE_PROVIDER environment variable
 * (baked into `environment.storageProvider` at build time). Defaults to the
 * bundled static JSON file so the template runs with zero configuration.
 */
export function provideLinkStorage(): Provider {
  return {
    provide: LINK_STORAGE,
    useFactory: (): LinkStorageProvider =>
      environment.storageProvider === 'google-sheets'
        ? inject(GoogleSheetsProvider)
        : inject(StaticJsonProvider),
  };
}
