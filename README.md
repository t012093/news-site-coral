# news-site-coral

テクノロジー、スピリチュアル、健康、アート、政治など多様なトピックスを扱うモダンなニュース・マガジンサイト

## 技術スタック

- React + TypeScript + Vite
- Emotion (スタイリング)
- Framer Motion (アニメーション)
- React Router (ルーティング)

## 開発環境のセットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

## ESLint設定

プロダクション用にTypeScript対応のESLint設定を有効にする場合:

```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

## プロジェクト構造

```
src/
  ├── components/     # 再利用可能なコンポーネント
  ├── pages/         # ページコンポーネント
  ├── styles/        # グローバルスタイル
  ├── App.tsx        # メインアプリケーション
  └── main.tsx       # エントリーポイント
