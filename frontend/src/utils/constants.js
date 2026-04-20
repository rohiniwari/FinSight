/**
 * constants.js — app-wide constants
 */

export const EXPENSE_CATEGORIES = [
  'Food', 'Housing', 'Transport', 'Entertainment',
  'Shopping', 'Healthcare', 'Education', 'Utilities',
  'Travel', 'Other Expense',
];

export const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Business', 'Other Income',
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const TRANSACTION_TYPES = ['income', 'expense'];

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export const DONUT_COLORS = [
  '#6366f1','#22d3ee','#f59e0b','#ec4899',
  '#10b981','#f43f5e','#8b5cf6','#14b8a6',
];

export const HEALTH_SCORE_MAX = 100;

export const BUDGET_WARNING_THRESHOLD  = 80;   // % at which warning shows
export const BUDGET_EXCEEDED_THRESHOLD = 100;  // % at which exceeded shows
