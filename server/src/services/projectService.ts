import { Project, ProjectMember, ProjectStatus, ProjectMemberRole, QueryOptions } from '@/types';
import { createError } from '@/middleware/errorHandler';
import { generateId } from '@/utils/generateId';

// Mock data for projects
const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'ウェブサイトリニューアル',
    description: 'コーポレートサイトの全面リニューアルプロジェクト',
    color: '#3B82F6',
    icon: '🚀',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    ownerId: 'user-1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'モバイルアプリ開発',
    description: 'iOSとAndroid向けネイティブアプリの開発',
    color: '#10B981',
    icon: '📱',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    ownerId: 'user-1',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'proj-3',
    name: 'マーケティングキャンペーン',
    description: '新商品のプロモーション活動',
    color: '#F59E0B',
    icon: '📈',
    status: 'completed',
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    ownerId: 'user-2',
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2024-01-31T00:00:00Z',
  },
];

const projectMembers: ProjectMember[] = [
  {
    id: 'pm-1',
    projectId: 'proj-1',
    userId: 'user-1',
    role: 'owner',
    joinedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'pm-2',
    projectId: 'proj-1',
    userId: 'user-2',
    role: 'admin',
    joinedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 'pm-3',
    projectId: 'proj-2',
    userId: 'user-1',
    role: 'owner',
    joinedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'pm-4',
    projectId: 'proj-3',
    userId: 'user-2',
    role: 'owner',
    joinedAt: '2023-11-01T00:00:00Z',
  },
];

export interface CreateProjectRequest {
  name: string;
  description?: string;
  color: string;
  icon: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  ownerId?: string;
  userId?: string; // プロジェクトメンバーとして参加しているもの
  search?: string;
  limit?: number;
  offset?: number;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface ProjectWithMemberRole extends Project {
  userRole?: ProjectMemberRole;
  memberCount?: number;
}

export class ProjectService {
  /**
   * プロジェクト一覧を取得
   */
  static async getProjects(filters: ProjectFilters = {}): Promise<{
    projects: ProjectWithMemberRole[];
    total: number;
  }> {
    try {
      let filteredProjects = [...projects];

      // フィルタリング
      if (filters.status && filters.status.length > 0) {
        filteredProjects = filteredProjects.filter(project =>
          filters.status!.includes(project.status)
        );
      }

      if (filters.ownerId) {
        filteredProjects = filteredProjects.filter(project =>
          project.ownerId === filters.ownerId
        );
      }

      if (filters.userId) {
        const userProjectIds = projectMembers
          .filter(member => member.userId === filters.userId)
          .map(member => member.projectId);
        
        filteredProjects = filteredProjects.filter(project =>
          userProjectIds.includes(project.id)
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProjects = filteredProjects.filter(project =>
          project.name.toLowerCase().includes(searchLower) ||
          (project.description && project.description.toLowerCase().includes(searchLower))
        );
      }

      // ソート
      const sortField = filters.sortField || 'updatedAt';
      const sortDirection = filters.sortDirection || 'DESC';
      
      filteredProjects.sort((a, b) => {
        const aValue = (a as any)[sortField];
        const bValue = (b as any)[sortField];
        
        if (sortDirection === 'ASC') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      const total = filteredProjects.length;

      // ページング
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;
      const paginatedProjects = filteredProjects.slice(offset, offset + limit);

      // プロジェクトにユーザーの役割とメンバー数を追加
      const projectsWithRole: ProjectWithMemberRole[] = paginatedProjects.map(project => {
        const userMember = filters.userId 
          ? projectMembers.find(member => 
              member.projectId === project.id && member.userId === filters.userId
            )
          : undefined;

        const memberCount = projectMembers.filter(member => 
          member.projectId === project.id
        ).length;

        return {
          ...project,
          userRole: userMember?.role,
          memberCount,
        };
      });

      return {
        projects: projectsWithRole,
        total,
      };
    } catch (error) {
      console.error('Error getting projects:', error);
      throw createError.internalError('Failed to retrieve projects');
    }
  }

  /**
   * プロジェクトをIDで取得
   */
  static async getProjectById(id: string, userId?: string): Promise<ProjectWithMemberRole | null> {
    try {
      const project = projects.find(p => p.id === id);
      
      if (!project) {
        return null;
      }

      const userMember = userId 
        ? projectMembers.find(member => 
            member.projectId === project.id && member.userId === userId
          )
        : undefined;

      const memberCount = projectMembers.filter(member => 
        member.projectId === project.id
      ).length;

      return {
        ...project,
        userRole: userMember?.role,
        memberCount,
      };
    } catch (error) {
      console.error('Error getting project by ID:', error);
      throw createError.internalError('Failed to retrieve project');
    }
  }

  /**
   * プロジェクトを作成
   */
  static async createProject(data: CreateProjectRequest & { ownerId: string }): Promise<Project> {
    try {
      const now = new Date().toISOString();
      const newProject: Project = {
        id: generateId('proj'),
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
        status: 'active',
        startDate: data.startDate,
        endDate: data.endDate,
        ownerId: data.ownerId,
        createdAt: now,
        updatedAt: now,
      };

      projects.push(newProject);

      // オーナーをプロジェクトメンバーとして追加
      const ownerMember: ProjectMember = {
        id: generateId('pm'),
        projectId: newProject.id,
        userId: data.ownerId,
        role: 'owner',
        joinedAt: now,
      };
      projectMembers.push(ownerMember);

      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw createError.internalError('Failed to create project');
    }
  }

  /**
   * プロジェクトを更新
   */
  static async updateProject(id: string, updates: UpdateProjectRequest): Promise<Project> {
    try {
      const projectIndex = projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        throw createError.notFound('Project not found');
      }

      const updatedProject = {
        ...projects[projectIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      projects[projectIndex] = updatedProject;
      return updatedProject;
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error updating project:', error);
      throw createError.internalError('Failed to update project');
    }
  }

  /**
   * プロジェクトを削除（アーカイブ）
   */
  static async deleteProject(id: string): Promise<void> {
    try {
      const projectIndex = projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        throw createError.notFound('Project not found');
      }

      // 実際の削除ではなく、ステータスを変更
      projects[projectIndex] = {
        ...projects[projectIndex],
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error deleting project:', error);
      throw createError.internalError('Failed to delete project');
    }
  }

  /**
   * プロジェクトメンバーを取得
   */
  static async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    try {
      return projectMembers.filter(member => member.projectId === projectId);
    } catch (error) {
      console.error('Error getting project members:', error);
      throw createError.internalError('Failed to retrieve project members');
    }
  }

  /**
   * プロジェクトメンバーを追加
   */
  static async addProjectMember(
    projectId: string,
    userId: string,
    role: ProjectMemberRole = 'member'
  ): Promise<ProjectMember> {
    try {
      // プロジェクトが存在するかチェック
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        throw createError.notFound('Project not found');
      }

      // 既にメンバーかチェック
      const existingMember = projectMembers.find(
        member => member.projectId === projectId && member.userId === userId
      );
      if (existingMember) {
        throw createError.conflict('User is already a member of this project');
      }

      const newMember: ProjectMember = {
        id: generateId('pm'),
        projectId,
        userId,
        role,
        joinedAt: new Date().toISOString(),
      };

      projectMembers.push(newMember);
      return newMember;
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error adding project member:', error);
      throw createError.internalError('Failed to add project member');
    }
  }

  /**
   * プロジェクトメンバーの役割を更新
   */
  static async updateProjectMemberRole(
    projectId: string,
    userId: string,
    role: ProjectMemberRole
  ): Promise<ProjectMember> {
    try {
      const memberIndex = projectMembers.findIndex(
        member => member.projectId === projectId && member.userId === userId
      );

      if (memberIndex === -1) {
        throw createError.notFound('Project member not found');
      }

      projectMembers[memberIndex] = {
        ...projectMembers[memberIndex],
        role,
      };

      return projectMembers[memberIndex];
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error updating project member role:', error);
      throw createError.internalError('Failed to update project member role');
    }
  }

  /**
   * プロジェクトメンバーを削除
   */
  static async removeProjectMember(projectId: string, userId: string): Promise<void> {
    try {
      const memberIndex = projectMembers.findIndex(
        member => member.projectId === projectId && member.userId === userId
      );

      if (memberIndex === -1) {
        throw createError.notFound('Project member not found');
      }

      // オーナーは削除できない
      if (projectMembers[memberIndex].role === 'owner') {
        throw createError.forbidden('Cannot remove project owner');
      }

      projectMembers.splice(memberIndex, 1);
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error removing project member:', error);
      throw createError.internalError('Failed to remove project member');
    }
  }

  /**
   * ユーザーのプロジェクト統計を取得
   */
  static async getUserProjectStats(userId: string): Promise<{
    total: number;
    active: number;
    completed: number;
    onHold: number;
    owned: number;
  }> {
    try {
      const userProjectIds = projectMembers
        .filter(member => member.userId === userId)
        .map(member => member.projectId);

      const userProjects = projects.filter(project => 
        userProjectIds.includes(project.id)
      );

      const owned = projects.filter(project => 
        project.ownerId === userId
      ).length;

      const stats = {
        total: userProjects.length,
        active: userProjects.filter(p => p.status === 'active').length,
        completed: userProjects.filter(p => p.status === 'completed').length,
        onHold: userProjects.filter(p => p.status === 'on_hold').length,
        owned,
      };

      return stats;
    } catch (error) {
      console.error('Error getting user project stats:', error);
      throw createError.internalError('Failed to retrieve project statistics');
    }
  }
}