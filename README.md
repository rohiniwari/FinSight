# FinSight — Financial Analytics Dashboard

> Full-stack personal finance management platform.
> React + Tailwind + ShadCN UI frontend · Node.js + Express backend · Supabase database.

---

## Repositories

| Part | Path | README |
|------|------|--------|
| Frontend | `frontend/` | [frontend/README.md](./frontend/README.md) |
| Backend  | `backend/`  | [backend/README.md](./backend/README.md) |

---

## Quick Start

```bash
# 1. Database — paste database/schema_safe.sql into Supabase SQL Editor

# 2. Backend
cd backend && npm install && cp .env.example .env
# Fill .env with your Supabase keys, then:
npm run dev

# 3. Frontend
cd frontend && npm install && cp .env.example .env
# Fill .env with your keys, then:
npm run dev
```

Frontend → http://localhost:5173
Backend  → http://localhost:5000

---

## Architecture

```
Browser (React + ShadCN UI)
       │
       │  Axios (auto JWT refresh)
       ▼
Express API (Node.js)
       │
       ├── Zod validation
       ├── JWT auth middleware
       ├── MVC: Controller → Model
       │
       ▼
Supabase (PostgreSQL + Auth + Realtime)
       │
       └── RLS policies (per-user data isolation)
```

---

## Tech Stack

**Frontend:** React 18, React Router v6, Tailwind CSS, ShadCN UI, Axios, React Query, Supabase JS

**Backend:** Node.js, Express, Zod, Helmet, express-rate-limit, json2csv, pdfkit

**Database:** Supabase (PostgreSQL), Row Level Security, Realtime subscriptions



---

## Full Documentation

- 📖 [Frontend README](./frontend/README.md) — setup, folder structure, component docs
- 📖 [Backend README](./backend/README.md) — API docs, database schema, security
