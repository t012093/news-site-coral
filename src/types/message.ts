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

export interface MessageUser {
  id: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  users: Record<string, MessageUser>;
  unreadTotal: number;
  isLoading: boolean;
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

export interface MessageStats {
  totalConversations: number;
  directConversations: number;
  groupConversations: number;
  totalUnreadMessages: number;
}

export interface SendMessageData {
  conversationId?: string;
  receiverId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file';
  replyTo?: string;
}

export interface MessageNotification {
  id: string;
  type: 'new_message' | 'message_read' | 'user_online' | 'user_offline';
  data: any;
  timestamp: string;
}

export interface TypingIndicator {
  userId: string;
  conversationId: string;
  timestamp: string;
}

export interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  timestamp: string;
}

export interface OnlineUsers {
  onlineUsers: string[];
  timestamp: string;
}