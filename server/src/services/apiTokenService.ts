import crypto from 'crypto';
import { Pool } from 'pg';
import { pool } from '@/config/database';
import { ApiToken, CreateApiTokenRequest, CreateApiTokenResponse } from '@/types';
import { CustomError } from '@/middleware/errorHandler';

export class ApiTokenService {
  private static readonly TOKEN_LENGTH = 64;
  private static readonly TOKEN_PREFIX = 'nst_';

  /**
   * Generate a secure random API token
   */
  private static generateToken(): { token: string; hash: string } {
    const randomBytes = crypto.randomBytes(this.TOKEN_LENGTH);
    const token = this.TOKEN_PREFIX + randomBytes.toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    
    return { token, hash };
  }

  /**
   * Hash an API token for storage
   */
  public static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Create a new API token for a user
   */
  public static async createApiToken(
    userId: string,
    tokenData: CreateApiTokenRequest
  ): Promise<CreateApiTokenResponse> {
    const { token, hash } = this.generateToken();
    const { name, description, expiresAt, scope = ['read', 'write'] } = tokenData;

    const query = `
      INSERT INTO api_tokens (user_id, token_hash, name, description, scope, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, name, description, scope, is_active, expires_at, created_at, updated_at
    `;

    const values = [
      userId,
      hash,
      name,
      description || null,
      scope,
      expiresAt ? new Date(expiresAt) : null,
    ];

    try {
      const result = await pool.query(query, values);
      const tokenInfo = result.rows[0];

      return {
        token,
        tokenInfo: {
          id: tokenInfo.id,
          userId: tokenInfo.user_id,
          name: tokenInfo.name,
          description: tokenInfo.description,
          scope: tokenInfo.scope,
          isActive: tokenInfo.is_active,
          expiresAt: tokenInfo.expires_at?.toISOString(),
          createdAt: tokenInfo.created_at.toISOString(),
          updatedAt: tokenInfo.updated_at.toISOString(),
        },
      };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new CustomError('Token name already exists for this user', 400);
      }
      throw new CustomError('Failed to create API token', 500);
    }
  }

  /**
   * Get all API tokens for a user (excluding token hashes)
   */
  public static async getUserApiTokens(userId: string): Promise<Omit<ApiToken, 'tokenHash'>[]> {
    const query = `
      SELECT id, user_id, name, description, scope, is_active, 
             expires_at, last_used_at, last_used_ip, created_at, updated_at
      FROM api_tokens
      WHERE user_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `;

    try {
      const result = await pool.query(query, [userId]);
      
      return result.rows.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        description: row.description,
        scope: row.scope,
        isActive: row.is_active,
        expiresAt: row.expires_at?.toISOString(),
        lastUsedAt: row.last_used_at?.toISOString(),
        lastUsedIp: row.last_used_ip,
        createdAt: row.created_at.toISOString(),
        updatedAt: row.updated_at.toISOString(),
      }));
    } catch (error) {
      throw new CustomError('Failed to retrieve API tokens', 500);
    }
  }

  /**
   * Revoke (deactivate) an API token
   */
  public static async revokeApiToken(userId: string, tokenId: string): Promise<void> {
    const query = `
      UPDATE api_tokens 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2 AND is_active = true
    `;

    try {
      const result = await pool.query(query, [tokenId, userId]);
      
      if (result.rowCount === 0) {
        throw new CustomError('API token not found or already revoked', 404);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to revoke API token', 500);
    }
  }

  /**
   * Validate an API token and return user information
   */
  public static async validateApiToken(token: string): Promise<{
    userId: string;
    email: string;
    role: string;
    tokenId: string;
  } | null> {
    const hash = this.hashToken(token);
    
    const query = `
      SELECT t.id as token_id, t.user_id, t.expires_at, u.email, u.role
      FROM api_tokens t
      JOIN users u ON t.user_id = u.id
      WHERE t.token_hash = $1 AND t.is_active = true AND u.is_active = true
    `;

    try {
      const result = await pool.query(query, [hash]);
      
      if (result.rowCount === 0) {
        return null;
      }

      const tokenData = result.rows[0];
      
      // Check if token is expired
      if (tokenData.expires_at && new Date() > new Date(tokenData.expires_at)) {
        // Automatically deactivate expired token
        await this.deactivateExpiredToken(tokenData.token_id);
        return null;
      }

      // Update last used timestamp and IP
      await this.updateTokenUsage(tokenData.token_id);

      return {
        userId: tokenData.user_id,
        email: tokenData.email,
        role: tokenData.role,
        tokenId: tokenData.token_id,
      };
    } catch (error) {
      console.error('Error validating API token:', error);
      return null;
    }
  }

  /**
   * Update token usage statistics
   */
  private static async updateTokenUsage(tokenId: string, ip?: string): Promise<void> {
    const query = `
      UPDATE api_tokens 
      SET last_used_at = CURRENT_TIMESTAMP, last_used_ip = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    
    try {
      await pool.query(query, [tokenId, ip || null]);
    } catch (error) {
      // Log error but don't throw - usage tracking is not critical
      console.error('Error updating token usage:', error);
    }
  }

  /**
   * Deactivate expired token
   */
  private static async deactivateExpiredToken(tokenId: string): Promise<void> {
    const query = `
      UPDATE api_tokens 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    
    try {
      await pool.query(query, [tokenId]);
    } catch (error) {
      console.error('Error deactivating expired token:', error);
    }
  }

  /**
   * Clean up expired tokens (should be run periodically)
   */
  public static async cleanupExpiredTokens(): Promise<number> {
    const query = `
      UPDATE api_tokens 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE expires_at < CURRENT_TIMESTAMP AND is_active = true
    `;

    try {
      const result = await pool.query(query);
      return result.rowCount || 0;
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
      return 0;
    }
  }
}