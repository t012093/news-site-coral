import { Request, Response } from 'express';
import { MessageService, CreateMessageRequest, CreateConversationRequest } from '@/services/messageService';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

export class MessageController {
  /**
   * GET /api/messages/conversations
   * ユーザーの会話一覧を取得
   */
  public static getConversations = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const { type, limit, offset } = req.query;

    const filters = {
      userId: req.user.userId,
      type: type as 'direct' | 'group' | undefined,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
    };

    const result = await MessageService.getUserConversations(filters);

    res.status(200).json({
      success: true,
      data: result.conversations,
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
   * GET /api/messages/conversations/:id
   * 会話の詳細を取得
   */
  public static getConversation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const { id } = req.params;

    const conversation = await MessageService.getConversationById(id, req.user.userId);

    if (!conversation) {
      throw createError.notFound('Conversation not found');
    }

    res.status(200).json({
      success: true,
      data: conversation,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/messages/conversations
   * 新しい会話を作成
   */
  public static createConversation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const conversationData: CreateConversationRequest = req.body;

    // 必須フィールドの検証
    if (!conversationData.type || !conversationData.participantIds || !Array.isArray(conversationData.participantIds)) {
      throw createError.badRequest('Missing required fields: type, participantIds');
    }

    if (conversationData.participantIds.length === 0) {
      throw createError.badRequest('At least one participant is required');
    }

    // グループ会話の場合はタイトルが必要
    if (conversationData.type === 'group' && !conversationData.title) {
      throw createError.badRequest('Group conversations require a title');
    }

    const conversation = await MessageService.createConversation(req.user.userId, conversationData);

    res.status(201).json({
      success: true,
      data: conversation,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/messages/conversations/:id/messages
   * 会話のメッセージ一覧を取得
   */
  public static getMessages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const { id } = req.params;
    const { limit, offset, beforeMessageId, afterMessageId } = req.query;

    // ユーザーが会話の参加者かチェック
    const conversation = await MessageService.getConversationById(id, req.user.userId);
    if (!conversation) {
      throw createError.notFound('Conversation not found or access denied');
    }

    const filters = {
      conversationId: id,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
      beforeMessageId: beforeMessageId as string,
      afterMessageId: afterMessageId as string,
    };

    const result = await MessageService.getConversationMessages(filters);

    res.status(200).json({
      success: true,
      data: result.messages,
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
   * POST /api/messages/conversations/:id/messages
   * メッセージを送信
   */
  public static sendMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const { id } = req.params;
    const messageData: CreateMessageRequest = req.body;

    // 必須フィールドの検証
    if (!messageData.content || messageData.content.trim().length === 0) {
      throw createError.badRequest('Message content is required');
    }

    const message = await MessageService.sendMessage(id, req.user.userId, messageData);

    res.status(201).json({
      success: true,
      data: message,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * PATCH /api/messages/conversations/:id/read
   * メッセージを既読にする
   */
  public static markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const { id } = req.params;
    const { messageId } = req.body;

    if (!messageId) {
      throw createError.badRequest('messageId is required');
    }

    await MessageService.markMessagesAsRead(id, req.user.userId, messageId);

    res.status(200).json({
      success: true,
      data: { message: 'Messages marked as read' },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/messages/conversations/:id/participants
   * 会話に参加者を追加
   */
  public static addParticipant = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      throw createError.badRequest('userId is required');
    }

    const participant = await MessageService.addParticipant(id, req.user.userId, userId);

    res.status(201).json({
      success: true,
      data: participant,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * DELETE /api/messages/conversations/:id/participants
   * 会話から離脱
   */
  public static leaveConversation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const { id } = req.params;

    await MessageService.leaveConversation(id, req.user.userId);

    res.status(200).json({
      success: true,
      data: { message: 'Left conversation successfully' },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/messages/stats
   * メッセージング統計を取得
   */
  public static getMessageStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    const conversationsResult = await MessageService.getUserConversations({
      userId: req.user.userId,
    });

    const totalUnreadCount = conversationsResult.conversations.reduce(
      (sum, conv) => sum + (conv.unreadCount || 0), 
      0
    );

    const stats = {
      totalConversations: conversationsResult.total,
      directConversations: conversationsResult.conversations.filter(c => c.type === 'direct').length,
      groupConversations: conversationsResult.conversations.filter(c => c.type === 'group').length,
      totalUnreadMessages: totalUnreadCount,
    };

    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  });
}