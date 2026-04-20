import { useCallback }          from 'react';
import { Link }                 from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast                    from 'react-hot-toast';
import { useAuth }              from '../context/AuthContext.jsx';
import { analyticsService }     from '../services/analyticsService.js';
import { transactionService }   from '../services/transactionService.js';
import { useRealtime }          from '../hooks/useRealtime.js';
import TransactionModal         from '../components/TransactionModal.jsx';
import { DashboardSkeleton }    from '../components/Skeleton.jsx';
import { useState }             from 'react';

const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN');
const DONUT_COLORS = ['#6366f1','#22d3ee','#f59e0b','#ec4899','#10b981','#f43f5e','#8b5cf6','#14b8a6'];
const CIRC = 628;

function DonutChart({ slices, size = 110 }) {
  const R = 50; const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <svg viewBox="0 0 140 140" width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
      <circle cx="70" cy="70" r={R} fill="none" stroke="#1e293b" strokeWidth="18"/>
      {slices.map((s, i) => {
        const dash = (s.pct / 100) * C;
        const el = <circle key={i} cx="70" cy="70" r={R} fill="none"
          stroke={DONUT_COLORS[i % DONUT_COLORS.length]} strokeWidth="18"
          strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-offset}/>;
        offset += dash;
        return el;
      })}
    </svg>
  );
}

function BarChart({ data }) {
  const maxVal = Math.max(...(data || []).flatMap(d => [d.income || 0, d.expense || 0]), 1);
  return (
    <div className="flex items-end gap-2 h-28">
      {(data || []).map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
          <div className="flex items-end gap-0.5 w-full justify-center" style={{ flex:1 }}>
            <div className="flex-1 max-w-[14px] rounded-t-sm transition-all duration-700"
                 style={{ height:`${((d.income||0)/maxVal)*100}%`, background:'#6366f1', minHeight:3 }}/>
            <div className="flex-1 max-w-[14px] rounded-t-sm transition-all duration-700"
                 style={{ height:`${((d.expense||0)/maxVal)*100}%`, background:'rgba(244,63,94,.65)', minHeight:3 }}/>
          </div>
          <span className="text-[9px] font-bold text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ label, value, badge, badgeColor, accentClass, icon }) {
  return (
    <div className={`glass card-glow rounded-2xl p-5 relative overflow-hidden ${accentClass}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${icon.cls}`}>{icon.el}</div>
      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</div>
      <div className="text-xl font-display font-extrabold">{value}</div>
      {badge && (
        <span className="inline-block mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: badgeColor+'22', color: badgeColor }}>{badge}</span>
      )}
    </div>
  );
}

// ── Live badge ─────────────────────────────────────────────
function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background:'rgba(16,185,129,.1)', color:'#10b981', border:'1px solid rgba(16,185,129,.2)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
      Live
    </span>
  );
}

export default function Dashboard() {
  const { user }      = useAuth();
  const queryClient   = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  // React Query — all dashboard data
  const { data: summaryData, isLoading: sLoad } = useQuery({
    queryKey: ['summary'],
    queryFn:  () => analyticsService.getSummary(),
    staleTime: 60_000,
  });

  const { data: trend = [] } = useQuery({
    queryKey: ['trend'],
    queryFn:  () => analyticsService.getMonthlyTrend(6),
    staleTime: 5 * 60_000,
  });

  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn:  () => analyticsService.getHealthScore(),
    staleTime: 60_000,
  });

  const { data: recentData } = useQuery({
    queryKey: ['recent'],
    queryFn:  () => transactionService.getAll({ limit:6, sort:'date', order:'desc' }),
    staleTime: 30_000,
  });

  // Realtime — invalidate React Query cache on any change
  const onRealtimeUpdate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['summary'] });
    queryClient.invalidateQueries({ queryKey: ['recent'] });
    queryClient.invalidateQueries({ queryKey: ['health'] });
    toast('Balance updated ✨', { icon: '💰', duration: 2000, style: { background:'#0f1224', color:'#e2e8f0', border:'1px solid rgba(99,102,241,.3)' }});
  }, [queryClient]);

  useRealtime(onRealtimeUpdate, ['transactions']);

  const summary = summaryData?.summary;
  const recent  = recentData?.transactions || [];
  const cats    = summaryData?.category_breakdown || [];

  const first = user?.full_name?.split(' ')[0] || 'there';
  const hour  = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (sLoad) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-6 animate-slide-up">

      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-2xl text-white">{greet}, {first} 👋</h2>
            <LiveBadge />
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
                className="btn-pri px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Transaction
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Income"    value={fmt(summary?.total_income)}  badge="All time"   badgeColor="#10b981" accentClass="m-green"
          icon={{ cls:'ic-g', el:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg> }}/>
        <MetricCard label="Total Expenses"  value={fmt(summary?.total_expense)} badge="All time"   badgeColor="#f43f5e" accentClass="m-rose"
          icon={{ cls:'ic-r', el:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg> }}/>
        <MetricCard label="Current Balance" value={fmt(summary?.balance)}       badge="Net"        badgeColor="#6366f1" accentClass="m-indigo"
          icon={{ cls:'ic-i', el:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg> }}/>
        <MetricCard label="Savings Rate"    value={`${summary?.savings_rate||0}%`} badge="This Month" badgeColor="#f59e0b" accentClass="m-amber"
          icon={{ cls:'ic-a', el:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"/></svg> }}/>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-300">Income vs Expenses</span>
            <span className="text-xs text-slate-500">Last 6 months</span>
          </div>
          <BarChart data={trend}/>
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background:'#6366f1' }}/>Income
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background:'rgba(244,63,94,.65)' }}/>Expenses
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Donut */}
          <div className="glass rounded-2xl p-5 flex-1">
            <div className="text-sm font-bold text-slate-300 mb-3">Expense Breakdown</div>
            {cats.length ? (
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <DonutChart slices={cats.slice(0,6).map(c => ({ pct: c.percentage }))}/>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-display font-extrabold text-xs">{fmt(summary?.expense)}</span>
                    <span className="text-[10px] text-slate-500">Total</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {cats.slice(0,5).map((c,i) => (
                    <div key={c.category} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}/>
                      {c.category} {c.percentage}%
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="text-slate-600 text-sm">No expense data yet.</p>}
          </div>

          {/* Health */}
          {health && (
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-300">Health Score</span>
                <Link to="/app/analytics" className="text-xs font-semibold hover:underline" style={{ color:'#22d3ee' }}>Details</Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 140 140" className="w-full h-full">
                    <defs><linearGradient id="dhg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#22d3ee"/>
                    </linearGradient></defs>
                    <circle cx="70" cy="70" r="50" fill="none" stroke="#1e293b" strokeWidth="14" transform="rotate(-90 70 70)"/>
                    <circle cx="70" cy="70" r="50" fill="none" stroke="url(#dhg)" strokeWidth="14"
                            strokeLinecap="round" transform="rotate(-90 70 70)"
                            strokeDasharray={`${(CIRC*health.total)/100} ${CIRC}`}/>
                    <circle cx="70" cy="70" r="38" fill="rgba(8,10,22,.92)"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-extrabold text-base g-ge">{health.total}</span>
                    <span className="text-[9px] text-slate-500">/ 100</span>
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-white mb-0.5">{health.label}</div>
                  <div className="text-xs text-slate-500">Financial health</div>
                  <LiveBadge />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-300">Recent Transactions</span>
            <LiveBadge />
          </div>
          <Link to="/app/transactions" className="text-xs font-semibold hover:underline" style={{ color:'#22d3ee' }}>
            View All →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-slate-500 text-sm">No transactions yet.</p>
            <button onClick={() => setShowModal(true)} className="btn-pri mt-3 px-4 py-2 rounded-xl text-sm">
              Add your first one
            </button>
          </div>
        ) : (
          <div className="flex flex-col divide-y" style={{ '--tw-divide-opacity':1 }}>
            {recent.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-3"
                   style={{ borderColor:'rgba(148,163,184,.05)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                     style={{ background: t.type==='income'?'rgba(16,185,129,.1)':'rgba(244,63,94,.1)' }}>
                  {t.type==='income'?'💰':'💸'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{t.notes || t.category}</div>
                  <div className="text-xs text-slate-500">
                    {t.category} · {new Date(t.date).toLocaleDateString('en-IN',{ day:'numeric',month:'short' })}
                  </div>
                </div>
                <span className="text-sm font-extrabold shrink-0"
                      style={{ color: t.type==='income'?'#10b981':'#f43f5e' }}>
                  {t.type==='income'?'+':'-'}{fmt(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            queryClient.invalidateQueries();
            toast.success('Transaction added! 🎉');
          }}
        />
      )}
    </div>
  );
}
