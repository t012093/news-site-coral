# Railwayに追加が必要な環境変数

## 1. 重要な環境変数（必須）

### JWT_REFRESH_SECRET
```
JWT_REFRESH_SECRET=your-refresh-token-secret-key-for-production-min-32-characters
```
例: `railway-coral-refresh-secret-2025-production-key-secure`

### COOKIE_SECRET  
```
COOKIE_SECRET=your-cookie-secret-for-production-min-32-characters-long
```
例: `railway-coral-cookie-secret-2025-production-secure-key`

### JWT_EXPIRES_IN
```
JWT_EXPIRES_IN=24h
```

### JWT_REFRESH_EXPIRES_IN
```
JWT_REFRESH_EXPIRES_IN=30d
```

## 2. CORSの設定（Vercelのフロントエンド URL）

### FRONTEND_URL の修正
現在の値を以下に更新：
```
FRONTEND_URL=https://coral-network.com
```

## 3. データベース関連（既に設定済みか確認）

### DB関連の環境変数（DATABASE_URLから自動的に読み取られるが、念のため）
```
DB_HOST=db.ykywpylhxedsamsfcnov.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Coral1324!
```

## 設定方法

1. Railwayダッシュボードにログイン
2. プロジェクトを選択
3. Variables タブをクリック
4. 「+ New Variable」で上記の環境変数を追加
5. 保存後、自動的に再デプロイされます

## 確認事項

設定後、以下を確認：
- https://news-site-coral-production.up.railway.app/health でヘルスチェック
- フロントエンドからユーザー登録・ログインのテスト