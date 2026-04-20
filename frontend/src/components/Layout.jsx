import { useState }                  from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar                       from './Sidebar.jsx';

const pageTitles = {
  '/app/dashboard':    'Dashboard',
  '/app/transactions': 'Transactions',
  '/app/budgets':      'Budget Tracker',
  '/app/analytics':    'Analytics',
};

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title    = pageTitles[location.pathname] || 'FinSight';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#05060f' }}>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full" onClick={e => e.stopPropagation()}>
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
          <div className="flex-1" style={{ background: 'rgba(0,0,0,.5)' }} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{
            background:    'rgba(5,6,15,.9)',
            borderBottom:  '1px solid rgba(148,163,184,.06)',
            backdropFilter:'blur(12px)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile burger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMobileOpen(v => !v)}
            >
              <span className="block w-5 h-0.5 bg-white rounded"/>
              <span className="block w-5 h-0.5 bg-white rounded"/>
              <span className="block w-5 h-0.5 bg-white rounded"/>
            </button>
            <h1 className="font-display font-bold text-lg text-white">{title}</h1>
          </div>

          {/* Right side: date + home link */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-semibold hidden sm:block"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' })}
            </span>
            {/* Home button → landing page */}
            <Link
              to="/"
              title="Back to home"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,.04)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </Link>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
