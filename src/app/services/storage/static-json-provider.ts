import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DonationItem } from '../interfaces/donation-item';
import donationsData from '../../data/donations.json';

/**
 * Reads the donations list from a bundled JSON file
 * (src/app/data/donations.json). Edit that file in the GitHub web UI and
 * Vercel redeploys automatically. SSR-safe — the data is imported at build
 * time, so there's no network call.
 */
@Injectable({ providedIn: 'root' })
export class StaticJsonProvider {
  getItems(): Observable<DonationItem[]> {
    return of(donationsData as DonationItem[]);
  }
}
