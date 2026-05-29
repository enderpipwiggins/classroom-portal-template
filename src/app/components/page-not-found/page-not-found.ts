import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../services/seo';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss',
})
export class PageNotFound implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPage(
      'Page Not Found',
      'The page you were looking for could not be found.',
      `${environment.siteUrl}/404`,
    );
  }
}
