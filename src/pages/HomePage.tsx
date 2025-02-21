import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  position: relative;
  height: 80vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-bottom: 4rem;
  overflow: hidden;
  border-radius: 12px;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  filter: brightness(0.7);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeaturedArticle = styled(motion.article)<{ gridArea: string }>`
  grid-area: ${props => props.gridArea};
  position: relative;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
`;

const ArticleBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;

  ${FeaturedArticle}:hover & {
    transform: scale(1.05);
  }
`;

const ArticleContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: white;
`;

const ArticleTag = styled.span`
  background-color: var(--accent-color);
  color: #FFFFFF;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ArticleTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const ArticleMeta = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--text-color);
`;

const TrendingSection = styled.section`
  margin-bottom: 4rem;
`;

const TrendingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TrendingCard = styled(motion.article)`
  background: var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px #000000;
  border: 1px solid #2a2a2a;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px #000000;
  }
`;

const TrendingImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${TrendingCard}:hover & {
    transform: scale(1.05);
  }
`;

const TrendingContent = styled.div`
  padding: 1.5rem;
  background: var(--primary-color);
  color: var(--text-color);
`;

const HomePage = () => {
  return (
    <Container>
      <HeroSection>
        <HeroBackground />
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroTitle>Discover The Future</HeroTitle>
            <HeroSubtitle>
              テクノロジー、スピリチュアル、健康、アート、そして政治。
              私たちの世界を形作る重要なトピックスをお届けします。
            </HeroSubtitle>
          </motion.div>
        </HeroContent>
      </HeroSection>

      <MainGrid>
        <FeaturedArticle
          gridArea="1 / 1 / 2 / 8"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <ArticleBackground
            style={{
              backgroundImage: 'url(/images/UFO.png)',
            }}
          />
          <ArticleContent>
            <ArticleTag>テクノロジー</ArticleTag>
            <ArticleTitle>
              量子コンピューティングが切り開く、新時代のAI技術
            </ArticleTitle>
            <ArticleMeta>
              <span>By 山田太郎</span>
              <span>2024年2月22日</span>
            </ArticleMeta>
          </ArticleContent>
        </FeaturedArticle>

        <FeaturedArticle
          gridArea="1 / 8 / 2 / 13"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <ArticleBackground
            style={{
              backgroundImage: 'url(/images/hebi.png)',
            }}
          />
          <ArticleContent>
            <ArticleTag>スピリチュアル</ArticleTag>
            <ArticleTitle>
              現代社会における瞑想の重要性：科学的アプローチ
            </ArticleTitle>
            <ArticleMeta>
              <span>By 佐藤美咲</span>
              <span>2024年2月21日</span>
            </ArticleMeta>
          </ArticleContent>
        </FeaturedArticle>
      </MainGrid>

      <TrendingSection>
        <SectionTitle>Trending Now</SectionTitle>
        <TrendingGrid>
          <TrendingCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <TrendingImage
              src="/images/tokyo.png"
              alt="Health Article"
            />
            <TrendingContent>
              <ArticleTag>健康</ArticleTag>
              <ArticleTitle>
                最新の睡眠科学が解き明かす、質の高い睡眠の秘密
              </ArticleTitle>
              <ArticleMeta>
                <span>2024年2月20日</span>
              </ArticleMeta>
            </TrendingContent>
          </TrendingCard>

          <TrendingCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <TrendingImage
              src="/images/gumi.png"
              alt="Art Article"
            />
            <TrendingContent>
              <ArticleTag>アート</ArticleTag>
              <ArticleTitle>
                NFTアートが変える、現代アートシーンの新たな展開
              </ArticleTitle>
              <ArticleMeta>
                <span>2024年2月19日</span>
              </ArticleMeta>
            </TrendingContent>
          </TrendingCard>

          <TrendingCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <TrendingImage
              src="/images/city.png"
              alt="Politics Article"
            />
            <TrendingContent>
              <ArticleTag>政治</ArticleTag>
              <ArticleTitle>
                気候変動対策：各国の取り組みと今後の展望
              </ArticleTitle>
              <ArticleMeta>
                <span>2024年2月18日</span>
              </ArticleMeta>
            </TrendingContent>
          </TrendingCard>
        </TrendingGrid>
      </TrendingSection>
    </Container>
  );
};

export default HomePage;
