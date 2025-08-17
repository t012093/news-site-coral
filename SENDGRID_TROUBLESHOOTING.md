# SendGrid トラブルシューティングガイド

## 現在の問題
- 本番環境で500エラー「メール送信に失敗しました」が発生
- SendGridは登録済み、Single Sender Verification完了済み

## 確認が必要な設定

### 1. Railway環境変数の確認
以下の環境変数が正しく設定されているか確認してください：

```
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
```

### 2. SendGrid APIキーの確認
- SendGridダッシュボードで新しいAPIキーを作成
- 権限は「Mail Send」の「Full Access」が必要
- APIキーは `SG.` で始まる文字列

### 3. Single Sender Verification の確認
- SendGrid > Settings > Sender Authentication
- naoya.k@coral-network.com が緑色のチェックマークで認証済みか確認
- From Address として使用可能な状態か確認

### 4. よくあるエラーの原因

#### A. APIキーの問題
- APIキーが正しくコピーされていない（末尾切れ、空白文字含む）
- APIキーの権限が不足している
- APIキーが無効化されている

#### B. 送信者認証の問題
- Single Sender Verificationが完了していない
- 認証されたメールアドレスと実際の送信者が異なる
- 認証プロセスが完了していない

#### C. 環境変数の問題
- Railway環境変数が正しく設定されていない
- 環境変数名が間違っている
- 新しい環境変数がサーバーに反映されていない

### 5. デバッグ手順

#### Step 1: SendGrid設定の再確認
1. SendGridダッシュボードログイン
2. API Keys > Create API Key
3. 名前: "CORAL_PRODUCTION"
4. 権限: Mail Send > Full Access
5. APIキーをコピー

#### Step 2: Railway環境変数の再設定
1. Railway プロジェクト > Variables
2. 以下を設定：
   ```
   EMAIL_USER=apikey
   EMAIL_PASSWORD=（新しいAPIキー）
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   EMAIL_FROM_NAME=CORAL コミュニティ
   ```

#### Step 3: サーバーの再起動
- Railway環境変数変更後、自動的に再デプロイされるまで待つ
- または手動でRedeploy

#### Step 4: 送信テスト
```bash
curl -X POST https://news-site-coral-production.up.railway.app/api/auth/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{"email":"naoya.k@coral-network.com","purpose":"register"}'
```

### 6. 追加の確認事項

#### SendGrid Account Status
- アカウントがSuspendされていないか
- 送信制限に達していないか
- 請求情報が正しく設定されているか

#### Network/Firewall
- Railway側でSMTPポート（587）がブロックされていないか
- SendGrid側でAPI制限がかかっていないか

### 7. 代替案

#### Option 1: Web API使用
SMTP経由ではなく、SendGridのWeb APIを使用する方法

#### Option 2: 他のメールサービス
- Mailgun
- Amazon SES
- Postmark

## 次のステップ

1. SendGridダッシュボードで新しいAPIキーを作成
2. Railway環境変数を再設定
3. デプロイ完了を待つ
4. メール送信をテスト
5. 成功したらフロントエンドの登録フローをテスト

## 参考情報

### SendGrid SMTP設定
- Host: smtp.sendgrid.net
- Port: 587 (STARTTLS) または 465 (SSL)
- Username: apikey（固定値）
- Password: SendGrid API Key

### コードの確認箇所
- `/server/src/services/emailService.ts:49-57` - SMTP設定
- `/server/src/controllers/authController.ts:419-425` - 送信処理
- `/server/src/services/emailVerificationServiceFactory.ts` - サービス選択