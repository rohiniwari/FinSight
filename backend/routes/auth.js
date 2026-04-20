import { Router } from 'express';
import {
  register, login, logout, getMe, updateProfile,
  sendOtp, verifyOtp, googleOAuthUrl, refreshToken,
} from '../controllers/authController.js';
import { authenticate }          from '../middleware/auth.js';
import { validate, registerSchema, loginSchema } from '../middleware/validate.js';

const router = Router();

// Public
router.post('/register',       validate(registerSchema), register);
router.post('/login',          validate(loginSchema),    login);
router.post('/otp/send',       sendOtp);
router.post('/otp/verify',     verifyOtp);
router.get ('/google',         googleOAuthUrl);
router.post('/refresh',        refreshToken);

// Protected
router.post('/logout',         authenticate, logout);
router.get ('/me',             authenticate, getMe);
router.put ('/profile',        authenticate, updateProfile);

export default router;
