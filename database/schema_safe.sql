-- ═══════════════════════════════════════════════════
--  FinSight – Supabase Schema (Safe Version)
--  Paste this ENTIRE file into SQL Editor → Run
-- ═══════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Drop existing tables if re-running ─────────────
DROP TABLE IF EXISTS public.budgets      CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.categories   CASCADE;
DROP TABLE IF EXISTS public.profiles     CASCADE;

-- ─── Drop existing functions/triggers ───────────────
DROP FUNCTION IF EXISTS public.handle_new_user()  CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at()   CASCADE;


-- ═══════════════════════════════════════════════════
--  PROFILES
-- ═══════════════════════════════════════════════════
CREATE TABLE public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ═══════════════════════════════════════════════════
--  TRANSACTIONS
-- ═══════════════════════════════════════════════════
CREATE TABLE public.transactions (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount      NUMERIC(12, 2) NOT NULL,
  category    TEXT NOT NULL,
  type        TEXT NOT NULL,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_txn_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_txn_date    ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_txn_type    ON public.transactions(type);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users CRUD own transactions"
  ON public.transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();


-- ═══════════════════════════════════════════════════
--  BUDGETS
-- ═══════════════════════════════════════════════════
CREATE TABLE public.budgets (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category    TEXT NOT NULL,
  amount      NUMERIC(12, 2) NOT NULL,
  month       INTEGER NOT NULL,
  year        INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category, month, year)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id    ON public.budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_month_year ON public.budgets(month, year);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users CRUD own budgets"
  ON public.budgets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════
--  CATEGORIES  (read-only lookup table)
-- ═══════════════════════════════════════════════════
CREATE TABLE public.categories (
  id    SERIAL PRIMARY KEY,
  name  TEXT UNIQUE NOT NULL,
  icon  TEXT,
  color TEXT,
  type  TEXT
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON public.categories FOR SELECT
  USING (true);

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


-- ═══════════════════════════════════════════════════
--  VERIFY  (run this to check everything was created)
-- ═══════════════════════════════════════════════════
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
