# 🚀 Vercel環境変数設定ガイド

## 📋 Vercel Console で設定する環境変数

### 1. Vercel Dashboard にアクセス
- https://vercel.com/dashboard
- "Add New" → "Project" → GitHubから選択

### 2. 環境変数設定
以下の変数を Settings > Environment Variables で追加：

```bash
# バックエンドAPI設定 (RailwayのURLに置き換え)
VITE_API_URL=https://your-railway-domain.railway.app/api
VITE_SOCKET_URL=https://your-railway-domain.railway.app

# WordPress.com API設定 (既存)
VITE_WP_API_URL=https://coral-news.wordpress.com/wp-json/wp/v2
VITE_WP_DEBUG=false
```

### 3. 重要なポイント
- **Environment**: Production, Preview, Development すべてにチェック
- **VITE_API_URL**: 必ず `/api` を末尾に追加
- **VITE_SOCKET_URL**: `/api` なしでバックエンドのベースURL

### 4. デプロイ後の確認
- デプロイ完了後、VercelのURLを取得
- そのURLをRailwayの `FRONTEND_URL` に設定

## 🔄 設定順序
1. VercelでRailwayのURLを環境変数に設定
2. Vercelデプロイ実行  
3. VercelのURLをRailwayの環境変数に設定
4. Railway再デプロイ