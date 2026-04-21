import express   from 'express';
import cors      from 'cors';
import dotenv    from 'dotenv';
import helmet    from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes        from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes      from './routes/budgets.js';
import analyticsRoutes   from './routes/analytics.js';
import exportRoutes      from './routes/export.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security headers ─────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// ── CORS ─────────────────────────────────────────────────
const allowedOrigins = [
  (process.env.FRONTEND_URL || 'http://localhost:5174').replace(/\/$/, ''),
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              300,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,
  message:  { error: 'Too many login attempts, please try again later.' },
});

app.use('/api', limiter);
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets',      budgetRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/export',       exportRoutes);

// ── Health check ─────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', time: new Date().toISOString(), env: process.env.NODE_ENV })
);

// ── 404 ───────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ──────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message || err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🚀  FinSight API  →  http://localhost:${PORT}`);
    console.log(`   ENV: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

export default app;
