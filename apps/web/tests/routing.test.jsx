import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { App, getPageFromUrl, getPathForPage } from '../src/app/App.jsx';
import { authService } from '../src/infrastructure/auth/firebaseAuth.js';

describe('App Routing & Navigation System', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.pushState({}, '', '/');
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
    expect(window.location.pathname).toBe('/routine');
  });

  it('renders direct navigation to /impact route consistently', () => {
    window.history.pushState({}, '', '/impact');
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(getPageFromUrl()).toBe('impact');
    expect(window.location.pathname).toBe('/impact');
  });

  it('navigates cleanly when clicking navigation links in TopBar', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    // Click 'My Routine' navigation button in the TopBar
    const routineNavButtons = screen.getAllByRole('button', { name: /my routine/i });
    expect(routineNavButtons.length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.click(routineNavButtons[0]);
    });

    expect(window.location.pathname).toBe('/routine');
    expect(getPageFromUrl()).toBe('routine');
  }, 20000);

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
  }, 20000);

  it('inactivity logout on /privacy redirects user to landing page and updates URL to /', async () => {
    vi.useFakeTimers();

    const mockUser = { uid: 'user_privacy_timeout', email: 'privacy@example.com' };
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);
    const signOutSpy = vi.spyOn(authService, 'signOut').mockResolvedValue(undefined);

    window.history.pushState({}, '', '/privacy');
    expect(window.location.pathname).toBe('/privacy');

    render(<App />);

    // Fast-forward 15 minutes of user inactivity
    await act(async () => {
      vi.advanceTimersByTime(15 * 60 * 1000 + 100);
    });

    expect(signOutSpy).toHaveBeenCalled();
    // Inactivity logout must safely transition the URL to '/' for private pages
    expect(window.location.pathname).toBe('/');
    expect(window.location.pathname).not.toContain('object');
    expect(window.location.pathname).not.toContain('Function');
    expect(screen.getByText(/automatically logged out after 15 minutes of inactivity/i)).toBeDefined();

    vi.useRealTimers();
  });

  it('inactivity logout on /routine terminates auth while preserving /routine URL without corruption', async () => {
    vi.useFakeTimers();

    const mockUser = { uid: 'user_routine_timeout', email: 'routine@example.com' };
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);
    const signOutSpy = vi.spyOn(authService, 'signOut').mockResolvedValue(undefined);

    window.history.pushState({}, '', '/routine');
    expect(window.location.pathname).toBe('/routine');

    render(<App />);

    // Fast-forward 15 minutes of user inactivity
    await act(async () => {
      vi.advanceTimersByTime(15 * 60 * 1000 + 100);
    });

    expect(signOutSpy).toHaveBeenCalled();
    // Non-private pages preserve page and URL according to logout policy
    expect(window.location.pathname).toBe('/routine');
    expect(window.location.pathname).not.toContain('object');
    expect(window.location.pathname).not.toContain('Function');
    expect(screen.getByText(/automatically logged out after 15 minutes of inactivity/i)).toBeDefined();

    vi.useRealTimers();
  });

  it('user activity resets inactivity timer and prevents premature session logout', async () => {
    vi.useFakeTimers();

    const mockUser = { uid: 'user_active_test', email: 'active@example.com' };
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);
    const signOutSpy = vi.spyOn(authService, 'signOut').mockResolvedValue(undefined);

    window.history.pushState({}, '', '/privacy');
    render(<App />);

    // Advance 10 minutes (not yet timed out)
    await act(async () => {
      vi.advanceTimersByTime(10 * 60 * 1000);
    });
    expect(signOutSpy).not.toHaveBeenCalled();

    // User interacts with app (mouse movement)
    await act(async () => {
      window.dispatchEvent(new MouseEvent('mousemove'));
    });

    // Advance another 10 minutes (total 20 mins, but only 10 mins since last interaction)
    await act(async () => {
      vi.advanceTimersByTime(10 * 60 * 1000);
    });
    expect(signOutSpy).not.toHaveBeenCalled();

    // Now let full 15 minutes elapse without interaction
    await act(async () => {
      vi.advanceTimersByTime(15 * 60 * 1000 + 100);
    });
    expect(signOutSpy).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
