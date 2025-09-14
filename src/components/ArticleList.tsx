import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { ArticleCard } from './ArticleCard';
import { Article } from '../types/wordpress';

const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 360px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 360px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const LoadingCard = styled(motion.div)`
  background: var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #2a2a2a;
  height: 400px;
`;

const LoadingImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #2a2a2a 0%, #3a3a3a 50%, #2a2a2a 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const LoadingContent = styled.div`
  padding: 1.5rem;
`;

const LoadingText = styled.div<{ width?: string; height?: string }>`
  background: linear-gradient(90deg, #2a2a2a 0%, #3a3a3a 50%, #2a2a2a 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '16px'};
  margin-bottom: 0.5rem;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-color);
  opacity: 0.7;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const LoadMoreButton = styled(motion.button)`
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin: 2rem auto;
  display: block;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(156, 124, 244, 0.8);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ArticleListProps {
  articles: Article[];
  loading?: boolean;
  error?: string | null;
  columns?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  hasMore?: boolean;
}

export const ArticleList = ({
  articles,
  loading = false,
  error = null,
  columns = 3,
  showLoadMore = false,
  onLoadMore,
  loadingMore = false,
  hasMore = false,
}: ArticleListProps) => {
  // ローディング状態
  if (loading) {
    return (
      <LoadingGrid>
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingCard
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <LoadingImage />
            <LoadingContent>
              <LoadingText width="60%" height="12px" />
              <LoadingText width="100%" height="20px" />
              <LoadingText width="80%" height="16px" />
              <LoadingText width="100%" height="16px" />
              <LoadingText width="40%" height="12px" />
            </LoadingContent>
          </LoadingCard>
        ))}
      </LoadingGrid>
    );
  }

  // エラー状態
  if (error) {
    return (
      <ErrorState>
        <h3>エラーが発生しました</h3>
        <p>{error}</p>
        <p>WordPressサイトの接続を確認してください。</p>
      </ErrorState>
    );
  }

  // 記事が0件の場合
  if (!articles || articles.length === 0) {
    return (
      <EmptyState>
        <h3>記事が見つかりません</h3>
        <p>現在表示する記事がありません。</p>
      </EmptyState>
    );
  }

  return (
    <>
      <Grid columns={columns}>
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </Grid>

      {showLoadMore && hasMore && (
        <LoadMoreButton
          onClick={onLoadMore}
          disabled={loadingMore}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loadingMore ? '読み込み中...' : 'もっと見る'}
        </LoadMoreButton>
      )}
    </>
  );
};