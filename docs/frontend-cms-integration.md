# フロントエンド CMS連携ガイド

## 1. 必要なパッケージのインストール

```bash
npm install axios @tanstack/react-query date-fns
```

## 2. APIクライアントの設定

`src/lib/api.ts`を作成：

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_CMS_API_URL;
const API_TOKEN = import.meta.env.VITE_CMS_API_TOKEN;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

// レスポンスの型定義
export interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: {
      data: {
        attributes: {
          url: string;
          formats: {
            thumbnail: { url: string };
            small: { url: string };
            medium: { url: string };
            large: { url: string };
          };
        };
      };
    };
    category: {
      data: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    tags: {
      data: Array<{
        attributes: {
          name: string;
          slug: string;
        };
      }>;
    };
    author: {
      data: {
        attributes: {
          name: string;
          bio: string;
          avatar: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
      };
    };
    publishedAt: string;
    updatedAt: string;
  };
}

// APIクライアントの実装
export const articleApi = {
  // 記事一覧の取得
  getArticles: async (params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    tag?: string;
  }) => {
    const { data } = await api.get('/api/articles', {
      params: {
        ...params,
        populate: ['featuredImage', 'category', 'tags', 'author.avatar'],
      },
    });
    return data;
  },

  // 記事詳細の取得
  getArticle: async (slug: string) => {
    const { data } = await api.get(`/api/articles/${slug}`, {
      params: {
        populate: ['featuredImage', 'category', 'tags', 'author.avatar'],
      },
    });
    return data;
  },

  // カテゴリー一覧の取得
  getCategories: async () => {
    const { data } = await api.get('/api/categories');
    return data;
  },

  // タグ一覧の取得
  getTags: async () => {
    const { data } = await api.get('/api/tags');
    return data;
  },
};
```

## 3. React Queryの設定

`src/lib/queryClient.ts`を作成：

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分
      cacheTime: 1000 * 60 * 30, // 30分
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## 4. カスタムフックの実装

`src/hooks/useArticles.ts`を作成：

```typescript
import { useQuery } from '@tanstack/react-query';
import { articleApi } from '@/lib/api';

export function useArticles(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
}) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => articleApi.getArticles(params),
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleApi.getArticle(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => articleApi.getCategories(),
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => articleApi.getTags(),
  });
}
```

## 5. 記事一覧コンポーネントの実装

`src/components/ArticleList.tsx`を作成：

```typescript
import { useArticles } from '@/hooks/useArticles';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const ArticleList = ({
  category,
  tag,
  pageSize = 10,
}: {
  category?: string;
  tag?: string;
  pageSize?: number;
}) => {
  const { data, isLoading, error } = useArticles({
    category,
    tag,
    pageSize,
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data?.data.map((article) => (
        <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={article.attributes.featuredImage.data.attributes.formats.medium.url}
            alt={article.attributes.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">
              {article.attributes.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {article.attributes.excerpt}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{article.attributes.author.data.attributes.name}</span>
              <time>
                {format(new Date(article.attributes.publishedAt), 'yyyy年MM月dd日', {
                  locale: ja,
                })}
              </time>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
```

## 6. 記事詳細ページの実装

`src/pages/ArticlePage.tsx`を作成：

```typescript
import { useArticle } from '@/hooks/useArticles';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const ArticlePage = () => {
  const { slug } = useParams();
  const { data: article, isLoading, error } = useArticle(slug!);

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;
  if (!article) return <div>記事が見つかりません</div>;

  const { attributes } = article.data;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{attributes.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <img
              src={attributes.author.data.attributes.avatar.data.attributes.url}
              alt={attributes.author.data.attributes.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span>{attributes.author.data.attributes.name}</span>
          </div>
          <time>
            {format(new Date(attributes.publishedAt), 'yyyy年MM月dd日', {
              locale: ja,
            })}
          </time>
        </div>
      </header>

      <img
        src={attributes.featuredImage.data.attributes.formats.large.url}
        alt={attributes.title}
        className="w-full h-[400px] object-cover rounded-lg mb-8"
      />

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: attributes.content }}
      />

      <footer className="mt-8 pt-8 border-t">
        <div className="flex gap-2">
          {attributes.tags.data.map((tag) => (
            <span
              key={tag.attributes.slug}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              {tag.attributes.name}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
};
```

## 7. データの事前取得

`src/pages/HomePage.tsx`などのページコンポーネントでのデータ事前取得：

```typescript
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { articleApi } from '@/lib/api';

export const HomePage = () => {
  const queryClient = useQueryClient();

  // データの事前取得
  useEffect(() => {
    // メインコンテンツの事前取得
    queryClient.prefetchQuery({
      queryKey: ['articles', { pageSize: 10 }],
      queryFn: () => articleApi.getArticles({ pageSize: 10 }),
    });

    // サイドバーのカテゴリーとタグの事前取得
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: () => articleApi.getCategories(),
    });

    queryClient.prefetchQuery({
      queryKey: ['tags'],
      queryFn: () => articleApi.getTags(),
    });
  }, [queryClient]);

  return (
    // コンポーネントの実装
  );
};
```

## 8. キャッシュの最適化

### キャッシュの無効化（更新時）

```typescript
const queryClient = useQueryClient();

// 特定の記事のキャッシュを無効化
queryClient.invalidateQueries({ queryKey: ['article', slug] });

// カテゴリーの記事一覧を無効化
queryClient.invalidateQueries({ queryKey: ['articles', { category }] });
```

### キャッシュの永続化

```typescript
import { PersistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// QueryClientProviderでラップする際に設定
<PersistQueryClient
  client={queryClient}
  persistOptions={{ persister }}
>
  <App />
</PersistQueryClient>
```

## 9. エラーハンドリング

`src/lib/api.ts`に追加：

```typescript
// カスタムエラークラス
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
  }
}

// エラーハンドリングの実装
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      throw new APIError(
        error.response.data.message || 'APIエラーが発生しました',
        error.response.status,
        error.response.data
      );
    }
    throw new APIError(
      'ネットワークエラーが発生しました',
      0
    );
  }
);
```

## 10. SEO対策

`src/components/SEO.tsx`を作成：

```typescript
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  article?: boolean;
}

export const SEO = ({ title, description, image, article }: SEOProps) => {
  const siteTitle = 'CORAL';
  const defaultDescription = 'テクノロジー、スピリチュアル、健康、アートなど多様な情報を発信';
  
  return (
    <Helmet>
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description || defaultDescription} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || defaultDescription} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content={article ? 'article' : 'website'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};
