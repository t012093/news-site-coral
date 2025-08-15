import { Task, CreateTaskRequest, UpdateTaskRequest, QueryOptions } from '@/types';
import { createError } from '@/middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

// Temporary in-memory storage (will be replaced with database)
let tasks: (Task & { password_hash?: string })[] = [];
let taskIdCounter = 1;

// Mock data initialization
const initializeMockTasks = () => {
  if (tasks.length > 0) return; // Already initialized

  const mockTasks: Task[] = [
    {
      id: uuidv4(),
      title: 'ホームページのデザイン更新',
      description: '新しいブランドガイドラインに基づいてホームページのデザインを更新する',
      priority: 'high',
      status: 'in_progress',
      category: 'design',
      projectId: '660e8400-e29b-41d4-a716-446655440000',
      assignedTo: '550e8400-e29b-41d4-a716-446655440003',
      createdBy: '550e8400-e29b-41d4-a716-446655440001',
      dueDate: '2024-08-20T17:00:00.000Z',
      estimatedHours: 16,
      actualHours: 8,
      isArchived: false,
      tags: ['urgent', 'frontend'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'ユーザー認証システムの実装',
      description: 'JWT認証システムを実装する',
      priority: 'urgent',
      status: 'todo',
      category: 'development',
      projectId: '660e8400-e29b-41d4-a716-446655440000',
      assignedTo: '550e8400-e29b-41d4-a716-446655440004',
      createdBy: '550e8400-e29b-41d4-a716-446655440001',
      dueDate: '2024-08-18T17:00:00.000Z',
      estimatedHours: 24,
      actualHours: 0,
      isArchived: false,
      tags: ['backend', 'security'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'データベースマイグレーション',
      description: '新しいテーブル構造に対応するマイグレーションを作成',
      priority: 'medium',
      status: 'completed',
      category: 'development',
      projectId: '660e8400-e29b-41d4-a716-446655440000',
      assignedTo: '550e8400-e29b-41d4-a716-446655440005',
      createdBy: '550e8400-e29b-41d4-a716-446655440001',
      dueDate: '2024-08-15T17:00:00.000Z',
      estimatedHours: 8,
      actualHours: 6,
      completedAt: '2024-08-14T16:30:00.000Z',
      isArchived: false,
      tags: ['database'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  tasks = mockTasks;
};

export class TaskService {
  /**
   * Get tasks with filtering and pagination
   */
  public static async getTasks(options: {
    userId?: string;
    projectId?: string;
    status?: string[];
    priority?: string[];
    category?: string[];
    assignedTo?: string;
    search?: string;
    isOverdue?: boolean;
    limit?: number;
    offset?: number;
    sortField?: string;
    sortDirection?: 'ASC' | 'DESC';
  } = {}): Promise<{ tasks: Task[]; total: number }> {
    initializeMockTasks();

    let filteredTasks = [...tasks];

    // Apply filters
    if (options.projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === options.projectId);
    }

    if (options.status && options.status.length > 0) {
      filteredTasks = filteredTasks.filter(task => options.status!.includes(task.status));
    }

    if (options.priority && options.priority.length > 0) {
      filteredTasks = filteredTasks.filter(task => options.priority!.includes(task.priority));
    }

    if (options.category && options.category.length > 0) {
      filteredTasks = filteredTasks.filter(task => options.category!.includes(task.category));
    }

    if (options.assignedTo) {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === options.assignedTo);
    }

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower)) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (options.isOverdue) {
      const now = new Date();
      filteredTasks = filteredTasks.filter(task => 
        task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed'
      );
    }

    // Filter out archived tasks unless specifically requested
    filteredTasks = filteredTasks.filter(task => !task.isArchived);

    const total = filteredTasks.length;

    // Apply sorting
    const sortField = options.sortField || 'updatedAt';
    const sortDirection = options.sortDirection || 'DESC';

    filteredTasks.sort((a, b) => {
      let aValue: any = a[sortField as keyof Task];
      let bValue: any = b[sortField as keyof Task];

      // Handle date fields
      if (sortField === 'createdAt' || sortField === 'updatedAt' || sortField === 'dueDate') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      // Handle string fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue ? bValue.toLowerCase() : '';
      }

      if (sortDirection === 'ASC') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Apply pagination
    const limit = options.limit || 50;
    const offset = options.offset || 0;
    const paginatedTasks = filteredTasks.slice(offset, offset + limit);

    return { tasks: paginatedTasks, total };
  }

  /**
   * Get task by ID
   */
  public static async getTaskById(id: string): Promise<Task | null> {
    initializeMockTasks();
    const task = tasks.find(t => t.id === id && !t.isArchived);
    return task || null;
  }

  /**
   * Create new task
   */
  public static async createTask(taskData: CreateTaskRequest & { createdBy: string }): Promise<Task> {
    initializeMockTasks();

    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: 'todo',
      category: taskData.category,
      projectId: taskData.projectId,
      assignedTo: taskData.assignedTo,
      createdBy: taskData.createdBy,
      dueDate: taskData.dueDate ? (taskData.dueDate instanceof Date ? taskData.dueDate.toISOString() : taskData.dueDate) : undefined,
      estimatedHours: taskData.estimatedHours,
      actualHours: 0,
      isArchived: false,
      tags: taskData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    return newTask;
  }

  /**
   * Update task
   */
  public static async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    initializeMockTasks();

    const taskIndex = tasks.findIndex(t => t.id === id && !t.isArchived);
    if (taskIndex === -1) {
      throw createError.notFound('Task not found');
    }

    const task = tasks[taskIndex];
    const updatedTask: Task = {
      ...task,
      ...updates,
      dueDate: updates.dueDate ? (updates.dueDate instanceof Date ? updates.dueDate.toISOString() : updates.dueDate) : task.dueDate,
      tags: updates.tags || task.tags,
      updatedAt: new Date().toISOString(),
    };

    // Set completed date if status changed to completed
    if (updates.status === 'completed' && task.status !== 'completed') {
      updatedTask.completedAt = new Date().toISOString();
    } else if (updates.status && updates.status !== 'completed') {
      updatedTask.completedAt = undefined;
    }

    tasks[taskIndex] = updatedTask;

    return updatedTask;
  }

  /**
   * Update task status
   */
  public static async updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
    return this.updateTask(id, { status });
  }

  /**
   * Delete task (archive)
   */
  public static async deleteTask(id: string): Promise<void> {
    initializeMockTasks();

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw createError.notFound('Task not found');
    }

    // Archive instead of delete
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      isArchived: true,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Bulk update tasks
   */
  public static async bulkUpdateTasks(
    taskIds: string[], 
    updates: Partial<UpdateTaskRequest>
  ): Promise<Task[]> {
    initializeMockTasks();

    const updatedTasks: Task[] = [];

    for (const taskId of taskIds) {
      try {
        const updatedTask = await this.updateTask(taskId, updates);
        updatedTasks.push(updatedTask);
      } catch (error) {
        // Continue with other tasks if one fails
        console.error(`Failed to update task ${taskId}:`, error);
      }
    }

    return updatedTasks;
  }

  /**
   * Get task statistics
   */
  public static async getTaskStats(projectId?: string, userId?: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    overdue: number;
  }> {
    initializeMockTasks();

    let filteredTasks = tasks.filter(task => !task.isArchived);

    if (projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === projectId);
    }

    if (userId) {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === userId);
    }

    const now = new Date();
    const overdueTasks = filteredTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed'
    );

    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};

    filteredTasks.forEach(task => {
      byStatus[task.status] = (byStatus[task.status] || 0) + 1;
      byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
    });

    return {
      total: filteredTasks.length,
      byStatus,
      byPriority,
      overdue: overdueTasks.length,
    };
  }

  /**
   * Get tasks assigned to user
   */
  public static async getUserTasks(userId: string, options: {
    status?: string[];
    limit?: number;
    offset?: number;
  } = {}): Promise<{ tasks: Task[]; total: number }> {
    return this.getTasks({
      ...options,
      assignedTo: userId,
    });
  }

  /**
   * Get overdue tasks
   */
  public static async getOverdueTasks(options: {
    projectId?: string;
    assignedTo?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ tasks: Task[]; total: number }> {
    return this.getTasks({
      ...options,
      isOverdue: true,
    });
  }
}