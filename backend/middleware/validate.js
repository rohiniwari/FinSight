import { z } from 'zod';

// ── Schemas ──────────────────────────────────────────────

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:     z.string().email('Invalid email address'),
  password:  z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const transactionSchema = z.object({
  amount:   z.coerce.number().positive('Amount must be greater than 0').max(99999999),
  category: z.string().min(1, 'Category is required').max(100),
  type:     z.enum(['income', 'expense'], { errorMap: () => ({ message: 'Type must be income or expense' }) }),
  date:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  notes:    z.string().max(500).optional().nullable(),
});

export const budgetSchema = z.object({
  category: z.string().min(1).max(100),
  amount:   z.coerce.number().positive('Amount must be greater than 0').max(99999999),
  month:    z.coerce.number().int().min(1).max(12),
  year:     z.coerce.number().int().min(2000).max(2100),
});

// ── Middleware factory ────────────────────────────────────

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      field:   e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      error:  errors[0].message,
      errors,
    });
  }
  req.body = result.data;
  next();
};
