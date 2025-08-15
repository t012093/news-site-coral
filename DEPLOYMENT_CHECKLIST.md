# 🚀 本番デプロイ前チェックリスト

## 📋 **必要な本番環境設定**

### 🗄️ **データベース設定**
- [ ] **PostgreSQL データベース**
  - Supabase / Neon / Vercel Postgres など
  - `DATABASE_URL` 環境変数
  
- [ ] **Redis キャッシュ**  
  - Upstash Redis / Redis Labs など
  - `REDIS_URL` 環境変数

### 🔐 **セキュリティ設定**
- [ ] **JWT シークレット**
  - `JWT_SECRET` (32文字以上の強力な文字列)
  - `JWT_REFRESH_SECRET` (32文字以上の強力な文字列)
  
- [ ] **Cookie シークレット**
  - `COOKIE_SECRET` (32文字以上の強力な文字列)

### 🌐 **CORS設定**
- [ ] **フロントエンド URL**
  - `FRONTEND_URL` (Vercelデプロイ後のURL)
  
### 📱 **フロントエンド設定**
- [ ] **API URL設定**
  - `VITE_API_URL` (バックエンドデプロイ後のURL)
  - `VITE_SOCKET_URL` (バックエンドデプロイ後のURL)

## 🚀 **デプロイ順序**

### 1. **バックエンドデプロイ**
- Railway / Render / Heroku など
- 環境変数設定
- データベース接続確認

### 2. **フロントエンドデプロイ**  
- Vercel
- 環境変数設定（バックエンドURL）

### 3. **動作テスト**
- 新規登録テスト
- ログインテスト
- WebSocket接続テスト

## ⚠️ **現在の状態**
- ✅ コード準備完了
- ⏳ データベース未設定（現在Mock）
- ⏳ 本番環境変数未設定
- ⏳ デプロイ未実行

## 🎯 **推奨デプロイ方法**

### **無料で始める構成**
1. **バックエンド**: Railway (無料枠)
2. **データベース**: Supabase (無料枠)  
3. **Redis**: Upstash (無料枠)
4. **フロントエンド**: Vercel (無料)

この構成なら、完全に無料で本格的なWebアプリケーションが運用できます！