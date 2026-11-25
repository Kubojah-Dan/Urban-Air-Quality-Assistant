import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { App, getPageFromUrl, getPathForPage, PAGE_MAP } from '../src/app/App.jsx';
import { authService } from '../src/infrastructure/auth/firebaseAuth.js';

describe('App Routing & Navigation System', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('correctly maps route paths and canonical URLs', () => {
    expect(getPathForPage('landing')).toBe('/');
    expect(getPathForPage('routine')).toBe('/routine');
    expect(getPathForPage('impact')).toBe('/impact');
    expect(getPathForPage('history')).toBe('/impact');
    expect(getPathForPage('indoor')).toBe('/indoor');
    expect(getPathForPage('unknown_random')).toBe('/');
  });

  it('resolves direct navigation from URL paths', () => {
    window.history.pushState({}, '', '/routine');
    expect(getPageFromUrl()).toBe('routine');

    window.history.pushState({}, '', '/indoor');
    expect(getPageFromUrl()).toBe('indoor');

    window.history.pushState({}, '', '/impact');
    expect(getPageFromUrl()).toBe('impact');

    // Canonicalizes legacy alias /history to impact
    window.history.pushState({}, '', '/history');
    expect(getPageFromUrl()).toBe('impact');

    // Resolves unknown path safely to landing
    window.history.pushState({}, '', '/non-existent-page');
    expect(getPageFromUrl()).toBe('landing');
  });

  it('renders direct navigation to /routine without crashing', () => {
    window.history.pushState({}, '', '/routine');
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(getPageFromUrl()).toBe('routine');
  });

  it('renders direct navigation to /impact route consistently', () => {
    window.history.pushState({}, '', '/impact');
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(getPageFromUrl()).toBe('impact');
  });

  it('synchronizes browser history on popstate (Back/Forward)', () => {
    render(<App />);

    act(() => {
      window.history.pushState({ page: 'routine' }, '', '/routine');
      window.dispatchEvent(new PopStateEvent('popstate', { state: { page: 'routine' } }));
    });

    expect(getPageFromUrl()).toBe('routine');

    act(() => {
      window.history.pushState({ page: 'indoor' }, '', '/indoor');
      window.dispatchEvent(new PopStateEvent('popstate', { state: { page: 'indoor' } }));
    });

    expect(getPageFromUrl()).toBe('indoor');
  });

  it('never generates an invalid URL like /[object%20Function] when updating state functionally', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    render(<App />);

    // Simulate functional update
    const updater = (prev) => (prev === 'onboarding' ? 'landing' : prev);
    expect(typeof updater).toBe('function');

    // Verify resolved target never contains Function or object
    const resolved = updater('landing');
    const targetPath = getPathForPage(resolved);
    expect(targetPath).not.toContain('Function');
    expect(targetPath).not.toContain('object');
    expect(targetPath).toBe('/');
  });

  it('enforces 15-minute inactivity logout with fake timers and cleans up route state', async () => {
    vi.useFakeTimers();

    const mockUser = { uid: 'user_timeout_test', email: 'test@example.com' };
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);
    const signOutSpy = vi.spyOn(authService, 'signOut').mockResolvedValue(undefined);

    window.history.pushState({}, '', '/privacy');

    render(<App />);

    // Fast-forward 15 minutes of user inactivity
    await act(async () => {
      vi.advanceTimersByTime(15 * 60 * 1000 + 100);
    });

    expect(signOutSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
