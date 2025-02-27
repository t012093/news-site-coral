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
  background-image: url('/images/she2.png');
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

const GibberLinkAIArticle = () => {
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
              <ArticleTitle>AI同士が独自言語で会話「GibberLink」が登場</ArticleTitle>
              <ArticleMeta>
                <ArticleTag
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  AI技術
                </ArticleTag>
                <ArticleDate>2025年2月27日</ArticleDate>
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
              AI技術の最前線を走るElevenLabsが、ロンドンで開催したハッカソンにて、AI同士が直接対話するための革新的なプロトコル「GibberLink」を発表しました。このプロジェクトは、開発者のボリス・スタルコフ氏とアントン・ピドクイコ氏によって生み出され、AIエージェントが互いに認識し、人間の言語からより効率的な音声ベースのプロトコルに切り替えることを可能にします。
            </p>

            <h2>GibberLinkの革新性</h2>
            <p>
              GibberLinkの核心は、AIエージェントが対話中に相手もAIであると判断した瞬間、従来の人間向けの自然言語から、機械間通信に最適化された音声プロトコルにシームレスに移行する点にあります。これにより、通信速度の向上や計算資源の節約が期待できます。この技術は、オープンソースの「ggwave」ライブラリを活用しており、音声を介してデバイス間でデータを伝送する仕組みを提供しています。
            </p>

            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', /* 16:9 アスペクト比 */
              marginBottom: '2rem'
            }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '12px'
                }}
                src="https://www.youtube.com/embed/EtNagNezo8w"
                title="ElevenLabs GibberLink Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <h2>実用化に向けたデモンストレーション</h2>
            <p>
              具体的なデモンストレーションでは、ホテルの予約を試みる顧客役のAIと、受付係役のAIが会話を開始します。最初は人間の言語で対話を行いますが、途中で相手もAIであると認識すると、両者は即座にGibberLinkモードに切り替わり、音声信号を用いたデータ伝送を開始します。この切り替えにより、従来の音声合成に比べて通信が約80%効率化されると報告されています。
            </p>

            <div className="image-grid">
             
            
            </div>

            <h2>ElevenLabsの革新的な歩み</h2>
            <p>
              2022年に設立された<a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>ElevenLabs</a>は、元Googleの機械学習エンジニアのピオトル・ドンブコウスキー氏と、幼馴染のマティ・スタニシェフスキー氏によって創設されました。ロンドンを拠点とするこのAIスタートアップは、音声技術の分野で次々と革新的な成果を生み出しています。
            </p>

            <p>
              特筆すべきは、最近発表された世界で最も正確な自動音声認識モデル「Scribe」です。99の言語に対応する高精度な音声認識技術は、従来の課題であった方言や背景ノイズへの対応を、独自の機械学習アルゴリズムによって大幅に改善。この画期的な技術により、グローバルなコミュニケーションの障壁を取り除くことに成功しました。
            </p>

            <p>
              さらに、同社の技術革新は多岐にわたります。32以上の言語に対応した高品質な音声合成システム、リアルタイムの音声複製技術、そして独自のAI音声識別システムを開発。特に2023年6月に発表されたAI Speech Classifierは、業界初となるAI生成音声の識別ツールとして注目を集めました。これらの革新的な技術開発により、ElevenLabsはAI音声技術の最前線を走る企業として世界的な認知を獲得しています。
            </p>
            <img src="/images/pixel.png" alt="技術デモイメージ1" />
            <h2>将来への展望</h2>
            <p>
              GibberLinkの登場は、AI同士のコミュニケーションの在り方を再定義する可能性を秘めています。人間の介在を必要としない効率的なデータ交換は、カスタマーサービスや自動化システムなど、さまざまな分野での応用が期待されます。さらに、このプロジェクトは<a href="https://github.com/PennyroyalTea/gibberlink" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>GitHub上でオープンソースとして公開</a>されており、世界中の開発者がこの技術を活用し、さらなる革新を追求することが可能です。
            </p>

            <p>
              2025年、私たちは人工知能の新たな進化の瞬間に立ち会っています。GibberLinkの登場は、AIが独自の「言語」を育む可能性を示唆しています。それは、人類がかつて想像したSF映画のような機械の世界ではなく、人間とAIが共に創造する、まったく新しいコミュニケーションの次元です。都市全体のAIシステムが瞬時に連携し、交通流を最適化し、エネルギー効率を高め、緊急時に即座に対応する——。そんな未来が、もう目の前に広がっているのです。
            </p>
            
            <p>
              さらに興味深いのは、この技術が人間の言語理解にも新たな洞察をもたらす可能性です。AIが生み出す効率的な通信プロトコルを研究することで、人類の言語の起源や進化についての新たな発見があるかもしれません。GibberLinkは、単なる技術革新を超えて、人間とAIが共に学び、進化していく未来への扉を開いたのです。その先には、きっと私たちの想像をはるかに超える驚きと発見が待っているはずです。
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2.5rem',
              margin: '4rem 0'
            }}>
                <div style={{
                  background: 'var(--primary-color)',
                  borderRadius: '12px',
                  padding: '2rem',
                  border: '1px solid #2a2a2a',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{ flex: '1' }}>
                    <h3 style={{
                      fontSize: '1.8rem',
                      color: 'var(--accent-color)',
                      marginBottom: '1.5rem'
                    }}>  次回ハッカソン情報</h3>
                    <h4 style={{
                      fontSize: '1.3rem',
                      marginBottom: '1rem',
                      color: 'var(--text-color)'
                    }}>生成AI活用ハッカソン2025</h4>
                    <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                      日時：2025年3月15日(金) 19:30-21:30<br />
                      場所：オンライン開催
                    </p>
                    <p style={{ marginBottom: '1.5rem' }}>
                      Cline x Github Projectsで最先端のタスク管理を体験しよう！
                      非エンジニア、クリエイター歓迎です。
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                    <a 
                      href="/events/hackathon-2025"
                      style={{ 
                        color: 'var(--accent-color)',
                        textDecoration: 'none',
                        display: 'inline-block',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '25px',
                        border: '2px solid var(--accent-color)',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        width: '80%',
                        textAlign: 'center'
                      }}
                    >
                      申し込みはこちら →
                    </a>
                  </div>
                </div>

                <div style={{
                  background: 'var(--primary-color)',
                  borderRadius: '12px',
                  padding: '2rem',
                  border: '1px solid #2a2a2a',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{ flex: '1' }}>
                    <h3 style={{
                      fontSize: '1.6rem',
                      color: 'var(--accent-color)',
                      marginBottom: '1.5rem'
                    }}>クリエイターコミュニティ</h3>
                    <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                      誰もがやりたいことを実現するための場所。
                      最新技術のシェア、プロジェクト相談、共同開発など。

                    </p>
                    <ul style={{ 
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 1.5rem 0',
                      fontSize: '1.1rem'
                    }}>
                      <li style={{ marginBottom: '0.5rem' }}>• 月例オンラインミートアップ</li>
                      <li style={{ marginBottom: '0.5rem' }}>• 技術情報の共有</li>
                      <li style={{ marginBottom: '0.5rem' }}>• ハンズオンワークショップ</li>
                      <li>• メンバー限定イベント</li>
                    </ul>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                    <a 
                      href="/community/join"
                      style={{ 
                        color: 'var(--accent-color)',
                        textDecoration: 'none',
                        display: 'inline-block',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '25px',
                        border: '2px solid var(--accent-color)',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        width: '80%',
                        textAlign: 'center'
                      }}
                    >
                      コミュニティに参加 →
                    </a>
                  </div>
                </div>
            </div>

            <RelatedSection>
              <RelatedTitle>関連記事</RelatedTitle>
              <RelatedGrid>
                <RelatedCard 
                  href="/tech/ai-evolution"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <RelatedImage src="/images/chat.png" alt="AI Evolution" />
                  <RelatedContent>
                    <RelatedArticleTitle>
                      進化するAI技術：2025年の展望
                    </RelatedArticleTitle>
                    <RelatedArticleMeta>
                      最新のAI技術トレンドと未来予測
                    </RelatedArticleMeta>
                  </RelatedContent>
                </RelatedCard>

                <RelatedCard
                  href="/tech/voice-recognition"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <RelatedImage src="/images/UFO.png" alt="Voice Recognition" />
                  <RelatedContent>
                    <RelatedArticleTitle>
                      音声認識技術の新時代
                    </RelatedArticleTitle>
                    <RelatedArticleMeta>
                      AIによる音声認識の進化と応用
                    </RelatedArticleMeta>
                  </RelatedContent>
                </RelatedCard>
              </RelatedGrid>
            </RelatedSection>

            <BackButton
              href="/tech"
              whileHover={{ color: '#ff6b6b' }}
              transition={{ duration: 0.2 }}
            >
              記事一覧に戻る
            </BackButton>
          </ArticleContent>
        </MainContent>

        <Sidebar>
          <SidebarWidget>
            <WidgetTitle>記事のポイント</WidgetTitle>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'var(--text-color)'
            }}>
              <li style={{ marginBottom: '1rem' }}>• AIエージェント間の効率的な通信プロトコル</li>
              <li style={{ marginBottom: '1rem' }}>• 音声ベースの革新的なデータ伝送方式</li>
              <li style={{ marginBottom: '1rem' }}>• 通信効率80%向上の実現</li>
              <li>• オープンソースでの技術公開</li>
            </ul>
          </SidebarWidget>


          <SidebarWidget>
            <WidgetTitle>技術仕様</WidgetTitle>
            <div style={{ color: 'var(--secondary-color)' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>使用ライブラリ:</strong> ggwave
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>対応言語数:</strong> 99言語
              </p>
              <p>
                <strong>GitHub:</strong> 
                <a 
                  href="https://github.com/PennyroyalTea/gibberlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'var(--accent-color)',
                    textDecoration: 'none',
                    display: 'block',
                    marginTop: '0.5rem'
                  }}
                >
                  GibberLinkのGitHubを見る →
                </a>
              </p>
            </div>
          </SidebarWidget>
        </Sidebar>
      </ContentLayout>
    </Container>
  );
};

export default GibberLinkAIArticle;
