import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
  margin: 2rem 0 4rem 8rem;
  text-align: left;
  color: var(--text-color);
  position: relative;
  left: -2rem;
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

// Topics Explorer用のスタイル
const TopicsExplorerSection = styled.section`
  margin-bottom: 4rem;
  position: relative;
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlanetContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin-top: 2rem;
`;

const Planet = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--accent-color),rgba(138, 116, 217, 0.76));
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(156, 124, 244, 0.7);
`;

const Satellite = styled(motion(Link))`
  position: absolute;
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  border-radius: 50%;
  border: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 0 20px var(--accent-color);
    transform: scale(1.1);
  }
`;

// Weekly Highlights用のスタイル
const WeeklySection = styled.section`
  margin-bottom: 4rem;
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
`;

const CarouselContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  perspective: 1000px;
`;

const WeeklyCard = styled(motion.div)`
  background: var(--primary-color);
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 2rem;
  width: 300px;
  position: relative;
  cursor: pointer;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 0 30px rgba(156, 124, 244, 0.2);
  }
`;

const WeeklyTitle = styled.h3`
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const WeeklyContent = styled.p`
  color: var(--text-color);
  opacity: 0.8;
  font-size: 0.9rem;
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
              テクノロジー、音楽、スピリチュアル、健康、アート、そして政治。知的欲求が未来を創る。
            </HeroSubtitle>
          </motion.div>
        </HeroContent>
      </HeroSection>

      <TopicsExplorerSection>
        <SectionTitle>Topics Explorer</SectionTitle>
        <PlanetContainer>
          <Planet
            animate={{ 
              rotate: 360,
              scale: [1, 1.03, 1],
            }}
            transition={{ 
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          <Satellite
            to="/tech"
            style={{ top: 60, left: -95 }}
            whileHover={{ y: -5, scale: 1.1 }}
            animate={{ y: [-2, 2, -2] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          >
            Tech
          </Satellite>
          <Satellite
            to="/music"
            style={{ top: -45, left: -95 }}
            whileHover={{ y: -5, scale: 1.1 }}
            animate={{ y: [-2, 2, -2] }}
            transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
          >
            Music
          </Satellite>
          <Satellite
            to="/health"
            style={{ top: 45, right: -95 }}
            whileHover={{ y: -5, scale: 1.1 }}
            animate={{ y: [-2, 2, -2] }}
            transition={{ y: { duration: 4.6, repeat: Infinity, ease: "easeInOut" } }}
          >
            Health
          </Satellite>
          <Satellite
            to="/arts"
            style={{ top: 95, left: 0 }}
            whileHover={{ y: -5, scale: 1.1 }}
            animate={{ y: [-2, 2, -2] }}
            transition={{ y: { duration: 5.4, repeat: Infinity, ease: "easeInOut" } }}
          >
            Arts
          </Satellite>
          <Satellite
            to="/spiritual"
            style={{ top: -95, left: 0 }}
            whileHover={{ y: -5, scale: 1.1 }}
            animate={{ y: [-2, 2, -2] }}
            transition={{ y: { duration: 4.4, repeat: Infinity, ease: "easeInOut" } }}
          >
            Spiritual
          </Satellite>
          <Satellite
            to="/politics"
            style={{ top: -45, right: -95 }}
            whileHover={{ y: -5, scale: 1.1 }}
            animate={{ y: [-2, 2, -2] }}
            transition={{ y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" } }}
          >
            Politics
          </Satellite>
        </PlanetContainer>
      </TopicsExplorerSection>

      <MainGrid>
        <Link to="/tech/gibberlink" style={{ textDecoration: 'none', gridArea: '1 / 1 / 2 / 8', display: 'block' }}>
          <FeaturedArticle
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            gridArea="auto"
          >
            <ArticleBackground
              style={{
                backgroundImage: 'url(/images/wabe.png)',
              }}
            />
            <ArticleContent>
              <ArticleTag>AI技術</ArticleTag>
              <ArticleTitle>
                AI同士が独自言語で会話「GibberLink」が登場
              </ArticleTitle>
              <ArticleMeta>
                <span>2025年2月27日</span>
              </ArticleMeta>
            </ArticleContent>
          </FeaturedArticle>
        </Link>

        <FeaturedArticle
          gridArea="1 / 8 / 2 / 13"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <ArticleBackground
            style={{
              backgroundImage: 'url(/images/cat.png)',
            }}
          />
          <ArticleContent>
            <ArticleTag>スピリチュアル</ArticleTag>
            <ArticleTitle>
              現代社会における瞑想の重要性：科学的アプローチ
            </ArticleTitle>
            <ArticleMeta>
              <span>2025年2月21日</span>
            </ArticleMeta>
          </ArticleContent>
        </FeaturedArticle>
      </MainGrid>

      <TrendingSection>
        <SectionTitle>Trending Now</SectionTitle>
        <TrendingGrid>
          <Link to="/music/subculture" style={{ textDecoration: 'none' }}>
            <TrendingCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
            <TrendingImage
              src="/images/hose.png"
              alt="Health Article"
            />
            <TrendingContent>
              <ArticleTag>健康</ArticleTag>
              <ArticleTitle>
                最新の睡眠科学が解き明かす、質の高い睡眠の秘密
              </ArticleTitle>
              <ArticleMeta>
                <span>2025年2月20日</span>
              </ArticleMeta>
            </TrendingContent>
            </TrendingCard>
          </Link>

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
                <span>2025年2月19日</span>
              </ArticleMeta>
            </TrendingContent>
          </TrendingCard>

          <Link to="/music/subculture" style={{ textDecoration: 'none' }}>
            <TrendingCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <TrendingImage
                src="/images/guer.png"
                alt="Music Article"
              />
              <TrendingContent>
                <ArticleTag>音楽</ArticleTag>
                <ArticleTitle>
                  界隈曲の世界：カオスと中毒性が織りなす音楽文化
                </ArticleTitle>
                <ArticleMeta>
                  <span>2025年2月18日</span>
                </ArticleMeta>
              </TrendingContent>
            </TrendingCard>
          </Link>
        </TrendingGrid>
      </TrendingSection>


    <WeeklySection>
      <SectionTitle>Weekly Highlights</SectionTitle>
      <CarouselContainer>
        <WeeklyCard
          whileHover={{ rotateY: 5, rotateX: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <WeeklyTitle>AIと倫理：今週の重要な議論</WeeklyTitle>
          <WeeklyContent>
            AI開発における倫理的な課題と、その解決に向けた取り組みについての詳細なレポート。
          </WeeklyContent>
        </WeeklyCard>
        <WeeklyCard
          whileHover={{ rotateY: 5, rotateX: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <WeeklyTitle>未来の働き方：リモートワークの新展開</WeeklyTitle>
          <WeeklyContent>
            最新のテクノロジーがもたらす、働き方改革とオフィスカルチャーの変革について。
          </WeeklyContent>
        </WeeklyCard>
        <WeeklyCard
          whileHover={{ rotateY: 5, rotateX: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <WeeklyTitle>デジタルアートの新時代</WeeklyTitle>
          <WeeklyContent>
            NFTとブロックチェーン技術が、アート業界にもたらす革新的な変化とは。
          </WeeklyContent>
        </WeeklyCard>
      </CarouselContainer>
    </WeeklySection>
    </Container>
  );
};

export default HomePage;
