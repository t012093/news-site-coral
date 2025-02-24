import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.header`
  margin-bottom: 4rem;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgb(76, 37, 73) 0%, rgb(145, 37, 89) 100%);
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
  height: 200px;
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

const ReadMore = styled(motion.a)`
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  
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

const MusicPage = () => {
  return (
    <Container>
      <PageHeader>
        <PageTitle>Music</PageTitle>
        <PageDescription>
          現代の音楽シーンから、サブカルチャーまで。
          多様な音楽カルチャーの今をお届けします。
        </PageDescription>
      </PageHeader>

      <FeaturedSection>
        <SectionTitle>Featured Stories</SectionTitle>
        <FeaturedGrid>
          <FeaturedCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.location.href = '/music/subculture'}
          >
            <FeaturedBackground
              style={{
                backgroundImage: 'url(/images/pixel.png)',
              }}
            />
            <FeaturedContent>
              <ArticleTag>音楽</ArticleTag>
              <ArticleTitle>
                界隈曲の世界：カオスと中毒性が織りなす音楽文化
              </ArticleTitle>
              <ArticleMeta>
                <span>2025年2月23日</span>
              </ArticleMeta>
            </FeaturedContent>
          </FeaturedCard>

          <FeaturedCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FeaturedBackground
              style={{
                backgroundImage: 'url(/images/she8.png)',
              }}
            />
            <FeaturedContent>
              <ArticleTag>インタビュー</ArticleTag>
              <ArticleTitle>
                次世代の音楽クリエイター：AIとの共創が生み出す新しい表現
              </ArticleTitle>
              <ArticleMeta>
                <span>2025年2月21日</span>
              </ArticleMeta>
            </FeaturedContent>
          </FeaturedCard>
        </FeaturedGrid>
      </FeaturedSection>

      <MainGrid>
        <ArticleCard
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.location.href = '/music/barbapapa'}
        >
          <ArticleImage
            src="/images/baba.png"
            alt="バーバパパ"
          />
          <ArticleContent>
            <ArticleTag>クリエイター</ArticleTag>
            <ArticleTitle>
              バーバパパ：シュールとカオスが織りなす映像音楽の世界
            </ArticleTitle>
            <ArticleExcerpt>
              謎に包まれたクリエイターの作品世界を探る。独特の映像表現と
              中毒性のある音楽で、多くの視聴者を魅了し続けている現象に迫る。
            </ArticleExcerpt>
            <ArticleMeta>
              <span>2025年2月24日</span>
              <ReadMore
                href="/music/barbapapa"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                続きを読む →
              </ReadMore>
            </ArticleMeta>
          </ArticleContent>
        </ArticleCard>

        <ArticleCard
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <ArticleImage
            src="/images/she15.png"
            alt="Street Music"
          />
          <ArticleContent>
            <ArticleTag>ストリート</ArticleTag>
            <ArticleTitle>
              都市と音楽：進化するストリートミュージックシーン
            </ArticleTitle>
            <ArticleExcerpt>
              SNSやライブ配信の普及により、新たな展開を見せる
              ストリートミュージックカルチャーの現在。
            </ArticleExcerpt>
            <ArticleMeta>
              <span>2025年2月19日</span>
              <ReadMore
                href="/music/street-music-evolution"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                続きを読む →
              </ReadMore>
            </ArticleMeta>
          </ArticleContent>
        </ArticleCard>

        <ArticleCard
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <ArticleImage
            src="/images/she55.png"
            alt="Music Technology"
          />
          <ArticleContent>
            <ArticleTag>テクノロジー</ArticleTag>
            <ArticleTitle>
              没入型音楽体験の未来：VRライブの可能性
            </ArticleTitle>
            <ArticleExcerpt>
              バーチャルライブ空間での演奏から、インタラクティブな
              音楽体験まで。テクノロジーが変える音楽の楽しみ方。
            </ArticleExcerpt>
            <ArticleMeta>
              <span>2025年2月18日</span>
              <ReadMore
                href="/music/vr-live-future"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                続きを読む →
              </ReadMore>
            </ArticleMeta>
          </ArticleContent>
        </ArticleCard>
      </MainGrid>
    </Container>
  );
};

export default MusicPage;
