import { useState }          from 'react';
import { Link, useNavigate }  from 'react-router-dom';
import { useAuth }            from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ full_name:'', email:'', password:'', confirm:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register({ full_name: form.full_name, email: form.email, password: form.password });
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
         style={{ background:'#05060f' }}>

      <div className="orb" style={{ width:600,height:600,background:'#6366f1',opacity:.14,top:-200,left:-180,animation:'orb1 14s ease-in-out infinite' }} />
      <div className="orb" style={{ width:450,height:450,background:'#22d3ee',opacity:.10,bottom:-120,right:-140,animation:'orb2 11s ease-in-out infinite' }} />

      <div className="relative w-full max-w-md animate-slide-up">

        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center gap-2.5">
            <svg width="38" height="38" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="9" fill="url(#rL)" />
              <path d="M8 24V15l4.5-4.5V24H8zm6 0V13l4.5-2V24h-4.5zm6 0V11l4.5-2V24H20z"
                    fill="#fff" fillOpacity=".92" />
              <defs>
                <linearGradient id="rL" x1="0" y1="0" x2="34" y2="34">
                  <stop stopColor="#6366f1" /><stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-display font-bold text-2xl text-white">
              Fin<span className="g-ic">Sight</span>
            </span>
          </a>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-display font-extrabold text-2xl text-white mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">Start your financial clarity journey</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <input type="text" required className="fs-input" placeholder="Alex Kumar"
                     value={form.full_name} onChange={e => set('full_name', e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" required autoComplete="email" className="fs-input" placeholder="you@example.com"
                     value={form.email} onChange={e => set('email', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                <input type="password" required className="fs-input" placeholder="••••••••"
                       value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Confirm</label>
                <input type="password" required className="fs-input" placeholder="••••••••"
                       value={form.confirm} onChange={e => set('confirm', e.target.value)} />
              </div>
            </div>

            {error && (
              <div className="rounded-xl p-3 text-sm font-semibold text-rose-400"
                   style={{ background:'rgba(244,63,94,.08)', border:'1px solid rgba(244,63,94,.2)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-pri w-full py-3.5 rounded-2xl text-base mt-1">
              {loading ? 'Creating account…' : 'Create Free Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold hover:underline" style={{ color:'#22d3ee' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
