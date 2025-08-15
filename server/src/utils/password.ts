import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createError } from '@/middleware/errorHandler';

export class PasswordManager {
  private static readonly SALT_ROUNDS = 12;
  private static readonly RESET_TOKEN_LENGTH = 32;
  private static readonly VERIFICATION_TOKEN_LENGTH = 32;

  /**
   * Hash password
   */
  public static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_ROUNDS);
    } catch (error) {
      throw createError.internalError('Failed to hash password');
    }
  }

  /**
   * Verify password
   */
  public static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw createError.internalError('Failed to verify password');
    }
  }

  /**
   * Generate secure random token
   */
  public static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate password reset token
   */
  public static generateResetToken(): string {
    return this.generateSecureToken(this.RESET_TOKEN_LENGTH);
  }

  /**
   * Generate email verification token
   */
  public static generateVerificationToken(): string {
    return this.generateSecureToken(this.VERIFICATION_TOKEN_LENGTH);
  }

  /**
   * Validate password strength
   */
  public static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must be no more than 128 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common and easily guessable');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate temporary password
   */
  public static generateTemporaryPassword(length: number = 12): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required category
    const required = [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // uppercase
      'abcdefghijklmnopqrstuvwxyz', // lowercase
      '0123456789', // numbers
      '!@#$%^&*' // special characters
    ];
    
    // Add one character from each required category
    required.forEach(category => {
      password += category[crypto.randomInt(0, category.length)];
    });
    
    // Fill the rest with random characters
    for (let i = password.length; i < length; i++) {
      password += charset[crypto.randomInt(0, charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Check if token is expired
   */
  public static isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}