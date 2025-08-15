# Vercel環境変数設定手順

## 1. Vercelダッシュボードにアクセス
1. https://vercel.com にアクセス
2. プロジェクト `news-site-coral` を選択

## 2. 環境変数の設定
Settings > Environment Variables から以下を設定：

### 必須の環境変数
```
VITE_API_URL = https://[your-railway-backend-url]/api
VITE_SOCKET_URL = https://[your-railway-backend-url]
```

### Railway バックエンドURLの確認方法
1. Railway ダッシュボードにアクセス
2. `news-site-coral-backend` プロジェクトを選択
3. Settings > Domains でURLを確認
4. 例: `https://news-site-coral-backend-production.up.railway.app`

### 設定例
```
VITE_API_URL = https://news-site-coral-backend-production.up.railway.app/api
VITE_SOCKET_URL = https://news-site-coral-backend-production.up.railway.app
```

## 3. 再デプロイ
環境変数を設定後、Vercelで再デプロイをトリガー：
- Deployments タブから "Redeploy" をクリック

## 4. WordPress API CORS問題の対処
現在、WordPress APIは `demo.wp-api.org` を使用していますが、CORSエラーが発生しています。
以下の対処法があります：

### オプション1: プロキシサーバーを経由
バックエンドにプロキシエンドポイントを追加

### オプション2: 別のWordPress APIを使用
CORSが許可されているAPIに変更

### オプション3: モックデータを使用
開発/デモ用にモックデータを使用