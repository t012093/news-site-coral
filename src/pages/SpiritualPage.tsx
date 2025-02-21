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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const ArticleCard = styled(motion.article)`
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

const ArticleTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const ArticleExcerpt = styled.p`
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  line-height: 1.6;
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
          <ArticleCard
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleImage
              src="https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&q=80"
              alt="Meditation Practice"
            />
            <ArticleContent>
              <ArticleTag>マインドフルネス</ArticleTag>
              <ArticleTitle>脳科学が解き明かす瞑想の驚くべき効果</ArticleTitle>
              <ArticleExcerpt>
                最新のニューロイメージング研究が、長期的な瞑想実践が脳の構造と機能にもたらす重要な変化を明らかにしています。
              </ArticleExcerpt>
              <ReadMoreLink
                href="/article/meditation-science"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                続きを読む →
              </ReadMoreLink>
            </ArticleContent>
          </ArticleCard>

          <ArticleCard
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
              <ReadMoreLink
                href="/article/mushroom-consciousness"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                続きを読む →
              </ReadMoreLink>
            </ArticleContent>
          </ArticleCard>

          <ArticleCard
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
              <ReadMoreLink
                href="/article/astrology-psychology"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                続きを読む →
              </ReadMoreLink>
            </ArticleContent>
          </ArticleCard>
        </ArticleGrid>
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
