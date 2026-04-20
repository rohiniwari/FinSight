import { useState, useCallback }                  from 'react';
import { useQuery, useQueryClient }               from '@tanstack/react-query';
import toast                                      from 'react-hot-toast';
import { transactionService }                     from '../services/transactionService.js';
import { exportService }                          from '../services/exportService.js';
import { useRealtime }                            from '../hooks/useRealtime.js';
import TransactionModal                           from '../components/TransactionModal.jsx';
import { TableSkeleton }                          from '../components/Skeleton.jsx';

const fmt = (n) => '₹' + Math.round(n||0).toLocaleString('en-IN');
const CATS = ['Food','Housing','Transport','Entertainment','Shopping','Healthcare','Education','Utilities','Travel','Other Expense','Salary','Freelance','Investment','Business','Other Income'];

function FilterBar({ filters, onChange, onReset }) {
  const set = (k, v) => onChange({ ...filters, [k]: v, page: 1 });
  return (
    <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-40">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search</label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="13" height="13"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="fs-input pl-8" placeholder="Search…" value={filters.search||''}
                 onChange={e => set('search', e.target.value)}/>
        </div>
      </div>
      <div className="min-w-28">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
        <select className="fs-input" value={filters.type||''} onChange={e => set('type', e.target.value)}>
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="min-w-36">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
        <select className="fs-input" value={filters.category||''} onChange={e => set('category', e.target.value)}>
          <option value="">All</option>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="min-w-36">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">From</label>
        <input type="date" className="fs-input" value={filters.start_date||''} onChange={e => set('start_date', e.target.value)}/>
      </div>
      <div className="min-w-36">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">To</label>
        <input type="date" className="fs-input" value={filters.end_date||''} onChange={e => set('end_date', e.target.value)}/>
      </div>
      <button onClick={onReset} className="btn-out px-4 py-2.5 rounded-xl text-sm">Reset</button>
    </div>
  );
}

export default function Transactions() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ page:1, limit:15, sort:'date', order:'desc' });
  const [modal,   setModal]   = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [exporting, setExporting] = useState('');

  const queryKey = ['transactions', filters];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => {
      const clean = Object.fromEntries(Object.entries(filters).filter(([,v]) => v !== ''));
      return transactionService.getAll(clean);
    },
    staleTime: 30_000,
    keepPreviousData: true,
  });

  const transactions = data?.transactions || [];
  const pagination   = data?.pagination   || {};

  const onRealtimeUpdate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  }, [queryClient]);
  useRealtime(onRealtimeUpdate, ['transactions']);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    setDeleting(id);
    try {
      await transactionService.remove(id);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      toast.success('Transaction deleted');
    } catch (_) {
      toast.error('Failed to delete');
    }
    setDeleting(null);
  };

  const handleExport = async (type) => {
    setExporting(type);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([,v]) => v !== '' && !['page','limit','sort','order'].includes(String(v))));
      if (type === 'csv') await exportService.downloadCSV(params);
      else                await exportService.downloadPDF(params);
      toast.success(`${type.toUpperCase()} downloaded! 📥`);
    } catch (_) {
      toast.error(`Failed to export ${type.toUpperCase()}`);
    }
    setExporting('');
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['summary'] });
    queryClient.invalidateQueries({ queryKey: ['recent'] });
  };

  return (
    <div className="flex flex-col gap-5 animate-slide-up">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-white">All Transactions</h2>
          <p className="text-slate-500 text-sm mt-0.5">{pagination.total ?? '…'} total transactions</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Export buttons */}
          <button onClick={() => handleExport('csv')} disabled={!!exporting}
                  className="btn-out px-3 py-2 rounded-xl text-xs flex items-center gap-1.5">
            {exporting==='csv' ? '…' : <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              CSV
            </>}
          </button>
          <button onClick={() => handleExport('pdf')} disabled={!!exporting}
                  className="btn-out px-3 py-2 rounded-xl text-xs flex items-center gap-1.5">
            {exporting==='pdf' ? '…' : <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              PDF
            </>}
          </button>
          <button onClick={() => setModal('add')} className="btn-pri px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Transaction
          </button>
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} onReset={() => setFilters({ page:1, limit:15, sort:'date', order:'desc' })}/>

      {/* Table */}
      {isLoading ? <TableSkeleton rows={8}/> : (
        <div className="glass rounded-2xl overflow-hidden">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <div className="text-3xl">🔍</div>
              <p className="text-slate-500 text-sm">No transactions found.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:grid px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                   style={{ gridTemplateColumns:'2fr 1.2fr 1fr 1.4fr 1fr auto', borderBottom:'1px solid rgba(148,163,184,.06)' }}>
                <span>Description</span><span>Category</span><span>Type</span>
                <span>Date</span><span>Amount</span><span>Actions</span>
              </div>
              <div className="flex flex-col">
                {transactions.map(t => (
                  <div key={t.id}
                       className="flex flex-col md:grid px-5 py-3.5 hover:bg-white/[.02] transition-colors"
                       style={{ gridTemplateColumns:'2fr 1.2fr 1fr 1.4fr 1fr auto', gap:'1rem', borderBottom:'1px solid rgba(148,163,184,.04)' }}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                           style={{ background: t.type==='income'?'rgba(16,185,129,.1)':'rgba(244,63,94,.1)' }}>
                        {t.type==='income'?'💰':'💸'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{t.notes || t.category}</div>
                        <div className="text-xs text-slate-600 md:hidden">{t.category}</div>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background:'rgba(99,102,241,.1)', color:'#a5b4fc' }}>{t.category}</span>
                    </div>
                    <div className="hidden md:flex items-center">
                      <span className="text-xs font-bold capitalize px-2 py-0.5 rounded-full"
                            style={{ background: t.type==='income'?'rgba(16,185,129,.1)':'rgba(244,63,94,.1)',
                                     color:      t.type==='income'?'#10b981':'#f43f5e' }}>{t.type}</span>
                    </div>
                    <div className="hidden md:flex items-center text-sm text-slate-500">
                      {new Date(t.date).toLocaleDateString('en-IN',{ day:'numeric',month:'short',year:'numeric' })}
                    </div>
                    <div className="flex md:items-center justify-between">
                      <span className="text-sm font-extrabold"
                            style={{ color: t.type==='income'?'#10b981':'#f43f5e' }}>
                        {t.type==='income'?'+':'-'}{fmt(t.amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(t)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-indigo-400 transition-colors"
                              style={{ background:'rgba(255,255,255,.04)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(t.id)} disabled={deleting===t.id}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 transition-colors"
                              style={{ background:'rgba(255,255,255,.04)' }}>
                        {deleting===t.id ? <span className="text-[9px] animate-pulse">…</span>
                          : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            </svg>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setFilters(f=>({...f,page:Math.max(1,f.page-1)}))}
                  disabled={pagination.page<=1} className="btn-out px-4 py-2 rounded-xl text-sm disabled:opacity-30">← Prev</button>
          <span className="text-sm text-slate-500 px-2">Page {pagination.page} of {pagination.total_pages}</span>
          <button onClick={() => setFilters(f=>({...f,page:Math.min(pagination.total_pages,f.page+1)}))}
                  disabled={pagination.page>=pagination.total_pages} className="btn-out px-4 py-2 rounded-xl text-sm disabled:opacity-30">Next →</button>
        </div>
      )}

      {modal && (
        <TransactionModal
          transaction={modal==='add'?null:modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); invalidateAll(); toast.success(modal==='add'?'Transaction added! 🎉':'Transaction updated!'); }}
        />
      )}
    </div>
  );
}
