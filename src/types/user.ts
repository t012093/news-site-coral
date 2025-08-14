// 拡張されたユーザー型定義

export interface MembershipInfo {
  type: 'general' | 'supporting' | 'regular' | 'director';
  id: string;
  joinDate: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'suspended';
  benefits: string[];
  lastPaymentDate?: string;
  nextPaymentDate?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    postalCode: string;
    prefecture: string;
    city: string;
    street: string;
  };
  skills: string[];
  interests: string[];
  occupation?: string;
  organization?: string;
}

export interface UserPreferences {
  language: 'ja' | 'en';
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    categories: {
      events: boolean;
      newsletter: boolean;
      projects: boolean;
      system: boolean;
    };
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  trustedDevices: Array<{
    id: string;
    name: string;
    lastUsed: string;
    userAgent: string;
  }>;
  lastPasswordChange: string;
  loginSessions: Array<{
    id: string;
    device: string;
    location: string;
    lastActive: string;
    current: boolean;
  }>;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'paypal';
  lastFour?: string;
  expiryDate?: string;
  brand?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentHistory {
  id: string;
  type: 'membership' | 'donation' | 'event' | 'other';
  amount: number;
  currency: 'JPY';
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  description: string;
  receiptUrl?: string;
  taxDeductible: boolean;
  invoiceNumber?: string;
}

export interface ActivityHistory {
  id: string;
  type: 'project' | 'event' | 'volunteer';
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  hoursContributed?: number;
  certificateUrl?: string;
  skills: string[];
  location?: string;
  organizer?: string;
}

export interface BookmarkItem {
  id: string;
  type: 'article' | 'project' | 'event';
  title: string;
  url: string;
  description?: string;
  createdAt: string;
  tags: string[];
}

export interface ExtendedUser {
  // 基本情報（既存）
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  
  // 拡張情報
  membershipInfo: MembershipInfo;
  personalInfo: PersonalInfo;
  preferences: UserPreferences;
  security: SecuritySettings;
  paymentMethods: PaymentMethod[];
  paymentHistory: PaymentHistory[];
  activityHistory: ActivityHistory[];
  bookmarks: BookmarkItem[];
  
  // 統計情報
  stats: {
    totalProjectsJoined: number;
    totalEventsAttended: number;
    totalVolunteerHours: number;
    contributionScore: number;
    memberSince: string;
  };
}

// ユーティリティ型
export type MembershipType = MembershipInfo['type'];
export type PaymentType = PaymentHistory['type'];
export type ActivityType = ActivityHistory['type'];
export type BookmarkType = BookmarkItem['type'];

// 会員タイプ表示用のマッピング
export const MEMBERSHIP_TYPE_LABELS: Record<MembershipType, string> = {
  general: '一般会員',
  supporting: '賛助会員', 
  regular: '正会員',
  director: '理事'
};

// 支払いタイプ表示用のマッピング
export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  membership: '年会費',
  donation: '寄付金',
  event: 'イベント参加費',
  other: 'その他'
};

// 活動タイプ表示用のマッピング
export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  project: 'プロジェクト',
  event: 'イベント',
  volunteer: 'ボランティア'
};