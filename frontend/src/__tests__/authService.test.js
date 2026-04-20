import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/authService.js';

// Mock api
vi.mock('../services/api.js', () => ({
  default: {
    post: vi.fn(),
    get:  vi.fn(),
  },
}));

import api from '../services/api.js';

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('authService.login', () => {
  it('stores session in localStorage on success', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        user:    { id:'1', email:'test@test.com', full_name:'Test' },
        session: { access_token:'tok123', refresh_token:'ref', expires_at: 9999999999 },
      },
    });
    await authService.login({ email:'test@test.com', password:'pass' });
    const stored = JSON.parse(localStorage.getItem('fs_session'));
    expect(stored.access_token).toBe('tok123');
  });

  it('throws on API error', async () => {
    api.post.mockRejectedValueOnce({ response: { data: { error: 'Invalid credentials' } } });
    await expect(authService.login({ email:'x@x.com', password:'wrong' })).rejects.toBeTruthy();
  });
});

describe('authService.isAuthenticated', () => {
  it('returns false when no session', () => {
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('returns false for expired token', () => {
    localStorage.setItem('fs_session', JSON.stringify({
      access_token: 'tok', expires_at: 1000,
    }));
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('returns true for valid token', () => {
    localStorage.setItem('fs_session', JSON.stringify({
      access_token: 'tok', expires_at: 9999999999,
    }));
    expect(authService.isAuthenticated()).toBe(true);
  });
});

describe('authService.logout', () => {
  it('clears localStorage', async () => {
    localStorage.setItem('fs_session', '{"access_token":"x"}');
    localStorage.setItem('fs_user',    '{"email":"x@x.com"}');
    api.post.mockResolvedValueOnce({ data: {} });
    await authService.logout();
    expect(localStorage.getItem('fs_session')).toBeNull();
    expect(localStorage.getItem('fs_user')).toBeNull();
  });
});

describe('authService.sendOtp', () => {
  it('calls the OTP send endpoint', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'OTP sent' } });
    await authService.sendOtp('test@test.com');
    expect(api.post).toHaveBeenCalledWith('/auth/otp/send', { email:'test@test.com' });
  });
});
