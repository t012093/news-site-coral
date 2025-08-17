import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authenticate, authRateLimit } from '@/middleware/auth';

const router = Router();

// Apply rate limiting to auth endpoints
const authLimit = authRateLimit(5, 15); // 5 attempts per 15 minutes

// Public routes
router.post('/login', authLimit, AuthController.login);
router.post('/register', authLimit, AuthController.register);
router.post('/refresh', AuthController.refresh);
router.post('/forgot-password', authLimit, AuthController.forgotPassword);
router.post('/reset-password', authLimit, AuthController.resetPassword);

// Protected routes
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getCurrentUser);
router.get('/validate', authenticate, AuthController.validateToken);

// API Token routes
router.post('/api-tokens', authenticate, AuthController.createApiToken);
router.get('/api-tokens', authenticate, AuthController.getApiTokens);
router.delete('/api-tokens/:tokenId', authenticate, AuthController.revokeApiToken);

export default router;