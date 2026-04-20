import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth }                    from '../context/AuthContext.jsx';

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
    <rect width="34" height="34" rx="9" fill="url(#sbL)"/>
    <path d="M8 24V15l4.5-4.5V24H8zm6 0V13l4.5-2V24h-4.5zm6 0V11l4.5-2V24H20z"
          fill="#fff" fillOpacity=".92"/>
    <defs><linearGradient id="sbL" x1="0" y1="0" x2="34" y2="34">
      <stop stopColor="#6366f1"/><stop offset="1" stopColor="#22d3ee"/>
    </linearGradient></defs>
  </svg>
);

const navItems = [
  {
    to: '/app/dashboard', label: 'Dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>,
  },
  {
    to: '/app/transactions', label: 'Transactions',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <path d="M2 10h20"/>
          </svg>,
  },
  {
    to: '/app/budgets', label: 'Budgets',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>,
  },
  {
    to: '/app/analytics', label: 'Analytics',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>,
  },
];

export default function Sidebar({ mobile, onClose }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
    }`;

  return (
    <aside
      className="h-full flex flex-col"
      style={{
        width:       mobile ? '100%' : '220px',
        background:  'rgba(0,0,0,.28)',
        borderRight: '1px solid rgba(148,163,184,.06)',
        flexShrink:  0,
      }}
    >
      {/* Logo → clicking goes back to landing page */}
      <Link
        to="/"
        className="p-5 flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        title="Back to home"
      >
        <Logo />
        <span className="font-display font-bold text-base text-white">
          Fin<span className="g-ic">Sight</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1 pt-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            style={({ isActive }) => isActive ? { background: 'rgba(99,102,241,.16)' } : {}}
            onClick={onClose}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(148,163,184,.06)' }}>
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-extrabold shrink-0"
            style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-300 truncate">
              {user?.full_name || 'User'}
            </div>
            <div className="text-[10px] text-slate-600 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-500 hover:text-rose-400 text-sm font-semibold transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
