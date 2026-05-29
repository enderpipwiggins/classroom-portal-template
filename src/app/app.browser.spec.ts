import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

const analytics = vi.hoisted(() => ({ inject: vi.fn() }));
const speedInsights = vi.hoisted(() => ({ injectSpeedInsights: vi.fn() }));

vi.mock('@vercel/analytics', () => ({ inject: analytics.inject }));
vi.mock('@vercel/speed-insights', () => ({
  injectSpeedInsights: speedInsights.injectSpeedInsights,
}));

import { App } from './app';

describe('App (browser platform)', () => {
  beforeEach(() => {
    analytics.inject.mockClear();
    speedInsights.injectSpeedInsights.mockClear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: 'browser' }],
    });
  });

  it('wires up Vercel analytics and speed insights in the browser', () => {
    TestBed.createComponent(App);
    expect(speedInsights.injectSpeedInsights).toHaveBeenCalledOnce();
    expect(analytics.inject).toHaveBeenCalledOnce();
  });
});
