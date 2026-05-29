import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../services/seo';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {
  private seoService = inject(SeoService);

  protected readonly title = environment.siteTitle;
  protected readonly tagline = environment.siteTagline;
  protected readonly description = environment.siteDescription;
  protected readonly donationsTitle = environment.donationsTitle;

  ngOnInit(): void {
    this.seoService.setDefault();
  }
}
