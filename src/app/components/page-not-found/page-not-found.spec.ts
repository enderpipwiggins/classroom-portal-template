import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PageNotFound } from './page-not-found';

describe('PageNotFound', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('renders and offers a way home', () => {
    const fixture = TestBed.createComponent(PageNotFound);
    fixture.detectChanges();
    expect((fixture.nativeElement.textContent as string).length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('a')).toBeTruthy();
  });
});
