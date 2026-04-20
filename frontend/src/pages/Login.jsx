import { useState }          from 'react';
import { Link, useNavigate }  from 'react-router-dom';
import toast                  from 'react-hot-toast';
import { useAuth }            from '../context/AuthContext.jsx';
import { authService }        from '../services/authService.js';

const Logo = () => (
  <svg width="38" height="38" viewBox="0 0 34 34" fill="none">
    <rect width="34" height="34" rx="9" fill="url(#lgL)"/>
    <path d="M8 24V15l4.5-4.5V24H8zm6 0V13l4.5-2V24h-4.5zm6 0V11l4.5-2V24H20z" fill="#fff" fillOpacity=".92"/>
    <defs><linearGradient id="lgL" x1="0" y1="0" x2="34" y2="34">
      <stop stopColor="#6366f1"/><stop offset="1" stopColor="#22d3ee"/>
    </linearGradient></defs>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ── Password Tab ──────────────────────────────────────────
function PasswordTab({ onSuccess }) {
  const { login }   = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back! 👋');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
        <input type="email" required autoComplete="email" className="fs-input"
               placeholder="you@example.com" value={form.email}
               onChange={e => set('email', e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
        <input type="password" required autoComplete="current-password" className="fs-input"
               placeholder="••••••••" value={form.password}
               onChange={e => set('password', e.target.value)} />
      </div>
      <button type="submit" disabled={loading} className="btn-pri w-full py-3.5 rounded-2xl text-base mt-1">
        {loading ? 'Signing in…' : 'Sign In →'}
      </button>
    </form>
  );
}

// ── OTP Tab ───────────────────────────────────────────────
function OtpTab({ onSuccess }) {
  const { verifyOtp } = useAuth();
  const [step,    setStep]    = useState('email'); // 'email' | 'verify'
  const [email,   setEmail]   = useState('');
  const [token,   setToken]   = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.sendOtp(email);
      toast.success('OTP sent! Check your email 📧');
      setStep('verify');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp({ email, token });
      toast.success('Logged in successfully! ✅');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'email') return (
    <form onSubmit={sendOtp} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
        <input type="email" required className="fs-input" placeholder="you@example.com"
               value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <p className="text-xs text-slate-500">We'll send a one-time code to your email. No password needed.</p>
      <button type="submit" disabled={loading} className="btn-pri w-full py-3.5 rounded-2xl text-base">
        {loading ? 'Sending…' : 'Send OTP →'}
      </button>
    </form>
  );

  return (
    <form onSubmit={verify} className="flex flex-col gap-4">
      <div className="rounded-xl p-3 text-xs text-slate-400"
           style={{ background:'rgba(34,211,238,.06)', border:'1px solid rgba(34,211,238,.15)' }}>
        Code sent to <strong className="text-white">{email}</strong>
        <button type="button" onClick={() => setStep('email')}
                className="ml-2 text-cyan-400 hover:underline">Change</button>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Enter OTP</label>
        <input type="text" required maxLength={6} className="fs-input text-center text-2xl tracking-[.5em] font-display font-bold"
               placeholder="000000" value={token} onChange={e => setToken(e.target.value.replace(/\D/g,''))} />
      </div>
      <button type="submit" disabled={loading || token.length < 6} className="btn-pri w-full py-3.5 rounded-2xl text-base">
        {loading ? 'Verifying…' : 'Verify OTP ✓'}
      </button>
      <button type="button" onClick={() => { setStep('email'); setToken(''); }}
              className="text-xs text-slate-500 hover:text-slate-300 text-center transition-colors">
        ← Resend OTP
      </button>
    </form>
  );
}

// ── Main Login Page ───────────────────────────────────────
export default function Login() {
  const navigate        = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [tab,      setTab]      = useState('password'); // 'password' | 'otp'
  const [gLoading, setGLoading] = useState(false);

  const onSuccess = () => navigate('/app/dashboard', { replace: true });

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      await loginWithGoogle();
      // Redirect happens automatically via Supabase
    } catch (err) {
      toast.error('Google sign-in failed. Try again.');
      setGLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
         style={{ background: '#05060f' }}>
      <div className="orb" style={{ width:600,height:600,background:'#6366f1',opacity:.14,top:-200,left:-180,animation:'orb1 14s ease-in-out infinite' }}/>
      <div className="orb" style={{ width:450,height:450,background:'#22d3ee',opacity:.10,bottom:-120,right:-140,animation:'orb2 11s ease-in-out infinite' }}/>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display font-bold text-2xl text-white">Fin<span className="g-ic">Sight</span></span>
          </a>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-6">
            <h1 className="font-display font-extrabold text-2xl text-white mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your financial dashboard</p>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle} disabled={gLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl text-sm font-semibold mb-5 transition-all hover:border-indigo-500/40"
            style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(148,163,184,.14)', color:'#e2e8f0' }}
          >
            {gLoading
              ? <span className="text-slate-400 text-sm animate-pulse">Redirecting…</span>
              : <><GoogleIcon /> Continue with Google</>
            }
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background:'rgba(148,163,184,.1)' }}/>
            <span className="text-xs text-slate-600 font-semibold">OR</span>
            <div className="flex-1 h-px" style={{ background:'rgba(148,163,184,.1)' }}/>
          </div>

          {/* Tab switcher */}
          <div className="flex p-1 rounded-2xl mb-5 gap-1" style={{ background:'rgba(255,255,255,.04)' }}>
            {[['password','🔑 Password'],['otp','📧 Email OTP']].map(([val,lbl]) => (
              <button key={val} type="button" onClick={() => setTab(val)}
                      className="flex-1 py-2 rounded-xl text-sm font-display font-bold transition-all"
                      style={tab === val
                        ? { background:'linear-gradient(135deg,#6366f1,#22d3ee)', color:'white' }
                        : { color:'#475569' }}>
                {lbl}
              </button>
            ))}
          </div>

          {tab === 'password' ? <PasswordTab onSuccess={onSuccess} /> : <OtpTab onSuccess={onSuccess} />}

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold hover:underline" style={{ color:'#22d3ee' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
