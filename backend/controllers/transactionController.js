/**
 * transactionController.js
 * Handles HTTP layer only — delegates DB work to transactionModel.
 * MVC: Controller → Model → Supabase
 */
import { transactionModel } from '../models/index.js';
import { supabase }          from '../config/supabase.js';

/** GET /api/transactions */
export const getTransactions = async (req, res) => {
  try {
    const result = await transactionModel.findAll(req.user.id, {
      ...req.query,
      page:  parseInt(req.query.page  || 1),
      limit: parseInt(req.query.limit || 20),
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error('getTransactions:', err.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

/** GET /api/transactions/categories */
export const getCategories = async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories').select('*').order('name');
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ categories: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

/** GET /api/transactions/:id */
export const getTransaction = async (req, res) => {
  try {
    const txn = await transactionModel.findById(req.params.id, req.user.id);
    if (!txn) return res.status(404).json({ error: 'Transaction not found' });
    return res.status(200).json({ transaction: txn });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

/** POST /api/transactions */
export const createTransaction = async (req, res) => {
  try {
    const { amount, category, type, date, notes } = req.body;
    const txn = await transactionModel.create(req.user.id, {
      amount: parseFloat(amount),
      category, type, date,
      notes: notes || null,
    });
    return res.status(201).json({ transaction: txn, message: 'Transaction created' });
  } catch (err) {
    console.error('createTransaction:', err.message);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

/** PUT /api/transactions/:id */
export const updateTransaction = async (req, res) => {
  try {
    const existing = await transactionModel.findById(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ error: 'Transaction not found' });

    const updates = {};
    const { amount, category, type, date, notes } = req.body;
    if (amount   !== undefined) updates.amount   = parseFloat(amount);
    if (category !== undefined) updates.category = category;
    if (type     !== undefined) updates.type     = type;
    if (date     !== undefined) updates.date     = date;
    if (notes    !== undefined) updates.notes    = notes;

    const txn = await transactionModel.update(req.params.id, req.user.id, updates);
    return res.status(200).json({ transaction: txn, message: 'Transaction updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

/** DELETE /api/transactions/:id */
export const deleteTransaction = async (req, res) => {
  try {
    const existing = await transactionModel.findById(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ error: 'Transaction not found' });

    await transactionModel.remove(req.params.id, req.user.id);
    return res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
