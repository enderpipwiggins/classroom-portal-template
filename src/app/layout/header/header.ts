import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly siteTitle = environment.siteTitle;

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Donations', path: '/page/donations' },
    { label: 'About', path: '/page/about' },
    { label: 'Contact', path: '/page/contact' },
  ];
}
