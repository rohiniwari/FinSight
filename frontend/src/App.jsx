import { lazy, Suspense }                        from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider }       from '@tanstack/react-query';
import { Toaster }                                from 'react-hot-toast';
import { AuthProvider }    from './context/AuthContext.jsx';
import ProtectedRoute      from './components/ProtectedRoute.jsx';
import ErrorBoundary       from './components/ErrorBoundary.jsx';
import Layout              from './components/Layout.jsx';

// ── Code-split every page route ────────────────────────
const LandingPage  = lazy(() => import('./pages/LandingPage.jsx'));   // NEW
const Login        = lazy(() => import('./pages/Login.jsx'));
const Register     = lazy(() => import('./pages/Register.jsx'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback.jsx'));
const Dashboard    = lazy(() => import('./pages/Dashboard.jsx'));
const Transactions = lazy(() => import('./pages/Transactions.jsx'));
const Budgets      = lazy(() => import('./pages/Budgets.jsx'));
const Analytics    = lazy(() => import('./pages/Analytics.jsx'));

// ── React Query client ──────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:           60_000,
      gcTime:              5 * 60_000,
      retry:               1,
      refetchOnWindowFocus: true,
    },
  },
});

// ── Minimal page loader (dark themed) ──────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: '#05060f' }}>
      <div className="flex flex-col items-center gap-3">
        <svg width="36" height="36" viewBox="0 0 34 34" fill="none">
          <rect width="34" height="34" rx="9" fill="url(#appL)"/>
          <path d="M8 24V15l4.5-4.5V24H8zm6 0V13l4.5-2V24h-4.5zm6 0V11l4.5-2V24H20z"
                fill="#fff" fillOpacity=".92"/>
          <defs><linearGradient id="appL" x1="0" y1="0" x2="34" y2="34">
            <stop stopColor="#6366f1"/><stop offset="1" stopColor="#22d3ee"/>
          </linearGradient></defs>
        </svg>
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                  style={{ animation:`ping .8s ${i*.15}s ease-in-out infinite`, opacity:.7 }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>

                {/* ── PUBLIC routes ──────────────────────── */}
                <Route path="/"              element={<LandingPage />} />   {/* Landing page */}
                <Route path="/login"         element={<Login />} />
                <Route path="/register"      element={<Register />} />
                <Route path="/auth/callback" element={<OAuthCallback />} />

                {/* ── PROTECTED routes inside Layout ──────── */}
                <Route path="/app" element={
                  <ProtectedRoute><Layout /></ProtectedRoute>
                }>
                  <Route index              element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard"   element={<Dashboard />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="budgets"     element={<Budgets />} />
                  <Route path="analytics"   element={<Analytics />} />
                </Route>

                {/* Legacy /dashboard → /app/dashboard */}
                <Route path="/dashboard"    element={<Navigate to="/app/dashboard" replace />} />
                <Route path="/transactions" element={<Navigate to="/app/transactions" replace />} />
                <Route path="/budgets"      element={<Navigate to="/app/budgets" replace />} />
                <Route path="/analytics"    element={<Navigate to="/app/analytics" replace />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </Suspense>
          </BrowserRouter>

          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background:   '#0f1224',
                color:        '#e2e8f0',
                border:       '1px solid rgba(148,163,184,.12)',
                borderRadius: '12px',
                fontSize:     '14px',
                fontFamily:   '"DM Sans", sans-serif',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#0f1224' } },
              error:   { iconTheme: { primary: '#f43f5e', secondary: '#0f1224' } },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
