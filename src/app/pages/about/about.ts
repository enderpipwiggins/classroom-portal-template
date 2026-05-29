import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../services/seo';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  private seoService = inject(SeoService);

  protected readonly siteTitle = environment.siteTitle;

  ngOnInit(): void {
    this.seoService.setPage(
      'About',
      `Learn more about ${environment.siteTitle} and how donations help our classroom.`,
      `${environment.siteUrl}/page/about`,
    );
  }
}
