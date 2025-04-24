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

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const Agent2AgentArticle = () => {
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
              <ArticleTitle>AIエージェント革命の幕開け！異なるAIが連携して驚きのパワーを発揮</ArticleTitle>
              <ArticleMeta>
                <ArticleTag
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  テクノロジー
                </ArticleTag>
                <ArticleDate>2025年4月13日</ArticleDate>
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
              Googleが画期的な技術革新を発表しました！異なるAIエージェント同士が連携できる「Agent2Agent（A2A）」プロトコルの登場により、AIの可能性が一気に広がります。これからのAI活用がどう変わるのか、その魅力を徹底解説します。
            </p>

            <h2>複数のAIが結集！あなたのタスクが驚くほどスムーズに</h2>
            <p>
              これまで別々に動作していた各社のAIエージェントが、A2Aによって連携できるようになります。例えば、あなたが「海外出張の準備をして」と頼むだけで、航空券予約に最適なAIと、ホテル予約に特化したAI、現地の観光案内に詳しいAIが自動的に連携し、完璧な旅程を一つのインターフェースで提案してくれるようになるのです！
            </p>

            <div style={{
              background: 'var(--primary-color)',
              padding: '2rem',
              borderRadius: '8px',
              margin: '2rem 0',
              border: '1px solid var(--accent-color)'
            }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
                A2A技術のポイント
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem'
              }}>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>
                    エージェントカード機能
                  </h4>
                  <ul style={{ 
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    color: 'var(--secondary-color)'
                  }}>
                    <li style={{ marginBottom: '0.5rem' }}>• JSON形式の能力定義</li>
                    <li style={{ marginBottom: '0.5rem' }}>• 自動マッチング</li>
                    <li>• 動的な役割分担</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>
                    AIエージェント間通信
                  </h4>
                  <ul style={{ 
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    color: 'var(--secondary-color)'
                  }}>
                    <li style={{ marginBottom: '0.5rem' }}>• リアルタイム連携</li>
                    <li style={{ marginBottom: '0.5rem' }}>• セキュア通信</li>
                    <li>• コンテキスト共有</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>エージェントカードで最適なパートナーを自動発見</h2>
            <p>
              A2Aの核心技術である「エージェントカード」は、各AIエージェントが「私はこんなことが得意です」とアピールするJSON形式の名刺のようなもの。これにより、あなたの指示に最適なAIエージェントが自動的に選ばれ、タスクが効率的に実行されます。まるで優秀な秘書が、社内の専門家たちを自動的にアサインしてくれるようなイメージです！
            </p>

            <h2>AIどうしの「交渉」が実現する新次元のサービス</h2>
            <p>
              A2Aの驚くべき特徴は、AIエージェント同士が「交渉」できること。「このデータを表で表示した方が分かりやすいですか？」「画像で説明した方が良いですか？」といった会話をAI同士が行い、最適な形でユーザーに情報を提供します。こうした交渉が全て裏側で行われるため、ユーザーは複雑な指示を出す必要なく、最適な結果だけを受け取れるのです。
            </p>

            <div style={{
              background: 'var(--primary-color)',
              padding: '2rem',
              borderRadius: '8px',
              margin: '2rem 0',
              border: '1px solid #2a2a2a'
            }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
                人材採用プロセスの変革例
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem'
              }}>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    要件定義
                  </h4>
                  <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>
                    Agentspaceが業務内容を分析し、最適な人材要件を自動定義
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    候補者探索
                  </h4>
                  <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>
                    Sourcing Agentが条件に合った候補者を効率的に発見
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    視覚化
                  </h4>
                  <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>
                    情報を直感的なカード形式で表示し、意思決定をサポート
                  </p>
                </div>
              </div>
            </div>

            <h2>業務効率化の可能性が無限大に</h2>
            <p>
              Googleが公開したデモでは、人材採用プロセスにおけるA2Aの活用例が示されています。ユーザーが業務内容を記したファイルを添付し、条件に合ったソフトウェアエンジニアを探すよう依頼すると、Googleの「Agentspace」が最適な「Sourcing Agent」と連携。Sourcing Agentは情報を分析し、視覚的に分かりやすいカードとして候補者情報を表示しました。これまでなら複数のツールを行ったり来たりする必要があった作業が、一つのインターフェースで完結するのです。
            </p>

            <h2>AnthropicのMCPとの連携で更なる可能性</h2>
            <p>
              A2AはAnthropicが開発した「Model Context Protocol（MCP）」を補完する技術として位置づけられています。MCPがAIエージェントと外部ツール・APIをつなぐのに対し、A2Aは異なるAIエージェント同士をつなぐ役割を担います。この二つのプロトコルの連携により、AIエコシステムは飛躍的に発展するでしょう。
            </p>

            <div style={{
              background: 'var(--primary-color)',
              padding: '2rem',
              borderRadius: '8px',
              margin: '2rem 0',
              border: '1px solid var(--accent-color)'
            }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
                A2Aがもたらす革新的な機能
              </h3>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem'
              }}>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>
                    マルチエージェント連携
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    color: 'var(--secondary-color)'
                  }}>
                    <li style={{ marginBottom: '0.5rem' }}>• タスクの自動分担</li>
                    <li style={{ marginBottom: '0.5rem' }}>• 効率的な情報共有</li>
                    <li>• 最適な結果の統合</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>
                    ユーザーエクスペリエンス
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    color: 'var(--secondary-color)'
                  }}>
                    <li style={{ marginBottom: '0.5rem' }}>• シンプルな操作性</li>
                    <li style={{ marginBottom: '0.5rem' }}>• 直感的なインターフェース</li>
                    <li>• パーソナライズされた結果</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>未来のAIエコシステムはここから始まる</h2>
            <p>
              A2Aの登場により、各社が独自に開発してきたAIエージェントが一つのエコシステムとして機能し始めます。これは単なる技術革新ではなく、AIの活用方法を根本から変える革命といえるでしょう。あなたのビジネスや日常生活が、この新技術によってどう変わるのか、今から想像するだけでワクワクしませんか？
            </p>

            <p>
              Googleの「Agent2Agent」は、AIの新時代を切り開く重要な一歩です。この技術革新がもたらす可能性に、今後も注目していきましょう！
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

            <div style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              marginTop: '4rem',
              paddingTop: '4rem'
            }}>
              <h2 style={{ 
                fontSize: '2rem',
                marginBottom: '2rem',
                color: 'var(--accent-color)'
              }}>関連記事</h2>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem'
              }}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'var(--primary-color)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #2a2a2a'
                  }}
                >
                  <a href="/article/future-ai" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img 
                      src="/images/ai.png" 
                      alt="Future AI" 
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <ArticleTag style={{ marginBottom: '1rem' }}>AI技術</ArticleTag>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        marginBottom: '1rem',
                        color: 'var(--text-color)'
                      }}>
                        次世代AI技術が実現する未来の可能性
                      </h3>
                      <p style={{ 
                        color: 'var(--secondary-color)',
                        marginBottom: '1.5rem',
                        fontSize: '1rem'
                      }}>
                        最新のAI技術動向と、それがもたらす社会変革の可能性を探ります。
                      </p>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--secondary-color)',
                        fontSize: '0.9rem'
                      }}>
                        <span>2025年4月10日</span>
                        <motion.span
                          whileHover={{ x: 5 }}
                          style={{ color: 'var(--accent-color)' }}
                        >
                          続きを読む →
                        </motion.span>
                      </div>
                    </div>
                  </a>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'var(--primary-color)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #2a2a2a'
                  }}
                >
                  <a href="/article/ai-business" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img 
                      src="/images/drive.png" 
                      alt="AI Business" 
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <ArticleTag style={{ marginBottom: '1rem' }}>ビジネス</ArticleTag>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        marginBottom: '1rem',
                        color: 'var(--text-color)'
                      }}>
                        AI活用で変わるビジネスモデル
                      </h3>
                      <p style={{ 
                        color: 'var(--secondary-color)',
                        marginBottom: '1.5rem',
                        fontSize: '1rem'
                      }}>
                        AIがもたらすビジネス革新と成功事例を紹介。
                      </p>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--secondary-color)',
                        fontSize: '0.9rem'
                      }}>
                        <span>2025年4月8日</span>
                        <motion.span
                          whileHover={{ x: 5 }}
                          style={{ color: 'var(--accent-color)' }}
                        >
                          続きを読む →
                        </motion.span>
                      </div>
                    </div>
                  </a>
                </motion.div>
              </div>
            </div>

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
            <WidgetTitle>人気の記事</WidgetTitle>
            <PopularList>
              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/tech/future-ai">
                  <PopularTitle>
                    次世代AI技術が実現する未来の可能性
                  </PopularTitle>
                  <PopularMeta>2025年4月10日</PopularMeta>
                </PopularLink>
              </PopularItem>

              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/tech/ai-business">
                  <PopularTitle>
                    AI活用で変わるビジネスモデル
                  </PopularTitle>
                  <PopularMeta>2025年4月8日</PopularMeta>
                </PopularLink>
              </PopularItem>

              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/tech/ai-society">
                  <PopularTitle>
                    AIと共に進化する社会
                  </PopularTitle>
                  <PopularMeta>2025年4月5日</PopularMeta>
                </PopularLink>
              </PopularItem>
            </PopularList>
          </SidebarWidget>

          <SidebarWidget>
            <WidgetTitle>関連トピック</WidgetTitle>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block', marginRight: '0.5rem' }}
            >
              AI
            </ArticleTag>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block', marginRight: '0.5rem' }}
            >
              テクノロジー
            </ArticleTag>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block' }}
            >
              イノベーション
            </ArticleTag>
          </SidebarWidget>
        </Sidebar>
      </ContentLayout>
    </Container>
  );
};

export default Agent2AgentArticle;
