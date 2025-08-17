# メール送信機能のセットアップ

## 基本設定（必須）

すべてのメールプロバイダーで必要な基本設定：

```
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
```

## SMTP設定（推奨）

### 一般的なメールプロバイダー設定例

#### Gmail
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```
*注意: Gmailはアプリパスワードが必要です*

#### Outlook/Hotmail
```
SMTP_HOST=smtp.live.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Yahoo Mail
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

#### SendGrid
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### Mailgun
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-mailgun-smtp-username
EMAIL_PASSWORD=your-mailgun-smtp-password
```

#### カスタムSMTP
```
SMTP_HOST=mail.yourhost.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@yourhost.com
EMAIL_PASSWORD=your-password
```

### SSL/TLS設定

#### SSL接続（ポート465）
```
SMTP_PORT=465
SMTP_SECURE=true
```

#### STARTTLS接続（ポート587）- 推奨
```
SMTP_PORT=587
SMTP_SECURE=false
```

#### 証明書検証を無効にする（開発環境のみ）
```
SMTP_TLS_REJECT_UNAUTHORIZED=false
```

## オプション設定

### 送信者名のカスタマイズ
```
EMAIL_FROM_NAME=あなたのサービス名
```

### 開発環境でのTLS証明書検証無効化
```
SMTP_TLS_REJECT_UNAUTHORIZED=false
```

## 設定の確認

### 1. サーバーログの確認
起動時に以下のメッセージを確認：

✅ 正常：`✅ Email service initialized successfully (Custom SMTP)`
⚠️ モック：`⚠️ No email configuration found, using mock transporter`

### 2. 接続テスト（開発環境のみ）
```bash
curl -X POST https://your-app.railway.app/api/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test@example.com"}'
```

### 3. 認証コードの確認（開発環境のみ）
```bash
curl "https://your-app.railway.app/api/auth/debug-codes?email=test@example.com&purpose=register"
```

## トラブルシューティング

### よくある問題

1. **認証エラー**
   - ユーザー名/パスワードが間違っている
   - 2段階認証が必要（Gmail, Yahoo）
   - アプリパスワードが必要

2. **接続エラー**
   - SMTPホスト/ポートが間違っている
   - ファイアウォールで通信がブロックされている
   - SSL/TLS設定が間違っている

3. **送信エラー**
   - 送信制限に達している
   - メールアドレス形式が不正
   - SPFレコードの問題

### 推奨設定

#### 本番環境
- 専用のメール送信サービスを使用（SendGrid, Mailgun等）
- 独自ドメインのメールアドレスを使用
- SPF, DKIM, DMARCレコードを設定

#### 開発環境
- Gmailやプロバイダーメールでも可能
- テスト用メールアドレスを使用

## セキュリティ注意事項

- メール認証情報は環境変数として安全に保管
- 本番環境では信頼できるSMTPサービスを使用
- レート制限を適切に設定
- メール送信ログを監視