import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { wordPressAPI } from '../lib/wordpress';
import { WordPressQueryParams } from '../types/wordpress';

// 記事一覧取得フック
export function usePosts(params: WordPressQueryParams = {}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => wordPressAPI.getPosts(params),
    staleTime: 1000 * 60 * 5, // 5分
  });
}

// 記事詳細取得フック
export function usePost(identifier: string | number) {
  return useQuery({
    queryKey: ['post', identifier],
    queryFn: () => wordPressAPI.getPost(identifier),
    enabled: !!identifier,
    staleTime: 1000 * 60 * 10, // 10分
  });
}

// カテゴリー一覧取得フック
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => wordPressAPI.getCategories(),
    staleTime: 1000 * 60 * 30, // 30分
  });
}

// タグ一覧取得フック
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => wordPressAPI.getTags(),
    staleTime: 1000 * 60 * 30, // 30分
  });
}

// カテゴリー別記事取得フック
export function usePostsByCategory(categorySlug: string, params: WordPressQueryParams = {}) {
  return useQuery({
    queryKey: ['posts', 'category', categorySlug, params],
    queryFn: () => wordPressAPI.getPostsByCategory(categorySlug, params),
    enabled: !!categorySlug,
    staleTime: 1000 * 60 * 5, // 5分
  });
}

// 検索フック
export function useSearchPosts(query: string, params: WordPressQueryParams = {}) {
  return useQuery({
    queryKey: ['posts', 'search', query, params],
    queryFn: () => wordPressAPI.searchPosts(query, params),
    enabled: !!query && query.length > 2, // 3文字以上で検索
    staleTime: 1000 * 60 * 2, // 2分
  });
}

// 無限スクロール用フック
export function useInfinitePosts(params: WordPressQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ['posts', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => 
      wordPressAPI.getPosts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = Math.ceil(lastPage.total / (params.per_page || 10));
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5分
  });
}

// 最近の記事取得フック（特定の数だけ）
export function useRecentPosts(count: number = 5) {
  return useQuery({
    queryKey: ['posts', 'recent', count],
    queryFn: () => wordPressAPI.getPosts({ per_page: count, orderby: 'date', order: 'desc' }),
    staleTime: 1000 * 60 * 10, // 10分
  });
}

// 人気記事取得フック（コメント数順など）
export function usePopularPosts(count: number = 5) {
  return useQuery({
    queryKey: ['posts', 'popular', count],
    queryFn: () => wordPressAPI.getPosts({ per_page: count, orderby: 'comment_count', order: 'desc' }),
    staleTime: 1000 * 60 * 15, // 15分
  });
}

// 関連記事取得フック
export function useRelatedPosts(articleId: number, categoryIds: number[] = [], count: number = 3) {
  return useQuery({
    queryKey: ['posts', 'related', articleId, categoryIds, count],
    queryFn: async () => {
      if (categoryIds.length === 0) {
        return { posts: [], total: 0, totalPages: 0 };
      }
      
      const params: WordPressQueryParams = {
        per_page: count + 1, // 現在の記事を除外するため+1
        categories: categoryIds.join(','),
        exclude: [articleId],
      };
      
      return wordPressAPI.getPosts(params);
    },
    enabled: !!articleId && categoryIds.length > 0,
    staleTime: 1000 * 60 * 15, // 15分
  });
}

// プリフェッチ用フック（ページ遷移前にデータを取得）
export function usePrefetchPost(identifier: string | number) {
  const queryClient = wordPressAPI;
  
  const prefetch = () => {
    if (!identifier) return;
    
    queryClient.getPosts({ include: [Number(identifier)] });
  };

  return { prefetch };
}

// WordPress API接続状態確認フック
export function useWordPressStatus() {
  return useQuery({
    queryKey: ['wordpress', 'status'],
    queryFn: async () => {
      try {
        const result = await wordPressAPI.getPosts({ per_page: 1 });
        return {
          connected: true,
          apiInfo: wordPressAPI.getApiInfo(),
          postsCount: result.total,
        };
      } catch (error) {
        return {
          connected: false,
          apiInfo: wordPressAPI.getApiInfo(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5分
    retry: 1,
  });
}