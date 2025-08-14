import { Task, Project, TaskFilter, TaskSort, TaskStatus } from '../types/task';

const API_BASE = '/api';

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
  const params = new URLSearchParams();
  
  if (filter?.search) params.append('search', filter.search);
  if (filter?.status) params.append('status', filter.status.join(','));
  if (filter?.priority) params.append('priority', filter.priority.join(','));
  if (filter?.category) params.append('category', filter.category.join(','));
  if (filter?.assignedTo) params.append('assignedTo', filter.assignedTo);
  if (filter?.projectId) params.append('projectId', filter.projectId);
  if (filter?.isOverdue) params.append('isOverdue', 'true');
  if (filter?.dueDate?.from) params.append('dueDateFrom', filter.dueDate.from.toISOString());
  if (filter?.dueDate?.to) params.append('dueDateTo', filter.dueDate.to.toISOString());
  
  if (sort) {
    params.append('sortField', sort.field);
    params.append('sortDirection', sort.direction);
  }

  const response = await fetch(`${API_BASE}/tasks?${params}`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  
  const data = await response.json();
  return data.map((task: any) => ({
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  }));
};

// タスク作成
export const createTask = async (task: CreateTaskRequest): Promise<Task> => {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...task,
      dueDate: task.dueDate?.toISOString(),
    }),
  });

  if (!response.ok) throw new Error('Failed to create task');
  
  const data = await response.json();
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  };
};

// タスク更新
export const updateTask = async (id: string, updates: UpdateTaskRequest): Promise<Task> => {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...updates,
      dueDate: updates.dueDate?.toISOString(),
    }),
  });

  if (!response.ok) throw new Error('Failed to update task');
  
  const data = await response.json();
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  };
};

// タスクステータス変更
export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
  const response = await fetch(`${API_BASE}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error('Failed to update task status');
  
  const data = await response.json();
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  };
};

// タスク削除
export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Failed to delete task');
};

// プロジェクト一覧取得
export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE}/projects`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  
  const data = await response.json();
  return data.map((project: any) => ({
    ...project,
    startDate: new Date(project.startDate),
    endDate: project.endDate ? new Date(project.endDate) : undefined,
  }));
};

// バルク操作用
export const bulkUpdateTasks = async (
  taskIds: string[], 
  updates: Partial<UpdateTaskRequest>
): Promise<Task[]> => {
  const response = await fetch(`${API_BASE}/tasks/bulk`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      taskIds,
      updates: {
        ...updates,
        dueDate: updates.dueDate?.toISOString(),
      },
    }),
  });

  if (!response.ok) throw new Error('Failed to bulk update tasks');
  
  const data = await response.json();
  return data.map((task: any) => ({
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  }));
};

// リアルタイム更新用のWebSocket接続
export const subscribeToTaskUpdates = (
  onUpdate: (task: Task) => void,
  onDelete: (taskId: string) => void
) => {
  if (typeof WebSocket === 'undefined') {
    console.warn('WebSocket is not available in this environment');
    return () => {};
  }

  const ws = new WebSocket(`ws://localhost:3001/tasks/subscribe`);
  
  ws.onmessage = (event) => {
    try {
      const { type, data } = JSON.parse(event.data);
      
      switch (type) {
        case 'TASK_UPDATED':
          onUpdate({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          });
          break;
        case 'TASK_DELETED':
          onDelete(data.taskId);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  };
};