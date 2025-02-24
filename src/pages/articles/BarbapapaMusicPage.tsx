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
  background-image: url('/images/pixel2.png');
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
  padding: 0 2rem 0 12rem;
  max-width: 2000px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 0 2rem;
  }
`;

const MainContent = styled.div`
  max-width: 900px;
  width: 100%;
  padding-right: 0;
  margin-left: auto;
  margin-right: 4rem;
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 2rem;
  height: fit-content;
  width: 100%;
  max-width: 360px;
  padding-top: 0;
  margin-right: 6rem;
`;

const SidebarWidget = styled.div`
  background: var(--primary-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #2a2a2a;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WidgetTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: var(--accent-color);
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const PopularList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PopularItem = styled(motion.li)`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const PopularLink = styled(motion.a)`
  display: block;
  color: var(--text-color);
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 6px;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const PopularTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  font-weight: 500;
`;

const PopularMeta = styled.div`
  font-size: 0.9rem;
  color: var(--secondary-color);
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
  gap: 2rem;
  
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

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
  border: 2px solid #1DB954;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 30px rgba(29, 185, 84, 0.2);
    border-color: #1ed760;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1DB954, #1ed760);
    z-index: 1;
  }
`;

const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const VideoCaption = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #1DB954;
  margin-top: 1rem;
  margin-bottom: 2rem;
  font-style: italic;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '▶';
    margin-right: 8px;
    font-size: 0.8em;
  }
`;

const ArticleContent = styled(motion.div)`
  line-height: 1.8;
  font-size: 1.2rem;
  color: var(--text-color);
  max-width: 800px;
  margin-left: auto;
  
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
`;

const ShareSection = styled.div`
  margin: 4rem 0;
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ShareTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ShareButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: var(--primary-color);
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: var(--accent-color);
    color: white;
  }
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

const StatBox = styled(motion.div)`
  background: var(--primary-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    font-size: 1.2rem;
    color: var(--accent-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(45deg, var(--accent-color), #ff6b6b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const BarbapapaMusicPage = () => {
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
              <ArticleTitle>バーバパパ：シュールとカオスが織りなす映像音楽の世界</ArticleTitle>
              <ArticleMeta>
                <ArticleTag
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  クリエイター
                </ArticleTag>
                <ArticleDate>2025年2月23日</ArticleDate>
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
              YouTube上で独特の音楽と映像作品を発表し、多くの視聴者を魅了しているクリエイター、バーバパパ。
              彼の作品は、一度見たら忘れられない強烈なインパクトと中毒性を持ち、現代のデジタルアート
              シーンにおいて独自の位置を確立しています。今回は、謎に包まれたこのアーティストの魅力に
              迫ります。
            </p>

            <VideoContainer>
              <VideoIframe
                src="https://www.youtube.com/embed/iSsct7423J4"
                title="VEAH"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoContainer>
            <VideoCaption>
              バーバパパ氏の代表作「ウィエ」
            </VideoCaption>

            <h2>謎に包まれたクリエイター</h2>
            <p>
              バーバパパは、主に3DCGを駆使したミュージックビデオやアニメーションを制作・投稿している
              日本のYouTuber、映像作家、音楽家です。その正体は明かされておらず、関西出身の男性である
              こと以外はほとんど知られていません。しかし、その作品は確かな技術力と独創性を感じさせ、
              多くのファンを魅了し続けています。
            </p>

            <h2>代表作「ウ"ィ"エ"」の衝撃</h2>
            <p>
              彼の代表作として知られる「ウ"ィ"エ"」は、独特の映像と音楽で視聴者を圧倒し、YouTubeで
              3400万回以上の再生回数を記録しています。この作品で展開される奇妙でありながらも引き込まれる
              世界観は、多くの人々に衝撃を与え、現代のインターネットカルチャーを代表する作品の一つと
              なっています。
            </p>

            <h2>多彩な作品群と進化する技術</h2>
            <p>
              バーバパパは、「ウ"ィ"エ"」以外にも「Motor Synthecycle Racing Battle」や「にょーり君」など、多くの印象的な
              作品を手掛けています。これらの作品はそれぞれ独自の世界観とストーリーを持ち、視聴者を
              不思議な感覚へと誘います。また、作品を重ねるごとに技術力は向上し、最新作では高度な3DCG
              技術と音楽制作能力が見事に融合した高品質なコンテンツを提供しています。
            </p>

            <VideoContainer>
              <VideoIframe
                src="https://www.youtube.com/embed/jSVK5mhTV1s"
                title="otor Synthecycle Racing Battle"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoContainer>
            <VideoCaption>
              独特の世界観が展開される「Motor Synthecycle Racing Battle」
            </VideoCaption>

            <h2>独自の世界観と中毒性</h2>
            <p>
              バーバパパの作品は、視聴者から「インフルエンザに罹った時に見る夢みたい」と評されるほど、
              独特でシュールな世界観を持っています。その奇妙さと中毒性は、現代のデジタルカルチャーに
              おいて特異な存在感を放ち、多くのファンを惹きつけてやまない理由となっています。
            </p>

            <p>
              また、彼の作品に一貫して見られる特徴は、現実と非現実の境界を巧みに操作する手法です。
              日常的な要素と超現実的な表現を組み合わせることで、視聴者の想像力を刺激し、独特の
              没入感を生み出しています。
            </p>

            <ShareSection>
              <ShareTitle>この記事をシェア</ShareTitle>
              <ShareButtons>
                <ShareButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🐦</span> Twitter
                </ShareButton>
                <ShareButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📘</span> Facebook
                </ShareButton>
                <ShareButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📱</span> LINE
                </ShareButton>
              </ShareButtons>
            </ShareSection>

            <RelatedSection>
              <RelatedTitle>関連記事</RelatedTitle>
              <RelatedGrid>
                <RelatedCard 
                  href="/music/subculture"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <RelatedImage src="/images/pixel.png" alt="界隈曲の世界" />
                  <RelatedContent>
                    <RelatedArticleTitle>
                      界隈曲の世界：カオスと中毒性が織りなす音楽文化
                    </RelatedArticleTitle>
                    <RelatedArticleMeta>2025年2月23日</RelatedArticleMeta>
                  </RelatedContent>
                </RelatedCard>

                <RelatedCard
                  href="/music/vr-live-future"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <RelatedImage src="/images/she55.png" alt="VR Live" />
                  <RelatedContent>
                    <RelatedArticleTitle>
                      没入型音楽体験の未来：VRライブの可能性
                    </RelatedArticleTitle>
                    <RelatedArticleMeta>2025年2月18日</RelatedArticleMeta>
                  </RelatedContent>
                </RelatedCard>
              </RelatedGrid>
            </RelatedSection>

            <BackButton
              href="/music"
              whileHover={{ color: '#ff6b6b' }}
              transition={{ duration: 0.2 }}
            >
              記事一覧に戻る
            </BackButton>
          </ArticleContent>
        </MainContent>

        <Sidebar>
          <StatBox
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3>代表作の再生回数</h3>
            <p>34M+</p>
          </StatBox>

          <StatBox
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3>YouTube登録者数</h3>
            <p>100K+</p>
          </StatBox>

          <StatBox
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3>作品数</h3>
            <p>50+</p>
          </StatBox>

          <SidebarWidget>
            <WidgetTitle>人気の記事</WidgetTitle>
            <PopularList>
              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/music/subculture">
                  <PopularTitle>
                    界隈曲の世界：カオスと中毒性が織りなす音楽文化
                  </PopularTitle>
                  <PopularMeta>2025年2月23日</PopularMeta>
                </PopularLink>
              </PopularItem>

              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/music/street-music-evolution">
                  <PopularTitle>
                    都市と音楽：進化するストリートミュージックシーン
                  </PopularTitle>
                  <PopularMeta>2025年2月19日</PopularMeta>
                </PopularLink>
              </PopularItem>

              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/music/vr-live-future">
                  <PopularTitle>
                    没入型音楽体験の未来：VRライブの可能性
                  </PopularTitle>
                  <PopularMeta>2025年2月18日</PopularMeta>
                </PopularLink>
              </PopularItem>
            </PopularList>
          </SidebarWidget>

          <SidebarWidget>
            <WidgetTitle>バーバパパの代表作</WidgetTitle>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block' }}
            >
              ウィエ
            </ArticleTag>
            <p style={{ color: 'var(--secondary-color)', lineHeight: '1.6', fontSize: '1rem' }}>
              3400万回以上の再生回数を記録した代表作。独特の映像と音楽で
              多くの視聴者を魅了し続けている。
            </p>
          </SidebarWidget>
        </Sidebar>
      </ContentLayout>
    </Container>
  );
};

export default BarbapapaMusicPage;
