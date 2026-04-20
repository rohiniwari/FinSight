import { Router } from 'express';
import {
  getSummary, getMonthlyTrend,
  getHealthScore, getInsights,
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/summary',       getSummary);
router.get('/monthly',       getMonthlyTrend);
router.get('/health-score',  getHealthScore);
router.get('/insights',      getInsights);

export default router;
