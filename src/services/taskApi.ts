import axios from 'axios';
import Cookies from 'js-cookie';
import { Task, Project, TaskFilter, TaskSort, TaskStatus } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const taskAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// リクエストインターセプターで認証ヘッダーを追加
taskAPI.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプターでエラーハンドリング
taskAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 認証エラーの場合はログインページにリダイレクト
      Cookies.remove('auth_token');
      Cookies.remove('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'development' | 'design' | 'testing' | 'other';
  projectId: string;
  assignedTo?: string;
  dueDate?: Date;
  estimatedHours?: number;
  tags: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: TaskStatus;
  category?: 'development' | 'design' | 'testing' | 'other';
  assignedTo?: string;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}

// タスク一覧取得
export const getTasks = async (filter?: TaskFilter, sort?: TaskSort): Promise<Task[]> => {
  try {
    const params: any = {};
    
    if (filter?.search) params.search = filter.search;
    if (filter?.status) params.status = filter.status.join(',');
    if (filter?.priority) params.priority = filter.priority.join(',');
    if (filter?.category) params.category = filter.category.join(',');
    if (filter?.assignedTo) params.assignedTo = filter.assignedTo;
    if (filter?.projectId) params.projectId = filter.projectId;
    if (filter?.isOverdue) params.isOverdue = 'true';
    if (filter?.dueDate?.from) params.dueDateFrom = filter.dueDate.from.toISOString();
    if (filter?.dueDate?.to) params.dueDateTo = filter.dueDate.to.toISOString();
    
    if (sort) {
      params.sortField = sort.field;
      params.sortDirection = sort.direction;
    }

    const response = await taskAPI.get('/tasks', { params });
    
    // バックエンドのレスポンス構造に合わせる
    const tasks = response.data.data || [];
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));
  } catch (error: any) {
    console.error('Failed to fetch tasks:', error);
    const errorMessage = error.response?.data?.message || 'タスクの取得に失敗しました';
    throw new Error(errorMessage);
  }
};

// タスク作成
export const createTask = async (task: CreateTaskRequest): Promise<Task> => {
  try {
    const response = await taskAPI.post('/tasks', {
      ...task,
      dueDate: task.dueDate?.toISOString(),
    });

    // バックエンドのレスポンス構造に合わせる
    const taskData = response.data.data;
    return {
      ...taskData,
      createdAt: new Date(taskData.createdAt),
      updatedAt: new Date(taskData.updatedAt),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
    };
  } catch (error: any) {
    console.error('Failed to create task:', error);
    const errorMessage = error.response?.data?.message || 'タスクの作成に失敗しました';
    throw new Error(errorMessage);
  }
};

// タスク更新
export const updateTask = async (id: string, updates: UpdateTaskRequest): Promise<Task> => {
  try {
    const response = await taskAPI.put(`/tasks/${id}`, {
      ...updates,
      dueDate: updates.dueDate?.toISOString(),
    });

    // バックエンドのレスポンス構造に合わせる
    const taskData = response.data.data;
    return {
      ...taskData,
      createdAt: new Date(taskData.createdAt),
      updatedAt: new Date(taskData.updatedAt),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
    };
  } catch (error: any) {
    console.error('Failed to update task:', error);
    const errorMessage = error.response?.data?.message || 'タスクの更新に失敗しました';
    throw new Error(errorMessage);
  }
};

// タスクステータス変更
export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
  try {
    const response = await taskAPI.patch(`/tasks/${id}/status`, { status });

    // バックエンドのレスポンス構造に合わせる
    const taskData = response.data.data;
    return {
      ...taskData,
      createdAt: new Date(taskData.createdAt),
      updatedAt: new Date(taskData.updatedAt),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
    };
  } catch (error: any) {
    console.error('Failed to update task status:', error);
    const errorMessage = error.response?.data?.message || 'タスクステータスの更新に失敗しました';
    throw new Error(errorMessage);
  }
};

// タスク削除
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await taskAPI.delete(`/tasks/${id}`);
  } catch (error: any) {
    console.error('Failed to delete task:', error);
    const errorMessage = error.response?.data?.message || 'タスクの削除に失敗しました';
    throw new Error(errorMessage);
  }
};

// プロジェクト一覧取得 (既存のAPIを使用)
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await taskAPI.get('/projects');
    
    // バックエンドのレスポンス構造に合わせる
    const apiResponse = response.data;
    const projects = (apiResponse.data || []).map((project: any) => ({
      ...project,
      startDate: new Date(project.startDate),
      endDate: project.endDate ? new Date(project.endDate) : undefined,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    }));
    
    return projects;
  } catch (error: any) {
    console.error('Failed to fetch projects:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクトの取得に失敗しました';
    throw new Error(errorMessage);
  }
};

// バルク操作用
export const bulkUpdateTasks = async (
  taskIds: string[], 
  updates: Partial<UpdateTaskRequest>
): Promise<Task[]> => {
  try {
    const response = await taskAPI.patch('/tasks/bulk', {
      taskIds,
      updates: {
        ...updates,
        dueDate: updates.dueDate?.toISOString(),
      },
    });

    // バックエンドのレスポンス構造に合わせる
    const tasks = response.data.data || [];
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));
  } catch (error: any) {
    console.error('Failed to bulk update tasks:', error);
    const errorMessage = error.response?.data?.message || 'タスクの一括更新に失敗しました';
    throw new Error(errorMessage);
  }
};

// Socket.IOを使用したリアルタイム更新のサブスクリプション
// 注意: これはレガシー実装です。新しいsocketServiceを使用することを推奨します
export const subscribeToTaskUpdates = (
  _onUpdate: (task: Task) => void,
  _onDelete: (taskId: string) => void
) => {
  console.warn('subscribeToTaskUpdates は非推奨です。socketService を使用してください');
  
  // 空の関数を返してエラーを防ぐ
  return () => {
    console.log('Legacy WebSocket subscription cleanup');
  };
};