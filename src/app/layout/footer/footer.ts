import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly siteTitle = environment.siteTitle;
  protected readonly tagline = environment.siteTagline;
  protected readonly socialLinks = environment.socialLinks;
  currentYear = new Date().getFullYear();
}
