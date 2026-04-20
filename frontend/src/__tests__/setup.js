import '@testing-library/jest-dom';

// Mock Supabase in all frontend tests
vi.mock('../services/supabase.js', () => ({
  supabase: {
    auth: {
      getSession:        vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithOAuth:   vi.fn().mockResolvedValue({ data: { url: 'https://google.com' }, error: null }),
      signInWithOtp:     vi.fn().mockResolvedValue({ data: {}, error: null }),
      verifyOtp:         vi.fn().mockResolvedValue({ data: { user:{id:'1',email:'t@t.com'}, session:{access_token:'tok'} }, error: null }),
      signOut:           vi.fn().mockResolvedValue({ error: null }),
      getUser:           vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    channel:             vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })),
    removeChannel:       vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

// Suppress console.error in tests
beforeAll(() => { vi.spyOn(console,'error').mockImplementation(() => {}); });
afterAll (() => { vi.restoreAllMocks(); });
