import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../services/seo';

/**
 * EXAMPLE PAGE — a working template you can copy to build your own page.
 *
 * It deliberately demonstrates every convention this project uses for a page:
 *   • a standalone component with an `app-` selector
 *   • importing `RouterLink` so the template can link to other pages
 *   • reading configured values from `environment` (set via env vars at build
 *     time — see scripts/generate-config.mjs and .env.example)
 *   • setting the browser title and social/search preview via `SeoService`
 *
 * This file ships UNWIRED on purpose, so the template has no extra live routes.
 * To turn it into a real, reachable page, register a route for it — the route
 * is already written (commented out) in src/app/app.routes.ts. The full
 * walkthrough is in docs/adding-a-page.md.
 *
 * Copy this folder, rename things, and make it yours — or delete it if you
 * don't need a starting point.
 */
@Component({
  selector: 'app-example',
  imports: [RouterLink],
  templateUrl: './example.html',
  styleUrl: './example.scss',
})
export class Example implements OnInit {
  private seoService = inject(SeoService);

  protected readonly siteTitle = environment.siteTitle;

  ngOnInit(): void {
    // Sets <title> and the Open Graph / Twitter preview tags for this page.
    // Pass the page's own URL so social shares link back to the right place.
    this.seoService.setPage(
      'Example',
      `An example page for ${environment.siteTitle}, showing how to add your own.`,
      `${environment.siteUrl}/page/example`,
    );
  }
}
