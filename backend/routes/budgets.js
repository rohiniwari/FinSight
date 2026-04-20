import { Router } from 'express';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../controllers/budgetController.js';
import { authenticate }                    from '../middleware/auth.js';
import { validate, budgetSchema }          from '../middleware/validate.js';

const router = Router();
router.use(authenticate);

router.get   ('/',    getBudgets);
router.post  ('/',    validate(budgetSchema), createBudget);
router.put   ('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
