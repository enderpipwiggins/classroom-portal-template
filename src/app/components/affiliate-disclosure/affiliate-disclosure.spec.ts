import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AffiliateDisclosure } from './affiliate-disclosure';

describe('AffiliateDisclosure', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('renders the disclosure content', () => {
    const fixture = TestBed.createComponent(AffiliateDisclosure);
    fixture.detectChanges();
    expect((fixture.nativeElement.textContent as string).toLowerCase()).toContain('amazon');
  });
});
