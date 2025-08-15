import { Router } from 'express';
import { TaskController } from '@/controllers/taskController';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

// All task routes require authentication
router.use(authenticate);

// Public task routes (accessible to all authenticated users)
router.get('/stats', TaskController.getTaskStats);
router.get('/my-tasks', TaskController.getMyTasks);
router.get('/overdue', TaskController.getOverdueTasks);
router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTask);

// Task creation and modification
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.patch('/:id/status', TaskController.updateTaskStatus);
router.patch('/bulk', TaskController.bulkUpdateTasks);

// Task deletion (admin or manager only)
router.delete('/:id', authorize('admin', 'manager'), TaskController.deleteTask);

export default router;