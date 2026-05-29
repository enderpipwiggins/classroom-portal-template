import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';
import { environment } from '../../../environments/environment';

describe('Header', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('renders the site title and the nav links', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain(environment.siteTitle);
    expect(text).toContain('Donations');
  });

  it('toggles and closes the mobile menu', () => {
    const header = TestBed.createComponent(Header).componentInstance;
    expect(header.menuOpen).toBe(false);
    header.toggleMenu();
    expect(header.menuOpen).toBe(true);
    header.toggleMenu();
    expect(header.menuOpen).toBe(false);
    header.menuOpen = true;
    header.closeMenu();
    expect(header.menuOpen).toBe(false);
  });

  it('reflects the open menu state in the rendered markup', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.componentInstance.menuOpen = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Contact');
  });

  it('closes the menu when a nav link is clicked', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.componentInstance.menuOpen = true;
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a.nav-link') as HTMLAnchorElement;
    link.click();
    expect(fixture.componentInstance.menuOpen).toBe(false);
  });
});
