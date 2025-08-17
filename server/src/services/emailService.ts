import nodemailer from 'nodemailer';
import { CustomError } from '@/middleware/errorHandler';

export interface EmailConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private static instance: EmailService;
  private transporter!: nodemailer.Transporter;

  private constructor() {
    this.initializeTransporter();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private initializeTransporter(): void {
    // Check if email configuration is available
    const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
    const hasSMTPConfig = process.env.SMTP_HOST;

    if (!hasEmailConfig && !hasSMTPConfig) {
      console.warn('⚠️ No email configuration found, using mock transporter');
      this.transporter = this.createMockTransporter();
      return;
    }

    const emailConfig: EmailConfig = {
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    };

    // For development, use SMTP settings if available
    if (process.env.SMTP_HOST) {
      emailConfig.host = process.env.SMTP_HOST;
      emailConfig.port = parseInt(process.env.SMTP_PORT || '587');
      emailConfig.secure = process.env.SMTP_SECURE === 'true';
      delete emailConfig.service;
    }

    try {
      this.transporter = nodemailer.createTransport(emailConfig);
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.warn('⚠️ Email service initialization failed:', error);
      // Create a mock transporter for development
      this.transporter = this.createMockTransporter();
    }
  }

  private createMockTransporter(): nodemailer.Transporter {
    return {
      sendMail: async (options: any) => {
        console.log('📧 [MOCK EMAIL]', {
          to: options.to,
          subject: options.subject,
          text: options.text,
          html: options.html,
        });
        return { messageId: 'mock-' + Date.now() };
      },
    } as any;
  }

  /**
   * Send verification code email
   */
  public async sendVerificationCode(
    email: string, 
    code: string, 
    purpose: 'login' | 'register' | 'password_reset' = 'login'
  ): Promise<void> {
    const subjects = {
      login: 'CORAL - ログイン認証コード',
      register: 'CORAL - 新規登録認証コード',
      password_reset: 'CORAL - パスワードリセット認証コード',
    };

    const templates = {
      login: this.getLoginTemplate(code),
      register: this.getRegisterTemplate(code),
      password_reset: this.getPasswordResetTemplate(code),
    };

    const emailOptions: EmailOptions = {
      to: email,
      subject: subjects[purpose],
      html: templates[purpose],
      text: `認証コード: ${code}`,
    };

    try {
      const fromAddress = process.env.EMAIL_USER || 'noreply@coral.localhost';
      await this.transporter.sendMail({
        from: `"CORAL コミュニティ" <${fromAddress}>`,
        ...emailOptions,
      });

      console.log(`📧 Verification code sent to ${email} for ${purpose}`);
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      // Check if this is a mock transporter error or real email error
      const isMockTransporter = !process.env.EMAIL_USER && !process.env.SMTP_HOST;
      
      if (isMockTransporter) {
        console.log('📧 [MOCK MODE] Email simulation successful');
        // Don't throw error for mock transporter
      } else {
        // Real email configuration error
        throw new CustomError('メール送信に失敗しました', 500);
      }
    }
  }

  /**
   * Login verification email template
   */
  private getLoginTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CORAL ログイン認証</title>
        <style>
          body { font-family: 'Hiragino Sans', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #9c7cf4 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 40px 30px; }
          .code-container { background-color: #f8f9fa; border: 2px solid #9c7cf4; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
          .code { font-size: 36px; font-weight: bold; color: #9c7cf4; letter-spacing: 8px; font-family: monospace; }
          .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; color: #856404; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌊 CORAL コミュニティ</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0;">ログイン認証コード</p>
          </div>
          
          <div class="content">
            <h2 style="color: #374151; margin-bottom: 20px;">ログイン認証コードをお送りします</h2>
            
            <p style="color: #6b7280; line-height: 1.6;">
              CORALコミュニティへのログインリクエストを受け付けました。<br>
              以下の6桁の認証コードを入力してログインを完了してください。
            </p>

            <div class="code-container">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">認証コード</p>
              <div class="code">${code}</div>
            </div>

            <div class="warning">
              <strong>⚠️ セキュリティについて</strong><br>
              • このコードは10分間有効です<br>
              • コードは他人に教えないでください<br>
              • 心当たりのないリクエストの場合は無視してください
            </div>

            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              このメールに心当たりがない場合は、このメールを無視してください。<br>
              アカウントのセキュリティに関してご質問がある場合は、サポートまでお問い合わせください。
            </p>
          </div>

          <div class="footer">
            <p>© 2024 CORAL コミュニティ. All rights reserved.</p>
            <p>このメールは自動送信されています。返信はできません。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Register verification email template
   */
  private getRegisterTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CORAL 新規登録認証</title>
        <style>
          body { font-family: 'Hiragino Sans', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 40px 30px; }
          .code-container { background-color: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
          .code { font-size: 36px; font-weight: bold; color: #10b981; letter-spacing: 8px; font-family: monospace; }
          .welcome { background-color: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌊 CORAL コミュニティ</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0;">新規登録認証コード</p>
          </div>
          
          <div class="content">
            <h2 style="color: #374151; margin-bottom: 20px;">CORALコミュニティへようこそ！</h2>
            
            <div class="welcome">
              <h3 style="color: #0369a1; margin-top: 0;">🎉 登録ありがとうございます</h3>
              <p style="color: #075985; margin-bottom: 0;">
                CORALコミュニティにご参加いただき、ありがとうございます。<br>
                以下の認証コードで登録を完了してください。
              </p>
            </div>

            <div class="code-container">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">認証コード</p>
              <div class="code">${code}</div>
            </div>

            <p style="color: #6b7280; line-height: 1.6;">
              この認証コードは10分間有効です。<br>
              登録画面で上記のコードを入力して、アカウント作成を完了してください。
            </p>
          </div>

          <div class="footer">
            <p>© 2024 CORAL コミュニティ. All rights reserved.</p>
            <p>このメールは自動送信されています。返信はできません。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Password reset verification email template
   */
  private getPasswordResetTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CORAL パスワードリセット</title>
        <style>
          body { font-family: 'Hiragino Sans', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 40px 30px; }
          .code-container { background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
          .code { font-size: 36px; font-weight: bold; color: #ef4444; letter-spacing: 8px; font-family: monospace; }
          .security { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; color: #92400e; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌊 CORAL コミュニティ</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0;">パスワードリセット認証</p>
          </div>
          
          <div class="content">
            <h2 style="color: #374151; margin-bottom: 20px;">パスワードリセットの認証コード</h2>
            
            <p style="color: #6b7280; line-height: 1.6;">
              パスワードリセットのリクエストを受け付けました。<br>
              以下の6桁の認証コードを入力して、新しいパスワードを設定してください。
            </p>

            <div class="code-container">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">認証コード</p>
              <div class="code">${code}</div>
            </div>

            <div class="security">
              <strong>🔒 セキュリティ重要事項</strong><br>
              • このコードは10分間のみ有効です<br>
              • パスワードリセットをリクエストしていない場合は、このメールを無視してください<br>
              • アカウントのセキュリティを確保するため、定期的にパスワードを変更することをお勧めします
            </div>
          </div>

          <div class="footer">
            <p>© 2024 CORAL コミュニティ. All rights reserved.</p>
            <p>このメールは自動送信されています。返信はできません。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Test email connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();