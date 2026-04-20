import { Router }         from 'express';
import { exportCSV, exportPDF } from '../controllers/exportController.js';
import { authenticate }   from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/csv', exportCSV);
router.get('/pdf', exportPDF);

export default router;
