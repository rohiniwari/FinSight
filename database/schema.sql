-- ═══════════════════════════════════════════════════
--  FinSight – Supabase Database Schema
--  Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
--  PROFILES  (extends auth.users)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ─────────────────────────────────────────
--  TRANSACTIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount      DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  category    TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date    ON public.transactions(date DESC);
CREATE INDEX idx_transactions_type    ON public.transactions(type);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own transactions"
  ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();


-- ─────────────────────────────────────────
--  BUDGETS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.budgets (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category    TEXT NOT NULL,
  amount      DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  month       INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year        INTEGER NOT NULL CHECK (year >= 2020),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category, month, year)
);

CREATE INDEX idx_budgets_user_id   ON public.budgets(user_id);
CREATE INDEX idx_budgets_month_year ON public.budgets(month, year);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own budgets"
  ON public.budgets FOR ALL USING (auth.uid() = user_id);


-- ─────────────────────────────────────────
--  CATEGORIES  (shared/static lookup)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id      SERIAL PRIMARY KEY,
  name    TEXT UNIQUE NOT NULL,
  icon    TEXT,
  color   TEXT,
  type    TEXT CHECK (type IN ('income', 'expense', 'both'))
);

INSERT INTO public.categories (name, icon, color, type) VALUES
  ('Food',           '🍕', '#22d3ee', 'expense'),
  ('Housing',        '🏠', '#6366f1', 'expense'),
  ('Transport',      '🚗', '#10b981', 'expense'),
  ('Entertainment',  '🎬', '#ec4899', 'expense'),
  ('Shopping',       '🛍️', '#f59e0b', 'expense'),
  ('Healthcare',     '💊', '#f43f5e', 'expense'),
  ('Education',      '📚', '#8b5cf6', 'expense'),
  ('Utilities',      '💡', '#14b8a6', 'expense'),
  ('Travel',         '✈️', '#0ea5e9', 'expense'),
  ('Other Expense',  '💸', '#94a3b8', 'expense'),
  ('Salary',         '💰', '#10b981', 'income'),
  ('Freelance',      '💻', '#6366f1', 'income'),
  ('Investment',     '📈', '#22d3ee', 'income'),
  ('Business',       '🏢', '#f59e0b', 'income'),
  ('Other Income',   '🎁', '#94a3b8', 'income')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories"
  ON public.categories FOR SELECT USING (true);
