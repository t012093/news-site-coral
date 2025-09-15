import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEOHelmet from '../components/SEOHelmet';
import { Helmet } from 'react-helmet-async';
import { useRecentPosts, useWordPressStatus } from '../hooks/useWordPress';
import { ArticleList } from '../components/ArticleList';
import OptimizedImage from '../components/OptimizedImage';
import { PerformantMotion, optimizedAnimations, usePerformantAnimation } from '../components/PerformantMotion';

const Container = styled.div`
  padding: 2rem 1rem;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
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
  
  @media (max-width: 1024px) {
    height: 70vh;
    min-height: 500px;
  }
  
  @media (max-width: 768px) {
    height: 60vh;
    min-height: 400px;
    margin-bottom: 3rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    height: 50vh;
    min-height: 350px;
    margin-bottom: 2rem;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: brightness(0.7);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    max-width: 90%;
    padding: 0 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  
  @media (max-width: 1024px) {
    font-size: 3.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.2rem;
    line-height: 1.1;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (max-width: 1024px) {
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const FeaturedArticle = styled(motion.article)<{ gridArea: string }>`
  grid-area: ${props => props.gridArea};
  position: relative;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  
  @media (max-width: 1024px) {
    height: 400px;
  }
  
  @media (max-width: 768px) {
    height: 350px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    height: 300px;
    border-radius: 6px;
  }
`;

const ArticleBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: transform 0.3s ease;
  overflow: hidden;

  ${FeaturedArticle}:hover & {
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
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
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 0.6rem;
    line-height: 1.2;
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    gap: 1rem;
    font-size: 0.8rem;
    flex-direction: column;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    font-size: 0.75rem;
  }
`;

const FeaturedLinkWrapper = styled(Link)`
  text-decoration: none;
  grid-area: 1 / 1 / 2 / 8;
  display: block;
  
  @media (max-width: 768px) {
    grid-area: auto;
  }
`;

const SecondFeaturedWrapper = styled.div`
  grid-area: 1 / 8 / 2 / 13;
  
  @media (max-width: 768px) {
    grid-area: auto;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin: 2rem 0 4rem 8rem;
  text-align: left;
  color: var(--text-color);
  position: relative;
  left: -2rem;
  
  @media (max-width: 1024px) {
    font-size: 1.8rem;
    margin: 2rem 0 3rem 4rem;
    left: -1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin: 1.5rem 0 2rem 0;
    left: 0;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin: 1rem 0 1.5rem 0;
  }
`;

const TrendingSection = styled.section`
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`;

const TrendingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
  
  @media (max-width: 360px) {
    gap: 0.8rem;
  }
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

const TrendingImageContainer = styled.div`
  width: 100%;
  overflow: hidden;
  
  ${TrendingCard}:hover & > div {
    transform: scale(1.05);
  }
`;

const TrendingContent = styled.div`
  padding: 1.5rem;
  background: var(--primary-color);
  color: var(--text-color);
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

// Topics Explorer用のスタイル
const TopicsExplorerSection = styled.section`
  margin-bottom: 4rem;
  position: relative;
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 1024px) {
    min-height: 400px;
  }
  
  @media (max-width: 768px) {
    min-height: 350px;
    margin-bottom: 3rem;
  }
  
  @media (max-width: 480px) {
    min-height: 300px;
    margin-bottom: 2rem;
  }
`;

const PlanetContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    margin-top: 1.5rem;
  }
  
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    margin-top: 1rem;
  }
`;

const Planet = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--accent-color),rgba(138, 116, 217, 0.76));
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(156, 124, 244, 0.7);
`;

const Satellite = styled(Link)`
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
  font-size: 0.8rem;
  text-decoration: none;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 0 20px var(--accent-color);
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 0.7rem;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 0.6rem;
  }
`;

const EventsSatellite = styled(Satellite)`
  @media (max-width: 768px) {
    top: 80px !important;
    right: -50px !important;
    left: auto !important;
  }
  
  @media (max-width: 480px) {
    top: 75px !important;
    right: -40px !important;
    left: auto !important;
  }
`;


// Weekly Highlights用のスタイル
const WeeklySection = styled.section`
  margin-bottom: 4rem;
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    margin-bottom: 3rem;
    padding: 1.5rem 0;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 2rem;
    padding: 1rem 0;
  }
`;

const CarouselContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  perspective: 1000px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
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
  
  @media (max-width: 1024px) {
    width: 280px;
    padding: 1.8rem;
  }
  
  @media (max-width: 768px) {
    width: 90%;
    max-width: 400px;
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    width: 95%;
    padding: 1.2rem;
  }
`;

const WeeklyTitle = styled.h3`
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const WeeklyContent = styled.p`
  color: var(--text-color);
  opacity: 0.8;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const HomePage = () => {
  const { data: recentPosts, isLoading, error } = useRecentPosts(6);
  const { data: wpStatus } = useWordPressStatus();
  
  // Use performant animations based on user preferences and device capabilities
  const planetAnimation = usePerformantAnimation(
    {
      animate: { 
        rotate: 360,
        scale: [1, 1.03, 1],
      },
      transition: { 
        rotate: { duration: 40, repeat: Infinity, ease: "linear" },
        scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      }
    },
    optimizedAnimations.lightRotation
  );
  
  const heroAnimation = usePerformantAnimation(
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8 }
    },
    optimizedAnimations.slideUp
  );

  return (
    <>
      <SEOHelmet
        title="NPO法人 Open Coral Network"
        description="情報とプロジェクトで人がつながる。信頼できるコミュニティと、新しいコミュニティ型メディア『Coral Magazine』を運営するNPO法人 Open Coral Networkの公式サイト。テクノロジーとアートの力で社会を前進させます。"
        url="https://cora-network.com/"
        keywords="NPO法人, Open Coral Network, オープンコーラルネットワーク, Coral Magazine, コミュニティ, プロジェクト, 情報メディア, テクノロジー, アート"
      />
      {/* Organization & Website JSON-LD for richer entity understanding */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NonprofitOrganization',
            name: 'NPO法人 Open Coral Network',
            alternateName: 'オープンコーラルネットワーク',
            url: 'https://coral-network.com',
            logo: 'https://cora-network.com/images/coral6.png',
            foundingDate: '2025-07',
            description:
              '情報とプロジェクトで人がつながる、信頼できるコミュニティとコミュニティ型メディア「Coral Magazine」を運営するNPO法人。テクノロジーとアートで社会課題解決に取り組みます。',
            sameAs: [
              'https://twitter.com/opencoralnet'
            ],
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'JP'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: 'info@cora-network.com',
              availableLanguage: ['ja']
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            url: 'https://coral-network.com/',
            name: 'Coral Magazine - Open Coral Network',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://coral-network.com/?s={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })}
        </script>
      </Helmet>
      <Container>
      <HeroSection>
        <HeroBackground>
          <OptimizedImage
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
            alt="Future technology background"
            lazy={false}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </HeroBackground>
        <HeroContent>
          <PerformantMotion
            {...heroAnimation}
          >
            <HeroTitle>Discover The Future</HeroTitle>
            <HeroSubtitle>
              テクノロジー、音楽、スピリチュアル、健康、アート、そして政治。知的欲求が未来を創る。
            </HeroSubtitle>
          </PerformantMotion>
        </HeroContent>
      </HeroSection>

      <TopicsExplorerSection>
        <SectionTitle>Topics Explorer</SectionTitle>
        <PlanetContainer>
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, var(--accent-color),rgba(138, 116, 217, 0.76))',
              borderRadius: '50%',
              boxShadow: '0 0 30px rgba(156, 124, 244, 0.7)'
            }}
            {...planetAnimation}
          />
          <Satellite to="/tech" style={{ top: 60, left: -95 }}>
            Tech
          </Satellite>
          <Satellite to="/music" style={{ top: -45, left: -95 }}>
            Music
          </Satellite>
          <Satellite to="/health" style={{ top: 45, right: -95 }}>
            Health
          </Satellite>
          <Satellite to="/arts" style={{ top: 95, left: 0 }}>
            Arts
          </Satellite>
          <Satellite to="/spiritual" style={{ top: -95, left: 0 }}>
            Spiritual
          </Satellite>
          <Satellite to="/politics" style={{ top: -45, right: -95 }}>
            Politics
          </Satellite>
          <EventsSatellite to="/events" style={{ top: 80, right: -50 }}>
            Events
          </EventsSatellite>
        </PlanetContainer>
      </TopicsExplorerSection>

      <MainGrid>
        <FeaturedLinkWrapper to="/tech/gibberlink">
          <FeaturedArticle
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            gridArea="auto"
          >
            <ArticleBackground>
              <OptimizedImage
                src="/images/wabe.png"
                alt="AI技術記事のイメージ"
                lazy={true}
              />
            </ArticleBackground>
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
        </FeaturedLinkWrapper>

        <SecondFeaturedWrapper>
          <FeaturedArticle
            gridArea="auto"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
          <ArticleBackground>
            <OptimizedImage
              src="/images/cat.png"
              alt="スピリチュアル記事のイメージ"
              lazy={true}
            />
          </ArticleBackground>
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
        </SecondFeaturedWrapper>
      </MainGrid>

      <TrendingSection>
        <SectionTitle>Latest Articles</SectionTitle>
        {wpStatus && !wpStatus.connected && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            background: 'rgba(255, 193, 7, 0.1)', 
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '8px',
            marginBottom: '2rem',
            color: '#ffc107'
          }}>
            <p>WordPress接続待機中 - デモデータを表示しています</p>
            <small>設定: {wpStatus.apiInfo.baseURL}</small>
          </div>
        )}
        <ArticleList
          articles={recentPosts?.posts || []}
          loading={isLoading}
          error={error?.message || null}
          columns={3}
        />
      </TrendingSection>


    <WeeklySection>
      <SectionTitle>Weekly Highlights</SectionTitle>
      <CarouselContainer>
        <WeeklyCard
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <WeeklyTitle>AIと倫理：今週の重要な議論</WeeklyTitle>
          <WeeklyContent>
            AI開発における倫理的な課題と、その解決に向けた取り組みについての詳細なレポート。
          </WeeklyContent>
        </WeeklyCard>
        <WeeklyCard
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <WeeklyTitle>未来の働き方：リモートワークの新展開</WeeklyTitle>
          <WeeklyContent>
            最新のテクノロジーがもたらす、働き方改革とオフィスカルチャーの変革について。
          </WeeklyContent>
        </WeeklyCard>
        <WeeklyCard
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <WeeklyTitle>デジタルアートの新時代</WeeklyTitle>
          <WeeklyContent>
            NFTとブロックチェーン技術が、アート業界にもたらす革新的な変化とは。
          </WeeklyContent>
        </WeeklyCard>
      </CarouselContainer>
    </WeeklySection>
    </Container>
    </>
  );
};

export default HomePage;
