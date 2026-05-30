import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../services/seo';
import { resolveRel } from '../../utils/affiliate';
import { DonationsStore } from './donations.store';

const SKELETON_COUNT = 8;

@Component({
  selector: 'app-donations',
  imports: [RouterLink],
  templateUrl: './donations.html',
  styleUrl: './donations.scss',
  // Provided here (not at root) so the store's lifetime matches this page —
  // a feature-scoped store. The page reads state from it and owns no state
  // of its own beyond static copy.
  providers: [DonationsStore],
})
export class Donations implements OnInit {
  protected readonly store = inject(DonationsStore);
  private seoService = inject(SeoService);

  protected readonly title = environment.donationsTitle;
  protected readonly intro = environment.donationsIntro;
  protected readonly shippingAddress = environment.shippingAddress;
  protected readonly rel = resolveRel();

  ngOnInit(): void {
    this.seoService.setPage(this.title, this.intro, `${environment.siteUrl}/page/donations`);
    // The store loads itself via its onInit hook — nothing to trigger here.
  }

  protected retry(): void {
    this.store.load();
  }

  get skeletonItems(): number[] {
    return Array.from({ length: SKELETON_COUNT }, (_, i) => i);
  }
}
