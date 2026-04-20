/**
 * generateInsights – analyses transaction data and returns insight cards.
 * @param {Array} transactions – array of transaction objects
 * @returns {Array} insights
 */
export function generateInsights(transactions) {
  const insights = [];
  if (!transactions.length) return insights;

  const now      = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear  = now.getFullYear();
  const lastMonth = thisMonth === 1 ? 12       : thisMonth - 1;
  const lastYear  = thisMonth === 1 ? thisYear - 1 : thisYear;

  const inMonth = (t, m, y) => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === m && d.getFullYear() === y;
  };

  const sum = (arr, type) =>
    arr.filter(t => t.type === type).reduce((s, t) => s + parseFloat(t.amount), 0);

  const curTxns  = transactions.filter(t => inMonth(t, thisMonth, thisYear));
  const prevTxns = transactions.filter(t => inMonth(t, lastMonth, lastYear));

  const curExpense  = sum(curTxns,  'expense');
  const prevExpense = sum(prevTxns, 'expense');
  const curIncome   = sum(curTxns,  'income');

  // 1. Month-over-month expense change
  if (prevExpense > 0) {
    const change = ((curExpense - prevExpense) / prevExpense) * 100;
    if (Math.abs(change) >= 5) {
      insights.push({
        id:     'mom-expense',
        type:   change > 0 ? 'warning' : 'success',
        icon:   change > 0 ? '📈' : '📉',
        title:  change > 0 ? 'Spending Increased' : 'Spending Decreased',
        text:   `Your total spending ${change > 0 ? 'increased' : 'decreased'} by **${Math.abs(Math.round(change))}%** compared to last month.`,
        value:  `${change > 0 ? '+' : ''}${Math.round(change)}%`,
        tab:    'monthly',
      });
    }
  }

  // 2. Top spending category
  const catMap = {};
  curTxns.filter(t => t.type === 'expense').forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + parseFloat(t.amount);
  });
  const topCat = Object.entries(catMap).sort((a,b) => b[1]-a[1])[0];
  if (topCat) {
    insights.push({
      id:    'top-category',
      type:  'info',
      icon:  '🛒',
      title: 'Top Spending Category',
      text:  `**${topCat[0]}** is your highest expense this month at ₹${Math.round(topCat[1]).toLocaleString('en-IN')}.`,
      value: `₹${Math.round(topCat[1]).toLocaleString('en-IN')}`,
      tab:   'monthly',
    });
  }

  // 3. Savings rate
  if (curIncome > 0) {
    const rate = ((curIncome - curExpense) / curIncome) * 100;
    insights.push({
      id:    'savings-rate',
      type:  rate >= 20 ? 'success' : rate >= 0 ? 'warning' : 'danger',
      icon:  rate >= 20 ? '💰' : '⚠️',
      title: 'Savings Rate',
      text:  rate >= 20
        ? `Excellent! You saved **${Math.round(rate)}%** of your income this month.`
        : rate >= 0
          ? `You saved **${Math.round(rate)}%** of your income. Aim for 20%+.`
          : `You spent **₹${Math.round(curExpense - curIncome).toLocaleString('en-IN')}** more than you earned this month.`,
      value: `${Math.round(rate)}%`,
      tab:   'monthly',
    });
  }

  // 4. Category spike vs last month
  const prevCatMap = {};
  prevTxns.filter(t => t.type === 'expense').forEach(t => {
    prevCatMap[t.category] = (prevCatMap[t.category] || 0) + parseFloat(t.amount);
  });
  Object.entries(catMap).forEach(([cat, cur]) => {
    const prev = prevCatMap[cat] || 0;
    if (prev > 0) {
      const spike = ((cur - prev) / prev) * 100;
      if (spike >= 20) {
        insights.push({
          id:    `spike-${cat}`,
          type:  'warning',
          icon:  '⚡',
          title: `${cat} Spike`,
          text:  `Your **${cat}** spending rose by **${Math.round(spike)}%** compared to last month.`,
          value: `+${Math.round(spike)}%`,
          tab:   'weekly',
        });
      }
    }
  });

  // 5. High-frequency category (possible subscriptions)
  const freqMap = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    freqMap[t.category] = (freqMap[t.category] || 0) + 1;
  });
  const highFreq = Object.entries(freqMap).filter(([,c]) => c >= 5);
  if (highFreq.length) {
    insights.push({
      id:    'recurring-detected',
      type:  'info',
      icon:  '🔄',
      title: 'Recurring Transactions',
      text:  `Detected **${highFreq.length}** frequently occurring expense categories — possible recurring payments.`,
      value: `${highFreq.length} found`,
      tab:   'alerts',
    });
  }

  // 6. Income this month
  if (curIncome > 0) {
    insights.push({
      id:    'income-received',
      type:  'success',
      icon:  '💸',
      title: 'Income Received',
      text:  `You received **₹${Math.round(curIncome).toLocaleString('en-IN')}** in income this month.`,
      value: `+₹${Math.round(curIncome).toLocaleString('en-IN')}`,
      tab:   'weekly',
    });
  }

  return insights.slice(0, 12);
}
