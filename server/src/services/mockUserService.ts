import { User, RegisterData, QueryOptions } from '@/types';
import { PasswordManager } from '@/utils/password';
import { createError } from '@/middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

// In-memory user storage
let users: (User & { password_hash?: string })[] = [];

// Initialize mock users
const initializeMockUsers = () => {
  if (users.length > 0) return; // Already initialized

  const mockUsers = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@coral.com',
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdPu7/K1Gv3KXGG', // password123
      username: 'admin',
      displayName: 'システム管理者',
      avatar: '/images/admin.png',
      bio: 'CORALシステムの管理者です',
      role: 'admin' as const,
      isActive: true,
      emailVerified: true,
      preferences: {
        notifications: {
          eventReminders: true,
          newsletter: true,
          eventRecommendations: true,
        },
        privacy: {
          showProfile: true,
          showEventHistory: true,
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'demo@coral.com',
      password_hash: '$2b$12$egFBOC7uZYaJd0mV5DNhOOkGdjRndAVHu/AzH99kQ9JPw7VutClJG', // demo123
      username: 'demo_user',
      displayName: 'デモユーザー',
      avatar: '/images/man.png',
      bio: 'CORALコミュニティのデモユーザーです',
      role: 'member' as const,
      isActive: true,
      emailVerified: true,
      preferences: {
        notifications: {
          eventReminders: true,
          newsletter: true,
          eventRecommendations: true,
        },
        privacy: {
          showProfile: true,
          showEventHistory: true,
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  users = mockUsers;
};

export class MockUserService {
  /**
   * Create a new user
   */
  public static async createUser(userData: RegisterData): Promise<User> {
    initializeMockUsers();

    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw createError.conflict('Email already registered');
    }

    // Check if username already exists
    if (users.some(u => u.username === userData.username)) {
      throw createError.conflict('Username already taken');
    }

    // Validate password strength
    const passwordValidation = PasswordManager.validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      throw createError.badRequest(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Hash password
    const passwordHash = await PasswordManager.hashPassword(userData.password);

    const newUser: User & { password_hash?: string } = {
      id: uuidv4(),
      email: userData.email,
      password_hash: passwordHash,
      username: userData.username,
      displayName: userData.displayName,
      avatar: undefined,
      bio: undefined,
      role: 'member',
      isActive: true,
      emailVerified: false,
      preferences: {
        notifications: {
          eventReminders: true,
          newsletter: true,
          eventRecommendations: true,
        },
        privacy: {
          showProfile: true,
          showEventHistory: true,
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Find user by email
   */
  public static async findByEmail(email: string): Promise<User | null> {
    initializeMockUsers();
    
    const user = users.find(u => u.email === email && u.isActive);
    if (!user) return null;

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user by email (alias for findByEmail)
   */
  public static async getUserByEmail(email: string): Promise<User | null> {
    return this.findByEmail(email);
  }

  /**
   * Find user by ID
   */
  public static async findById(id: string): Promise<User | null> {
    initializeMockUsers();
    
    const user = users.find(u => u.id === id && u.isActive);
    if (!user) return null;

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find user by username
   */
  public static async findByUsername(username: string): Promise<User | null> {
    initializeMockUsers();
    
    const user = users.find(u => u.username === username && u.isActive);
    if (!user) return null;

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Verify user password
   */
  public static async verifyPassword(email: string, password: string): Promise<{ isValid: boolean; user?: User }> {
    initializeMockUsers();
    
    const user = users.find(u => u.email === email && u.isActive);
    if (!user) {
      return { isValid: false };
    }

    const isValid = await PasswordManager.verifyPassword(password, user.password_hash!);

    if (!isValid) {
      return { isValid: false };
    }

    const { password_hash, ...userWithoutPassword } = user;
    return {
      isValid: true,
      user: userWithoutPassword
    };
  }

  /**
   * Update user profile
   */
  public static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    initializeMockUsers();
    
    const userIndex = users.findIndex(u => u.id === id && u.isActive);
    if (userIndex === -1) {
      throw createError.notFound('User not found');
    }

    const user = users[userIndex];
    
    // Update allowed fields
    const allowedFields = ['displayName', 'avatar', 'bio', 'preferences'];
    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key) && value !== undefined) {
        (user as any)[key] = value;
      }
    });

    user.updatedAt = new Date().toISOString();
    users[userIndex] = user;

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user password
   */
  public static async updatePassword(email: string, newPassword: string): Promise<void> {
    initializeMockUsers();

    // Validate password strength
    const passwordValidation = PasswordManager.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw createError.badRequest(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Find user
    const userIndex = users.findIndex(u => u.email === email && u.isActive);
    if (userIndex === -1) {
      throw createError.notFound('User not found');
    }

    // Hash new password
    const passwordHash = await PasswordManager.hashPassword(newPassword);

    // Update password
    users[userIndex].password_hash = passwordHash;
    users[userIndex].updatedAt = new Date().toISOString();

    console.log(`✅ Mock: Password updated for user ${email}`);
  }

  /**
   * Update user online status
   */
  public static async updateOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    initializeMockUsers();

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      // Mock implementation - we don't track online status in memory store
      console.log(`User ${id} online status updated to: ${isOnline}`);
    }
  }

  /**
   * Get users list with pagination
   */
  public static async getUsers(options: QueryOptions = {}): Promise<{ users: User[]; total: number }> {
    initializeMockUsers();
    
    const { limit = 20, offset = 0 } = options;
    const activeUsers = users.filter(u => u.isActive);
    
    const total = activeUsers.length;
    const paginatedUsers = activeUsers
      .slice(offset, offset + limit)
      .map(({ password_hash, ...user }) => user);

    return { users: paginatedUsers, total };
  }

  /**
   * Search users
   */
  public static async searchUsers(searchTerm: string, options: QueryOptions = {}): Promise<{ users: User[]; total: number }> {
    initializeMockUsers();
    
    const { limit = 20, offset = 0 } = options;
    const searchLower = searchTerm.toLowerCase();
    
    const matchingUsers = users.filter(u => 
      u.isActive && (
        u.username.toLowerCase().includes(searchLower) ||
        u.displayName.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      )
    );

    const total = matchingUsers.length;
    const paginatedUsers = matchingUsers
      .slice(offset, offset + limit)
      .map(({ password_hash, ...user }) => user);

    return { users: paginatedUsers, total };
  }
}