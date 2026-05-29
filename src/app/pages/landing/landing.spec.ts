import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Landing } from './landing';
import { environment } from '../../../environments/environment';

describe('Landing', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('renders the site title and tagline', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain(environment.siteTitle);
    expect(text).toContain(environment.siteTagline);
  });
});
