import { Router } from 'express';
import { MessageController } from '@/controllers/messageController';
import { authenticate } from '@/middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Conversation routes
router.get('/conversations', MessageController.getConversations);
router.post('/conversations', MessageController.createConversation);
router.get('/conversations/:id', MessageController.getConversation);

// Message routes
router.get('/conversations/:id/messages', MessageController.getMessages);
router.post('/conversations/:id/messages', MessageController.sendMessage);

// Conversation management routes
router.patch('/conversations/:id/read', MessageController.markAsRead);
router.post('/conversations/:id/participants', MessageController.addParticipant);
router.delete('/conversations/:id/participants', MessageController.leaveConversation);

// Statistics route
router.get('/stats', MessageController.getMessageStats);

export default router;