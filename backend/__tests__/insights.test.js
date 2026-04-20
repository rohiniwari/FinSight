import { generateInsights } from '../utils/insights.js';

const makeDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

describe('generateInsights', () => {
  it('returns empty array for empty transactions', () => {
    expect(generateInsights([])).toEqual([]);
  });

  it('generates income insight when income present', () => {
    const txns = [
      { type: 'income', amount: 50000, category: 'Salary', date: makeDate(1), notes: null },
    ];
    const insights = generateInsights(txns);
    expect(Array.isArray(insights)).toBe(true);
    const incomeInsight = insights.find(i => i.id === 'income-received');
    expect(incomeInsight).toBeDefined();
  });

  it('generates top category insight', () => {
    const txns = [
      { type: 'expense', amount: 3000, category: 'Food',      date: makeDate(2), notes: null },
      { type: 'expense', amount: 1000, category: 'Transport', date: makeDate(3), notes: null },
      { type: 'income',  amount: 50000, category: 'Salary',   date: makeDate(1), notes: null },
    ];
    const insights = generateInsights(txns);
    const topCat   = insights.find(i => i.id === 'top-category');
    expect(topCat).toBeDefined();
    expect(topCat.text).toContain('Food');
  });

  it('generates savings rate insight', () => {
    const txns = [
      { type: 'income',  amount: 50000, category: 'Salary', date: makeDate(1), notes: null },
      { type: 'expense', amount: 10000, category: 'Food',   date: makeDate(2), notes: null },
    ];
    const insights = generateInsights(txns);
    const saving   = insights.find(i => i.id === 'savings-rate');
    expect(saving).toBeDefined();
    expect(saving.type).toBe('success');
  });

  it('never returns more than 12 insights', () => {
    const txns = Array.from({ length: 50 }, (_, i) => ({
      type: i % 3 === 0 ? 'income' : 'expense',
      amount: 100 + i,
      category: ['Food','Housing','Transport','Entertainment','Shopping'][i % 5],
      date: makeDate(i % 28),
      notes: null,
    }));
    const insights = generateInsights(txns);
    expect(insights.length).toBeLessThanOrEqual(12);
  });
});
