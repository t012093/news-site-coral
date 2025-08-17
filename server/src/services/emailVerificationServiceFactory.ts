import { pool } from '@/config/database';
import { EmailVerificationService } from '@/services/emailVerificationService';
import { MockEmailVerificationService } from '@/services/mockEmailVerificationService';

/**
 * Factory to create appropriate email verification service
 * based on database availability
 */
export class EmailVerificationServiceFactory {
  private static isPostgreSQLAvailable: boolean | null = null;

  /**
   * Test if PostgreSQL is available
   */
  private static async testPostgreSQLConnection(): Promise<boolean> {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch (error) {
      console.warn('PostgreSQL not available for email verification:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  /**
   * Get appropriate email verification service
   */
  public static async getService(): Promise<typeof EmailVerificationService | typeof MockEmailVerificationService> {
    // Cache the result to avoid repeated database checks
    if (this.isPostgreSQLAvailable === null) {
      this.isPostgreSQLAvailable = await this.testPostgreSQLConnection();
      
      if (this.isPostgreSQLAvailable) {
        console.log('📧 Using PostgreSQL-based EmailVerificationService');
      } else {
        console.log('📧 Using MockEmailVerificationService (in-memory)');
      }
    }

    return this.isPostgreSQLAvailable ? EmailVerificationService : MockEmailVerificationService;
  }

  /**
   * Reset the cached PostgreSQL availability status
   */
  public static resetCache(): void {
    this.isPostgreSQLAvailable = null;
  }
}