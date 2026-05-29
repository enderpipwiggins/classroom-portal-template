import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../services/seo';

@Component({
  selector: 'app-affiliate-disclosure',
  imports: [RouterLink],
  templateUrl: './affiliate-disclosure.html',
  styleUrl: './affiliate-disclosure.scss',
})
export class AffiliateDisclosure implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPage(
      'Affiliate Disclosure',
      `How affiliate links work on ${environment.siteTitle}.`,
      `${environment.siteUrl}/page/affiliate-disclosure`,
    );
  }
}
