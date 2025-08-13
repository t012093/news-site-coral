# CORAL ニュースサイト Headless WordPress CMS 連携設計

## 概要

CORALサイトをHeadless WordPress CMSと連携し、コンテンツ管理の効率化とスケーラビリティを向上させる設計です。

## 現在のサイト構成

### フロントエンド
- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite 6.3.4
- **スタイリング**: Emotion (`@emotion/react`, `@emotion/styled`)
- **アニメーション**: Framer Motion 12.4.7
- **ルーティング**: React Router DOM 7.2.0
- **デプロイ**: Vercel

### コンテンツ構造
- **カテゴリー**: Tech, Music, Spiritual, Health, Arts, Politics
- **記事管理**: 現在は静的TSXファイル（手動管理）
- **画像**: public/images/に静的配置

## Headless WordPress CMS アーキテクチャ

### WordPress設定

#### 1. WordPress インスタンス設定
- **ホスティング**: WordPress.com Business / WP Engine / 独自サーバー
- **ドメイン**: cms.coral-news.com（推奨）
- **SSL**: 必須
- **PHP**: 8.1以上推奨

#### 2. 必要プラグイン
```
- WPGraphQL（GraphQL API）
- Advanced Custom Fields（カスタムフィールド）
- Yoast SEO（SEO最適化）
- JWT Authentication（認証）
- CORS Headers（CORS設定）
- WP REST API Cache（キャッシュ）
```

#### 3. カスタム投稿タイプ
```php
// functions.php
register_post_type('article', [
    'public' => true,
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'article',
    'graphql_plural_name' => 'articles',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
    'taxonomies' => ['category', 'post_tag']
]);
```

### データスキーマ

#### 記事エンティティ
```typescript
interface WordPressArticle {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  acf: {
    featured_image_alt?: string;
    article_subtitle?: string;
    reading_time?: number;
    author_bio?: string;
    related_articles?: number[];
  };
  _embedded: {
    'wp:featuredmedia': Array<{
      source_url: string;
      alt_text: string;
      media_details: {
        sizes: {
          thumbnail: { source_url: string };
          medium: { source_url: string };
          large: { source_url: string };
          full: { source_url: string };
        };
      };
    }>;
    'wp:term': Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}
```

## フロントエンド実装

### 1. API設定

#### 環境変数 (.env.local)
```env
VITE_WP_API_URL=https://cms.coral-news.com/wp-json/wp/v2
VITE_WP_GRAPHQL_URL=https://cms.coral-news.com/graphql
VITE_WP_AUTH_TOKEN=your_jwt_token
```

#### APIクライアント (src/lib/wordpress.ts)
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_WP_API_URL;

export const wpApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API関数
export const wordPressAPI = {
  // 記事一覧取得
  getArticles: async (params?: {
    page?: number;
    per_page?: number;
    categories?: string;
    tags?: string;
    search?: string;
  }) => {
    const { data } = await wpApi.get('/articles', {
      params: {
        ...params,
        _embed: true, // メディアとタクソノミー情報を含める
      },
    });
    return data;
  },

  // 記事詳細取得
  getArticle: async (slug: string) => {
    const { data } = await wpApi.get('/articles', {
      params: {
        slug,
        _embed: true,
      },
    });
    return data[0];
  },

  // カテゴリー一覧
  getCategories: async () => {
    const { data } = await wpApi.get('/categories');
    return data;
  },

  // タグ一覧
  getTags: async () => {
    const { data } = await wpApi.get('/tags');
    return data;
  },
};
```

### 2. React Query統合

#### パッケージ追加
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

#### Query Client設定 (src/lib/queryClient.ts)
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分
      gcTime: 1000 * 60 * 30, // 30分（旧cacheTime）
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 3. カスタムフック (src/hooks/useWordPress.ts)

```typescript
import { useQuery } from '@tanstack/react-query';
import { wordPressAPI } from '@/lib/wordpress';

export function useArticles(params?: {
  page?: number;
  per_page?: number;
  categories?: string;
  tags?: string;
}) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => wordPressAPI.getArticles(params),
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => wordPressAPI.getArticle(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => wordPressAPI.getCategories(),
  });
}
```

### 4. コンポーネントの更新

#### ArticleCard コンポーネント
```typescript
import { WordPressArticle } from '@/types/wordpress';

interface ArticleCardProps {
  article: WordPressArticle;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const featuredImage = article._embedded?.['wp:featuredmedia']?.[0];
  const categories = article._embedded?.['wp:term']?.[0] || [];
  
  return (
    <FeaturedArticle>
      <ArticleBackground
        style={{
          backgroundImage: `url(${featuredImage?.source_url})`,
        }}
      />
      <ArticleContent>
        <ArticleTag>
          {categories[0]?.name || 'ニュース'}
        </ArticleTag>
        <ArticleTitle>
          {article.title.rendered}
        </ArticleTitle>
        <ArticleMeta>
          <span>{new Date(article.date).toLocaleDateString('ja-JP')}</span>
        </ArticleMeta>
      </ArticleContent>
    </FeaturedArticle>
  );
};
```

## データ移行計画

### 1. フェーズ1: WordPress環境構築（1週間）
- WordPressインスタンスのセットアップ
- 必要プラグインのインストールと設定
- カスタム投稿タイプとフィールドの作成
- REST API/GraphQLの設定とテスト

### 2. フェーズ2: フロントエンド統合（1-2週間）
- React Query の統合
- WordPress API クライアントの実装
- 既存コンポーネントのWordPressデータ対応
- ルーティングの動的化

### 3. フェーズ3: コンテンツ移行（1週間）
- 既存記事のWordPressへの移行
- 画像ファイルのWordPressメディアライブラリへ移行
- カテゴリーとタグの設定
- SEO設定の移行

### 4. フェーズ4: 最適化とテスト（1週間）
- パフォーマンス最適化
- キャッシュ戦略の実装
- エラーハンドリング強化
- プロダクション環境での検証

## パフォーマンス最適化

### 1. キャッシュ戦略
```typescript
// ISR相当の実装
export async function generateStaticParams() {
  const articles = await wordPressAPI.getArticles({ per_page: 100 });
  return articles.map((article: WordPressArticle) => ({
    slug: article.slug,
  }));
}
```

### 2. 画像最適化
- WordPressの画像最適化プラグイン（Smush, Optimole）
- レスポンシブ画像の自動生成
- WebP対応

### 3. CDNとキャッシュ
```typescript
// Vercel Edge Functions活用
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const response = await wordPressAPI.getArticles();
  
  return new Response(JSON.stringify(response), {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'Content-Type': 'application/json',
    },
  });
}
```

## SEO対策

### 1. メタデータ管理
```typescript
// WordPressからSEOデータ取得
export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  const article = await wordPressAPI.getArticle(params.slug);
  
  return {
    title: article.title.rendered,
    description: article.excerpt.rendered.replace(/<[^>]*>/g, ''),
    openGraph: {
      title: article.title.rendered,
      description: article.excerpt.rendered.replace(/<[^>]*>/g, ''),
      images: [article._embedded?.['wp:featuredmedia']?.[0]?.source_url],
    },
  };
};
```

### 2. サイトマップ自動生成
- WordPress XML Sitemaps プラグイン活用
- フロントエンドでのサイトマップ統合

## セキュリティ対策

### 1. WordPress セキュリティ
- ログインページの変更
- 2FA認証の有効化
- セキュリティプラグイン（Wordfence）
- 定期的なバックアップ

### 2. API セキュリティ
```php
// JWT認証設定
add_filter('jwt_auth_whitelist', function($whitelist) {
    $whitelist[] = '/wp-json/wp/v2/articles';
    return $whitelist;
});
```

## 運用とメンテナンス

### 1. 自動化
- GitHub Actions でのデプロイ自動化
- WordPressプラグインの自動更新
- セキュリティ監視

### 2. バックアップ戦略
- 毎日の自動バックアップ
- AWS S3 / Google Cloud Storage連携
- 復旧手順の文書化

### 3. 監視
- Uptime監視（UptimeRobot）
- パフォーマンス監視（New Relic）
- エラー監視（Sentry）

## 必要リソース

### 技術的要件
- WordPress ホスティング: $20-100/月
- CDN (Cloudflare): 無料-$20/月
- 監視ツール: $10-50/月

### 開発工数
- 総工数: 4-5週間（1人）
- WordPress構築: 1週間
- フロントエンド実装: 1-2週間
- 移行作業: 1週間
- テスト・最適化: 1週間

## 次のステップ

1. WordPress ホスティング環境の決定
2. ドメイン設定（cms.coral-news.com）
3. WordPress プラグインの検証
4. プロトタイプ開発の開始

このアーキテクチャにより、コンテンツ管理の効率化とスケーラビリティの向上を実現できます。