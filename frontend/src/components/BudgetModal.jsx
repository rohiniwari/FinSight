import { useState }             from 'react';
import { budgetService }        from '../services/budgetService.js';
import { EXPENSE_CATEGORIES }   from '../utils/constants.js';
import { MONTHS }               from '../utils/constants.js';
import {
  Button, Input, Select,
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogClose,
}                                from './ui/index.js';

export default function BudgetModal({ budget, onClose, onSave }) {
  const isEdit = Boolean(budget?.id);
  const now    = new Date();

  const [form, setForm] = useState({
    category: budget?.category || EXPENSE_CATEGORIES[0],
    amount:   budget?.amount   || '',
    month:    budget?.month    || now.getMonth() + 1,
    year:     budget?.year     || now.getFullYear(),
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError('Please enter a valid budget amount.');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await budgetService.update(budget.id, { amount: form.amount });
      } else {
        await budgetService.create(form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Budget' : 'Set Budget'}</DialogTitle>
          <DialogClose onClose={onClose} />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category — only shown when creating */}
          {!isEdit && (
            <Select
              label="Category"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Monthly Budget (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
              <input type="number" step="1" min="1" required className="fs-input pl-7"
                     placeholder="5000" value={form.amount}
                     onChange={e => set('amount', e.target.value)} />
            </div>
          </div>

          {/* Month + Year — only when creating */}
          {!isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <Select label="Month" value={form.month}
                      onChange={e => set('month', parseInt(e.target.value))}>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </Select>
              <Select label="Year" value={form.year}
                      onChange={e => set('year', parseInt(e.target.value))}>
                {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
            </div>
          )}

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
              {isEdit ? 'Update' : 'Set Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
