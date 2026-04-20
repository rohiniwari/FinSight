import { supabase }       from '../config/supabase.js';
import { generateInsights } from '../utils/insights.js';

/** GET /api/analytics/summary?month=6&year=2025 */
export const getSummary = async (req, res) => {
  try {
    const now   = new Date();
    const month = parseInt(req.query.month || now.getMonth() + 1);
    const year  = parseInt(req.query.year  || now.getFullYear());

    const firstDay = `${year}-${String(month).padStart(2,'0')}-01`;
    const lastDay  = new Date(year, month, 0).toISOString().split('T')[0];

    const { data: txns, error } = await supabase
      .from('transactions')
      .select('amount, type, category, date')
      .eq('user_id', req.user.id)
      .gte('date', firstDay)
      .lte('date', lastDay);

    if (error) return res.status(400).json({ error: error.message });

    // All-time totals
    const { data: allTxns } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', req.user.id);

    const allIncome  = (allTxns || []).filter(t => t.type === 'income')
      .reduce((s, t) => s + parseFloat(t.amount), 0);
    const allExpense = (allTxns || []).filter(t => t.type === 'expense')
      .reduce((s, t) => s + parseFloat(t.amount), 0);

    const income  = txns.filter(t => t.type === 'income') .reduce((s, t) => s + parseFloat(t.amount), 0);
    const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0);

    // Category breakdown
    const categoryMap = {};
    txns.filter(t => t.type === 'expense').forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + parseFloat(t.amount);
    });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([cat, amt]) => ({
        category:   cat,
        amount:     Math.round(amt * 100) / 100,
        percentage: expense > 0 ? Math.round((amt / expense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return res.status(200).json({
      summary: {
        month, year,
        income:   Math.round(income  * 100) / 100,
        expense:  Math.round(expense * 100) / 100,
        savings:  Math.round((income - expense) * 100) / 100,
        savings_rate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
        // All-time
        total_income:  Math.round(allIncome  * 100) / 100,
        total_expense: Math.round(allExpense * 100) / 100,
        balance:       Math.round((allIncome - allExpense) * 100) / 100,
      },
      category_breakdown: categoryBreakdown,
    });
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};

/** GET /api/analytics/monthly?months=6 */
export const getMonthlyTrend = async (req, res) => {
  try {
    const monthsBack = parseInt(req.query.months || 6);
    const results    = [];

    for (let i = monthsBack - 1; i >= 0; i--) {
      const d        = new Date();
      d.setMonth(d.getMonth() - i);
      const month    = d.getMonth() + 1;
      const year     = d.getFullYear();
      const firstDay = `${year}-${String(month).padStart(2,'0')}-01`;
      const lastDay  = new Date(year, month, 0).toISOString().split('T')[0];

      const { data } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', req.user.id)
        .gte('date', firstDay)
        .lte('date', lastDay);

      const income  = (data || []).filter(t => t.type === 'income') .reduce((s,t) => s + parseFloat(t.amount), 0);
      const expense = (data || []).filter(t => t.type === 'expense').reduce((s,t) => s + parseFloat(t.amount), 0);

      results.push({
        month, year,
        label:   d.toLocaleDateString('en-IN', { month: 'short' }),
        income:  Math.round(income  * 100) / 100,
        expense: Math.round(expense * 100) / 100,
        savings: Math.round((income - expense) * 100) / 100,
      });
    }

    return res.status(200).json({ monthly_trend: results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly trend' });
  }
};

/** GET /api/analytics/health-score */
export const getHealthScore = async (req, res) => {
  try {
    const now      = new Date();
    const month    = now.getMonth() + 1;
    const year     = now.getFullYear();
    const firstDay = `${year}-${String(month).padStart(2,'0')}-01`;
    const lastDay  = now.toISOString().split('T')[0];

    const { data: txns } = await supabase
      .from('transactions')
      .select('amount, type, category, date')
      .eq('user_id', req.user.id)
      .gte('date', firstDay)
      .lte('date', lastDay);

    const { data: budgets } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('month', month)
      .eq('year', year);

    const income  = (txns||[]).filter(t=>t.type==='income') .reduce((s,t)=>s+parseFloat(t.amount),0);
    const expense = (txns||[]).filter(t=>t.type==='expense').reduce((s,t)=>s+parseFloat(t.amount),0);

    // 1. Saving ratio (max 25 pts)  – target ≥30%
    const savingRate   = income > 0 ? (income - expense) / income : 0;
    const savingScore  = Math.round(Math.min(savingRate / 0.3, 1) * 25);

    // 2. Budget adherence (max 25 pts)
    let budgetScore = 15; // default if no budgets set
    if ((budgets||[]).length > 0) {
      const catMap = {};
      (txns||[]).filter(t=>t.type==='expense').forEach(t=>{
        catMap[t.category] = (catMap[t.category]||0) + parseFloat(t.amount);
      });
      const adherent = (budgets||[]).filter(b => (catMap[b.category]||0) <= parseFloat(b.amount)).length;
      budgetScore = Math.round((adherent / budgets.length) * 25);
    }

    // 3. Expense control (max 25 pts) – expense ≤ income
    const expenseControlRate  = income > 0 ? Math.min(income / (expense || 1), 1) : 0;
    const expenseControlScore = Math.round(expenseControlRate * 25);

    // 4. Spending consistency (max 25 pts) – based on transaction frequency
    const txnCount            = (txns||[]).length;
    const consistencyScore    = Math.min(Math.round(txnCount / 30 * 25), 25);

    const total = savingScore + budgetScore + expenseControlScore + consistencyScore;

    return res.status(200).json({
      health_score: {
        total: Math.min(total, 100),
        breakdown: {
          saving_ratio:          { score: savingScore,          max: 25, value: Math.round(savingRate * 100) },
          budget_adherence:      { score: budgetScore,          max: 25 },
          expense_control:       { score: expenseControlScore,  max: 25, value: Math.round(expenseControlRate * 100) },
          spending_consistency:  { score: consistencyScore,     max: 25, value: txnCount },
        },
        label: total >= 70 ? 'Healthy' : total >= 40 ? 'Moderate' : 'Poor',
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate health score' });
  }
};

/** GET /api/analytics/insights */
export const getInsights = async (req, res) => {
  try {
    const { data: txns } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('date', { ascending: false })
      .limit(200);

    const insights = generateInsights(txns || []);

    return res.status(200).json({ insights });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};
