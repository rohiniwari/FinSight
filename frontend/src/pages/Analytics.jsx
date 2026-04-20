import { useState, useEffect } from 'react';
import { analyticsService }     from '../services/analyticsService.js';

const fmt    = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const COLORS = ['#6366f1','#22d3ee','#f59e0b','#ec4899','#10b981','#f43f5e','#8b5cf6','#14b8a6'];
const CIRC   = 628;

/* ── SVG Bar Chart ────────────────────────────────── */
function TrendChart({ data }) {
  if (!data.length) return <div className="h-48 flex items-center justify-center text-slate-600 text-sm">No data</div>;
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]), 1);
  return (
    <div className="flex items-end gap-2 h-48 mt-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <div className="flex items-end gap-1 w-full justify-center" style={{ flex:1 }}>
            <div className="flex-1 rounded-t-sm transition-all duration-700 max-w-[14px]"
                 style={{ height:`${(d.income  / maxVal) * 100}%`, background:'#6366f1', minHeight:3 }} />
            <div className="flex-1 rounded-t-sm transition-all duration-700 max-w-[14px]"
                 style={{ height:`${(d.expense / maxVal) * 100}%`, background:'rgba(244,63,94,.65)', minHeight:3 }} />
          </div>
          <span className="text-[9px] font-bold text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Donut Chart ──────────────────────────────────── */
function DonutChart({ slices, total }) {
  const R = 50; const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 140 140" className="w-full h-full" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={R} fill="none" stroke="#1e293b" strokeWidth="18" />
        {slices.map((s, i) => {
          const dash = (s.percentage / 100) * C;
          const el = (
            <circle key={i} cx="70" cy="70" r={R} fill="none"
                    stroke={COLORS[i % COLORS.length]} strokeWidth="18"
                    strokeDasharray={`${dash} ${C - dash}`}
                    strokeDashoffset={-offset} />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="font-display font-extrabold text-sm">{fmt(total)}</div>
        <div className="text-[10px] text-slate-500">Total</div>
      </div>
    </div>
  );
}

/* ── Health Ring ──────────────────────────────────── */
function HealthRing({ score, label }) {
  return (
    <div className="relative w-52 h-52 mx-auto" style={{ filter:'drop-shadow(0 0 40px rgba(16,185,129,.2))' }}>
      <svg viewBox="0 0 240 240" className="w-full h-full">
        <defs>
          <linearGradient id="hGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#10b981" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="zGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f43f5e" stopOpacity=".35" />
            <stop offset="42%"  stopColor="#f59e0b" stopOpacity=".35" />
            <stop offset="100%" stopColor="#10b981" stopOpacity=".35" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="100" fill="none" stroke="url(#zGrad)" strokeWidth="16" transform="rotate(-90 120 120)" />
        <circle cx="120" cy="120" r="100" fill="none" stroke="url(#hGrad)" strokeWidth="16"
                strokeLinecap="round" transform="rotate(-90 120 120)"
                strokeDasharray={`${(CIRC * score) / 100} ${CIRC}`} />
        <circle cx="120" cy="120" r="82" fill="rgba(8,10,22,.95)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display font-extrabold g-ge" style={{ fontSize:'4rem', lineHeight:1 }}>{score}</span>
        <span className="text-slate-500 text-sm font-semibold mt-1">out of 100</span>
        <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold rounded-full px-3 py-1.5"
              style={{ background:'rgba(16,185,129,.1)', color:'#10b981', border:'1px solid rgba(16,185,129,.22)' }}>
          <span className="ping-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {label}
        </span>
      </div>
    </div>
  );
}

/* ── Insight Card ─────────────────────────────────── */
const TAG = { warning:'tag-w', success:'tag-s', info:'tag-i', danger:'tag-d' };

function InsightCard({ insight }) {
  const parts = insight.text.split(/\*\*(.*?)\*\*/g);
  return (
    <div className="glass card-glow rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span style={{ fontSize:'1.8rem', lineHeight:1 }}>{insight.icon}</span>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${TAG[insight.type] || 'tag-i'}`}>
          {insight.title}
        </span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed flex-1">
        {parts.map((p, i) =>
          i % 2 === 1
            ? <strong key={i} className="text-white">{p}</strong>
            : p
        )}
      </p>
      <div className="pt-2 border-t" style={{ borderColor:'rgba(148,163,184,.07)' }}>
        <span className="text-xs font-bold" style={{ color: insight.type === 'success' ? '#10b981' : insight.type === 'danger' ? '#f43f5e' : '#22d3ee' }}>
          {insight.value}
        </span>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────── */
export default function Analytics() {
  const [summary,   setSummary]   = useState(null);
  const [trend,     setTrend]     = useState([]);
  const [health,    setHealth]    = useState(null);
  const [insights,  setInsights]  = useState([]);
  const [tab,       setTab]       = useState('weekly');
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, t, h, ins] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getMonthlyTrend(6),
          analyticsService.getHealthScore(),
          analyticsService.getInsights(),
        ]);
        setSummary(s);
        setTrend(t);
        setHealth(h);
        setInsights(ins || []);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const breakdown    = summary?.category_breakdown || [];
  const totalExpense = summary?.summary?.expense   || 0;
  const bd           = health?.breakdown || {};

  const scoreRows = [
    { key:'saving_ratio',         label:'Saving Ratio',          color:'#10b981', grad:'linear-gradient(90deg,#10b981,#22d3ee)' },
    { key:'budget_adherence',     label:'Budget Adherence',      color:'#22d3ee', grad:'linear-gradient(90deg,#22d3ee,#6366f1)' },
    { key:'expense_control',      label:'Expense Control',       color:'#6366f1', grad:'linear-gradient(90deg,#6366f1,#8b5cf6)' },
    { key:'spending_consistency', label:'Spending Consistency',  color:'#f59e0b', grad:'linear-gradient(90deg,#f59e0b,#f43f5e)' },
  ];

  const filteredInsights = insights.filter(i => i.tab === tab || tab === 'all');

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500 text-sm animate-pulse">
      Analysing your finances…
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-slide-up">

      {/* ── Monthly Trend + Category Breakdown ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Bar chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-display font-bold text-base text-white">Monthly Trend</span>
            <span className="text-xs text-slate-500">Last 6 months</span>
          </div>
          <TrendChart data={trend} />
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background:'#6366f1' }} />Income
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background:'rgba(244,63,94,.65)' }} />Expenses
            </span>
          </div>
        </div>

        {/* Donut */}
        <div className="glass rounded-2xl p-5">
          <div className="font-display font-bold text-base text-white mb-4">Expense Breakdown</div>
          {breakdown.length ? (
            <>
              <DonutChart slices={breakdown} total={totalExpense} />
              <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2">
                {breakdown.slice(0, 8).map((c, i) => (
                  <div key={c.category} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="truncate">{c.category}</span>
                    <span className="ml-auto text-slate-500 shrink-0">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-36 text-slate-600 text-sm">No expense data</div>
          )}
        </div>
      </div>

      {/* ── Health Score ── */}
      {health && (
        <div className="glass rounded-2xl p-7">
          <div className="text-center mb-2">
            <span className="s-tag">Financial Health Score</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center mt-8">

            {/* Ring */}
            <div className="flex flex-col items-center gap-6">
              <HealthRing score={health.total} label={health.label} />
              <div className="flex items-center gap-5 flex-wrap justify-center">
                {[['#f43f5e','0–40 Poor'],['#f59e0b','40–70 Moderate'],['#10b981','70–100 Healthy']].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background:c }} />{l}
                  </span>
                ))}
              </div>
            </div>

            {/* Breakdown bars */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-extrabold text-xl mb-1">Score Breakdown</h3>
              <p className="text-slate-500 text-sm mb-6">
                How your <strong className="text-white">{health.total}-point</strong> score is calculated
              </p>
              <div className="flex flex-col gap-5">
                {scoreRows.map(row => {
                  const item = bd[row.key];
                  if (!item) return null;
                  const pct = Math.round((item.score / item.max) * 100);
                  return (
                    <div key={row.key}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-slate-300 flex-1">{row.label}</span>
                        <span className="text-sm font-extrabold" style={{ color: row.color }}>
                          {item.value !== undefined ? `${item.value}%` : `${item.score}/${item.max}`}
                        </span>
                        <span className="text-xs text-slate-600 font-semibold">+{item.score} pts</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,.07)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                             style={{ width:`${pct}%`, background: row.grad }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-start gap-3 rounded-2xl p-4 mt-6"
                   style={{ background:'rgba(34,211,238,.05)', border:'1px solid rgba(34,211,238,.15)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-sm text-slate-400 leading-relaxed">
                  <strong className="text-white">Tip:</strong> Add transactions regularly and set category budgets to improve your score.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Insights Feed ── */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Smart Insights</h3>
            <p className="text-slate-500 text-sm mt-0.5">Auto-generated from your spending patterns</p>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl glass">
            {[['weekly','This Week'],['monthly','This Month'],['alerts','Alerts']].map(([val, lbl]) => (
              <button
                key={val} onClick={() => setTab(val)}
                className="px-4 py-2 rounded-lg text-xs font-display font-bold transition-all"
                style={tab === val
                  ? { background:'linear-gradient(135deg,#6366f1,#22d3ee)', color:'white' }
                  : { color:'#475569' }}
              >
                {val === 'alerts' ? '🔔 ' : ''}{lbl}
              </button>
            ))}
          </div>
        </div>

        {filteredInsights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="text-3xl">💡</div>
            <p className="text-slate-500 text-sm">Keep adding transactions to generate insights.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInsights.map(ins => <InsightCard key={ins.id} insight={ins} />)}
          </div>
        )}
      </div>
    </div>
  );
}
