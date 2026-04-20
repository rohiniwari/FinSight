import request from 'supertest';
import app     from '../server.js';

const MOCK_USER = { id: 'user-123', email: 'test@test.com' };
const MOCK_TXN  = {
  id: 'txn-1', user_id: 'user-123',
  amount: 500, category: 'Food', type: 'expense',
  date: '2025-01-15', notes: 'Lunch',
};

jest.mock('../config/supabase.js', () => {
  const mockChain = {
    select:  jest.fn().mockReturnThis(),
    insert:  jest.fn().mockReturnThis(),
    update:  jest.fn().mockReturnThis(),
    delete:  jest.fn().mockReturnThis(),
    eq:      jest.fn().mockReturnThis(),
    gte:     jest.fn().mockReturnThis(),
    lte:     jest.fn().mockReturnThis(),
    or:      jest.fn().mockReturnThis(),
    order:   jest.fn().mockReturnThis(),
    range:   jest.fn().mockReturnThis(),
    single:  jest.fn().mockResolvedValue({ data: null, error: null }),
    limit:   jest.fn().mockReturnThis(),
  };
  return {
    supabase: {
      auth: { getUser: jest.fn() },
      from: jest.fn(() => mockChain),
    },
  };
});

import { supabase } from '../config/supabase.js';

// Helper: authenticate requests
const withAuth = (req) => req.set('Authorization', 'Bearer valid-token');

beforeEach(() => {
  supabase.auth.getUser.mockResolvedValue({ data: { user: MOCK_USER }, error: null });
});

describe('GET /api/transactions', () => {
  it('returns 401 without token', async () => {
    supabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: { message: 'Not authenticated' } });
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(401);
  });

  it('returns 200 with auth token', async () => {
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq:     jest.fn().mockReturnThis(),
      order:  jest.fn().mockReturnThis(),
      range:  jest.fn().mockResolvedValue({ data: [MOCK_TXN], error: null, count: 1 }),
    });
    const res = await withAuth(request(app).get('/api/transactions'));
    expect(res.status).toBe(200);
  });
});

describe('POST /api/transactions', () => {
  it('returns 400 for missing amount', async () => {
    const res = await withAuth(request(app).post('/api/transactions'))
      .send({ category: 'Food', type: 'expense', date: '2025-01-15' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for invalid type', async () => {
    const res = await withAuth(request(app).post('/api/transactions'))
      .send({ amount: 100, category: 'Food', type: 'invalid', date: '2025-01-15' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for negative amount', async () => {
    const res = await withAuth(request(app).post('/api/transactions'))
      .send({ amount: -100, category: 'Food', type: 'expense', date: '2025-01-15' });
    expect(res.status).toBe(400);
  });
});

describe('Zod validation', () => {
  it('rejects bad date format', async () => {
    const res = await withAuth(request(app).post('/api/transactions'))
      .send({ amount: 100, category: 'Food', type: 'expense', date: '15-01-2025' });
    expect(res.status).toBe(400);
  });
});
