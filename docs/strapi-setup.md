# Strapi セットアップガイド

## 前提条件
- Node.js v18以上
- PostgreSQL（推奨）またはSQLite
- npm または yarn

## 1. Strapiのインストール

```bash
# プロジェクトのルートディレクトリで実行
npx create-strapi-app@latest coral-cms --quickstart
```

## 2. 初期設定

### 管理者アカウントの作成
1. `http://localhost:1337/admin` にアクセス
2. 以下の情報を入力：
   - ユーザー名
   - メールアドレス
   - パスワード（8文字以上）

### 日本語化の設定
1. 管理画面の「Settings」→「Internationalization」
2. 「Add new locale」から「Japanese (ja)」を追加

## 3. コンテンツタイプの作成

### Article（記事）
1. Content-Type Builder → "Create new collection type"
2. 以下のフィールドを追加：

```yaml
title:
  type: string
  required: true
  unique: true

slug:
  type: uid
  targetField: title
  required: true

content:
  type: richtext
  required: true

excerpt:
  type: text

featuredImage:
  type: media
  multiple: false
  required: true

category:
  type: relation
  target: category
  relation: manyToOne

tags:
  type: relation
  target: tag
  relation: manyToMany

author:
  type: relation
  target: author
  relation: manyToOne

publishedAt:
  type: datetime

status:
  type: enumeration
  enum:
    - draft
    - published
  default: draft
  required: true
```

### Category（カテゴリー）
```yaml
name:
  type: string
  required: true
  unique: true

slug:
  type: uid
  targetField: name
  required: true

description:
  type: text
```

### Tag（タグ）
```yaml
name:
  type: string
  required: true
  unique: true

slug:
  type: uid
  targetField: name
  required: true
```

### Author（著者）
```yaml
name:
  type: string
  required: true

bio:
  type: text

avatar:
  type: media
  multiple: false

role:
  type: string
  required: true
```

## 4. APIトークンの設定

1. Settings → API Tokens
2. "Create new API token"を選択
3. 以下の情報を入力：
   - Name: `CORAL_API_TOKEN`
   - Description: "Token for CORAL website"
   - Token type: "Full access"
4. 生成されたトークンを保存

## 5. 画像最適化の設定

`config/plugins.js`を作成：

```javascript
module.exports = {
  upload: {
    config: {
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        thumbnail: 250
      },
      sizeLimit: 10 * 1024 * 1024 // 10MB
    },
  },
};
```

## 6. CORS設定

`config/middlewares.js`を編集：

```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:5173'], // Viteの開発サーバー
      headers: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## 7. 環境変数の設定

### Strapi側（.env）
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
```

### フロントエンド側（.env.local）
```env
VITE_CMS_API_URL=http://localhost:1337
VITE_CMS_API_TOKEN=your-generated-token
```

## 8. 本番環境の注意点

1. **データベースの設定**
   - 本番環境ではPostgreSQLの使用を推奨
   - バックアップの定期実行を設定

2. **セキュリティ設定**
   - 本番用の強力なパスワードとシークレットキーの使用
   - API制限の設定
   - レート制限の有効化

3. **パフォーマンス設定**
   - Node.jsのメモリ制限の調整
   - PM2などのプロセスマネージャーの使用

## 9. バックアップ設定

```bash
# データベースのバックアップ（PostgreSQL使用時）
pg_dump -U username -d database_name > backup.sql

# メディアファイルのバックアップ
tar -czf media_backup.tar.gz public/uploads/
```

## 10. 起動と停止

```bash
# 開発モードで起動
npm run develop

# 本番モードで起動
NODE_ENV=production npm run start

# PM2で本番運用
pm2 start npm --name "coral-cms" -- start
