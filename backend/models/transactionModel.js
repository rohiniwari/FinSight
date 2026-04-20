/**
 * transactionModel.js
 * Data-access layer for the transactions table.
 * Controllers call these methods — never raw Supabase queries.
 */
import { supabase } from '../config/supabase.js';

export const transactionModel = {
  /** Paginated list with filters */
  async findAll(userId, {
    page = 1, limit = 20,
    type, category,
    start_date, end_date,
    min_amount, max_amount,
    search,
    sort  = 'date',
    order = 'desc',
  } = {}) {
    const offset = (page - 1) * limit;

    let q = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (type)       q = q.eq('type', type);
    if (category)   q = q.eq('category', category);
    if (start_date) q = q.gte('date', start_date);
    if (end_date)   q = q.lte('date', end_date);
    if (min_amount) q = q.gte('amount', parseFloat(min_amount));
    if (max_amount) q = q.lte('amount', parseFloat(max_amount));
    if (search)     q = q.or(`notes.ilike.%${search}%,category.ilike.%${search}%`);

    q = q.order(sort, { ascending: order === 'asc' })
         .range(offset, offset + limit - 1);

    const { data, error, count } = await q;
    if (error) throw new Error(error.message);

    return {
      transactions: data || [],
      pagination: {
        total:       count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  },

  /** Single transaction by ID (ownership enforced) */
  async findById(id, userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    if (error || !data) return null;
    return data;
  },

  /** Create a new transaction */
  async create(userId, payload) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ user_id: userId, ...payload })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  /** Update an existing transaction */
  async update(id, userId, updates) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  /** Delete a transaction */
  async remove(id, userId) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return true;
  },

  /** Fetch all for a date range (used by export + analytics) */
  async findByDateRange(userId, startDate, endDate, limit = 5000) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return data || [];
  },
};
