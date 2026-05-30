import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Example } from './example';
import { environment } from '../../../environments/environment';

describe('Example', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('renders and references the site title', () => {
    const fixture = TestBed.createComponent(Example);
    fixture.detectChanges();
    expect((fixture.nativeElement.textContent as string).length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).toContain(environment.siteTitle);
  });
});
