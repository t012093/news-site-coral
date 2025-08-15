# 🚀 CORAL デプロイガイド

## 📊 **構成**
- 🚂 **Railway**: Node.js API + Redis
- 🐘 **Supabase**: PostgreSQL + Auth
- ⚡ **Vercel**: React Frontend
- 📝 **WordPress**: CMS (既存)

## 🔧 **1. Supabase設定**

### 1.1 プロジェクト作成
1. [Supabase](https://supabase.com) にアクセス
2. 「New Project」でプロジェクト作成
3. データベースパスワードを設定

### 1.2 必要な情報を取得
```
Database URL: postgresql://postgres:[password]@[host]:5432/postgres
API URL: https://[project].supabase.co
API Key: [anon key]
```

## 🚂 **2. Railway設定**

### 2.1 プロジェクト作成
1. [Railway](https://railway.app) にアクセス
2. GitHub連携でこのリポジトリを接続
3. 自動デプロイ開始

### 2.2 環境変数設定
```bash
# Database
USE_REAL_DATABASES=true
DATABASE_URL=[Supabaseから取得]

# JWT
JWT_SECRET=[32文字以上のランダム文字列]
JWT_REFRESH_SECRET=[32文字以上のランダム文字列]

# Cookie
COOKIE_SECRET=[32文字以上のランダム文字列]

# CORS
FRONTEND_URL=[Vercelデプロイ後のURL]

# Redis (Railway内蔵)
REDIS_URL=[Railway Redisから自動設定]
```

### 2.3 Redis追加
- Railway ダッシュボードで「+ Add Service」
- 「Redis」を選択
- 自動で `REDIS_URL` が設定される

## ⚡ **3. Vercel設定**

### 3.1 プロジェクト作成
1. [Vercel](https://vercel.com) にアクセス
2. GitHub連携でこのリポジトリを接続
3. Root Directory を指定（デフォルトでOK）

### 3.2 環境変数設定
```bash
VITE_API_URL=[RailwayのAPI URL]/api
VITE_SOCKET_URL=[RailwayのAPI URL]
```

## 🔗 **4. 連携確認**

### 4.1 ヘルスチェック
- Railway: `[railway-url]/health`
- Vercel: `[vercel-url]`

### 4.2 機能テスト
- [ ] 新規登録
- [ ] ログイン
- [ ] WebSocket接続
- [ ] メッセージング
- [ ] プロジェクト管理

## 💡 **Tips**

### 強力なパスワード生成
```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Cookie_SECRET  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### デバッグ
- Railway: リアルタイムログ確認可能
- Vercel: Function logs で確認
- Supabase: 管理画面でDB確認

## 🎯 **完成！**
すべて設定完了後、本格的なWebアプリケーションが完成します！