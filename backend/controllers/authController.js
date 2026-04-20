import { supabase } from '../config/supabase.js';

// ── Register ──────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name } },
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json({
      message: 'Registration successful. Check your email to confirm.',
      user: {
        id:        data.user.id,
        email:     data.user.email,
        full_name: data.user.user_metadata?.full_name,
      },
      session: data.session,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// ── Login ─────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ error: 'Invalid email or password' });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id:        data.user.id,
        email:     data.user.email,
        full_name: data.user.user_metadata?.full_name,
      },
      session: data.session,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ── OTP: Send ─────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// ── OTP: Verify ───────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) return res.status(400).json({ error: 'Email and token are required' });

    const { data, error } = await supabase.auth.verifyOtp({
      email, token, type: 'email',
    });

    if (error) return res.status(400).json({ error: 'Invalid or expired OTP' });

    return res.status(200).json({
      message: 'OTP verified',
      user: {
        id:        data.user.id,
        email:     data.user.email,
        full_name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
      },
      session: data.session,
    });
  } catch (err) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
};

// ── Google OAuth URL ──────────────────────────────────────
export const googleOAuthUrl = async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ url: data.url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate OAuth URL' });
  }
};

// ── Token Refresh ─────────────────────────────────────────
export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ error: 'refresh_token is required' });

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error) return res.status(401).json({ error: 'Session expired, please log in again' });

    return res.status(200).json({
      session: data.session,
      user: {
        id:        data.user.id,
        email:     data.user.email,
        full_name: data.user.user_metadata?.full_name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

// ── Logout ────────────────────────────────────────────────
export const logout = async (_req, res) => {
  try {
    await supabase.auth.signOut();
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (_) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

// ── Get Me ────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles').select('*').eq('id', req.user.id).single();

    return res.status(200).json({
      user: {
        id:         req.user.id,
        email:      req.user.email,
        full_name:  profile?.full_name || req.user.user_metadata?.full_name,
        avatar_url: profile?.avatar_url,
        created_at: req.user.created_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// ── Update Profile ────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { full_name } = req.body;
    const { error } = await supabase
      .from('profiles').update({ full_name }).eq('id', req.user.id);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: 'Profile updated', full_name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
