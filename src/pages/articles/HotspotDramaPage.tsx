import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  position: relative;
  height: 60vh;
  min-height: 500px;
  margin-bottom: 4rem;
  background-image: url('/images/hotspot/14.png');
  background-size: cover;
  background-position: center;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
  }
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  color: white;
  text-align: center;
`;

const ArticleHeader = styled.header`
  position: relative;
  z-index: 1;
`;

const ArticleTitle = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
`;

const ArticleTag = styled(motion.span)`
  background-color: var(--accent-color);
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ArticleDate = styled.span`
  font-size: 1rem;
  opacity: 0.9;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 6fr 3fr;
  gap: 6rem;
  margin: 0 auto;
  padding: 0 2rem;
  max-width: 1400px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 0 2rem;
  }
`;

const MainContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ArticleContent = styled(motion.div)`
  line-height: 1.8;
  font-size: 1.2rem;
  color: var(--text-color);
  
  p {
    margin-bottom: 2rem;
    letter-spacing: 0.02em;
  }

  h2 {
    font-size: 2rem;
    margin: 3rem 0 1.5rem;
    color: var(--accent-color);
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  img {
    width: 100%;
    max-width: 600px;
    border-radius: 12px;
    margin: 2rem auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: block;
  }

  .image-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 2rem 0;

    img {
      margin: 0;
    }
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 2rem;
  height: fit-content;
`;

const SidebarWidget = styled.div`
  background: var(--primary-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #2a2a2a;
`;

const WidgetTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: var(--accent-color);
  font-weight: 600;
`;

const ViewingList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ViewingItem = styled.li`
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ViewingLink = styled(motion.a)`
  display: block;
  color: var(--text-color);
  text-decoration: none;
  padding: 0.8rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const RelatedSection = styled.div`
  margin: 4rem 0;
`;

const RelatedTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--accent-color);
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RelatedCard = styled(motion.a)`
  display: block;
  text-decoration: none;
  color: inherit;
  background: var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const RelatedImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const RelatedContent = styled.div`
  padding: 1.5rem;
`;

const RelatedArticleTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
`;

const RelatedArticleMeta = styled.div`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const BackButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  margin: 4rem 0;
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  
  &::before {
    content: '←';
    margin-right: 0.5rem;
    transition: transform 0.2s ease;
  }
  
  &:hover::before {
    transform: translateX(-5px);
  }
`;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const HotspotDramaPage = () => {
  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <ArticleHeader>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ArticleTitle>ドラマ『ホットスポット』の魅力とは？</ArticleTitle>
              <ArticleMeta>
                <ArticleTag
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  ドラマレビュー
                </ArticleTag>
                <ArticleDate>2025年2月24日</ArticleDate>
              </ArticleMeta>
            </motion.div>
          </ArticleHeader>
        </HeroContent>
      </HeroSection>

      <ContentLayout>
        <MainContent>
          <ArticleContent
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <p>
              2025年1月期の冬ドラマとして放送中の『ホットスポット』が、多くの視聴者から高い評価を受けています。この作品の人気の理由を、脚本、キャスト、演出の3つの視点から紐解いていきます。
            </p>



            <h2>1. バカリズム脚本の独自性</h2>
            <p>
              『ホットスポット』の脚本を手掛けるのは、お笑いタレントのバカリズム。彼の作品は日常の何気ない瞬間を丁寧に切り取ることで知られています。本作も、富士山麓の田舎町にあるビジネスホテルを舞台に、シングルマザーの主人公・遠藤清美と、同僚の高橋（実は宇宙人！）が織りなす日常をユーモラスかつ温かい視点で描いています。
            </p>
            
            
            <p>
              特筆すべきは、非日常的な「宇宙人」という要素を持ち込みながらも、決して派手なSFではなく、日常のささいな出来事を中心に物語を展開させている点です。このギャップが、視聴者に新鮮な驚きと共感を与えています。
            </p>
            <img src="/images/hotspot/hotspot1.png" alt="ホットスポット メインビジュアル" />

            <h2>2. 実力派キャストによる自然な演技</h2>
            <p>
              主演を務める市川実日子をはじめ、角田晃広、鈴木杏、平岩紙、夏帆、坂井真紀といった実力派俳優が脇を固めています。特に、市川実日子の飄々とした演技と、角田晃広演じる「普通の中年男性にしか見えない宇宙人」の掛け合いが絶妙です。
            </p>
            <p>
              このキャスト陣が生み出すリアルな会話劇は、まるで本当にその場にいるような感覚を与え、視聴者を引き込みます。「何気ない雑談が心地よい」「どのキャラも愛おしくなる」といった声が多く寄せられているのも納得です。
            </p>

            <div className="image-grid">
            
              <img src="/images/hotspot/5.png" alt="キャストの会話シーン" />
            </div>

            <h2>3. 丁寧な演出と映像美</h2>
            <p>
              『ホットスポット』は、日常の小さなドラマを美しく切り取る映像演出も魅力の一つです。富士山麓の静かな町の風景、ホテル内の温かみのある照明、登場人物たちのさりげない仕草など、細部にわたるこだわりが作品の世界観を支えています。
            </p>
            <p>
              また、ドラマのテンポ感も秀逸です。過剰な演出に頼ることなく、会話と間を大切にしたシンプルな構成が、視聴者に心地よい余韻を残します。
            </p>

            <img src="/images/hotspot/4.png" alt="富士山麓の風景" />

            <h2>4. なぜこの作品が心に響くのか？</h2>
            <p>
              『ホットスポット』の人気の背景には、日常の中にある楽しさや幸せを再認識させてくれるという点も挙げられます。現代では、何かを成し遂げなければならない、夢を追いかけなければならないというプレッシャーが多くの人にのしかかっています。その一方で、本作のような作品は「何気ない日常の中にある幸せ」や「小さな出来事の尊さ」に気づかせてくれるのです。
            </p>
            <p>
              ついつい刺激的なコンテンツに埋もれてしまいがちな時代だからこそ、『ホットスポット』のような静かで温かな物語が、多くの人の心に響くのかもしれません。
            </p>

            <div className="image-grid">
              <img src="/images/hotspot/8.png" alt="日常のワンシーン1" />
              <img src="/images/hotspot/11.png" alt="日常のワンシーン2" />
            </div>

            <h2>配信サービス</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: 'linear-gradient(180deg, var(--primary-color) 0%, rgba(42, 42, 42, 0.8) 100%)',
                padding: '2.5rem',
                borderRadius: '16px',
                marginTop: '2rem',
                marginBottom: '3rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <h3 style={{ 
                  color: 'var(--accent-color)',
                  fontSize: '1.4rem',
                  marginBottom: '1.5rem',
                  fontWeight: '600'
                }}>
                  『ホットスポット』配信プラットフォーム
                </h3>
                <p style={{ 
                  marginBottom: '2rem',
                  fontSize: '1.1rem',
                  color: 'var(--secondary-color)',
                  lineHeight: '1.6'
                }}>
                  以下の動画配信サービスで本作をお楽しみいただけます
                </p>
                <motion.div
                  style={{
                    display: 'grid',
                    gap: '1rem'
                  }}
                >
                  <motion.a
                    href="https://tver.jp/series/sr8bc2gtho"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '1.2rem 1.5rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-color)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.3rem' }}>TVer</strong>
                      <span style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>最新話の見逃し配信（1週間限定）</span>
                    </div>
                    <span style={{ fontSize: '1.2rem' }}>→</span>
                  </motion.a>

                  <motion.a
                    href="https://www.hulu.jp/the-hot-spot?autoplay=true&pn-series=500018451"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '1.2rem 1.5rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-color)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.3rem' }}>Hulu</strong>
                      <span style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>全話配信中</span>
                    </div>
                    <span style={{ fontSize: '1.2rem' }}>→</span>
                  </motion.a>

                  <motion.a
                    href="https://www.netflix.com/jp/title/81985186"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '1.2rem 1.5rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-color)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.3rem' }}>Netflix</strong>
                      <span style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>全話配信中</span>
                    </div>
                    <span style={{ fontSize: '1.2rem' }}>→</span>
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>

            <RelatedSection>
              <RelatedTitle>おすすめ記事</RelatedTitle>
              <RelatedGrid>
                <RelatedCard 
                  href="/arts/japanese-movie-2025"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <RelatedImage src="/images/hotspot/3.png" alt="Japanese Movies 2025" />
                  <RelatedContent>
                    <RelatedArticleTitle>
                      2025年、注目の新作ドラマ特集
                    </RelatedArticleTitle>
                    <RelatedArticleMeta>
                      期待の新作から話題作まで、今期のドラマ情報をお届け
                    </RelatedArticleMeta>
                  </RelatedContent>
                </RelatedCard>

                <RelatedCard
                  href="/arts/theater-evolution"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <RelatedImage src="/images/hotspot/14.png" alt="Modern Theater" />
                  <RelatedContent>
                    <RelatedArticleTitle>
                      ドラマ撮影の舞台裏に密着
                    </RelatedArticleTitle>
                    <RelatedArticleMeta>
                      制作現場のこだわりと、作品に込められた想いを探る
                    </RelatedArticleMeta>
                  </RelatedContent>
                </RelatedCard>
              </RelatedGrid>
            </RelatedSection>

            <BackButton
              href="/arts"
              whileHover={{ color: '#ff6b6b' }}
              transition={{ duration: 0.2 }}
            >
              記事一覧に戻る
            </BackButton>
          </ArticleContent>
        </MainContent>

        <Sidebar>
          <SidebarWidget>
            <WidgetTitle>視聴方法</WidgetTitle>
            <ViewingList>
              <ViewingItem>
                <ViewingLink
                  href="https://tver.jp/series/sr8bc2gtho"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                >
                  TVer - 最新話の見逃し配信（1週間限定）
                </ViewingLink>
              </ViewingItem>
              <ViewingItem>
                <ViewingLink
                  href="https://www.hulu.jp/the-hot-spot?autoplay=true&pn-series=500018451"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                >
                  Hulu - 全話配信中
                </ViewingLink>
              </ViewingItem>
              <ViewingItem>
                <ViewingLink
                  href="https://www.netflix.com/jp/title/81985186"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                >
                  Netflix - 全話配信中
                </ViewingLink>
              </ViewingItem>
            </ViewingList>
          </SidebarWidget>

          <SidebarWidget>
            <WidgetTitle>注目の観点</WidgetTitle>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block' }}
            >
              日常系ドラマ
            </ArticleTag>
            <p style={{ color: 'var(--secondary-color)', lineHeight: '1.6', fontSize: '1rem' }}>
              非日常的な要素を日常の中に溶け込ませる、新しい形の心温まるドラマ作品。
            </p>
          </SidebarWidget>
        </Sidebar>
      </ContentLayout>
    </Container>
  );
};

export default HotspotDramaPage;
