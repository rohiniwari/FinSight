import request from 'supertest';
import app     from '../server.js';

// Mock Supabase so tests run without real credentials
jest.mock('../config/supabase.js', () => ({
  supabase: {
    auth: {
      signUp:               jest.fn(),
      signInWithPassword:   jest.fn(),
      signOut:              jest.fn(),
      getUser:              jest.fn(),
      signInWithOtp:        jest.fn(),
      verifyOtp:            jest.fn(),
      signInWithOAuth:      jest.fn(),
      refreshSession:       jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq:     jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { full_name: 'Test User' }, error: null }),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
    })),
  },
}));

import { supabase } from '../config/supabase.js';

describe('POST /api/auth/register', () => {
  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'test@test.com' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for invalid email', async () => {
    const res = await request(app).post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'pass123', full_name: 'Test' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for short password', async () => {
    const res = await request(app).post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123', full_name: 'Test' });
    expect(res.status).toBe(400);
  });

  it('returns 201 on successful register', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: {
        user:    { id: 'abc-123', email: 'test@test.com', user_metadata: { full_name: 'Test User' } },
        session: { access_token: 'token123' },
      },
      error: null,
    });
    const res = await request(app).post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'password123', full_name: 'Test User' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('session');
  });
});

describe('POST /api/auth/login', () => {
  it('returns 400 when email missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'pass' });
    expect(res.status).toBe(400);
  });

  it('returns 401 on wrong credentials', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: {}, error: { message: 'Invalid credentials' },
    });
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('returns 200 on successful login', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: {
        user:    { id: 'abc-123', email: 'test@test.com', user_metadata: { full_name: 'Test' } },
        session: { access_token: 'tok', refresh_token: 'ref', expires_at: 9999999999 },
      },
      error: null,
    });
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('session');
    expect(res.body.user.email).toBe('test@test.com');
  });
});

describe('Health check', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Unknown routes', () => {
  it('returns 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });
});
