import { useState, useCallback }               from 'react';
import { useQuery, useQueryClient }            from '@tanstack/react-query';
import toast                                   from 'react-hot-toast';
import { budgetService }                       from '../services/budgetService.js';
import { useRealtime }                         from '../hooks/useRealtime.js';
import BudgetModal                             from '../components/BudgetModal.jsx';
import { BudgetCardSkeleton }                  from '../components/Skeleton.jsx';
import { Card, CardContent, Button,
         Badge, Progress }                     from '../components/ui/index.js';
import { formatCurrency }                      from '../utils/formatters.js';
import { MONTHS }                              from '../utils/constants.js';
import { getCategoryIcon }                     from '../utils/formatters.js';

function BudgetCard({ budget, onEdit, onDelete }) {
  const { category, amount, spent = 0, utilization = 0,
          remaining = 0, is_exceeded, is_warning } = budget;

  return (
    <Card glow className="p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryIcon(category)}</span>
          <div>
            <div className="font-display font-bold text-base text-white">{category}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {formatCurrency(spent)} <span className="text-slate-600">of</span> {formatCurrency(amount)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onEdit(budget)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(budget.id)}
                  className="hover:text-rose-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 font-semibold">Utilization</span>
          <Badge variant={is_exceeded ? 'expense' : is_warning ? 'warning' : 'income'}>
            {utilization}%
          </Badge>
        </div>
        <Progress value={utilization} max={100} colorByValue />
      </div>

      {/* Status alert */}
      {is_exceeded ? (
        <div className="flex items-center gap-2 text-xs font-semibold rounded-xl p-2.5"
             style={{ background:'rgba(244,63,94,.08)', color:'#f43f5e', border:'1px solid rgba(244,63,94,.18)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          Budget exceeded by {formatCurrency(spent - amount)}!
        </div>
      ) : is_warning ? (
        <div className="flex items-center gap-2 text-xs font-semibold rounded-xl p-2.5"
             style={{ background:'rgba(245,158,11,.08)', color:'#f59e0b', border:'1px solid rgba(245,158,11,.18)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Approaching limit — {formatCurrency(remaining)} left
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Remaining</span>
          <span className="font-bold text-emerald-400">{formatCurrency(remaining)}</span>
        </div>
      )}
    </Card>
  );
}

export default function Budgets() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year,  setYear]  = useState(now.getFullYear());
  const [modal, setModal] = useState(null);
  const queryClient       = useQueryClient();

  const queryKey = ['budgets', month, year];
  const { data: budgets = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => budgetService.getAll({ month, year }),
    staleTime: 60_000,
  });

  const onRealtimeUpdate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['budgets'] });
  }, [queryClient]);
  useRealtime(onRealtimeUpdate, ['budgets', 'transactions']);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await budgetService.remove(id);
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget deleted');
    } catch (_) {
      toast.error('Failed to delete budget');
    }
  };

  const totalBudgeted = budgets.reduce((s, b) => s + parseFloat(b.amount), 0);
  const totalSpent    = budgets.reduce((s, b) => s + (b.spent || 0), 0);
  const exceeded      = budgets.filter(b => b.is_exceeded).length;
  const warnings      = budgets.filter(b => b.is_warning).length;

  return (
    <div className="flex flex-col gap-5 animate-slide-up">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Budget Tracker</h2>
          <p className="text-slate-500 text-sm mt-0.5">Set and track monthly spending limits</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="fs-input w-28">
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="fs-input w-24">
            {[year-1, year, year+1].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <Button onClick={() => setModal('add')} size="md" className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Set Budget
          </Button>
        </div>
      </div>

      {/* Summary strip */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'Total Budgeted', value: formatCurrency(totalBudgeted), color:'#6366f1' },
            { label:'Total Spent',    value: formatCurrency(totalSpent),    color:'#f43f5e' },
            { label:'Remaining',      value: formatCurrency(Math.max(0, totalBudgeted - totalSpent)), color:'#10b981' },
            { label:'Alerts',         value: `${exceeded} exceeded, ${warnings} warning`, color:'#f59e0b' },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{s.label}</div>
                <div className="text-sm font-display font-extrabold" style={{ color: s.color }}>{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cards grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0,1,2,3,4,5].map(i => <BudgetCardSkeleton key={i} />)}
        </div>
      ) : budgets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-4xl">🎯</div>
            <p className="text-slate-400 font-semibold">No budgets for {MONTHS[month-1]} {year}</p>
            <p className="text-slate-600 text-sm text-center max-w-xs">
              Set budgets per category to track your spending and get alerts before you overspend.
            </p>
            <Button onClick={() => setModal('add')} className="mt-2">
              Set Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(b => (
            <BudgetCard key={b.id} budget={b} onEdit={setModal} onDelete={handleDelete} />
          ))}
          <button
            onClick={() => setModal('add')}
            className="glass rounded-2xl p-5 flex flex-col items-center justify-center gap-2
                       text-slate-600 hover:text-slate-400 transition-all border border-dashed"
            style={{ borderColor:'rgba(148,163,184,.1)', minHeight:200 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="text-sm font-semibold">Add Budget</span>
          </button>
        </div>
      )}

      {modal && (
        <BudgetModal
          budget={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            toast.success(modal === 'add' ? 'Budget set! 🎯' : 'Budget updated!');
          }}
        />
      )}
    </div>
  );
}
