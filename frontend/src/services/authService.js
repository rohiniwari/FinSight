import api     from './api.js';
import { supabase } from './supabase.js';

export const authService = {
  async register({ email, password, full_name }) {
    const { data } = await api.post('/auth/register', { email, password, full_name });
    if (data.session) {
      localStorage.setItem('fs_session', JSON.stringify(data.session));
      localStorage.setItem('fs_user',    JSON.stringify(data.user));
    }
    return data;
  },

  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.session) {
      localStorage.setItem('fs_session', JSON.stringify(data.session));
      localStorage.setItem('fs_user',    JSON.stringify(data.user));
    }
    return data;
  },

  // ── OTP ──────────────────────────────────────────────
  async sendOtp(email) {
    const { data } = await api.post('/auth/otp/send', { email });
    return data;
  },

  async verifyOtp({ email, token }) {
    const { data } = await api.post('/auth/otp/verify', { email, token });
    if (data.session) {
      localStorage.setItem('fs_session', JSON.stringify(data.session));
      localStorage.setItem('fs_user',    JSON.stringify(data.user));
    }
    return data;
  },

  // ── Google OAuth ──────────────────────────────────────
  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) throw new Error(error.message);
    return data;
  },

  // ── OAuth callback handler ────────────────────────────
  async handleOAuthCallback() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) throw new Error('OAuth callback failed');

    const session = data.session;
    const user    = {
      id:        session.user.id,
      email:     session.user.email,
      full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
    };
    localStorage.setItem('fs_session', JSON.stringify(session));
    localStorage.setItem('fs_user',    JSON.stringify(user));
    return { session, user };
  },

  // ── Token refresh ─────────────────────────────────────
  async refreshToken() {
    const session = this.getSession();
    if (!session?.refresh_token) throw new Error('No refresh token');

    const { data } = await api.post('/auth/refresh', {
      refresh_token: session.refresh_token,
    });
    if (data.session) {
      localStorage.setItem('fs_session', JSON.stringify(data.session));
      if (data.user) localStorage.setItem('fs_user', JSON.stringify(data.user));
    }
    return data;
  },

  async logout() {
    try { await api.post('/auth/logout'); } catch (_) {}
    localStorage.removeItem('fs_session');
    localStorage.removeItem('fs_user');
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.user;
  },

  getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('fs_user') || 'null'); } catch { return null; }
  },

  getSession() {
    try { return JSON.parse(localStorage.getItem('fs_session') || 'null'); } catch { return null; }
  },

  isAuthenticated() {
    const session = this.getSession();
    if (!session?.access_token) return false;
    if (session.expires_at) return Date.now() / 1000 < session.expires_at;
    return true;
  },
};
