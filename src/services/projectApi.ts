import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const projectAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// リクエストインターセプターで認証ヘッダーを追加
projectAPI.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプターでエラーハンドリング
projectAPI.interceptors.response.use(
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

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: Date;
  endDate?: Date;
  ownerId: string;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  memberRole?: 'owner' | 'admin' | 'member' | 'viewer';
  memberCount?: number;
  taskCount?: number;
  completedTaskCount?: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: Date;
  endDate?: Date;
  isPublic: boolean;
  tags: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: Date;
  endDate?: Date;
  isPublic?: boolean;
  tags?: string[];
}

export interface ProjectFilters {
  search?: string;
  status?: string[];
  priority?: string[];
  isOwner?: boolean;
  limit?: number;
  offset?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ProjectMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  projectsAsOwner: number;
  projectsAsMember: number;
}

// プロジェクト一覧取得
export const getProjects = async (filters?: ProjectFilters): Promise<{
  projects: Project[];
  total: number;
}> => {
  try {
    const params: any = {};
    
    if (filters?.search) params.search = filters.search;
    if (filters?.status) params.status = filters.status.join(',');
    if (filters?.priority) params.priority = filters.priority.join(',');
    if (filters?.isOwner !== undefined) params.isOwner = filters.isOwner;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.offset) params.offset = filters.offset;
    if (filters?.sortField) params.sortField = filters.sortField;
    if (filters?.sortDirection) params.sortDirection = filters.sortDirection;

    const response = await projectAPI.get('/projects', { params });
    
    const apiResponse = response.data;
    const projects = (apiResponse.data || []).map((project: any) => ({
      ...project,
      startDate: new Date(project.startDate),
      endDate: project.endDate ? new Date(project.endDate) : undefined,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    }));

    return {
      projects,
      total: apiResponse.meta?.total || projects.length,
    };
  } catch (error: any) {
    console.error('Failed to fetch projects:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクトの取得に失敗しました';
    throw new Error(errorMessage);
  }
};

// プロジェクト詳細取得
export const getProject = async (id: string): Promise<Project> => {
  try {
    const response = await projectAPI.get(`/projects/${id}`);
    
    const project = response.data.data;
    return {
      ...project,
      startDate: new Date(project.startDate),
      endDate: project.endDate ? new Date(project.endDate) : undefined,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    };
  } catch (error: any) {
    console.error('Failed to fetch project:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクトの取得に失敗しました';
    throw new Error(errorMessage);
  }
};

// プロジェクト作成
export const createProject = async (project: CreateProjectRequest): Promise<Project> => {
  try {
    const response = await projectAPI.post('/projects', {
      ...project,
      startDate: project.startDate.toISOString(),
      endDate: project.endDate?.toISOString(),
    });

    const projectData = response.data.data;
    return {
      ...projectData,
      startDate: new Date(projectData.startDate),
      endDate: projectData.endDate ? new Date(projectData.endDate) : undefined,
      createdAt: new Date(projectData.createdAt),
      updatedAt: new Date(projectData.updatedAt),
    };
  } catch (error: any) {
    console.error('Failed to create project:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクトの作成に失敗しました';
    throw new Error(errorMessage);
  }
};

// プロジェクト更新
export const updateProject = async (id: string, updates: UpdateProjectRequest): Promise<Project> => {
  try {
    const response = await projectAPI.put(`/projects/${id}`, {
      ...updates,
      startDate: updates.startDate?.toISOString(),
      endDate: updates.endDate?.toISOString(),
    });

    const projectData = response.data.data;
    return {
      ...projectData,
      startDate: new Date(projectData.startDate),
      endDate: projectData.endDate ? new Date(projectData.endDate) : undefined,
      createdAt: new Date(projectData.createdAt),
      updatedAt: new Date(projectData.updatedAt),
    };
  } catch (error: any) {
    console.error('Failed to update project:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクトの更新に失敗しました';
    throw new Error(errorMessage);
  }
};

// プロジェクト削除
export const deleteProject = async (id: string): Promise<void> => {
  try {
    await projectAPI.delete(`/projects/${id}`);
  } catch (error: any) {
    console.error('Failed to delete project:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクトの削除に失敗しました';
    throw new Error(errorMessage);
  }
};

// プロジェクトメンバー取得
export const getProjectMembers = async (projectId: string): Promise<ProjectMember[]> => {
  try {
    const response = await projectAPI.get(`/projects/${projectId}/members`);
    
    const members = response.data.data || [];
    return members.map((member: any) => ({
      ...member,
      joinedAt: new Date(member.joinedAt),
    }));
  } catch (error: any) {
    console.error('Failed to fetch project members:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクトメンバーの取得に失敗しました';
    throw new Error(errorMessage);
  }
};

// プロジェクトメンバー追加
export const addProjectMember = async (
  projectId: string, 
  userId: string, 
  role: 'admin' | 'member' | 'viewer' = 'member'
): Promise<ProjectMember> => {
  try {
    const response = await projectAPI.post(`/projects/${projectId}/members`, {
      userId,
      role,
    });

    const member = response.data.data;
    return {
      ...member,
      joinedAt: new Date(member.joinedAt),
    };
  } catch (error: any) {
    console.error('Failed to add project member:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクトメンバーの追加に失敗しました';
    throw new Error(errorMessage);
  }
};

// プロジェクトメンバー権限変更
export const updateProjectMemberRole = async (
  projectId: string, 
  userId: string, 
  role: 'admin' | 'member' | 'viewer'
): Promise<ProjectMember> => {
  try {
    const response = await projectAPI.put(`/projects/${projectId}/members/${userId}`, {
      role,
    });

    const member = response.data.data;
    return {
      ...member,
      joinedAt: new Date(member.joinedAt),
    };
  } catch (error: any) {
    console.error('Failed to update project member role:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクトメンバーの権限変更に失敗しました';
    throw new Error(errorMessage);
  }
};

// プロジェクトメンバー削除
export const removeProjectMember = async (projectId: string, userId: string): Promise<void> => {
  try {
    await projectAPI.delete(`/projects/${projectId}/members/${userId}`);
  } catch (error: any) {
    console.error('Failed to remove project member:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクトメンバーの削除に失敗しました';
    throw new Error(errorMessage);
  }
};

// プロジェクト統計取得
export const getProjectStats = async (): Promise<ProjectStats> => {
  try {
    const response = await projectAPI.get('/projects/stats');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch project stats:', error);
    const errorMessage = error.response?.data?.message || 'プロジェクト統計の取得に失敗しました';
    throw new Error(errorMessage);
  }
};