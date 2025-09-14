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
  background-image: url('/images/ai.png');
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
  
  @media (max-width: 768px) {
    height: 50vh;
    min-height: 400px;
    margin-bottom: 3rem;
  }
  
  @media (max-width: 480px) {
    height: 40vh;
    min-height: 300px;
    margin-bottom: 2rem;
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
  
  @media (max-width: 768px) {
    bottom: 3rem;
    width: 95%;
  }
  
  @media (max-width: 480px) {
    bottom: 2rem;
    width: 95%;
  }
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
  
  @media (max-width: 1024px) {
    font-size: 3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    line-height: 1.1;
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.8rem;
    margin-bottom: 1rem;
  }
`;

const ArticleTag = styled(motion.span)`
  background-color: var(--accent-color);
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
  }
`;

const ArticleDate = styled.span`
  font-size: 1rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 6fr 3fr;
  gap: 6rem;
  margin: 0 auto;
  padding: 0 2rem 0 12rem;
  max-width: 2000px;

  @media (max-width: 1200px) {
    padding: 0 2rem 0 6rem;
    gap: 4rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 0 2rem;
    gap: 3rem;
  }
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
    gap: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 1rem;
    gap: 1.5rem;
  }
`;

const MainContent = styled.div`
  max-width: 900px;
  width: 100%;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
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

const AIWritingArticle = () => {
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
              <ArticleTitle>AI時代のライティング：ライターとニュースサイトの未来</ArticleTitle>
              <ArticleMeta>
                <ArticleTag
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  テクノロジー
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
              2025年、AIライティング技術の急速な進化により、メディア業界は大きな転換点を迎えています。
              最新の調査によると、カスタマーサポート担当者のAI活用で問い合わせ処理が13.8%向上し、
              ビジネスプロフェッショナルの文書作成速度は59%上昇。この劇的な生産性の向上は、
              ジャーナリズムの世界にも波及しつつあります。
            </p>

            <h2>ニュースサイトの変革：AIと共存するメディアの実例</h2>
            <p>
              先進的なメディアではすでにAIの実践的な活用が始まっています。Financial Timesは
              Anthropicと協力し、読者の質問に答えるAIチャットボットを導入。これにより、
              記事の理解度向上と読者エンゲージメントの強化を実現しています。
            </p>

            <p>
              しかし、注目すべき点は、デジタルメディアリーダーの53%が未来のジャーナリズムに
              不安を感じているという調査結果です。AIによる記事生成の精度向上は、同時に
              フェイクニュースの増加リスクも高めています。このジレンマに対し、多くのメディアは
              「AI×人間」のハイブリッドアプローチを採用。AIによる下書き生成と、
              人間のジャーナリストによる厳密なファクトチェックを組み合わせることで、
              効率と信頼性の両立を図っています。
            </p>

            <div style={{
              background: 'var(--primary-color)',
              border: '1px solid var(--accent-color)',
              borderRadius: '8px',
              padding: '1.5rem',
              margin: '2rem 0'
            }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                AIツールがもたらす具体的な変化
              </h3>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '1rem' }}>
                  ✓ ヘッドライン生成の自動化
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  ✓ 大規模データの分析・可視化
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  ✓ 音声インタビューの自動文字起こし
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  ✓ 多言語コンテンツの即時翻訳
                </li>
                <li>
                  ✓ パーソナライズされたニュースフィード作成
                </li>
              </ul>
            </div>

            <h2>新時代のライター像：統計が示す成功の方程式</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2rem',
              margin: '2rem 0'
            }}>
              <div style={{
                background: 'var(--primary-color)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #2a2a2a'
              }}>
                <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                  必要なスキル
                </h3>
                <ul style={{ 
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li style={{ marginBottom: '0.5rem' }}>• AIプロンプトエンジニアリング</li>
                  <li style={{ marginBottom: '0.5rem' }}>• データ分析・可視化</li>
                  <li style={{ marginBottom: '0.5rem' }}>• マルチメディアコンテンツ制作</li>
                  <li>• ファクトチェック手法</li>
                </ul>
              </div>
              <div style={{
                background: 'var(--primary-color)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #2a2a2a'
              }}>
                <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                  生産性向上の実績
                </h3>
                <ul style={{ 
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li style={{ marginBottom: '0.5rem' }}>• 文書作成速度 59%向上</li>
                  <li style={{ marginBottom: '0.5rem' }}>• 取材準備時間 40%削減</li>
                  <li style={{ marginBottom: '0.5rem' }}>• 多言語展開 3倍に拡大</li>
                  <li>• 読者エンゲージメント 25%増</li>
                </ul>
              </div>
            </div>

            <p>
              重要なのは、これらのツールを使いこなしつつ、人間ならではの価値を提供すること。
              独自の取材、深い分析、感情的な共感—これらはAIには真似できない人間の強みです。
              実際、AIを効果的に活用しているライターの90%以上が、これまで以上に創造的な
              仕事に時間を費やせるようになったと報告しています。
            </p>

            <h2>進化する情報エコシステム</h2>

            <div style={{
              background: 'var(--primary-color)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--accent-color)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                2025年の情報革命：主要な変化
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem'
              }}>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    多言語展開
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    AIによる自動翻訳で、コンテンツの多言語展開が3倍に拡大
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    個別化
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    読者の興味に基づく記事推薦精度が85%向上
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    リアルタイム性
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    速報記事の生成時間が従来の1/3に短縮
                  </p>
                </div>
              </div>
            </div>

            <p>
              2025年の情報流通は、AIによってより迅速で正確になっています。特筆すべきは、
              生成AIを活用したニュースルームでは、ファクトチェックの精度が23%向上し、
              誤報の発生率が大幅に減少している点です。同時に、AIによる自動翻訳技術の進化により、
              77%のグローバルニュースが5分以内に現地語に翻訳され、情報格差の解消に貢献しています。
            </p>

            <div style={{
              background: 'var(--primary-color)',
              padding: '2rem',
              borderRadius: '8px',
              margin: '2rem 0',
              border: '1px solid #2a2a2a'
            }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                これからのメディアに求められる3つの要素
              </h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                  1. ハイブリッドな品質管理
                </h4>
                <p style={{ color: 'var(--secondary-color)' }}>
                  AIによる一次チェックと人間による最終判断の組み合わせで、
                  信頼性と効率性を両立
                </p>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                  2. マルチモーダルな情報提供
                </h4>
                <p style={{ color: 'var(--secondary-color)' }}>
                  テキスト、音声、動画、AR/VRなど、多様な形式でのコンテンツ展開
                </p>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                  3. コミュニティとの共創
                </h4>
                <p style={{ color: 'var(--secondary-color)' }}>
                  読者参加型のコンテンツ制作と、双方向のフィードバックループの確立
                </p>
              </div>
            </div>

            <h2>未来への展望：2025年以降の予測</h2>
            <p>
              最新の業界予測によると、2025年までにAIが関与する記事制作は全体の65%に達する
              見込みです。しかし、これは人間のジャーナリストの価値を低下させるのではなく、
              むしろ彼らの創造性とクリティカルシンキングの重要性を高めることになります。
            </p>

            <p>
              さらに注目すべきは、AIと人間のコラボレーションによる新しいコンテンツ形式の
              出現です。例えば、リアルタイムでカスタマイズされるインタラクティブ・ストーリーテリングや、
              読者の関心に応じて深堀り可能な階層型記事構造など、従来では実現できなかった
              革新的な表現方法が登場しつつあります。
            </p>

            <div style={{
              background: 'var(--primary-color)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--accent-color)',
              marginTop: '2rem'
            }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                読者の皆様へのアクションポイント
              </h3>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>①</span>
                  メディアリテラシーの向上：情報源の確認と批判的思考の習慣化
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>②</span>
                  多様な情報源の活用：AI生成コンテンツと人間による記事の使い分け
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>③</span>
                  積極的なフィードバック：より良いコンテンツ制作のための読者参加
                </li>
              </ul>
            </div>

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
                  <a href="/article/ai-ethics" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img 
                      src="/images/chat.png" 
                      alt="AI Ethics" 
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <ArticleTag style={{ marginBottom: '1rem' }}>AI倫理</ArticleTag>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        marginBottom: '1rem',
                        color: 'var(--text-color)'
                      }}>
                        AI倫理の最前線：技術と人間の共生を目指して
                      </h3>
                      <p style={{ 
                        color: 'var(--secondary-color)',
                        marginBottom: '1.5rem',
                        fontSize: '1rem'
                      }}>
                        AIの発展に伴う倫理的課題と、その解決に向けた取り組みを紹介します。
                      </p>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--secondary-color)',
                        fontSize: '0.9rem'
                      }}>
                        <span>2025年2月22日</span>
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
                  <a href="/article/future-journalism" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img 
                      src="/images/pixel.png" 
                      alt="Future Journalism" 
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <ArticleTag style={{ marginBottom: '1rem' }}>ジャーナリズム</ArticleTag>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        marginBottom: '1rem',
                        color: 'var(--text-color)'
                      }}>
                        デジタル時代のジャーナリズム：新しい情報発信のかたち
                      </h3>
                      <p style={{ 
                        color: 'var(--secondary-color)',
                        marginBottom: '1.5rem',
                        fontSize: '1rem'
                      }}>
                        テクノロジーの進化がもたらすジャーナリズムの変革と可能性。
                      </p>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--secondary-color)',
                        fontSize: '0.9rem'
                      }}>
                        <span>2025年2月21日</span>
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
                <PopularLink href="/tech/ai-robotics">
                  <PopularTitle>
                    次世代ロボットが切り開く未来：人間との共生に向けて
                  </PopularTitle>
                  <PopularMeta>2025年2月22日</PopularMeta>
                </PopularLink>
              </PopularItem>

              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/tech/quantum-computing">
                  <PopularTitle>
                    量子コンピューティングが変える未来
                  </PopularTitle>
                  <PopularMeta>2025年2月20日</PopularMeta>
                </PopularLink>
              </PopularItem>

              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/tech/metaverse-evolution">
                  <PopularTitle>
                    メタバースの進化：仮想と現実の境界を越えて
                  </PopularTitle>
                  <PopularMeta>2025年2月18日</PopularMeta>
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
              コンテンツ
            </ArticleTag>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block' }}
            >
              デジタルメディア
            </ArticleTag>
          </SidebarWidget>
        </Sidebar>
      </ContentLayout>
    </Container>
  );
};

export default AIWritingArticle;
