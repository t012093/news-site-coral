import { Request, Response } from 'express';
import { TaskService } from '@/services/taskService';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { CreateTaskRequest, UpdateTaskRequest } from '@/types';

export class TaskController {
  /**
   * GET /api/tasks
   * Get tasks with filtering and pagination
   */
  public static getTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
      projectId,
      status,
      priority,
      category,
      assignedTo,
      search,
      isOverdue,
      limit,
      offset,
      sortField,
      sortDirection,
    } = req.query;

    const options = {
      projectId: projectId as string,
      status: status ? (status as string).split(',') : undefined,
      priority: priority ? (priority as string).split(',') : undefined,
      category: category ? (category as string).split(',') : undefined,
      assignedTo: assignedTo as string,
      search: search as string,
      isOverdue: isOverdue === 'true',
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
      sortField: sortField as string,
      sortDirection: (sortDirection as 'ASC' | 'DESC') || 'DESC',
    };

    const result = await TaskService.getTasks(options);

    res.status(200).json({
      success: true,
      data: result.tasks,
      meta: {
        total: result.total,
        limit: options.limit,
        offset: options.offset,
        hasMore: result.total > options.offset + options.limit,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/tasks/:id
   * Get task by ID
   */
  public static getTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const task = await TaskService.getTaskById(id);

    if (!task) {
      throw createError.notFound('Task not found');
    }

    res.status(200).json({
      success: true,
      data: task,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/tasks
   * Create new task
   */
  public static createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const taskData: CreateTaskRequest = req.body;

    // Validate required fields
    if (!taskData.title || !taskData.projectId || !taskData.priority || !taskData.category) {
      throw createError.badRequest('Missing required fields: title, projectId, priority, category');
    }

    // Convert dueDate string to Date if provided
    if (taskData.dueDate) {
      taskData.dueDate = new Date(taskData.dueDate);
    }

    const task = await TaskService.createTask({
      ...taskData,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      data: task,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * PUT /api/tasks/:id
   * Update task
   */
  public static updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updates: UpdateTaskRequest = req.body;

    // Convert dueDate string to Date if provided
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    const task = await TaskService.updateTask(id, updates);

    res.status(200).json({
      success: true,
      data: task,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * PATCH /api/tasks/:id/status
   * Update task status
   */
  public static updateTaskStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw createError.badRequest('Status is required');
    }

    const validStatuses = ['todo', 'in_progress', 'review', 'completed', 'blocked', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw createError.badRequest(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const task = await TaskService.updateTaskStatus(id, status);

    res.status(200).json({
      success: true,
      data: task,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * DELETE /api/tasks/:id
   * Delete task (archive)
   */
  public static deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    await TaskService.deleteTask(id);

    res.status(200).json({
      success: true,
      data: { message: 'Task deleted successfully' },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * PATCH /api/tasks/bulk
   * Bulk update tasks
   */
  public static bulkUpdateTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { taskIds, updates } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      throw createError.badRequest('taskIds array is required');
    }

    if (!updates || typeof updates !== 'object') {
      throw createError.badRequest('updates object is required');
    }

    // Convert dueDate string to Date if provided
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    const tasks = await TaskService.bulkUpdateTasks(taskIds, updates);

    res.status(200).json({
      success: true,
      data: tasks,
      meta: {
        updated: tasks.length,
        requested: taskIds.length,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/tasks/stats
   * Get task statistics
   */
  public static getTaskStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { projectId, userId } = req.query;

    const stats = await TaskService.getTaskStats(
      projectId as string,
      userId as string
    );

    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/tasks/my-tasks
   * Get current user's tasks
   */
  public static getMyTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const { status, limit, offset } = req.query;

    const options = {
      status: status ? (status as string).split(',') : undefined,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
    };

    const result = await TaskService.getUserTasks(req.user.userId, options);

    res.status(200).json({
      success: true,
      data: result.tasks,
      meta: {
        total: result.total,
        limit: options.limit,
        offset: options.offset,
        hasMore: result.total > options.offset + options.limit,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/tasks/overdue
   * Get overdue tasks
   */
  public static getOverdueTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { projectId, assignedTo, limit, offset } = req.query;

    const options = {
      projectId: projectId as string,
      assignedTo: assignedTo as string,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
    };

    const result = await TaskService.getOverdueTasks(options);

    res.status(200).json({
      success: true,
      data: result.tasks,
      meta: {
        total: result.total,
        limit: options.limit,
        offset: options.offset,
        hasMore: result.total > options.offset + options.limit,
      },
      timestamp: new Date().toISOString(),
    });
  });
}