# 🚀 Railway デプロイ実行ガイド

## 📋 デプロイ前最終チェック

### ✅ 完了済み
- [x] Supabase PostgreSQL準備完了
- [x] Railway設定ファイル (`railway.toml`) 準備完了  
- [x] TypeScriptビルドエラー修正済み
- [x] 本番用JWT秘密キー生成済み
- [x] 環境変数リスト準備完了

### ⏳ 実行手順

## 🚀 Railway デプロイ手順

### 1. Railway CLI インストール (まだの場合)
```bash
npm install -g @railway/cli
```

### 2. Railway ログイン
```bash
railway login
```

### 3. プロジェクト初期化
```bash
railway init
```

### 4. 環境変数設定
Railway Console (https://railway.app) で：
1. プロジェクト選択
2. Settings > Variables
3. `railway-env-vars.txt` の内容を追加
4. **重要**: `REDIS_URL` をUpstash Redis URLに置き換え

### 5. デプロイ実行
```bash
railway up
```

### 6. ドメイン設定
1. Railway Console > Settings > Domains
2. "Generate Domain" または "Custom Domain" 設定

### 7. ヘルスチェック確認
デプロイ後、以下URLで確認：
```
https://your-railway-domain.railway.app/health
```

期待される応答：
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "database": "connected",
  "redis": "connected"
}
```

## 🔧 デプロイ後の設定

### フロントエンド環境変数更新
Railwayデプロイ完了後：
1. バックエンドURLをコピー
2. フロントエンド `.env` で `VITE_API_URL` を更新
3. Vercelで再デプロイ

### CORS設定更新
Railway Console で `FRONTEND_URL` をVercelのURLに更新

## 🐛 トラブルシューティング

### ビルドエラーの場合
```bash
# ローカルでビルドテスト
cd server
npm run build
```

### 接続エラーの場合
1. DATABASE_URL確認
2. REDIS_URL確認  
3. ファイアウォール設定確認

### ログ確認
```bash
railway logs
```

## 🎯 デプロイ成功の確認事項
- [ ] `/health` エンドポイントが200を返す
- [ ] データベース接続成功
- [ ] Redis接続成功
- [ ] CORS設定正常
- [ ] ログにエラーなし