# 🔧 CORS設定更新ガイド

## 📋 確認済み情報
- **Vercel本番URL**: https://coral-network.com
- **Railway URL**: （まだ確認が必要）

## 🚂 Railway設定更新

Railway Console で以下の環境変数を更新：

```bash
# CORS設定更新
FRONTEND_URL=https://coral-network.com

# 追加で設定すべき環境変数（まだ未設定の場合）
HOST=0.0.0.0
PORT=$PORT
```

## 🌐 Vercel設定確認

Vercel Console で以下の環境変数が正しく設定されているか確認：

```bash
# バックエンドAPI設定（RailwayのURLに置き換え）
VITE_API_URL=https://your-railway-domain.railway.app/api
VITE_SOCKET_URL=https://your-railway-domain.railway.app

# WordPress API設定
VITE_WP_API_URL=https://coral-news.wordpress.com/wp-json/wp/v2
VITE_WP_DEBUG=false
```

## 🔄 更新手順
1. RailwayでFRONTEND_URLを `https://coral-network.com` に更新
2. Railway再デプロイ
3. フルスタック動作確認

## 📝 次に必要な情報
**RailwayのバックエンドURL**を教えてください。
例: `https://your-project-name.railway.app`