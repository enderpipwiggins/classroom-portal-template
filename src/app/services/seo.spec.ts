import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from './seo';
import { environment } from '../../environments/environment';

describe('SeoService', () => {
  let seo: SeoService;
  let title: Title;
  let meta: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    seo = TestBed.inject(SeoService);
    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);
  });

  it('suffixes the site title onto a page title', () => {
    seo.setPage('Donations', 'desc', 'https://example.com/page/donations');
    expect(title.getTitle()).toBe(`Donations | ${environment.siteTitle}`);
    expect(meta.getTag('name="description"')?.content).toBe('desc');
    expect(meta.getTag('property="og:url"')?.content).toBe('https://example.com/page/donations');
  });

  it('does not double up when the page title is already the site title', () => {
    seo.setPage(environment.siteTitle, 'desc', 'https://example.com');
    expect(title.getTitle()).toBe(environment.siteTitle);
  });

  it('only sets image tags when an image is provided', () => {
    seo.setPage('No Image', 'desc', 'https://example.com');
    expect(meta.getTag('property="og:image"')).toBeNull();

    seo.setPage('With Image', 'desc', 'https://example.com', 'https://example.com/img.png');
    expect(meta.getTag('property="og:image"')?.content).toBe('https://example.com/img.png');
    expect(meta.getTag('name="twitter:image"')?.content).toBe('https://example.com/img.png');
  });

  it('setDefault uses the environment site values', () => {
    seo.setDefault();
    expect(title.getTitle()).toBe(environment.siteTitle);
    expect(meta.getTag('property="og:site_name"')?.content).toBe(environment.siteTitle);
    expect(meta.getTag('name="twitter:card"')?.content).toBe('summary_large_image');
  });
});
