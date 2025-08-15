import { pool } from '@/config/database';
import { User, RegisterData, QueryOptions } from '@/types';
import { PasswordManager } from '@/utils/password';
import { createError } from '@/middleware/errorHandler';

export class UserService {
  /**
   * Create a new user
   */
  public static async createUser(userData: RegisterData): Promise<User> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check if email already exists
      const emailCheck = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [userData.email]
      );

      if (emailCheck.rows.length > 0) {
        throw createError.conflict('Email already registered');
      }

      // Check if username already exists
      const usernameCheck = await client.query(
        'SELECT id FROM users WHERE username = $1',
        [userData.username]
      );

      if (usernameCheck.rows.length > 0) {
        throw createError.conflict('Username already taken');
      }

      // Validate password strength
      const passwordValidation = PasswordManager.validatePasswordStrength(userData.password);
      if (!passwordValidation.isValid) {
        throw createError.badRequest(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      // Hash password
      const passwordHash = await PasswordManager.hashPassword(userData.password);

      // Generate verification token
      const verificationToken = PasswordManager.generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Insert user
      const result = await client.query(`
        INSERT INTO users (
          email, password_hash, username, display_name, 
          verification_token, verification_token_expires
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, username, display_name, avatar_url, bio, role, 
                  is_active, email_verified, preferences, created_at, updated_at
      `, [
        userData.email,
        passwordHash,
        userData.username,
        userData.displayName,
        verificationToken,
        verificationExpires
      ]);

      await client.query('COMMIT');

      const user = result.rows[0];
      return this.mapDbUserToUser(user);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Find user by email
   */
  public static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(`
      SELECT id, email, username, display_name, avatar_url, bio, role,
             is_active, email_verified, preferences, created_at, updated_at,
             password_hash
      FROM users 
      WHERE email = $1 AND is_active = true
    `, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapDbUserToUser(result.rows[0]);
  }

  /**
   * Find user by ID
   */
  public static async findById(id: string): Promise<User | null> {
    const result = await pool.query(`
      SELECT id, email, username, display_name, avatar_url, bio, role,
             is_active, email_verified, preferences, created_at, updated_at
      FROM users 
      WHERE id = $1 AND is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapDbUserToUser(result.rows[0]);
  }

  /**
   * Find user by username
   */
  public static async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query(`
      SELECT id, email, username, display_name, avatar_url, bio, role,
             is_active, email_verified, preferences, created_at, updated_at
      FROM users 
      WHERE username = $1 AND is_active = true
    `, [username]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapDbUserToUser(result.rows[0]);
  }

  /**
   * Verify user password
   */
  public static async verifyPassword(email: string, password: string): Promise<{ isValid: boolean; user?: User }> {
    const result = await pool.query(`
      SELECT id, email, username, display_name, avatar_url, bio, role,
             is_active, email_verified, preferences, created_at, updated_at,
             password_hash
      FROM users 
      WHERE email = $1 AND is_active = true
    `, [email]);

    if (result.rows.length === 0) {
      return { isValid: false };
    }

    const user = result.rows[0];
    const isValid = await PasswordManager.verifyPassword(password, user.password_hash);

    if (!isValid) {
      return { isValid: false };
    }

    return {
      isValid: true,
      user: this.mapDbUserToUser(user)
    };
  }

  /**
   * Update user profile
   */
  public static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Build update query dynamically
      const allowedFields = ['display_name', 'avatar_url', 'bio', 'preferences'];
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (allowedFields.includes(key) && value !== undefined) {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      if (updateFields.length === 0) {
        throw createError.badRequest('No valid fields to update');
      }

      // Add updated_at
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      
      const query = `
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex} AND is_active = true
        RETURNING id, email, username, display_name, avatar_url, bio, role,
                  is_active, email_verified, preferences, created_at, updated_at
      `;
      
      values.push(id);

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw createError.notFound('User not found');
      }

      await client.query('COMMIT');

      return this.mapDbUserToUser(result.rows[0]);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update user online status
   */
  public static async updateOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    await pool.query(`
      UPDATE users 
      SET is_online = $1, last_seen = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [isOnline, id]);
  }

  /**
   * Get users list with pagination
   */
  public static async getUsers(options: QueryOptions = {}): Promise<{ users: User[]; total: number }> {
    const { limit = 20, offset = 0, orderBy = 'created_at', order = 'DESC' } = options;

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM users WHERE is_active = true'
    );
    const total = parseInt(countResult.rows[0].count);

    // Get users
    const result = await pool.query(`
      SELECT id, email, username, display_name, avatar_url, bio, role,
             is_active, email_verified, preferences, created_at, updated_at,
             is_online, last_seen
      FROM users 
      WHERE is_active = true
      ORDER BY ${orderBy} ${order}
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const users = result.rows.map(row => this.mapDbUserToUser(row));

    return { users, total };
  }

  /**
   * Search users
   */
  public static async searchUsers(searchTerm: string, options: QueryOptions = {}): Promise<{ users: User[]; total: number }> {
    const { limit = 20, offset = 0 } = options;

    const searchPattern = `%${searchTerm}%`;

    // Get total count
    const countResult = await pool.query(`
      SELECT COUNT(*) FROM users 
      WHERE is_active = true 
      AND (username ILIKE $1 OR display_name ILIKE $1 OR email ILIKE $1)
    `, [searchPattern]);
    const total = parseInt(countResult.rows[0].count);

    // Get users
    const result = await pool.query(`
      SELECT id, email, username, display_name, avatar_url, bio, role,
             is_active, email_verified, preferences, created_at, updated_at,
             is_online, last_seen
      FROM users 
      WHERE is_active = true 
      AND (username ILIKE $1 OR display_name ILIKE $1 OR email ILIKE $1)
      ORDER BY 
        CASE 
          WHEN username ILIKE $1 THEN 1
          WHEN display_name ILIKE $1 THEN 2
          ELSE 3
        END,
        display_name ASC
      LIMIT $2 OFFSET $3
    `, [searchPattern, limit, offset]);

    const users = result.rows.map(row => this.mapDbUserToUser(row));

    return { users, total };
  }

  /**
   * Map database user row to User type
   */
  private static mapDbUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      displayName: dbUser.display_name,
      avatar: dbUser.avatar_url,
      bio: dbUser.bio,
      role: dbUser.role,
      isActive: dbUser.is_active,
      emailVerified: dbUser.email_verified,
      preferences: dbUser.preferences || {
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
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
    };
  }
}