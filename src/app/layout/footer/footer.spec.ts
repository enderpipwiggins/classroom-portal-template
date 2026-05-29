import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';
import { environment } from '../../../environments/environment';
import type { SocialLink } from '../../../environments/generated-config';

describe('Footer', () => {
  const original = environment.socialLinks;

  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));
  afterEach(() => {
    (environment as { socialLinks: SocialLink[] }).socialLinks = original;
  });

  it('renders the site title and the current year', () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain(environment.siteTitle);
    expect(text).toContain(String(new Date().getFullYear()));
  });

  it('renders the social links section when links are configured', () => {
    (environment as { socialLinks: SocialLink[] }).socialLinks = [
      { label: 'Mastodon', href: 'https://example.social/@room12' },
    ];
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector(
      'a[href="https://example.social/@room12"]',
    );
    expect(link).toBeTruthy();
    expect(link.getAttribute('aria-label')).toBe('Mastodon');
  });
});
