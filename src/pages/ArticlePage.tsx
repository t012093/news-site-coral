import { useParams, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { usePost, useRelatedPosts } from '../hooks/useWordPress';
import { ArticleCard } from '../components/ArticleCard';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ArticleHeader = styled.header`
  margin-bottom: 3rem;
  text-align: center;
`;

const CategoryTag = styled.span`
  background-color: var(--accent-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ArticleTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  color: var(--text-color);
  opacity: 0.8;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AuthorAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const FeaturedImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 3rem;
`;

const ArticleContent = styled.div`
  max-width: 800px;
  margin: 0 auto 4rem;
  line-height: 1.8;
  font-size: 1.1rem;
  color: var(--text-color);

  h1, h2, h3, h4, h5, h6 {
    margin: 2rem 0 1rem;
    color: var(--text-color);
  }

  p {
    margin-bottom: 1.5rem;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5rem 0;
  }

  blockquote {
    border-left: 4px solid var(--accent-color);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    opacity: 0.9;
  }

  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  code {
    background: rgba(156, 124, 244, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9em;
  }

  pre {
    background: #1a1a1a;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5rem 0;

    code {
      background: none;
      padding: 0;
    }
  }
`;

const TagsSection = styled.footer`
  max-width: 800px;
  margin: 0 auto 3rem;
  padding-top: 2rem;
  border-top: 1px solid #2a2a2a;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Tag = styled.span`
  background: rgba(156, 124, 244, 0.1);
  color: var(--accent-color);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(156, 124, 244, 0.3);
`;

const RelatedSection = styled.section`
  margin-top: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--text-color);
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-color);
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #ff6b6b;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-color);
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = usePost(slug!);
  
  const categoryIds = article?.categories.map(cat => cat.id) || [];
  const { data: relatedData } = useRelatedPosts(
    article?.id || 0,
    categoryIds,
    3
  );

  if (isLoading) {
    return (
      <Container>
        <LoadingState>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ display: 'inline-block' }}
          >
            ⚡
          </motion.div>
          <p>記事を読み込み中...</p>
        </LoadingState>
      </Container>
    );
  }

  if (error || !article) {
    return (
      <Container>
        <ErrorState>
          <h2>記事が見つかりません</h2>
          <p>指定された記事が存在しないか、読み込みに失敗しました。</p>
          <BackLink to="/">← ホームに戻る</BackLink>
        </ErrorState>
      </Container>
    );
  }

  const primaryCategory = article.categories[0];

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BackLink to="/">← 記事一覧に戻る</BackLink>

        <ArticleHeader>
          {primaryCategory && (
            <CategoryTag>{primaryCategory.name}</CategoryTag>
          )}
          <ArticleTitle>{article.title}</ArticleTitle>
          <ArticleMeta>
            <AuthorInfo>
              {article.author.avatar && (
                <AuthorAvatar
                  src={article.author.avatar}
                  alt={article.author.name}
                />
              )}
              <span>{article.author.name}</span>
            </AuthorInfo>
            <time>
              {format(new Date(article.date), 'yyyy年MM月dd日', { locale: ja })}
            </time>
            {article.readingTime && (
              <span>読了時間: {article.readingTime}分</span>
            )}
          </ArticleMeta>
        </ArticleHeader>

        {article.featuredImage && (
          <FeaturedImage
            src={article.featuredImage.sizes.large || article.featuredImage.url}
            alt={article.featuredImage.alt || article.title}
          />
        )}

        <ArticleContent
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.tags.length > 0 && (
          <TagsSection>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>
              タグ
            </h3>
            <TagsList>
              {article.tags.map((tag) => (
                <Tag key={tag.id}>{tag.name}</Tag>
              ))}
            </TagsList>
          </TagsSection>
        )}

        {relatedData?.posts && relatedData.posts.length > 0 && (
          <RelatedSection>
            <SectionTitle>関連記事</SectionTitle>
            <RelatedGrid>
              {relatedData.posts.slice(0, 3).map((relatedArticle) => (
                <ArticleCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                />
              ))}
            </RelatedGrid>
          </RelatedSection>
        )}
      </motion.div>
    </Container>
  );
};