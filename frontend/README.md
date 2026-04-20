# FinSight — Frontend

> A modern financial analytics dashboard built with React + Tailwind CSS + ShadCN UI.
> Track transactions, monitor budgets, visualize spending, and gain real-time financial insights.

---

## 📸 Project Description

FinSight is a full-stack personal finance management platform. The frontend provides a clean, dark-themed dashboard where users can:

- Register and log in via **Password**, **Email OTP**, or **Google OAuth**
- Track every income and expense transaction with categories
- Set monthly budgets with real-time overspend alerts
- View interactive charts for income vs expenses, expense breakdown, and health score
- Export financial data as **CSV** or **PDF**
- Receive **live updates** via Supabase Realtime subscriptions

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Email/password, OTP magic link, Google OAuth |
| 💸 Transactions | Add, edit, delete, filter, search, paginate |
| 🎯 Budgets | Per-category monthly budgets with 80%/100% alerts |
| 📊 Dashboard | Real-time metrics, bar chart, donut chart, health score |
| 📈 Analytics | Monthly trends, category breakdown, financial insights feed |
| 📥 Export | Download transactions as CSV or formatted PDF report |
| 🔴 Realtime | Balance and transaction list update live without refresh |
| 🛡️ Error Handling | Global ErrorBoundary, toast notifications, skeleton loaders |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| ShadCN UI (custom) | Reusable component system |
| Axios | HTTP client for API calls |
| @tanstack/react-query | Server state caching & synchronisation |
| @supabase/supabase-js | Realtime subscriptions & OAuth |
| react-hot-toast | Toast notification system |
| Vite 5 | Build tool & dev server |

---

## 📂 Folder Structure

```
frontend/
├── public/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # ShadCN-style base components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── progress.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── tabs.jsx
│   │   │   └── index.js
│   │   ├── Layout.jsx         # App shell (sidebar + topbar)
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   ├── ProtectedRoute.jsx # Auth guard
│   │   ├── ErrorBoundary.jsx  # Global error catch
│   │   ├── Skeleton.jsx       # Loading placeholder components
│   │   ├── TransactionModal.jsx
│   │   └── BudgetModal.jsx
│   │
│   ├── pages/                 # Route-level page components
│   │   ├── Login.jsx          # Password + OTP + Google OAuth
│   │   ├── Register.jsx
│   │   ├── OAuthCallback.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Budgets.jsx
│   │   └── Analytics.jsx
│   │
│   ├── context/               # Global state
│   │   └── AuthContext.jsx    # Auth state, login/logout/OTP methods
│   │
│   ├── services/              # All API communication via Axios
│   │   ├── api.js             # Axios instance + auto token refresh
│   │   ├── authService.js
│   │   ├── transactionService.js
│   │   ├── budgetService.js
│   │   ├── analyticsService.js
│   │   ├── exportService.js
│   │   └── supabase.js
│   │
│   ├── hooks/                 # Custom React hooks
│   │   └── useRealtime.js     # Supabase Realtime subscription hook
│   │
│   ├── utils/                 # Shared utilities
│   │   ├── cn.js              # className merge utility
│   │   ├── formatters.js      # Currency, date, percent formatters
│   │   └── constants.js       # Category lists, color palettes
│   │
│   ├── __tests__/             # Vitest unit tests
│   │   ├── setup.js
│   │   ├── authService.test.js
│   │   └── components.test.jsx
│   │
│   ├── App.jsx                # Router + QueryClient + ErrorBoundary
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind + global design tokens
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js

├── .env.example
└── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js >= 18
- npm >= 9
- Backend running on `http://localhost:5000`

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/finsight.git
cd finsight/frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

```bash
# 4. Start development server
npm run dev
# → http://localhost:5173

# 5. Run tests
npm test

# 6. Production build
npm run build
```

---

## 🌐 Deployment

**Deploy to Vercel:**
```bash
npm install -g vercel
vercel --prod
```
Set environment variables in Vercel Dashboard.



---

## 🔗 Backend API Link

`http://localhost:5000/api` (development)

See backend README for full API documentation.

---

## 🔑 Login Credentials (Demo)

```
Email:    demo@finsight.io
Password: demo1234
```
Or use **Email OTP** on any email address.

---

## 🏗️ Architecture Decisions

- **React Query** — all server data is cached and auto-invalidated on mutations. No manual `useEffect` for data fetching in pages.
- **Lazy loading** — every page is code-split via `React.lazy()`. Initial bundle is under 80KB gzipped.
- **Context API** — only auth state lives in context. Everything else is React Query.
- **ShadCN UI pattern** — base components in `components/ui/` are unstyled logic wrappers; styling is applied via Tailwind classes matching the dark design system.
