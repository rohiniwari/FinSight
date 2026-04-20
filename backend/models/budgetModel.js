/**
 * budgetModel.js
 * Data-access layer for the budgets table.
 */
import { supabase } from '../config/supabase.js';

export const budgetModel = {
  /** Get all budgets for a user, optionally filtered by month/year */
  async findAll(userId, { month, year } = {}) {
    let q = supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('category');

    if (month) q = q.eq('month', parseInt(month));
    if (year)  q = q.eq('year',  parseInt(year));

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return data || [];
  },

  /** Upsert — creates or replaces a budget for the same category+month+year */
  async upsert(userId, { category, amount, month, year }) {
    const { data, error } = await supabase
      .from('budgets')
      .upsert(
        { user_id: userId, category, amount: parseFloat(amount),
          month: parseInt(month), year: parseInt(year) },
        { onConflict: 'user_id,category,month,year' }
      )
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  /** Update only the amount */
  async update(id, userId, amount) {
    const { data, error } = await supabase
      .from('budgets')
      .update({ amount: parseFloat(amount) })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Budget not found');
    return data;
  },

  /** Delete a budget */
  async remove(id, userId) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return true;
  },

  /** Get total spent per category for a given month (used by budget utilization) */
  async getSpentByCategory(userId, month, year) {
    const firstDay = `${year}-${String(month).padStart(2,'0')}-01`;
    const lastDay  = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transactions')
      .select('category, amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', firstDay)
      .lte('date', lastDay);

    if (error) throw new Error(error.message);

    // Aggregate by category
    const map = {};
    (data || []).forEach(t => {
      map[t.category] = (map[t.category] || 0) + parseFloat(t.amount);
    });
    return map;
  },
};
