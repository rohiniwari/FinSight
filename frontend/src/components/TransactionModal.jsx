import { useState, useEffect }    from 'react';
import { transactionService }     from '../services/transactionService.js';
import { EXPENSE_CATEGORIES,
         INCOME_CATEGORIES }      from '../utils/constants.js';
import {
  Button, Input, Select, Textarea,
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogClose,
}                                  from './ui/index.js';

export default function TransactionModal({ transaction, onClose, onSave }) {
  const isEdit = Boolean(transaction?.id);
  const today  = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    amount:   transaction?.amount   || '',
    category: transaction?.category || 'Food',
    type:     transaction?.type     || 'expense',
    date:     transaction?.date     || today,
    notes:    transaction?.notes    || '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Reset category when type changes
  useEffect(() => {
    const cats = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!cats.includes(form.category)) set('category', cats[0]);
  }, [form.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await transactionService.update(transaction.id, form);
      } else {
        await transactionService.create(form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          <DialogClose onClose={onClose} />
        </DialogHeader>

        {/* Type toggle */}
        <div className="flex p-1 rounded-xl mb-5 gap-1" style={{ background:'rgba(255,255,255,.04)' }}>
          {['expense','income'].map(t => (
            <button key={t} type="button" onClick={() => set('type', t)}
                    className="flex-1 py-2 rounded-lg text-sm font-display font-bold capitalize transition-all"
                    style={form.type === t ? {
                      background: t === 'expense'
                        ? 'linear-gradient(135deg,#f43f5e,#f59e0b)'
                        : 'linear-gradient(135deg,#10b981,#22d3ee)',
                      color: 'white',
                    } : { color:'#475569' }}>
              {t === 'expense' ? '💸 Expense' : '💰 Income'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
              <input type="number" step="0.01" min="0" required className="fs-input pl-7"
                     placeholder="0.00" value={form.amount}
                     onChange={e => set('amount', e.target.value)} />
            </div>
          </div>

          {/* Category */}
          <Select
            label="Category"
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {currentCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>

          {/* Date */}
          <Input
            label="Date"
            type="date"
            required
            value={form.date}
            onChange={e => set('date', e.target.value)}
          />

          {/* Notes */}
          <Textarea
            label="Notes (optional)"
            rows={2}
            placeholder="Add a note…"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />

          {error && (
            <p className="text-sm text-rose-400 font-semibold rounded-xl p-3"
               style={{ background:'rgba(244,63,94,.08)', border:'1px solid rgba(244,63,94,.2)' }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-1">
            <Button variant="outline" className="flex-1 py-2.5" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1 py-2.5">
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
