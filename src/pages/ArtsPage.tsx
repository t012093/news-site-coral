import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.header`
  position: relative;
  margin-bottom: 4rem;
  padding: 6rem 2rem;
  background: linear-gradient(to right,rgb(255, 152, 152) 0%,rgba(64, 95, 155, 0.64) 100%);
  border-radius: 12px;
  overflow: hidden;
  color: white;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedArticle = styled(motion.article)`
  grid-column: span 8;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  min-height: 600px;

  @media (max-width: 1024px) {
    grid-column: span 6;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const SideArticle = styled(motion.article)`
  grid-column: span 4;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    grid-column: span 6;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const ArticleImage = styled.img<{ isLarge?: boolean }>`
  width: 100%;
  height: ${props => props.isLarge ? '600px' : '300px'};
  object-fit: cover;
  border-radius: 12px;
`;

const ContentOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
`;

const ArticleContent = styled.div`
  padding: 1.5rem;
  background: var(--primary-color);
  color: var(--text-color);
`;

const ArticleTag = styled.span`
  background-color: var(--accent-color);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ArticleTitle = styled.h2<{ isLight?: boolean }>`
  font-size: ${props => props.isLight ? '2.5rem' : '1.8rem'};
  margin-bottom: 1rem;
  line-height: 1.3;
  color: ${props => props.isLight ? 'white' : 'var(--text-color)'};
`;

const ArticleExcerpt = styled.p<{ isLight?: boolean }>`
  color: ${props => props.isLight ? 'rgba(255, 255, 255, 0.9)' : 'var(--secondary-color)'};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const CategorySection = styled.section`
  margin-bottom: 4rem;
`;

const CategoryTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const SmallArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const SmallArticle = styled(motion.article)`
  background: var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #2a2a2a;
`;

const ArtsPage = () => {
  return (
    <Container>
      <PageHeader>
        <PageTitle>Arts & Culture</PageTitle>
        <PageDescription>
          アートとカルチャーが交差する場所。創造性と表現の最前線をお届けします。
        </PageDescription>
      </PageHeader>

      <ArticleGrid>
        <FeaturedArticle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ArticleImage
            src="images/she55.png"
            alt="Digital Art Revolution"
            isLarge
          />
          <ContentOverlay>
            <ArticleTag>デジタルアート</ArticleTag>
            <ArticleTitle isLight>
              AIとアーティストの共創：デジタルアートの新時代
            </ArticleTitle>
            <ArticleExcerpt isLight>
              人工知能がアーティストの創造性をどのように拡張し、新しい表現の可能性を生み出しているのか。
              最前線で活躍するクリエイターたちの声を交えて探ります。
            </ArticleExcerpt>
          </ContentOverlay>
        </FeaturedArticle>

        <SideArticle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ArticleImage
            src="images/hato.png"
            alt="Music Evolution"
          />
          <ArticleContent>
            <ArticleTag>音楽</ArticleTag>
            <ArticleTitle>
              ジャンルの境界を超えて：現代音楽の実験的アプローチ
            </ArticleTitle>
            <ArticleExcerpt>
              従来の音楽ジャンルの枠を超えた新しい音楽表現の潮流を、気鋭のミュージシャンたちの作品とともに紹介。
            </ArticleExcerpt>
          </ArticleContent>
        </SideArticle>
      </ArticleGrid>

      <CategorySection>
        <CategoryTitle>Latest in Culture</CategoryTitle>
        <SmallArticleGrid>
          <SmallArticle
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleImage
              src="images/coral2.png"
              alt="Fashion Trends"
            />
            <ArticleContent>
              <ArticleTag>ファッション</ArticleTag>
              <ArticleTitle>
                サステナブルファッションの新潮流
              </ArticleTitle>
              <ArticleExcerpt>
                環境に配慮したファッションの最新トレンドと、それを牽引するデザイナーたち。
              </ArticleExcerpt>
            </ArticleContent>
          </SmallArticle>

          <SmallArticle
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleImage
              src="images/chat.png"
              alt="Theater Performance"
            />
            <ArticleContent>
              <ArticleTag>舞台芸術</ArticleTag>
              <ArticleTitle>
                現代演劇における観客参加型の実験
              </ArticleTitle>
              <ArticleExcerpt>
                デジタル技術を活用した新しい演劇体験の可能性を探る。
              </ArticleExcerpt>
            </ArticleContent>
          </SmallArticle>

          <SmallArticle
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleImage
              src="images/man9.png"
              alt="Street Art"
            />
            <ArticleContent>
              <ArticleTag>ストリートアート</ArticleTag>
              <ArticleTitle>
                都市空間を変容させるパブリックアート
              </ArticleTitle>
              <ArticleExcerpt>
                世界各地で展開される革新的なストリートアートプロジェクトを特集。
              </ArticleExcerpt>
            </ArticleContent>
          </SmallArticle>
        </SmallArticleGrid>
      </CategorySection>
    </Container>
  );
};

export default ArtsPage;
