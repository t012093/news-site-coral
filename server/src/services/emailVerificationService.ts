import { pool } from '@/config/database';
import { emailService } from '@/services/emailService';
import { CustomError } from '@/middleware/errorHandler';

export interface VerificationCodeData {
  id: string;
  email: string;
  code: string;
  purpose: 'login' | 'register' | 'password_reset';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  expiresAt: Date;
  isUsed: boolean;
  isActive: boolean;
}

export class EmailVerificationService {
  private static readonly CODE_EXPIRY_MINUTES = 10;
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly RATE_LIMIT_MINUTES = 1; // Minimum time between code requests

  /**
   * Generate and send a 6-digit verification code
   */
  public static async sendVerificationCode(
    email: string,
    purpose: 'login' | 'register' | 'password_reset' = 'login',
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; expiresIn: number }> {
    try {
      // Check rate limiting
      await this.checkRateLimit(email, purpose);

      // Deactivate any existing active codes for this email and purpose
      await this.deactivateExistingCodes(email, purpose);

      // Generate new code
      const code = this.generateSixDigitCode();
      const expiresAt = new Date(Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000);

      // Store in database
      const query = `
        INSERT INTO email_verification_codes 
        (email, code, purpose, expires_at, ip_address, user_agent, max_attempts)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, expires_at
      `;

      const values = [
        email,
        code,
        purpose,
        expiresAt,
        ipAddress || null,
        userAgent || null,
        this.MAX_ATTEMPTS
      ];

      const result = await pool.query(query, values);

      // Send email
      await emailService.sendVerificationCode(email, code, purpose);

      console.log(`📧 Verification code sent to ${email} for ${purpose}`);

      return {
        success: true,
        expiresIn: this.CODE_EXPIRY_MINUTES * 60 // seconds
      };
    } catch (error) {
      console.error('Error sending verification code:', error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('認証コードの送信に失敗しました', 500);
    }
  }

  /**
   * Verify a 6-digit code
   */
  public static async verifyCode(
    email: string,
    code: string,
    purpose: 'login' | 'register' | 'password_reset' = 'login'
  ): Promise<{ valid: boolean; verificationId?: string }> {
    try {
      // Find active verification code
      const findQuery = `
        SELECT id, code, attempts, max_attempts, expires_at, is_used, is_active
        FROM email_verification_codes
        WHERE email = $1 AND purpose = $2 AND is_active = true
        ORDER BY created_at DESC
        LIMIT 1
      `;

      const findResult = await pool.query(findQuery, [email, purpose]);

      if (findResult.rowCount === 0) {
        throw new CustomError('認証コードが見つかりません', 400);
      }

      const verification = findResult.rows[0];

      // Check if already used
      if (verification.is_used) {
        throw new CustomError('この認証コードは既に使用済みです', 400);
      }

      // Check if expired
      if (new Date() > new Date(verification.expires_at)) {
        await this.deactivateCode(verification.id);
        throw new CustomError('認証コードの有効期限が切れています', 400);
      }

      // Check max attempts
      if (verification.attempts >= verification.max_attempts) {
        await this.deactivateCode(verification.id);
        throw new CustomError('認証試行回数の上限に達しました', 400);
      }

      // Increment attempts
      await this.incrementAttempts(verification.id);

      // Verify code
      if (verification.code !== code) {
        const remainingAttempts = verification.max_attempts - verification.attempts - 1;
        
        if (remainingAttempts <= 0) {
          await this.deactivateCode(verification.id);
          throw new CustomError('認証コードが正しくありません。試行回数の上限に達したため、新しいコードをリクエストしてください。', 400);
        }
        
        throw new CustomError(`認証コードが正しくありません。残り${remainingAttempts}回の試行が可能です。`, 400);
      }

      // Mark as used and verified
      await this.markAsUsed(verification.id);

      console.log(`✅ Email verification successful for ${email} (${purpose})`);

      return {
        valid: true,
        verificationId: verification.id
      };
    } catch (error) {
      console.error('Error verifying code:', error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('認証コードの検証に失敗しました', 500);
    }
  }

  /**
   * Check if user can request a new code (rate limiting)
   */
  private static async checkRateLimit(email: string, purpose: string): Promise<void> {
    const query = `
      SELECT created_at
      FROM email_verification_codes
      WHERE email = $1 AND purpose = $2
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [email, purpose]);

    if (result.rowCount > 0) {
      const lastRequest = new Date(result.rows[0].created_at);
      const now = new Date();
      const timeDiff = (now.getTime() - lastRequest.getTime()) / 1000; // seconds

      if (timeDiff < this.RATE_LIMIT_MINUTES * 60) {
        const waitTime = Math.ceil(this.RATE_LIMIT_MINUTES * 60 - timeDiff);
        throw new CustomError(`認証コードの再送信は${waitTime}秒後に可能です`, 429);
      }
    }
  }

  /**
   * Deactivate existing codes for the same email and purpose
   */
  private static async deactivateExistingCodes(email: string, purpose: string): Promise<void> {
    const query = `
      UPDATE email_verification_codes
      SET is_active = false
      WHERE email = $1 AND purpose = $2 AND is_active = true
    `;

    await pool.query(query, [email, purpose]);
  }

  /**
   * Deactivate a specific code
   */
  private static async deactivateCode(verificationId: string): Promise<void> {
    const query = `
      UPDATE email_verification_codes
      SET is_active = false
      WHERE id = $1
    `;

    await pool.query(query, [verificationId]);
  }

  /**
   * Increment attempt count
   */
  private static async incrementAttempts(verificationId: string): Promise<void> {
    const query = `
      UPDATE email_verification_codes
      SET attempts = attempts + 1
      WHERE id = $1
    `;

    await pool.query(query, [verificationId]);
  }

  /**
   * Mark code as used
   */
  private static async markAsUsed(verificationId: string): Promise<void> {
    const query = `
      UPDATE email_verification_codes
      SET is_used = true, verified_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;

    await pool.query(query, [verificationId]);
  }

  /**
   * Generate a 6-digit numeric code
   */
  private static generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Get verification status for debugging
   */
  public static async getVerificationStatus(email: string, purpose: string): Promise<any> {
    const query = `
      SELECT id, code, attempts, max_attempts, expires_at, is_used, is_active, created_at
      FROM email_verification_codes
      WHERE email = $1 AND purpose = $2
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const result = await pool.query(query, [email, purpose]);
    return result.rows;
  }

  /**
   * Clean up expired codes (should be run periodically)
   */
  public static async cleanupExpiredCodes(): Promise<number> {
    const query = `
      UPDATE email_verification_codes
      SET is_active = false
      WHERE expires_at < CURRENT_TIMESTAMP AND is_active = true
    `;

    const result = await pool.query(query);
    return result.rowCount || 0;
  }
}