import { emailService } from '@/services/emailService';
import { createError, CustomError } from '@/middleware/errorHandler';

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

// In-memory storage for verification codes
let verificationCodes: VerificationCodeData[] = [];

export class MockEmailVerificationService {
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
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.CODE_EXPIRY_MINUTES * 60 * 1000);

      // Create verification code data
      const verificationData: VerificationCodeData = {
        id: this.generateId(),
        email,
        code,
        purpose,
        attempts: 0,
        maxAttempts: this.MAX_ATTEMPTS,
        createdAt: now,
        expiresAt,
        isUsed: false,
        isActive: true
      };

      // Store in memory
      verificationCodes.push(verificationData);

      // Send email
      await emailService.sendVerificationCode(email, code, purpose);

      console.log(`\n🔐 =====================================================`);
      console.log(`📧 VERIFICATION CODE FOR: ${email}`);
      console.log(`🎯 PURPOSE: ${purpose}`);
      console.log(`🔢 CODE: ${code}`);
      console.log(`⏰ EXPIRES IN: ${this.CODE_EXPIRY_MINUTES} minutes`);
      console.log(`🔐 =====================================================\n`);

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
      const verification = verificationCodes.find(v => 
        v.email === email && 
        v.purpose === purpose && 
        v.isActive && 
        !v.isUsed
      );

      if (!verification) {
        throw new CustomError('認証コードが見つかりません', 400);
      }

      // Check if expired
      if (new Date() > verification.expiresAt) {
        verification.isActive = false;
        throw new CustomError('認証コードの有効期限が切れています', 400);
      }

      // Check max attempts
      if (verification.attempts >= verification.maxAttempts) {
        verification.isActive = false;
        throw new CustomError('認証試行回数の上限に達しました', 400);
      }

      // Increment attempts
      verification.attempts++;

      // Verify code
      if (verification.code !== code) {
        const remainingAttempts = verification.maxAttempts - verification.attempts;
        
        if (remainingAttempts <= 0) {
          verification.isActive = false;
          throw new CustomError('認証コードが正しくありません。試行回数の上限に達したため、新しいコードをリクエストしてください。', 400);
        }
        
        throw new CustomError(`認証コードが正しくありません。残り${remainingAttempts}回の試行が可能です。`, 400);
      }

      // Mark as used
      verification.isUsed = true;

      console.log(`✅ [MOCK] Email verification successful for ${email} (${purpose})`);

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
    const lastRequest = verificationCodes
      .filter(v => v.email === email && v.purpose === purpose)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    if (lastRequest) {
      const now = new Date();
      const timeDiff = (now.getTime() - lastRequest.createdAt.getTime()) / 1000; // seconds

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
    verificationCodes.forEach(v => {
      if (v.email === email && v.purpose === purpose && v.isActive) {
        v.isActive = false;
      }
    });
  }

  /**
   * Generate a 6-digit numeric code
   */
  private static generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get verification status for debugging
   */
  public static async getVerificationStatus(email: string, purpose: string): Promise<VerificationCodeData[]> {
    return verificationCodes
      .filter(v => v.email === email && v.purpose === purpose)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  }

  /**
   * Clean up expired codes (should be run periodically)
   */
  public static async cleanupExpiredCodes(): Promise<number> {
    const now = new Date();
    let cleanedCount = 0;
    
    verificationCodes.forEach(v => {
      if (v.expiresAt < now && v.isActive) {
        v.isActive = false;
        cleanedCount++;
      }
    });
    
    return cleanedCount;
  }

  /**
   * Clear all verification codes (for testing)
   */
  public static clearAll(): void {
    verificationCodes = [];
  }
}