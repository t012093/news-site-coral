import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.header`
  margin-bottom: 4rem;
  padding: 4rem 2rem;
  background: linear-gradient(135deg,rgb(37, 37, 76) 0%,rgb(37, 105, 145) 100%);
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
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const ArticleTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const ArticleExcerpt = styled.p`
  color: var(--secondary-color);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
`;

const ArticleMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--secondary-color);
  font-size: 0.9rem;
`;

const ReadMore = styled(motion.span)`
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FeaturedSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedCard = styled(motion.article)`
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
`;

const FeaturedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;

  ${FeaturedCard}:hover & {
    transform: scale(1.05);
  }
`;

const FeaturedContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: white;
`;

const TechPage = () => {
  return (
    <Container>
      <PageHeader>
        <PageTitle>Technology</PageTitle>
        <PageDescription>
          最先端のテクノロジーから、私たちの暮らしを変える革新的なアイデアまで。
          未来を形作る技術の今をお届けします。
        </PageDescription>
      </PageHeader>

      <FeaturedSection>
        <SectionTitle>Featured Stories</SectionTitle>
        <FeaturedGrid>
          <Link to="/tech/gibberlink" style={{ textDecoration: 'none' }}>
            <FeaturedCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <FeaturedBackground
                style={{
                  backgroundImage: 'url(/images/wabe.png)',
                }}
              />
              <FeaturedContent>
                <ArticleTag>AI技術</ArticleTag>
                <ArticleTitle>
                  ElevenLabsが革新的なAI通信プロトコル「GibberLink」を発表
                </ArticleTitle>
                <ArticleMeta>
                  <span>2025年2月27日</span>
                </ArticleMeta>
              </FeaturedContent>
            </FeaturedCard>
          </Link>

          <Link to="/article/web3-future" style={{ textDecoration: 'none' }}>
            <FeaturedCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <FeaturedBackground
                style={{
                  backgroundImage: 'url(/images/zou.png)',
                }}
              />
              <FeaturedContent>
                <ArticleTag>Web3</ArticleTag>
                <ArticleTitle>
                  分散型インターネットの未来：Web3が変える世界
                </ArticleTitle>
                <ArticleMeta>
                  <span>2025年2月21日</span>
                </ArticleMeta>
              </FeaturedContent>
            </FeaturedCard>
          </Link>
        </FeaturedGrid>
      </FeaturedSection>

      <MainGrid>
        <Link to="/tech/ai-writing" style={{ textDecoration: 'none' }}>
          <ArticleCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <ArticleImage
              src="/images/ai.png"
              alt="Robotics"
            />
            <ArticleContent>
              <ArticleTag>ロボティクス</ArticleTag>
              <ArticleTitle>
                AI時代のライティング：ライターとニュースサイトの未来
              </ArticleTitle>
              <ArticleExcerpt>
                AI技術の進化がもたらすライティングの変革と、ニュースサイトの未来像を探ります。
              </ArticleExcerpt>
              <ArticleMeta>
                <span>2025年2月20日</span>
                <ReadMore
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  続きを読む →
                </ReadMore>
              </ArticleMeta>
            </ArticleContent>
          </ArticleCard>
        </Link>

        <Link to="/article/metaverse-now" style={{ textDecoration: 'none' }}>
          <ArticleCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <ArticleImage
              src="/images/pixel2.png"
              alt="VR Technology"
            />
            <ArticleContent>
              <ArticleTag>VR/AR</ArticleTag>
              <ArticleTitle>
                メタバースの現在地：仮想世界がもたらす新たな可能性
              </ArticleTitle>
              <ArticleExcerpt>
                教育、医療、エンターテインメント。様々な分野で広がる
                VR/AR技術の活用事例と今後の展望を探る。
              </ArticleExcerpt>
              <ArticleMeta>
                <span>2025年2月19日</span>
                <ReadMore
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  続きを読む →
                </ReadMore>
              </ArticleMeta>
            </ArticleContent>
          </ArticleCard>
        </Link>

        <Link to="/article/space-development" style={{ textDecoration: 'none' }}>
          <ArticleCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <ArticleImage
              src="/images/UFO.png"
              alt="Space Technology"
            />
            <ArticleContent>
              <ArticleTag>宇宙開発</ArticleTag>
              <ArticleTitle>
                民間宇宙開発の新時代：月面開発計画の実現へ
              </ArticleTitle>
              <ArticleExcerpt>
                商業宇宙飛行から月面基地建設まで。加速する民間企業の
                宇宙開発プロジェクトの最新動向。
              </ArticleExcerpt>
              <ArticleMeta>
                <span>2025年2月18日</span>
                <ReadMore
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  続きを読む →
                </ReadMore>
              </ArticleMeta>
            </ArticleContent>
          </ArticleCard>
        </Link>
      </MainGrid>
    </Container>
  );
};

export default TechPage;
