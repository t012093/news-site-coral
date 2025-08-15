import { Message, Conversation, ConversationParticipant, MessageType } from '@/types';
import { createError } from '@/middleware/errorHandler';
import { generateId } from '@/utils/generateId';

// Mock data for conversations and messages
const conversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    title: undefined,
    lastMessageId: 'msg-1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
  },
  {
    id: 'conv-2',
    type: 'group',
    title: 'プロジェクトチーム',
    lastMessageId: 'msg-3',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
  },
];

const conversationParticipants: ConversationParticipant[] = [
  {
    id: 'cp-1',
    conversationId: 'conv-1',
    userId: '550e8400-e29b-41d4-a716-446655440002',
    joinedAt: '2024-01-15T00:00:00Z',
    lastReadMessageId: 'msg-1',
    unreadCount: 0,
    isMuted: false,
  },
  {
    id: 'cp-2',
    conversationId: 'conv-1',
    userId: 'user-2',
    joinedAt: '2024-01-15T00:00:00Z',
    lastReadMessageId: 'msg-1',
    unreadCount: 0,
    isMuted: false,
  },
  {
    id: 'cp-3',
    conversationId: 'conv-2',
    userId: '550e8400-e29b-41d4-a716-446655440002',
    joinedAt: '2024-01-10T00:00:00Z',
    lastReadMessageId: 'msg-2',
    unreadCount: 1,
    isMuted: false,
  },
  {
    id: 'cp-4',
    conversationId: 'conv-2',
    userId: 'user-2',
    joinedAt: '2024-01-10T00:00:00Z',
    lastReadMessageId: 'msg-3',
    unreadCount: 0,
    isMuted: false,
  },
  {
    id: 'cp-5',
    conversationId: 'conv-2',
    userId: 'user-3',
    joinedAt: '2024-01-10T00:00:00Z',
    lastReadMessageId: 'msg-2',
    unreadCount: 1,
    isMuted: false,
  },
];

const messages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'おはようございます！今日のミーティングの件でご連絡しました。',
    messageType: 'text',
    isEdited: false,
    createdAt: '2024-01-15T09:30:00Z',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-2',
    senderId: 'user-2',
    content: 'プロジェクトの進捗を共有します。現在75%完了です。',
    messageType: 'text',
    isEdited: false,
    createdAt: '2024-01-15T13:15:00Z',
  },
  {
    id: 'msg-3',
    conversationId: 'conv-2',
    senderId: 'user-3',
    content: 'ありがとうございます！順調ですね。何かサポートが必要でしたらお声がけください。',
    messageType: 'text',
    isEdited: false,
    createdAt: '2024-01-15T14:20:00Z',
  },
];

export interface CreateMessageRequest {
  content: string;
  messageType?: MessageType;
  replyToId?: string;
  metadata?: any;
}

export interface CreateConversationRequest {
  type: 'direct' | 'group';
  title?: string;
  participantIds: string[];
}

export interface ConversationFilters {
  userId: string;
  type?: 'direct' | 'group';
  limit?: number;
  offset?: number;
}

export interface MessageFilters {
  conversationId: string;
  limit?: number;
  offset?: number;
  beforeMessageId?: string;
  afterMessageId?: string;
}

export interface ConversationWithDetails extends Conversation {
  participants?: ConversationParticipant[];
  unreadCount?: number;
  lastMessage?: Message;
}

export class MessageService {
  /**
   * ユーザーの会話一覧を取得
   */
  static async getUserConversations(filters: ConversationFilters): Promise<{
    conversations: ConversationWithDetails[];
    total: number;
  }> {
    try {
      // ユーザーが参加している会話を取得
      const userParticipations = conversationParticipants.filter(
        cp => cp.userId === filters.userId && !cp.leftAt
      );

      let userConversations = conversations.filter(conv =>
        userParticipations.some(cp => cp.conversationId === conv.id)
      );

      // タイプでフィルタリング
      if (filters.type) {
        userConversations = userConversations.filter(conv => conv.type === filters.type);
      }

      // 更新日時で並び替え（新しい順）
      userConversations.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      const total = userConversations.length;

      // ページング
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;
      const paginatedConversations = userConversations.slice(offset, offset + limit);

      // 詳細情報を追加
      const conversationsWithDetails: ConversationWithDetails[] = paginatedConversations.map(conv => {
        const participants = conversationParticipants.filter(cp => 
          cp.conversationId === conv.id && !cp.leftAt
        );
        
        const userParticipant = participants.find(cp => cp.userId === filters.userId);
        const unreadCount = userParticipant?.unreadCount || 0;
        
        const lastMessage = conv.lastMessageId 
          ? messages.find(msg => msg.id === conv.lastMessageId)
          : undefined;

        return {
          ...conv,
          participants,
          unreadCount,
          lastMessage,
        };
      });

      return {
        conversations: conversationsWithDetails,
        total,
      };
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw createError.internalError('Failed to retrieve conversations');
    }
  }

  /**
   * 会話のメッセージ一覧を取得
   */
  static async getConversationMessages(filters: MessageFilters): Promise<{
    messages: Message[];
    total: number;
  }> {
    try {
      let conversationMessages = messages.filter(msg => 
        msg.conversationId === filters.conversationId
      );

      // beforeMessageId または afterMessageId でフィルタリング
      if (filters.beforeMessageId) {
        const beforeMessage = messages.find(msg => msg.id === filters.beforeMessageId);
        if (beforeMessage) {
          const beforeTime = new Date(beforeMessage.createdAt).getTime();
          conversationMessages = conversationMessages.filter(msg => 
            new Date(msg.createdAt).getTime() < beforeTime
          );
        }
      }

      if (filters.afterMessageId) {
        const afterMessage = messages.find(msg => msg.id === filters.afterMessageId);
        if (afterMessage) {
          const afterTime = new Date(afterMessage.createdAt).getTime();
          conversationMessages = conversationMessages.filter(msg => 
            new Date(msg.createdAt).getTime() > afterTime
          );
        }
      }

      // 作成日時で並び替え（古い順）
      conversationMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const total = conversationMessages.length;

      // ページング
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;
      const paginatedMessages = conversationMessages.slice(offset, offset + limit);

      return {
        messages: paginatedMessages,
        total,
      };
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw createError.internalError('Failed to retrieve messages');
    }
  }

  /**
   * メッセージを送信
   */
  static async sendMessage(
    conversationId: string, 
    senderId: string, 
    messageData: CreateMessageRequest
  ): Promise<Message> {
    try {
      // 会話が存在するかチェック
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (!conversation) {
        throw createError.notFound('Conversation not found');
      }

      // ユーザーが会話の参加者かチェック
      const userParticipant = conversationParticipants.find(cp => 
        cp.conversationId === conversationId && cp.userId === senderId && !cp.leftAt
      );
      if (!userParticipant) {
        throw createError.forbidden('User is not a participant in this conversation');
      }

      const now = new Date().toISOString();
      const newMessage: Message = {
        id: generateId('msg'),
        conversationId,
        senderId,
        content: messageData.content,
        messageType: messageData.messageType || 'text',
        replyToId: messageData.replyToId,
        metadata: messageData.metadata,
        isEdited: false,
        createdAt: now,
      };

      messages.push(newMessage);

      // 会話の最後のメッセージIDと更新日時を更新
      const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);
      if (conversationIndex !== -1) {
        conversations[conversationIndex] = {
          ...conversations[conversationIndex],
          lastMessageId: newMessage.id,
          updatedAt: now,
        };
      }

      // 他の参加者の未読数を増加
      conversationParticipants.forEach((participant, index) => {
        if (participant.conversationId === conversationId && participant.userId !== senderId) {
          conversationParticipants[index] = {
            ...participant,
            unreadCount: participant.unreadCount + 1,
          };
        }
      });

      return newMessage;
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error sending message:', error);
      throw createError.internalError('Failed to send message');
    }
  }

  /**
   * 会話を作成
   */
  static async createConversation(
    creatorId: string,
    conversationData: CreateConversationRequest
  ): Promise<Conversation> {
    try {
      // ダイレクトメッセージの場合、既存の会話があるかチェック
      if (conversationData.type === 'direct') {
        if (conversationData.participantIds.length !== 2) {
          throw createError.badRequest('Direct conversation must have exactly 2 participants');
        }
        
        if (!conversationData.participantIds.includes(creatorId)) {
          conversationData.participantIds.push(creatorId);
        }

        // 既存のダイレクト会話をチェック
        const existingConversation = conversations.find(conv => {
          if (conv.type !== 'direct') return false;
          
          const participants = conversationParticipants.filter(cp => 
            cp.conversationId === conv.id && !cp.leftAt
          );
          
          const participantUserIds = participants.map(cp => cp.userId).sort();
          const requestedUserIds = conversationData.participantIds.sort();
          
          return participantUserIds.length === requestedUserIds.length &&
                 participantUserIds.every((id, index) => id === requestedUserIds[index]);
        });

        if (existingConversation) {
          return existingConversation;
        }
      }

      const now = new Date().toISOString();
      const newConversation: Conversation = {
        id: generateId('conv'),
        type: conversationData.type,
        title: conversationData.title,
        createdAt: now,
        updatedAt: now,
      };

      conversations.push(newConversation);

      // 参加者を追加
      conversationData.participantIds.forEach(userId => {
        const participant: ConversationParticipant = {
          id: generateId('cp'),
          conversationId: newConversation.id,
          userId,
          joinedAt: now,
          unreadCount: 0,
          isMuted: false,
        };
        conversationParticipants.push(participant);
      });

      return newConversation;
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error creating conversation:', error);
      throw createError.internalError('Failed to create conversation');
    }
  }

  /**
   * 会話を取得
   */
  static async getConversationById(
    conversationId: string, 
    userId: string
  ): Promise<ConversationWithDetails | null> {
    try {
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (!conversation) {
        return null;
      }

      // ユーザーが参加者かチェック
      const userParticipant = conversationParticipants.find(cp => 
        cp.conversationId === conversationId && cp.userId === userId && !cp.leftAt
      );
      if (!userParticipant) {
        throw createError.forbidden('User is not a participant in this conversation');
      }

      const participants = conversationParticipants.filter(cp => 
        cp.conversationId === conversationId && !cp.leftAt
      );
      
      const unreadCount = userParticipant.unreadCount;
      
      const lastMessage = conversation.lastMessageId 
        ? messages.find(msg => msg.id === conversation.lastMessageId)
        : undefined;

      return {
        ...conversation,
        participants,
        unreadCount,
        lastMessage,
      };
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error getting conversation:', error);
      throw createError.internalError('Failed to retrieve conversation');
    }
  }

  /**
   * メッセージを既読にする
   */
  static async markMessagesAsRead(
    conversationId: string,
    userId: string,
    messageId: string
  ): Promise<void> {
    try {
      const participantIndex = conversationParticipants.findIndex(cp => 
        cp.conversationId === conversationId && cp.userId === userId
      );

      if (participantIndex === -1) {
        throw createError.notFound('Participant not found');
      }

      conversationParticipants[participantIndex] = {
        ...conversationParticipants[participantIndex],
        lastReadMessageId: messageId,
        unreadCount: 0,
      };
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error marking messages as read:', error);
      throw createError.internalError('Failed to mark messages as read');
    }
  }

  /**
   * 会話の参加者を追加
   */
  static async addParticipant(
    conversationId: string,
    userId: string,
    addedUserId: string
  ): Promise<ConversationParticipant> {
    try {
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (!conversation) {
        throw createError.notFound('Conversation not found');
      }

      if (conversation.type === 'direct') {
        throw createError.badRequest('Cannot add participants to direct conversations');
      }

      // 既に参加者かチェック
      const existingParticipant = conversationParticipants.find(cp => 
        cp.conversationId === conversationId && cp.userId === addedUserId && !cp.leftAt
      );
      if (existingParticipant) {
        throw createError.conflict('User is already a participant');
      }

      const newParticipant: ConversationParticipant = {
        id: generateId('cp'),
        conversationId,
        userId: addedUserId,
        joinedAt: new Date().toISOString(),
        unreadCount: 0,
        isMuted: false,
      };

      conversationParticipants.push(newParticipant);
      return newParticipant;
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error adding participant:', error);
      throw createError.internalError('Failed to add participant');
    }
  }

  /**
   * 会話から離脱
   */
  static async leaveConversation(conversationId: string, userId: string): Promise<void> {
    try {
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (!conversation) {
        throw createError.notFound('Conversation not found');
      }

      if (conversation.type === 'direct') {
        throw createError.badRequest('Cannot leave direct conversations');
      }

      const participantIndex = conversationParticipants.findIndex(cp => 
        cp.conversationId === conversationId && cp.userId === userId && !cp.leftAt
      );

      if (participantIndex === -1) {
        throw createError.notFound('Participant not found');
      }

      conversationParticipants[participantIndex] = {
        ...conversationParticipants[participantIndex],
        leftAt: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      console.error('Error leaving conversation:', error);
      throw createError.internalError('Failed to leave conversation');
    }
  }
}