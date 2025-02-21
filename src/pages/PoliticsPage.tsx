import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.header`
  margin-bottom: 4rem;
  padding: 4rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 12px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const TopStory = styled(motion.article)`
  margin-bottom: 4rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const TopStoryImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const TopStoryContent = styled.div`
  padding: 2rem;
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

const ArticleTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const ArticleMeta = styled.div`
  display: flex;
  gap: 2rem;
  color: var(--secondary-color);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const ArticleExcerpt = styled.p`
  color: var(--secondary-color);
  line-height: 1.6;
  margin-bottom: 2rem;
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

const NewsSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--accent-color);
`;

const NewsGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const NewsCard = styled(motion.article)`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const NewsContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NewsTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const Sidebar = styled.aside``;

const SidebarWidget = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const TrendingList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TrendingItem = styled(motion.li)`
  padding: 1rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const PoliticsPage = () => {
  return (
    <Container>
      <PageHeader>
        <PageTitle>Politics & Society</PageTitle>
        <PageDescription>
          政治、社会、そして私たちの未来。重要な課題と展望を深く掘り下げる分析をお届けします。
        </PageDescription>
      </PageHeader>

      <MainGrid>
        <MainContent>
          <TopStory
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TopStoryImage
              src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80"
              alt="Political Summit"
            />
            <TopStoryContent>
              <ArticleTag>国際政治</ArticleTag>
              <ArticleTitle>
                気候変動対策における国際協力の新たな枠組み：COP29への展望
              </ArticleTitle>
              <ArticleMeta>
                <span>By 鈴木健一</span>
                <span>2024年2月22日</span>
                <span>読了時間 10分</span>
              </ArticleMeta>
              <ArticleExcerpt>
                世界各国の環境政策と経済発展の両立を目指す新たな国際的な取り組みについて、
                専門家の見解と今後の展望を交えて詳しく解説します。
              </ArticleExcerpt>
              <ReadMoreLink
                href="/article/climate-cooperation"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                続きを読む →
              </ReadMoreLink>
            </TopStoryContent>
          </TopStory>

          <NewsSection>
            <SectionTitle>Latest Analysis</SectionTitle>
            <NewsGrid>
              <NewsCard
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <NewsImage
                  src="images/toudai.png"
                  alt="Digital Economy"
                />
                <NewsContent>
                  <ArticleTag>経済政策</ArticleTag>
                  <NewsTitle>
                    デジタル経済における規制と革新：新しい法制度の模索
                  </NewsTitle>
                  <ArticleMeta>
                    <span>2024年2月21日</span>
                  </ArticleMeta>
                </NewsContent>
              </NewsCard>

              <NewsCard
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <NewsImage
                  src="images/zou.png"
                  alt="Social Welfare"
                />
                <NewsContent>
                  <ArticleTag>社会保障</ArticleTag>
                  <NewsTitle>
                    高齢化社会における持続可能な社会保障制度の構築
                  </NewsTitle>
                  <ArticleMeta>
                    <span>2024年2月20日</span>
                  </ArticleMeta>
                </NewsContent>
              </NewsCard>
            </NewsGrid>
          </NewsSection>
        </MainContent>

        <Sidebar>
          <SidebarWidget>
            <SectionTitle>Trending Topics</SectionTitle>
            <TrendingList>
              <TrendingItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <NewsTitle>
                  <a href="/article/ai-regulation">
                    AI規制をめぐる国際的な議論の行方
                  </a>
                </NewsTitle>
                <ArticleMeta>
                  <span>3時間前</span>
                </ArticleMeta>
              </TrendingItem>

              <TrendingItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <NewsTitle>
                  <a href="/article/education-reform">
                    教育改革：デジタル時代の学びのあり方
                  </a>
                </NewsTitle>
                <ArticleMeta>
                  <span>6時間前</span>
                </ArticleMeta>
              </TrendingItem>

              <TrendingItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <NewsTitle>
                  <a href="/article/energy-policy">
                    再生可能エネルギー政策の転換点
                  </a>
                </NewsTitle>
                <ArticleMeta>
                  <span>12時間前</span>
                </ArticleMeta>
              </TrendingItem>
            </TrendingList>
          </SidebarWidget>

          <SidebarWidget>
            <SectionTitle>Opinion</SectionTitle>
            <ArticleExcerpt>
              各分野の専門家が、現代社会が直面する課題について
              独自の視点から分析と提言を行います。
            </ArticleExcerpt>
          </SidebarWidget>
        </Sidebar>
      </MainGrid>
    </Container>
  );
};

export default PoliticsPage;
