// タスク管理システムの型定義

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked' | 'cancelled';
export type TaskCategory = 'development' | 'design' | 'marketing' | 'content' | 'research' | 'meeting' | 'other';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  projectId: string;
  projectName: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  dependencies?: string[]; // Task IDs that this task depends on
  subtasks?: Task[];
  isArchived: boolean;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt?: Date;
  mentions?: string[]; // User IDs mentioned in comment
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  progress: number; // 0-100
  teamMembers: ProjectMember[];
  taskStats: TaskStats;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  skills: string[];
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  completed: number;
  blocked: number;
  cancelled: number;
  overdue: number;
}

export interface TaskFilter {
  search?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: TaskCategory[];
  projectId?: string;
  assignedTo?: string;
  createdBy?: string;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  tags?: string[];
  isOverdue?: boolean;
  isArchived?: boolean;
}

export interface TaskSort {
  field: 'title' | 'priority' | 'status' | 'dueDate' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface TaskBoard {
  id: string;
  name: string;
  description?: string;
  columns: TaskBoardColumn[];
  projectId?: string;
  isDefault: boolean;
}

export interface TaskBoardColumn {
  id: string;
  title: string;
  status: TaskStatus[];
  color: string;
  limit?: number; // WIP limit
  order: number;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  type: 'created' | 'updated' | 'assigned' | 'status_changed' | 'commented' | 'completed';
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
  metadata?: Record<string, any>; // Additional activity-specific data
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedHours?: number;
  checklist?: TaskChecklistItem[];
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface TaskChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface TaskNotification {
  id: string;
  taskId: string;
  taskTitle: string;
  type: 'assigned' | 'due_soon' | 'overdue' | 'completed' | 'mentioned' | 'status_changed';
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface TaskMetrics {
  productivity: {
    tasksCompleted: number;
    averageCompletionTime: number; // in hours
    onTimeDeliveryRate: number; // percentage
  };
  workload: {
    totalTasks: number;
    activeTasksCount: number;
    estimatedHours: number;
    actualHours: number;
  };
  quality: {
    reopenedTasksCount: number;
    feedbackScore: number; // 1-5
    clientSatisfactionRate: number; // percentage
  };
}

export interface TaskTimeEntry {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  description?: string;
  duration: number; // in minutes
  startTime: Date;
  endTime?: Date;
  isRunning: boolean;
  createdAt: Date;
}

export interface TaskTimerSession {
  taskId: string;
  startTime: Date;
  description?: string;
  isRunning: boolean;
}