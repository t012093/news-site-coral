import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分間はデータを新鮮と見なす
      gcTime: 1000 * 60 * 30, // 30分間キャッシュを保持（旧cacheTime）
      retry: (failureCount, error: any) => {
        // ネットワークエラーの場合は3回まで再試行
        if (error?.code === 'NETWORK_ERROR') {
          return failureCount < 3;
        }
        // 404の場合は再試行しない
        if (error?.response?.status === 404) {
          return false;
        }
        // その他のエラーは1回だけ再試行
        return failureCount < 1;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: false,
    },
  },
});

// 開発環境でのみクエリデータをコンソールに出力
if (import.meta.env.DEV) {
  queryClient.getQueryCache().subscribe((event) => {
    if (event?.query?.queryKey) {
      console.log('Query Cache Event:', {
        type: event.type,
        queryKey: event.query.queryKey,
        state: event.query.state,
      });
    }
  });
}