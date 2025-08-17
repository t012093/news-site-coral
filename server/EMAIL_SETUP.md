# メール送信機能のセットアップ

## Gmail SMTPを使用する場合

### 1. Gmail アプリパスワードの作成

1. Googleアカウントにログイン
2. [Google Account Settings](https://myaccount.google.com/) に移動
3. 「セキュリティ」タブを選択
4. 「2段階認証プロセス」を有効にする（まだの場合）
5. 「アプリパスワード」を検索し、設定
6. アプリを選択（「メール」）、デバイスを選択（「その他」）
7. 名前を入力（例：CORAL News Site）
8. 生成された16文字のパスワードをコピー

### 2. Railway環境変数の設定

Railway管理画面で以下の環境変数を設定：

```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

### 3. カスタムSMTPを使用する場合

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

## 設定の確認

サーバーログで以下のメッセージを確認：

✅ 正常：`✅ Email service initialized successfully (Gmail)`
⚠️ モック：`⚠️ No email configuration found, using mock transporter`

## トラブルシューティング

### よくある問題

1. **認証エラー**: アプリパスワードが正しく設定されていない
2. **接続エラー**: SMTPポートやセキュリティ設定の問題
3. **送信制限**: Gmailの1日の送信制限（500通/日）

### デバッグ

メール送信のデバッグログを確認：

```bash
curl "https://your-railway-app.railway.app/api/auth/debug-codes?email=test@example.com&purpose=register"
```

## セキュリティ注意事項

- アプリパスワードは環境変数として安全に保管
- 本番環境では専用のメールアカウントを使用推奨
- 送信制限とレート制限を適切に設定