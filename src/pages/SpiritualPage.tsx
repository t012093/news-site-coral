import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.header`
  text-align: center;
  margin-bottom: 4rem;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)),
    url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80')
    center/cover no-repeat;
  background-size: cover;
  background-position: center;
  padding: 6rem 2rem;
  color: white;
  border-radius: 12px;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-family: var(--font-secondary);
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FeaturedSection = styled.section`
  margin-bottom: 4rem;
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

const FeaturedArticle = styled(motion.a)`
  display: block;
  text-decoration: none;
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

const SideArticle = styled(motion.a)`
  display: block;
  text-decoration: none;
  grid-column: span 4;
  display: flex;
  flex-direction: column;
  background: var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #2a2a2a;

  @media (max-width: 1024px) {
    grid-column: span 6;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const SmallArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  gap: 2rem;
  margin-top: 2rem;
`;

const ArticleCard = styled(motion.a)`
  display: block;
  text-decoration: none;
  background: var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #2a2a2a;
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
`;

const ArticleContent = styled.div`
  padding: 2rem;
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

const ContentOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
`;

const ArticleTitle = styled.h2<{ isLight?: boolean }>`
  font-size: ${props => props.isLight ? '2.8rem' : '1.8rem'};
  line-height: 1.2;
  color: ${props => props.isLight ? 'white' : 'var(--text-color)'};
`;

const ArticleExcerpt = styled.p<{ isLight?: boolean }>`
  color: ${props => props.isLight ? 'rgba(255, 255, 255, 0.9)' : 'var(--secondary-color)'};
  line-height: 1.6;
  font-size: 1.1rem;
  margin-top: 1rem;
`;

const QuoteSection = styled.section`
  text-align: center;
  margin: 4rem 0;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f6f0ff 0%,rgb(75, 75, 114) 100%);
  border-radius: 12px;
`;

const Quote = styled.blockquote`
  font-size: 2rem;
  font-family: var(--font-secondary);
  color: var(--primary-color);
  max-width: 800px;
  margin: 0 auto 1.5rem;
  line-height: 1.4;

  &::before {
    content: '"';
  }

  &::after {
    content: '"';
  }
`;

const QuoteAuthor = styled.cite`
  font-size: 1.2rem;
  color: var(--secondary-color);
  font-style: normal;
`;

const SpiritualPage = () => {
  return (
    <Container>
      <PageHeader>
        <PageTitle>Spiritual Journey</PageTitle>
        <PageDescription>
          古代の智慧と現代の科学が交差する場所で、意識の探求と内なる気付きの旅へ
        </PageDescription>
      </PageHeader>

      <FeaturedSection>
        <ArticleGrid>
          <FeaturedArticle
            href="/articles/gift-of-ignorance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ArticleImage
              src="/images/zou.png"
              alt="Meditation and Mindfulness"
              style={{ height: '600px' }}
            />
            <ContentOverlay>
              <ArticleTag>無知の知</ArticleTag>
              <ArticleTitle isLight>
                無知の知：内なる叡智への旅
              </ArticleTitle>
              <ArticleExcerpt isLight>
                「無知の知」から学ぶ、深い洞察と実践的なアプローチを探ります。
              </ArticleExcerpt>
            </ContentOverlay>
          </FeaturedArticle>

          <SideArticle
            href="/articles/gift-of-ignorance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ArticleImage
              src="/images/hebi.png"
              alt="Sacred Geometry"
              style={{ height: '300px' }}
            />
            <ArticleContent>
              <ArticleTag>神聖幾何学</ArticleTag>
              <ArticleTitle>神聖幾何学：宇宙の数学的パターンと意識の進化</ArticleTitle>
              <ArticleExcerpt>
                自然界に見られる数学的パターンと、古代文明がそれらをどのように理解し、活用していたのかを考察します。
              </ArticleExcerpt>
            </ArticleContent>
          </SideArticle>
        </ArticleGrid>

        <SmallArticleGrid>
          <ArticleCard
            href="/articles/gift-of-ignorance"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleImage
              src="/images/hebi.png"
              alt="Sacred Geometry"
            />
            <ArticleContent>
              <ArticleTag>神聖幾何学</ArticleTag>
              <ArticleTitle>神聖幾何学：宇宙の数学的パターンと意識の進化</ArticleTitle>
              <ArticleExcerpt>
                自然界に見られる数学的パターンと、古代文明がそれらをどのように理解し、活用していたのかを考察します。
              </ArticleExcerpt>
            </ArticleContent>
          </ArticleCard>

          <ArticleCard
            href="/article/mushroom-consciousness"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleImage
              src="images/she.png"
              alt="Sacred Mushrooms"
            />
            <ArticleContent>
              <ArticleTag>民族植物学</ArticleTag>
              <ArticleTitle>キノコと意識：古代文明の知恵を探る</ArticleTitle>
              <ArticleExcerpt>
                世界各地の伝統文化で重要な役割を果たしてきた菌類と、その現代医療における可能性について。
              </ArticleExcerpt>
            </ArticleContent>
          </ArticleCard>

          <ArticleCard
            href="/article/astrology-psychology"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleImage
              src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&q=80"
              alt="Astrology"
            />
            <ArticleContent>
              <ArticleTag>占星術</ArticleTag>
              <ArticleTitle>現代科学の視点から見る占星術の心理学的意義</ArticleTitle>
              <ArticleExcerpt>
                ユングの元型理論と現代心理学の観点から、占星術が持つ自己理解とパーソナルグロースのツールとしての可能性を考察。
              </ArticleExcerpt>
            </ArticleContent>
          </ArticleCard>
        </SmallArticleGrid>
      </FeaturedSection>

      <QuoteSection>
        <Quote>
        手にしている真理でもなく思想でもなく、真理を見出すためにどれだけ真摯な努力をしてきたかがその人の価値を決める。
        </Quote>
        <QuoteAuthor>- Gotthold Ephraim Lessing 1778</QuoteAuthor>
      </QuoteSection>
    </Container>
  );
};

export default SpiritualPage;
