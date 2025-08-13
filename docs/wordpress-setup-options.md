# WordPress連携オプション

## オプション1: デモサイト（現在の設定）
```
VITE_WP_API_URL=https://demo.wp-api.org/wp-json/wp/v2
```
- すぐに動作確認可能
- 実際のWordPressデータで確認
- 制限：編集不可、デモデータのみ

## オプション2: WordPress.com 無料アカウント
1. https://wordpress.com でアカウント作成
2. 無料ブログを作成（例：mysite.wordpress.com）
3. 設定更新：
```
VITE_WP_API_URL=https://mysite.wordpress.com/wp-json/wp/v2
```

## オプション3: ローカルWordPress（Docker）
```bash
# docker-compose.yml
version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    depends_on:
      - db

  db:
    image: mysql:5.7
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: wordpress

# 起動
docker-compose up -d

# 設定
VITE_WP_API_URL=http://localhost:8080/wp-json/wp/v2
```

## オプション4: モックデータ
WordPressを使わずにモックデータで開発：

```typescript
// src/lib/mockData.ts
export const mockArticles = [
  {
    id: 1,
    title: "モック記事1",
    slug: "mock-article-1",
    content: "<p>これはモック記事です</p>",
    // ... 他のプロパティ
  }
];
```

## 推奨順序
1. **デモサイト**で動作確認（現在）
2. 必要に応じて**WordPress.com**で実際のコンテンツ管理
3. 本格運用時に独自ドメインのWordPress