import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.header`
  position: relative;
  text-align: center;
  margin-bottom: 4rem;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #c2e9fb 0%, #e3f2ff 100%);
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
  color: var(--primary-color);
  position: relative;
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  color: var(--secondary-color);
  position: relative;
  line-height: 1.6;
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
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const ArticleContent = styled.div`
  padding: 2rem;
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
`;

const ArticleExcerpt = styled.p`
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;
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
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const WidgetTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
`;

const TrendingList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TrendingItem = styled(motion.li)`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const TrendingTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const TrendingMeta = styled.div`
  font-size: 0.9rem;
  color: var(--secondary-color);
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
          <FeaturedArticle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
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
