import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://news-site-coral-production.up.railway.app/api';

const messageAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// リクエストインターセプターで認証ヘッダーを追加
messageAPI.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプターでエラーハンドリング
messageAPI.interceptors.response.use(
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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  senderId: string;
  conversationId: string;
  replyToId?: string;
  createdAt: Date;
  updatedAt: Date;
  readBy: Array<{
    userId: string;
    readAt: Date;
  }>;
  sender: User;
  replyTo?: Message;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  participants: Array<{
    id: string;
    userId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
    user: User;
  }>;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface CreateConversationRequest {
  type: 'direct' | 'group';
  title?: string;
  description?: string;
  participantIds: string[];
}

export interface CreateMessageRequest {
  content: string;
  messageType?: 'text' | 'image' | 'file';
  replyToId?: string;
}

export interface ConversationFilters {
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

// 会話一覧取得
export const getConversations = async (filters?: ConversationFilters): Promise<{
  conversations: Conversation[];
  total: number;
}> => {
  try {
    const params: any = {};
    
    if (filters?.type) params.type = filters.type;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.offset) params.offset = filters.offset;

    const response = await messageAPI.get('/messages/conversations', { params });
    
    const apiResponse = response.data;
    const conversations = (apiResponse.data || []).map((conversation: any) => ({
      ...conversation,
      createdAt: new Date(conversation.createdAt),
      updatedAt: new Date(conversation.updatedAt),
      participants: conversation.participants?.map((p: any) => ({
        ...p,
        joinedAt: new Date(p.joinedAt),
      })) || [],
      lastMessage: conversation.lastMessage ? {
        ...conversation.lastMessage,
        createdAt: new Date(conversation.lastMessage.createdAt),
        updatedAt: new Date(conversation.lastMessage.updatedAt),
      } : undefined,
    }));

    return {
      conversations,
      total: apiResponse.meta?.total || conversations.length,
    };
  } catch (error: any) {
    console.error('Failed to fetch conversations:', error);
    const errorMessage = error.response?.data?.message || '会話一覧の取得に失敗しました';
    throw new Error(errorMessage);
  }
};

// 会話詳細取得
export const getConversation = async (id: string): Promise<Conversation> => {
  try {
    const response = await messageAPI.get(`/messages/conversations/${id}`);
    
    const conversation = response.data.data;
    return {
      ...conversation,
      createdAt: new Date(conversation.createdAt),
      updatedAt: new Date(conversation.updatedAt),
      participants: conversation.participants?.map((p: any) => ({
        ...p,
        joinedAt: new Date(p.joinedAt),
      })) || [],
      lastMessage: conversation.lastMessage ? {
        ...conversation.lastMessage,
        createdAt: new Date(conversation.lastMessage.createdAt),
        updatedAt: new Date(conversation.lastMessage.updatedAt),
      } : undefined,
    };
  } catch (error: any) {
    console.error('Failed to fetch conversation:', error);
    const errorMessage = error.response?.data?.message || '会話の取得に失敗しました';
    throw new Error(errorMessage);
  }
};

// 会話作成
export const createConversation = async (data: CreateConversationRequest): Promise<Conversation> => {
  try {
    const response = await messageAPI.post('/messages/conversations', data);

    const conversation = response.data.data;
    return {
      ...conversation,
      createdAt: new Date(conversation.createdAt),
      updatedAt: new Date(conversation.updatedAt),
      participants: conversation.participants?.map((p: any) => ({
        ...p,
        joinedAt: new Date(p.joinedAt),
      })) || [],
    };
  } catch (error: any) {
    console.error('Failed to create conversation:', error);
    const errorMessage = error.response?.data?.message || '会話の作成に失敗しました';
    throw new Error(errorMessage);
  }
};

// メッセージ一覧取得
export const getMessages = async (filters: MessageFilters): Promise<{
  messages: Message[];
  total: number;
}> => {
  try {
    const params: any = {};
    
    if (filters.limit) params.limit = filters.limit;
    if (filters.offset) params.offset = filters.offset;
    if (filters.beforeMessageId) params.beforeMessageId = filters.beforeMessageId;
    if (filters.afterMessageId) params.afterMessageId = filters.afterMessageId;

    const response = await messageAPI.get(`/messages/conversations/${filters.conversationId}/messages`, { params });
    
    const apiResponse = response.data;
    const messages = (apiResponse.data || []).map((message: any) => ({
      ...message,
      createdAt: new Date(message.createdAt),
      updatedAt: new Date(message.updatedAt),
      readBy: message.readBy?.map((r: any) => ({
        ...r,
        readAt: new Date(r.readAt),
      })) || [],
      replyTo: message.replyTo ? {
        ...message.replyTo,
        createdAt: new Date(message.replyTo.createdAt),
        updatedAt: new Date(message.replyTo.updatedAt),
      } : undefined,
    }));

    return {
      messages,
      total: apiResponse.meta?.total || messages.length,
    };
  } catch (error: any) {
    console.error('Failed to fetch messages:', error);
    const errorMessage = error.response?.data?.message || 'メッセージの取得に失敗しました';
    throw new Error(errorMessage);
  }
};

// メッセージ送信
export const sendMessage = async (conversationId: string, data: CreateMessageRequest): Promise<Message> => {
  try {
    const response = await messageAPI.post(`/messages/conversations/${conversationId}/messages`, data);

    const message = response.data.data;
    return {
      ...message,
      createdAt: new Date(message.createdAt),
      updatedAt: new Date(message.updatedAt),
      readBy: message.readBy?.map((r: any) => ({
        ...r,
        readAt: new Date(r.readAt),
      })) || [],
      replyTo: message.replyTo ? {
        ...message.replyTo,
        createdAt: new Date(message.replyTo.createdAt),
        updatedAt: new Date(message.replyTo.updatedAt),
      } : undefined,
    };
  } catch (error: any) {
    console.error('Failed to send message:', error);
    const errorMessage = error.response?.data?.message || 'メッセージの送信に失敗しました';
    throw new Error(errorMessage);
  }
};

// メッセージを既読にマーク
export const markAsRead = async (conversationId: string, messageId: string): Promise<void> => {
  try {
    await messageAPI.patch(`/messages/conversations/${conversationId}/read`, {
      messageId,
    });
  } catch (error: any) {
    console.error('Failed to mark messages as read:', error);
    const errorMessage = error.response?.data?.message || 'メッセージの既読マークに失敗しました';
    throw new Error(errorMessage);
  }
};

// 会話に参加者を追加
export const addParticipant = async (conversationId: string, userId: string): Promise<void> => {
  try {
    await messageAPI.post(`/messages/conversations/${conversationId}/participants`, {
      userId,
    });
  } catch (error: any) {
    console.error('Failed to add participant:', error);
    const errorMessage = error.response?.data?.message || '参加者の追加に失敗しました';
    throw new Error(errorMessage);
  }
};

// 会話から離脱
export const leaveConversation = async (conversationId: string): Promise<void> => {
  try {
    await messageAPI.delete(`/messages/conversations/${conversationId}/participants`);
  } catch (error: any) {
    console.error('Failed to leave conversation:', error);
    const errorMessage = error.response?.data?.message || '会話からの離脱に失敗しました';
    throw new Error(errorMessage);
  }
};

// メッセージング統計取得
export const getMessageStats = async (): Promise<{
  totalConversations: number;
  directConversations: number;
  groupConversations: number;
  totalUnreadMessages: number;
}> => {
  try {
    const response = await messageAPI.get('/messages/stats');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch message stats:', error);
    const errorMessage = error.response?.data?.message || 'メッセージ統計の取得に失敗しました';
    throw new Error(errorMessage);
  }
};