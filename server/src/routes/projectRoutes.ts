import { Router } from 'express';
import { ProjectController } from '@/controllers/projectController';
import { authenticate } from '@/middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Project routes
router.get('/', ProjectController.getProjects);
router.get('/stats/user', ProjectController.getUserProjectStats);
router.get('/:id', ProjectController.getProject);
router.post('/', ProjectController.createProject);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

// Project member routes
router.get('/:id/members', ProjectController.getProjectMembers);
router.post('/:id/members', ProjectController.addProjectMember);
router.patch('/:id/members/:userId', ProjectController.updateProjectMemberRole);
router.delete('/:id/members/:userId', ProjectController.removeProjectMember);

export default router;