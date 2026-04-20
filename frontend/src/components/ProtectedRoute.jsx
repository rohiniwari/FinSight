import { Navigate } from 'react-router-dom';
import { useAuth }   from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#05060f' }}>
        <div className="flex flex-col items-center gap-4">
          <svg width="40" height="40" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" fill="url(#pL)" />
            <path d="M8 24V15l4.5-4.5V24H8zm6 0V13l4.5-2V24h-4.5zm6 0V11l4.5-2V24H20z"
                  fill="#fff" fillOpacity=".92" />
            <defs>
              <linearGradient id="pL" x1="0" y1="0" x2="34" y2="34">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <span key={i} className="w-2 h-2 rounded-full bg-indigo-500"
                    style={{ animation: `ping .9s ${i * .2}s ease-in-out infinite`,
                             opacity: .8 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
