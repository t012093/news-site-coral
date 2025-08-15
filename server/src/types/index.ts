// User types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'member' | 'viewer';

export interface UserPreferences {
  notifications: {
    eventReminders: boolean;
    newsletter: boolean;
    eventRecommendations: boolean;
  };
  privacy: {
    showProfile: boolean;
    showEventHistory: boolean;
  };
}

// Auth types
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Task types
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'development' | 'design' | 'marketing' | 'content' | 'research' | 'meeting' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  projectId: string;
  assignedTo?: string;
  createdBy: string;
  parentTaskId?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours: number;
  completedAt?: string;
  isArchived: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Project types
export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'cancelled';
export type ProjectMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
  joinedAt: string;
}

// Message types
export type MessageType = 'text' | 'image' | 'file' | 'system';
export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  replyToId?: string;
  metadata?: any;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  title?: string;
  lastMessageId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: string;
  leftAt?: string;
  lastReadMessageId?: string;
  unreadCount: number;
  isMuted: boolean;
}

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  timestamp: string;
}

// Task request types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  projectId: string;
  assignedTo?: string;
  parentTaskId?: string;
  dueDate?: Date | string;
  estimatedHours?: number;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  category?: TaskCategory;
  assignedTo?: string;
  parentTaskId?: string;
  dueDate?: Date | string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}

// Database query types
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
  where?: Record<string, any>;
}