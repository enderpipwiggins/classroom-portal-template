import { Component, OnInit, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../services/seo';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  private seoService = inject(SeoService);

  protected readonly contactEmail = environment.contactEmail;
  protected readonly siteTitle = environment.siteTitle;

  ngOnInit(): void {
    this.seoService.setPage(
      'Contact',
      `Get in touch with ${environment.siteTitle}.`,
      `${environment.siteUrl}/page/contact`,
    );
  }
}
