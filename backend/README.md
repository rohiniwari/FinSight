# FinSight — Backend API

> Node.js + Express REST API for the FinSight financial analytics dashboard.
> Handles authentication, transaction management, budget tracking, analytics, and report export.

---

## 📋 Project Overview

FinSight backend is a RESTful API built with **Node.js + Express** following **MVC architecture**.
It connects to **Supabase (PostgreSQL)** for data storage and uses Supabase Auth for JWT-based authentication.

All user data is protected by both Express middleware (JWT verification) and Supabase Row Level Security (RLS) policies — meaning even if the middleware were bypassed, the database itself would reject unauthorised queries.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js 20 | Runtime |
| Express.js 4 | HTTP framework |
| Supabase (PostgreSQL) | Database + Auth |
| @supabase/supabase-js | Supabase SDK |
| Zod | Input validation & schema enforcement |
| Helmet.js | HTTP security headers |
| express-rate-limit | Brute-force protection |
| json2csv | CSV export |
| pdfkit | PDF report generation |
| Jest + Supertest | Unit & integration testing |

---

## 📂 Folder Structure

```
backend/
│
├── config/
│   └── supabase.js          # Supabase client (service-role key)
│
├── controllers/             # HTTP request handlers (MVC — Controller)
│   ├── authController.js    # Register, login, OTP, OAuth, refresh
│   ├── transactionController.js
│   ├── budgetController.js
│   ├── analyticsController.js
│   └── exportController.js  # CSV + PDF generation
│
├── models/                  # Data-access layer (MVC — Model)
│   ├── userModel.js         # profiles table queries
│   ├── transactionModel.js  # transactions table queries
│   ├── budgetModel.js       # budgets table queries
│   └── index.js             # barrel export
│
├── routes/                  # Express route definitions
│   ├── auth.js
│   ├── transactions.js
│   ├── budgets.js
│   ├── analytics.js
│   └── export.js
│
├── middleware/
│   ├── auth.js              # JWT verification via Supabase
│   └── validate.js          # Zod schema validation middleware
│
├── utils/
│   └── insights.js          # Financial insights engine
│
├── __tests__/               # Jest test suites
│   ├── auth.test.js
│   ├── transactions.test.js
│   └── insights.test.js
│
├── .env.example

├── package.json
└── server.js                # App entry point
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js >= 18
- A Supabase project with schema applied (see Database section)

### Steps

```bash
# 1. Navigate to backend
cd finsight/backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

Edit `.env` with your actual values:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
# 4. Start development server
npm run dev
# → http://localhost:5000

# 5. Run tests
npm test

# 6. Production start
npm start
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require:
```
Authorization: Bearer <access_token>
```

---

### 🔐 Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login with email + password |
| POST | `/auth/otp/send` | ❌ | Send OTP to email |
| POST | `/auth/otp/verify` | ❌ | Verify OTP and get session |
| GET  | `/auth/google` | ❌ | Get Google OAuth redirect URL |
| POST | `/auth/refresh` | ❌ | Refresh expired access token |
| POST | `/auth/logout` | ✅ | Logout current session |
| GET  | `/auth/me` | ✅ | Get current user profile |
| PUT  | `/auth/profile` | ✅ | Update profile name |

#### POST `/auth/register`
```json
// Request
{ "full_name": "Alex Kumar", "email": "alex@example.com", "password": "secret123" }

// Response 201
{
  "message": "Registration successful",
  "user": { "id": "uuid", "email": "alex@example.com", "full_name": "Alex Kumar" },
  "session": { "access_token": "...", "refresh_token": "...", "expires_at": 1234567890 }
}
```

#### POST `/auth/login`
```json
// Request
{ "email": "alex@example.com", "password": "secret123" }

// Response 200
{
  "message": "Login successful",
  "user": { "id": "uuid", "email": "alex@example.com", "full_name": "Alex Kumar" },
  "session": { "access_token": "...", "refresh_token": "..." }
}
```

#### POST `/auth/otp/send`
```json
// Request
{ "email": "alex@example.com" }

// Response 200
{ "message": "OTP sent to your email" }
```

#### POST `/auth/otp/verify`
```json
// Request
{ "email": "alex@example.com", "token": "123456" }

// Response 200
{ "message": "OTP verified", "user": {...}, "session": {...} }
```

---

### 💸 Transaction Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | List transactions (filter + paginate) |
| POST | `/transactions` | Create transaction |
| GET | `/transactions/:id` | Get single transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |
| GET | `/transactions/categories` | Get all categories |

#### GET `/transactions` — Query Parameters

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page |
| `type` | string | `expense` | Filter by income/expense |
| `category` | string | `Food` | Filter by category |
| `start_date` | date | `2025-01-01` | From date (YYYY-MM-DD) |
| `end_date` | date | `2025-01-31` | To date (YYYY-MM-DD) |
| `min_amount` | number | `100` | Minimum amount |
| `max_amount` | number | `5000` | Maximum amount |
| `search` | string | `Swiggy` | Search notes/category |
| `sort` | string | `date` | Sort field |
| `order` | string | `desc` | asc or desc |

```json
// Response 200
{
  "transactions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "amount": "284.00",
      "category": "Food",
      "type": "expense",
      "date": "2025-06-15",
      "notes": "Swiggy order",
      "created_at": "2025-06-15T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 142,
    "page": 1,
    "limit": 20,
    "total_pages": 8
  }
}
```

#### POST `/transactions`
```json
// Request
{
  "amount": 42000,
  "category": "Salary",
  "type": "income",
  "date": "2025-06-01",
  "notes": "June salary"
}

// Response 201
{ "transaction": { "id": "uuid", ... }, "message": "Transaction created" }
```

---

### 🎯 Budget Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/budgets?month=6&year=2025` | List budgets with live utilization |
| POST | `/budgets` | Create/upsert a budget |
| PUT | `/budgets/:id` | Update budget amount |
| DELETE | `/budgets/:id` | Delete a budget |

#### GET `/budgets` Response
```json
{
  "budgets": [
    {
      "id": "uuid",
      "category": "Food",
      "amount": "5000.00",
      "month": 6,
      "year": 2025,
      "spent": 3400.00,
      "utilization": 68,
      "remaining": 1600.00,
      "is_exceeded": false,
      "is_warning": false
    }
  ]
}
```

---

### 📊 Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/summary?month=6&year=2025` | Monthly + all-time totals |
| GET | `/analytics/monthly?months=6` | Month-by-month trend data |
| GET | `/analytics/health-score` | Financial health score (0–100) |
| GET | `/analytics/insights` | Auto-generated spending insights |

#### GET `/analytics/summary` Response
```json
{
  "summary": {
    "month": 6, "year": 2025,
    "income": 42000,
    "expense": 31420,
    "savings": 10580,
    "savings_rate": 25,
    "total_income": 185000,
    "total_expense": 124000,
    "balance": 61000
  },
  "category_breakdown": [
    { "category": "Housing", "amount": 15000, "percentage": 48 },
    { "category": "Food",    "amount": 8400,  "percentage": 27 }
  ]
}
```

#### GET `/analytics/health-score` Response
```json
{
  "health_score": {
    "total": 78,
    "label": "Healthy",
    "breakdown": {
      "saving_ratio":         { "score": 23, "max": 25, "value": 25 },
      "budget_adherence":     { "score": 20, "max": 25 },
      "expense_control":      { "score": 22, "max": 25, "value": 95 },
      "spending_consistency": { "score": 13, "max": 25, "value": 16 }
    }
  }
}
```

---

### 📥 Export Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/export/csv` | Download transactions as CSV |
| GET | `/export/pdf` | Download formatted PDF report |

Both accept the same filter params as `/transactions` (type, category, start_date, end_date).

---

### 🔴 Error Responses

All errors follow this format:

```json
{ "error": "Human-readable error message" }
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error / bad request |
| 401 | Missing or expired token |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## 🗄️ Database Schema

### Tables

#### `profiles`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK, FK → auth.users) | User ID from Supabase Auth |
| `full_name` | TEXT | Display name |
| `avatar_url` | TEXT | Profile picture URL |
| `created_at` | TIMESTAMPTZ | Account creation timestamp |

#### `transactions`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated |
| `user_id` | UUID (FK → auth.users) | Owner |
| `amount` | NUMERIC(12,2) | Transaction value |
| `category` | TEXT | e.g. Food, Housing, Salary |
| `type` | TEXT | `income` or `expense` |
| `date` | DATE | Transaction date |
| `notes` | TEXT | Optional description |
| `created_at` | TIMESTAMPTZ | Row creation time |
| `updated_at` | TIMESTAMPTZ | Auto-updated on change |

#### `budgets`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated |
| `user_id` | UUID (FK → auth.users) | Owner |
| `category` | TEXT | Budget category |
| `amount` | NUMERIC(12,2) | Monthly budget limit |
| `month` | INTEGER | 1–12 |
| `year` | INTEGER | e.g. 2025 |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

Unique constraint: `(user_id, category, month, year)`

#### `categories`
| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL (PK) | Auto-increment |
| `name` | TEXT (UNIQUE) | Category name |
| `icon` | TEXT | Emoji icon |
| `color` | TEXT | Hex color |
| `type` | TEXT | `income`, `expense`, or `both` |

### Relationships
```
auth.users
  ├── profiles      (1:1  — one profile per user)
  ├── transactions  (1:N  — user has many transactions)
  └── budgets       (1:N  — user has many budgets)
```

### Row Level Security
Every table has RLS enabled. Users can only read/write their own rows:
```sql
-- Example policy on transactions
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

---

## 🔒 Security

- **Helmet.js** — sets 11 security-related HTTP headers
- **Zod validation** — all request bodies validated before hitting controllers
- **Rate limiting** — 300 req/15min globally; 20 req/15min on auth routes
- **Service-role key** — only used server-side, never exposed to browser
- **RLS** — database-level access control as a second security layer
- **Token refresh** — expired JWTs are auto-refreshed via interceptor

---

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

Test coverage:
- `auth.test.js` — register, login, validation, health check
- `transactions.test.js` — auth guard, Zod validation, CRUD
- `insights.test.js` — insights engine unit tests

---

## 🚀 Deployment

**Railway / Render:**
```bash
# Set env vars in dashboard, then:
git push
```



---

## 🌐 Deployment Link

Backend: `https://finsight-api.railway.app` *(replace with your URL)*

