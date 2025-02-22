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
  background-image: url('/images/pixel.png');
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

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9のアスペクト比 */
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background: var(--primary-color);
  border: 1px solid #2a2a2a;
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
  color: var(--secondary-color);
  margin-top: 1rem;
  margin-bottom: 2rem;
  font-style: italic;
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

  blockquote {
    margin: 2rem 0;
    padding: 1.5rem 2rem;
    border-left: 4px solid var(--accent-color);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0 8px 8px 0;
    font-style: italic;
    
    p {
      margin: 0;
    }
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

const SubcultureMusicPage = () => {
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
              <ArticleTitle>界隈曲の世界：カオスと中毒性が織りなす音楽文化</ArticleTitle>
              <ArticleMeta>
                <ArticleTag
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  音楽
                </ArticleTag>
                <ArticleDate>2024年2月23日</ArticleDate>
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
              YouTube上には、時に理解が追いつかないほどカオスで、それでいて妙にクセになる楽曲が存在する。
              そのひとつが、バーバパパ氏による「界隈の動物園」だ。シンセサイザーが不穏な旋律を奏で、
              機械音声が不可解なフレーズを繰り返すMVは、どこかノスタルジックでありながらも、不気味な違和感を残す。
              この楽曲は、いわゆる「界隈曲」と呼ばれるジャンルへのパロディ的オマージュとなっており、
              特定の音楽文化圏への風刺的な要素を含んでいる。
            </p>

            <VideoContainer>
              <VideoIframe
                src="https://www.youtube.com/embed/_oQ4wb0NbcQ"
                title="界隈の動物園"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoContainer>
            <VideoCaption>
              バーバパパ氏による「界隈の動物園」のミュージックビデオ
            </VideoCaption>

            <h2>界隈曲の起源</h2>
            <p>
              そもそも「界隈曲」とは何なのか。そのルーツを辿ると、音楽プロデューサー・ころんば氏による
              作品群に行き着く。2012年から2013年にかけて発表された「クロマグロがとんでくる」
              「イワシがつちからはえてくるんだ」「ヤツメ穴」「.（ドット）」の4曲は、界隈曲の代表格とされ、
              「海鮮市場」という別称でも知られている。
            </p>

            <VideoContainer>
              <VideoIframe
                src="https://www.youtube.com/embed/C9PFVo1FEwU"
                title="ヤツメ穴"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoContainer>
            <VideoCaption>
              界隈曲の代表作「ヤツメ穴」
            </VideoCaption>

            <h2>界隈曲の特徴</h2>
            <p>
              これらの楽曲の特徴として、シンセサイザーやエレクトリックピアノを多用した独特の音楽性、
              合成音声を駆使した歌唱法、ジャズ的なコード進行が挙げられる。また、歌詞やタイトルには
              ひらがな・カタカナ・記号が頻繁に用いられ、モールス信号や暗号のような要素が含まれることも多い。
              MVにおいては、レトロなドット絵の映像美が特徴的で、視聴者に強い印象を残す。
            </p>

            <h2>界隈曲の影響と広がり</h2>
            <p>
              ころんば氏の影響は広く、2号.氏や「全てあなたの所為です。」氏など、多くのアーティストが
              同様の作風を取り入れた楽曲を制作している。こうした楽曲群も「界隈曲」と総称され、
              特定のサブカルチャー内で根強い人気を誇っている。
            </p>

            <h2>パロディとしての「界隈の動物園」</h2>
            <p>
              そんな界隈曲を独自の視点でパロディ化したのが、バーバパパ氏の「界隈の動物園」である。
              この楽曲では、界隈曲の特徴を意識した音楽・映像表現がなされており、そのカオスさを
              より誇張した形で描き出している。曲調はどこか不安を煽るものでありながらも、
              一度聴くと妙にクセになる中毒性を持つ。
            </p>

            <p>
              界隈曲は、独特の音楽性と映像美によって、多くのリスナーを惹きつけ続けている。
              現在も新たなアーティストによる作品が生み出され続け、界隈曲は進化を遂げながら
              独自の文化を形成している。
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
                  href="/music/festival-evolution"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <RelatedImage src="/images/she9.png" alt="Music Festival" />
                  <RelatedContent>
                    <RelatedArticleTitle>
                      ポスト・パンデミック時代のフェス文化
                    </RelatedArticleTitle>
                    <RelatedArticleMeta>2024年2月20日</RelatedArticleMeta>
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
                    <RelatedArticleMeta>2024年2月18日</RelatedArticleMeta>
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
          <SidebarWidget>
            <WidgetTitle>人気の記事</WidgetTitle>
            <PopularList>
              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/music/festival-evolution">
                  <PopularTitle>
                    ポスト・パンデミック時代のフェス文化：新しい音楽体験の形
                  </PopularTitle>
                  <PopularMeta>2024年2月20日</PopularMeta>
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
                  <PopularMeta>2024年2月19日</PopularMeta>
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
                  <PopularMeta>2024年2月18日</PopularMeta>
                </PopularLink>
              </PopularItem>
            </PopularList>
          </SidebarWidget>

          <SidebarWidget>
            <WidgetTitle>注目のトピック</WidgetTitle>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block' }}
            >
              界隈曲
            </ArticleTag>
            <p style={{ color: 'var(--secondary-color)', lineHeight: '1.6', fontSize: '1rem' }}>
              独特の音楽性と映像美で注目を集める界隈曲。
              その魅力と独自の文化についての深掘り特集をお届けします。
            </p>
          </SidebarWidget>
        </Sidebar>
      </ContentLayout>
    </Container>
  );
};

export default SubcultureMusicPage;
