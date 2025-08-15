import { Request, Response } from 'express';
import { ProjectService, CreateProjectRequest, UpdateProjectRequest } from '@/services/projectService';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { ProjectMemberRole } from '@/types';

export class ProjectController {
  /**
   * GET /api/projects
   * プロジェクト一覧を取得
   */
  public static getProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
      status,
      ownerId,
      userId,
      search,
      limit,
      offset,
      sortField,
      sortDirection,
    } = req.query;

    const filters = {
      status: status ? (status as string).split(',') as any[] : undefined,
      ownerId: ownerId as string,
      userId: userId as string || req.user?.userId, // ユーザーが指定されていない場合は認証ユーザーを使用
      search: search as string,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
      sortField: sortField as string,
      sortDirection: (sortDirection as 'ASC' | 'DESC') || 'DESC',
    };

    const result = await ProjectService.getProjects(filters);

    res.status(200).json({
      success: true,
      data: result.projects,
      meta: {
        total: result.total,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: result.total > filters.offset + filters.limit,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/projects/:id
   * プロジェクトを取得
   */
  public static getProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const project = await ProjectService.getProjectById(id, req.user?.userId);

    if (!project) {
      throw createError.notFound('Project not found');
    }

    res.status(200).json({
      success: true,
      data: project,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/projects
   * プロジェクトを作成
   */
  public static createProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const projectData: CreateProjectRequest = req.body;

    // 必須フィールドの検証
    if (!projectData.name || !projectData.color || !projectData.icon) {
      throw createError.badRequest('Missing required fields: name, color, icon');
    }

    // 日付の検証
    if (projectData.startDate) {
      projectData.startDate = new Date(projectData.startDate).toISOString();
    }
    if (projectData.endDate) {
      projectData.endDate = new Date(projectData.endDate).toISOString();
    }

    const project = await ProjectService.createProject({
      ...projectData,
      ownerId: req.user.userId,
    });

    res.status(201).json({
      success: true,
      data: project,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * PUT /api/projects/:id
   * プロジェクトを更新
   */
  public static updateProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updates: UpdateProjectRequest = req.body;

    // 日付の変換
    if (updates.startDate) {
      updates.startDate = new Date(updates.startDate).toISOString();
    }
    if (updates.endDate) {
      updates.endDate = new Date(updates.endDate).toISOString();
    }

    const project = await ProjectService.updateProject(id, updates);

    res.status(200).json({
      success: true,
      data: project,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * DELETE /api/projects/:id
   * プロジェクトを削除（アーカイブ）
   */
  public static deleteProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    await ProjectService.deleteProject(id);

    res.status(200).json({
      success: true,
      data: { message: 'Project deleted successfully' },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/projects/:id/members
   * プロジェクトメンバーを取得
   */
  public static getProjectMembers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const members = await ProjectService.getProjectMembers(id);

    res.status(200).json({
      success: true,
      data: members,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/projects/:id/members
   * プロジェクトメンバーを追加
   */
  public static addProjectMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { userId, role = 'member' } = req.body;

    if (!userId) {
      throw createError.badRequest('userId is required');
    }

    const validRoles: ProjectMemberRole[] = ['owner', 'admin', 'member', 'viewer'];
    if (!validRoles.includes(role)) {
      throw createError.badRequest(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const member = await ProjectService.addProjectMember(id, userId, role);

    res.status(201).json({
      success: true,
      data: member,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * PATCH /api/projects/:id/members/:userId
   * プロジェクトメンバーの役割を更新
   */
  public static updateProjectMemberRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id, userId } = req.params;
    const { role } = req.body;

    if (!role) {
      throw createError.badRequest('Role is required');
    }

    const validRoles: ProjectMemberRole[] = ['owner', 'admin', 'member', 'viewer'];
    if (!validRoles.includes(role)) {
      throw createError.badRequest(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const member = await ProjectService.updateProjectMemberRole(id, userId, role);

    res.status(200).json({
      success: true,
      data: member,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * DELETE /api/projects/:id/members/:userId
   * プロジェクトメンバーを削除
   */
  public static removeProjectMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id, userId } = req.params;

    await ProjectService.removeProjectMember(id, userId);

    res.status(200).json({
      success: true,
      data: { message: 'Project member removed successfully' },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/projects/stats/user
   * ユーザーのプロジェクト統計を取得
   */
  public static getUserProjectStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const { userId } = req.query;
    const targetUserId = (userId as string) || req.user.userId;

    const stats = await ProjectService.getUserProjectStats(targetUserId);

    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  });
}