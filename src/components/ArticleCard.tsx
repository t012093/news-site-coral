import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Article } from '../types/wordpress';

const Card = styled(motion.article)`
  background: var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px #000000;
  border: 1px solid #2a2a2a;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 8px 30px #000000;
  }
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    aspect-ratio: 16/9;
  }
  
  @media (max-width: 480px) {
    aspect-ratio: 4/3;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  background: var(--primary-color);
  color: var(--text-color);
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const CategoryTag = styled.span`
  background-color: var(--accent-color);
  color: #FFFFFF;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
  width: fit-content;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.7rem;
    margin-bottom: 0.6rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  flex: 1;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.3;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.2;
    margin-bottom: 0.4rem;
  }
`;

const CardExcerpt = styled.p`
  color: var(--text-color);
  opacity: 0.8;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.8rem;
    -webkit-line-clamp: 2;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.6rem;
    line-height: 1.4;
  }
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-top: auto;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    gap: 0.2rem;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuthorAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

interface ArticleCardProps {
  article: Article;
  size?: 'small' | 'medium' | 'large';
}

export const ArticleCard = ({ article, size = 'medium' }: ArticleCardProps) => {
  // カテゴリーの最初の一つを表示
  const primaryCategory = article.categories[0];
  
  // 画像URLの取得（サイズに応じて）
  const getImageUrl = () => {
    if (!article.featuredImage) {
      return '/images/coral.png'; // デフォルト画像
    }
    
    switch (size) {
      case 'small':
        return article.featuredImage.sizes.thumbnail || article.featuredImage.url;
      case 'large':
        return article.featuredImage.sizes.large || article.featuredImage.url;
      default:
        return article.featuredImage.sizes.medium || article.featuredImage.url;
    }
  };

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
    } catch {
      return '日付不明';
    }
  };

  return (
    <Link to={`/article/${article.slug}`} style={{ textDecoration: 'none', height: '100%' }}>
      <Card
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        layout
      >
        <CardImage
          src={getImageUrl()}
          alt={article.featuredImage?.alt || article.title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/coral.png';
          }}
        />
        <CardContent>
          {primaryCategory && (
            <CategoryTag>{primaryCategory.name}</CategoryTag>
          )}
          <CardTitle>{article.title}</CardTitle>
          {article.excerpt && (
            <CardExcerpt>{article.excerpt}</CardExcerpt>
          )}
          <CardMeta>
            <AuthorInfo>
              {article.author.avatar && (
                <AuthorAvatar
                  src={article.author.avatar}
                  alt={article.author.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <span>{article.author.name}</span>
            </AuthorInfo>
            <time>{formatDate(article.date)}</time>
          </CardMeta>
        </CardContent>
      </Card>
    </Link>
  );
};