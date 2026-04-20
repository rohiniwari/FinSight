import { useEffect, useState } from 'react';
import { useNavigate }          from 'react-router-dom';
import { useAuth }              from '../context/AuthContext.jsx';
import toast                    from 'react-hot-toast';

export default function OAuthCallback() {
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();
  const [error,  setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        await handleOAuthCallback();
        toast.success('Logged in with Google!');
        navigate('/app/dashboard', { replace: true });
      } catch (err) {
        setError('Google login failed. Please try again.');
        setTimeout(() => navigate('/login', { replace: true }), 2500);
      }
    };
    run();
  }, []);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'#05060f' }}>
      <div className="glass rounded-2xl p-8 text-center max-w-sm">
        <div className="text-3xl mb-3">❌</div>
        <p className="text-rose-400 font-semibold text-sm">{error}</p>
        <p className="text-slate-600 text-xs mt-2">Redirecting to login…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'#05060f' }}>
      <div className="flex flex-col items-center gap-4">
        <svg width="40" height="40" viewBox="0 0 34 34" fill="none">
          <rect width="34" height="34" rx="9" fill="url(#cbL)"/>
          <path d="M8 24V15l4.5-4.5V24H8zm6 0V13l4.5-2V24h-4.5zm6 0V11l4.5-2V24H20z"
                fill="#fff" fillOpacity=".92"/>
          <defs><linearGradient id="cbL" x1="0" y1="0" x2="34" y2="34">
            <stop stopColor="#6366f1"/><stop offset="1" stopColor="#22d3ee"/>
          </linearGradient></defs>
        </svg>
        <p className="text-slate-400 text-sm font-semibold animate-pulse">
          Completing sign in…
        </p>
      </div>
    </div>
  );
}
