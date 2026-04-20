/**
 * formatters.js — shared formatting utilities used across all pages
 */

/** Format number as Indian Rupee string  e.g. 12345 → ₹12,345 */
export const formatCurrency = (amount, showSign = false) => {
  const n = Math.round(amount || 0);
  const str = '₹' + Math.abs(n).toLocaleString('en-IN');
  if (!showSign) return str;
  return n >= 0 ? str : '-' + str;
};

/** Format a date string to readable Indian format  e.g. 2025-06-01 → 1 Jun 2025 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
    ...options,
  });
};

/** Format percentage  e.g. 0.78 → "78%" */
export const formatPercent = (value, decimals = 0) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/** Truncate a string  e.g. truncate("hello world", 8) → "hello w…" */
export const truncate = (str, max = 30) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};

/** Get greeting based on hour  */
export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

/** Get current month name */
export const getCurrentMonthLabel = () =>
  new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

/** Map health score number to label */
export const getHealthLabel = (score) => {
  if (score >= 70) return 'Healthy';
  if (score >= 40) return 'Moderate';
  return 'Poor';
};

/** Get color for health score */
export const getHealthColor = (score) => {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#f43f5e';
};

/** Get color for budget utilization */
export const getBudgetColor = (pct) => {
  if (pct >= 100) return '#f43f5e';
  if (pct >= 80)  return '#f59e0b';
  return '#10b981';
};

/** Category icons map */
export const CATEGORY_ICONS = {
  Food:           '🍕',
  Housing:        '🏠',
  Transport:      '🚗',
  Entertainment:  '🎬',
  Shopping:       '🛍️',
  Healthcare:     '💊',
  Education:      '📚',
  Utilities:      '💡',
  Travel:         '✈️',
  'Other Expense':'💸',
  Salary:         '💰',
  Freelance:      '💻',
  Investment:     '📈',
  Business:       '🏢',
  'Other Income': '🎁',
};

export const getCategoryIcon = (category) =>
  CATEGORY_ICONS[category] || '💳';
