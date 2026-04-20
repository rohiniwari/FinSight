import { Router } from 'express';
import {
  getTransactions, getTransaction, createTransaction,
  updateTransaction, deleteTransaction, getCategories,
} from '../controllers/transactionController.js';
import { authenticate }                               from '../middleware/auth.js';
import { validate, transactionSchema }                from '../middleware/validate.js';

const router = Router();
router.use(authenticate);

router.get   ('/',           getTransactions);
router.get   ('/categories', getCategories);
router.get   ('/:id',        getTransaction);
router.post  ('/',           validate(transactionSchema), createTransaction);
router.put   ('/:id',        validate(transactionSchema), updateTransaction);
router.delete('/:id',        deleteTransaction);

export default router;
