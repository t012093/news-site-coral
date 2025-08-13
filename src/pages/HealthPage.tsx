import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.header`
  position: relative;
  text-align: center;
  margin-bottom: 4rem;
  padding: 4rem 2rem;
  background: linear-gradient(135deg,rgb(224, 233, 240) 0%,rgb(49, 93, 132) 100%);
  border-radius: 12px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80')
      center/cover no-repeat;
    opacity: 0.1;
  }
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  color: white;
  position: relative;
  line-height: 1.6;
  opacity: 0.9;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 7fr 3fr;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const FeaturedArticle = styled(motion.article)`
  background: var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
  border: 1px solid #2a2a2a;
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const ArticleContent = styled.div`
  padding: 2rem;
  background: var(--primary-color);
  color: var(--text-color);
`;

const ArticleTag = styled.span`
  background-color: #a8e6cf;
  color: var(--primary-color);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ArticleTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
  color: white;
`;

const ArticleExcerpt = styled.p`
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ReadMoreLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  gap: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Sidebar = styled.aside``;

const SidebarWidget = styled.div`
  background: var(--primary-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #2a2a2a;
  color: var(--text-color);
`;

const WidgetTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
`;

const TrendingList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TrendingItem = styled(motion.li)`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #2a2a2a;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  a {
    color: white;
    text-decoration: none;
    
    &:hover {
      color: var(--accent-color);
    }
  }
`;

const TrendingTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  color: white;
`;

const TrendingMeta = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const HealthPage = () => {
  return (
    <Container>
      <PageHeader>
        <PageTitle>Health & Wellness</PageTitle>
        <PageDescription>
          心と体の調和を探求する：最新の健康科学とホリスティックなウェルネスアプローチ
        </PageDescription>
      </PageHeader>

      <ContentGrid>
        <MainContent>
          <Link to="/health/ai-sleep-science-revolution" style={{ textDecoration: 'none' }}>
            <FeaturedArticle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <FeaturedImage
                src="/images/labo.png"
                alt="AI Sleep Science"
              />
              <ArticleContent>
                <ArticleTag>AI睡眠科学</ArticleTag>
                <ArticleTitle>AI睡眠科学の革命：夢の解読から生体ハッキングまで</ArticleTitle>
                <ArticleExcerpt>
                  Mount Sinai医科大学の100万時間睡眠データ分析から日本の15.3%成長市場まで。
                  AIが睡眠の謎を解き明かし、バイオハッキングの新時代を切り開く。
                </ArticleExcerpt>
                <ReadMoreLink
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  続きを読む →
                </ReadMoreLink>
              </ArticleContent>
            </FeaturedArticle>
          </Link>

          <Link to="/health/offensive-defensive-vacation" style={{ textDecoration: 'none' }}>
            <FeaturedArticle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <FeaturedImage
                src="/images/she15.png"
                alt="Offensive and Defensive Vacation"
              />
              <ArticleContent>
                <ArticleTag>休暇哲学</ArticleTag>
                <ArticleTitle>攻めの休暇と守りの休暇：現代社会における「休み方」の哲学と科学</ArticleTitle>
                <ArticleExcerpt>
                  ハーバード大学の神経科学研究から東京大学の社会学調査まで。
                  休暇の本質を問い直し、人間存在の深層に迫る現代的考察。
                </ArticleExcerpt>
                <ReadMoreLink
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  続きを読む →
                </ReadMoreLink>
              </ArticleContent>
            </FeaturedArticle>
          </Link>

          <Link to="/health/hippocampus-memory" style={{ textDecoration: 'none' }}>
            <FeaturedArticle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <FeaturedImage
                src="/images/ai.png"
                alt="Hippocampus Memory Science"
              />
              <ArticleContent>
                <ArticleTag>神経科学</ArticleTag>
                <ArticleTitle>海馬という"シーン生成器"──記憶、境界拡張、そして人間の内なる空間地図</ArticleTitle>
                <ArticleExcerpt>
                  ロンドン大学の最新研究から明かされる記憶の真実。
                  海馬は単なる記憶装置ではなく、空間と時間を統合するクリエイティブな中枢である。
                </ArticleExcerpt>
                <ReadMoreLink
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  続きを読む →
                </ReadMoreLink>
              </ArticleContent>
            </FeaturedArticle>
          </Link>
          
          <FeaturedArticle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <FeaturedImage
              src="images/logo.png"
              alt="Mindful Eating"
            />
            <ArticleContent>
              <ArticleTag>マインドフルネス</ArticleTag>
              <ArticleTitle>意識的な食事：マインドフルイーティングの科学</ArticleTitle>
              <ArticleExcerpt>
                食事に対する意識的なアプローチが、消化機能の改善から感情的な健康まで、
                私たちの心身の健康にどのように影響を与えるのか、最新の研究結果をもとに解説します。
              </ArticleExcerpt>
              <ReadMoreLink
                href="/article/mindful-eating"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                続きを読む →
              </ReadMoreLink>
            </ArticleContent>
          </FeaturedArticle>
        </MainContent>

        <Sidebar>
          <SidebarWidget>
            <WidgetTitle>トレンドトピック</WidgetTitle>
            <TrendingList>
              <TrendingItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingTitle>
                  <a href="/article/circadian-rhythm">
                    サーカディアンリズムと健康：睡眠の質を改善する新しいアプローチ
                  </a>
                </TrendingTitle>
                <TrendingMeta>5分前に更新</TrendingMeta>
              </TrendingItem>
              
              <TrendingItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingTitle>
                  <a href="/article/gut-health">
                    腸内フローラ革命：最新の研究が示す健康との深い関係
                  </a>
                </TrendingTitle>
                <TrendingMeta>2時間前に更新</TrendingMeta>
              </TrendingItem>
              
              <TrendingItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingTitle>
                  <a href="/article/exercise-mindfulness">
                    運動とマインドフルネスの融合：新しいフィットネスのカタチ
                  </a>
                </TrendingTitle>
                <TrendingMeta>4時間前に更新</TrendingMeta>
              </TrendingItem>
            </TrendingList>
          </SidebarWidget>

          <SidebarWidget>
            <WidgetTitle>今月の注目トピック</WidgetTitle>
            <ArticleTag style={{ marginBottom: '1rem' }}>栄養学</ArticleTag>
            <ArticleExcerpt>
              食事療法、サプリメント、そして最新の栄養科学の発見について、
              エキスパートたちの知見を集めた特集をお届けします。
            </ArticleExcerpt>
          </SidebarWidget>
        </Sidebar>
      </ContentGrid>
    </Container>
  );
};

export default HealthPage;
