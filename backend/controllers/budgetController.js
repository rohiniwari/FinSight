/**
 * budgetController.js
 * MVC: Controller delegates all DB work to budgetModel.
 */
import { budgetModel } from '../models/index.js';

/** GET /api/budgets */
export const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const budgets = await budgetModel.findAll(req.user.id, { month, year });

    // Attach utilization to each budget
    const spentMap = month && year
      ? await budgetModel.getSpentByCategory(req.user.id, parseInt(month), parseInt(year))
      : {};

    const enriched = budgets.map(b => {
      const spent       = spentMap[b.category] || 0;
      const utilization = b.amount > 0 ? Math.round((spent / parseFloat(b.amount)) * 100) : 0;
      return {
        ...b,
        spent:       Math.round(spent * 100) / 100,
        utilization,
        remaining:   Math.max(0, parseFloat(b.amount) - spent),
        is_exceeded: spent > parseFloat(b.amount),
        is_warning:  utilization >= 80 && utilization < 100,
      };
    });

    return res.status(200).json({ budgets: enriched });
  } catch (err) {
    console.error('getBudgets:', err.message);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

/** POST /api/budgets */
export const createBudget = async (req, res) => {
  try {
    const budget = await budgetModel.upsert(req.user.id, req.body);
    return res.status(201).json({ budget, message: 'Budget saved' });
  } catch (err) {
    console.error('createBudget:', err.message);
    res.status(500).json({ error: 'Failed to save budget' });
  }
};

/** PUT /api/budgets/:id */
export const updateBudget = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: 'amount is required' });
    const budget = await budgetModel.update(req.params.id, req.user.id, amount);
    return res.status(200).json({ budget, message: 'Budget updated' });
  } catch (err) {
    res.status(404).json({ error: err.message || 'Budget not found' });
  }
};

/** DELETE /api/budgets/:id */
export const deleteBudget = async (req, res) => {
  try {
    await budgetModel.remove(req.params.id, req.user.id);
    return res.status(200).json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};
