import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Contact } from './contact';
import { environment } from '../../../environments/environment';

describe('Contact', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('renders a mailto link to the configured contact email', () => {
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector(
      `a[href="mailto:${environment.contactEmail}"]`,
    );
    expect(link).toBeTruthy();
  });
});
