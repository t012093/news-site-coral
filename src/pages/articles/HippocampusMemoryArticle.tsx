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

  h3 {
    font-size: 1.6rem;
    margin: 2.5rem 0 1rem;
    color: var(--text-color);
    font-weight: 600;
  }
`;

const PhilosophicalBox = styled.div`
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05));
  border: 1px solid var(--accent-color);
  border-radius: 12px;
  padding: 2rem;
  margin: 3rem 0;
  position: relative;

  &::before {
    content: '🧠';
    position: absolute;
    top: -15px;
    left: 20px;
    background: var(--primary-color);
    padding: 0 10px;
    font-size: 1.5rem;
  }
`;

const QuoteBox = styled.div`
  background: var(--primary-color);
  border-left: 4px solid var(--accent-color);
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  font-style: italic;
  position: relative;
  
  &::before {
    content: '"';
    font-size: 4rem;
    color: var(--accent-color);
    position: absolute;
    top: -10px;
    left: 10px;
    line-height: 1;
  }
`;

const TechBox = styled.div`
  background: var(--primary-color);
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid #2a2a2a;
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

const HippocampusMemoryArticle = () => {
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
              <ArticleTitle>海馬という"シーン生成器"──記憶、境界拡張、そして人間の内なる空間地図</ArticleTitle>
              <ArticleMeta>
                <ArticleTag
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  神経科学
                </ArticleTag>
                <ArticleDate>2025年8月13日</ArticleDate>
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
            <h2>記憶は保存ではなく構築だ</h2>
            <p>
              私たちはしばしば、脳を巨大なハードディスクにたとえる。
              だが最新の神経科学は、この比喩が本質を見誤っていることを明らかにした。
            </p>

            <p>
              脳は、過去を"保存"しているのではない。
              過去を"空間的に構築"し、必要に応じて再生産しているのだ。
              そしてその舞台監督こそ、脳の奥に潜む<strong>海馬（hippocampus）</strong>である。
            </p>

            <h2>見えない領域まで拡張する脳──Boundary Extension</h2>
            <p>
              ロンドン大学（UCL）のエレノア・マグワイア博士は、人間の記憶に備わる奇妙な機能「境界拡張（Boundary Extension）」を研究した。
            </p>

            <p>
              境界拡張とは、一度見たシーンを思い出す際、実際より広い範囲を想起してしまう現象である。
              写真の外にあったはずの背景や地平線を、脳が"見た"かのように補完する。
            </p>

            <p>
              博士らの実験で、海馬が損傷した患者にはこの現象がほとんど見られなかった。
              これは、海馬が単なる記憶装置ではなく、シーンを生成し補完するクリエイティブな中枢であることを示している。
            </p>

            <PhilosophicalBox>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                哲学的考察：記憶の創造性
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                もし記憶が「事実の保存」ではなく「シーンの創造」であるなら、
                私たちの過去は毎回新たに構築されているということになる。
                これは、自己同一性や個人史に対する理解を根本的に変える可能性がある。
              </p>
              <p style={{ marginBottom: 0 }}>
                記憶が創造的プロセスであるなら、「真実の記憶」とは何を意味するのだろうか？
              </p>
            </PhilosophicalBox>

            <h2>記憶は空間で理解される</h2>
            <p>
              神経科学では、記憶はしばしば空間的マップとして表現される。
              海馬には<strong>場所細胞（place cells）とグリッド細胞（grid cells）</strong>があり、これらは位置や座標をエンコードする。
            </p>

            <p>
              この"脳内GPS"は、街を歩くときだけでなく、数字や概念を覚えるときにも動員される。
              人間は、情報を無意識に空間に配置し、その位置情報とセットで保存しているのだ。
            </p>

            <TechBox>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                海馬の空間記憶システム
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem'
              }}>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    場所細胞（Place Cells）
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', marginBottom: '1rem' }}>
                    特定の場所で活動が増加する神経細胞
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    グリッド細胞（Grid Cells）
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', marginBottom: '1rem' }}>
                    六角形の格子パターンで空間をエンコード
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    境界細胞（Border Cells）
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    環境の境界や壁に反応する細胞
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    方向細胞（Head Direction Cells）
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    頭部の方向を検出し、空間的方向感覚を提供
                  </p>
                </div>
              </div>
            </TechBox>

            <h2>想起時の視線は仮想空間をなぞる</h2>
            <p>
              興味深いのは、記憶を呼び出すときの視線パターンだ。
              心理学の研究によれば、人は過去の出来事や配置を思い出すとき、実際には何もない空間に視線を向けることがある。
            </p>

            <p>
              これは脳が"仮想の空間"を再構築し、まるでその場にいるかのように情報を検索している証拠だ。
              記憶宮殿法を使うときに視線が自然と右の棚や左の机の方へ動くのは、この神経メカニズムの表れである。
            </p>

            <QuoteBox>
              <p style={{ marginBottom: '1rem', paddingLeft: '3rem' }}>
                「記憶は単なるデータの保管庫ではなく、空間と時間を統合した動的な構造体である。
                海馬はその建築家として、私たちの体験を三次元的なシーンとして組み立てている」
              </p>
              <p style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--secondary-color)', marginBottom: 0 }}>
                — エレノア・マグワイア博士, ロンドン大学
              </p>
            </QuoteBox>

            <h2>シーン構築理論──海馬の本質的な機能</h2>
            <p>
              マグワイア博士の<strong>シーン構築理論（Scene Construction Theory）</strong>は、エピソード記憶、未来予測、空間ナビゲーションなどの異なる認知を一本の線で結びつける。
              その線の正体は、統合された空間的シーンを生成する能力だ。
            </p>

            <p>
              過去の再現も未来の想像も、脳内で「場面を組み立てる」という同じプロセスで行われている。
            </p>

            <TechBox>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                海馬が関与する認知機能
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem'
              }}>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    エピソード記憶
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    個人的な体験の記憶
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    未来想像
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    将来の出来事のシミュレーション
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    空間ナビゲーション
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    環境での位置把握と経路探索
                  </p>
                </div>
              </div>
            </TechBox>

            <h2>記憶を強化するための実践テクニック</h2>
            <p>
              あなたも懐かしい匂いや音楽を聴いた時、その時の情景や思い出を鮮明に思い出せる瞬間があるだろう。これは記憶が単体で脳に保存されているのではなく、あらゆる五感と関連付けられ、空間的に配置されているからだ。記憶はただ単に情報として蓄積するよりも、五感とのチャンキング（関連付け）によって空間的に配置する方が最も効率的なのである。
            </p>
            <p>
              空間的記憶システムを最大限活用するには、脳の得意分野に合わせた情報配置が有効だ。
            </p>

            <div style={{
              background: 'var(--primary-color)',
              padding: '2rem',
              borderRadius: '8px',
              margin: '2rem 0',
              border: '1px solid #2a2a2a'
            }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
                実践的記憶強化テクニック
              </h3>

              <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', fontSize: '1.2rem' }}>
                1. 空間に情報を置く（記憶宮殿法）
              </h4>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                margin: 0,
                marginBottom: '2rem'
              }}>
                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>•</span>
                  よく知っている場所を選び、順路に沿って覚えたい情報を配置
                </li>
                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>•</span>
                  「玄関→リビング→キッチン」のように動線を決める
                </li>
              </ul>

              <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', fontSize: '1.2rem' }}>
                2. 五感を使ってシーンを強化
              </h4>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                margin: 0,
                marginBottom: '2rem'
              }}>
                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>•</span>
                  色、音、匂い、質感などをイメージに追加
                </li>
                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>•</span>
                  例：「青い光を放つ数字の"3"が机の上で回転している」
                </li>
              </ul>

              <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', fontSize: '1.2rem' }}>
                3. 視線と一緒に記憶する
              </h4>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                margin: 0,
                marginBottom: '2rem'
              }}>
                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>•</span>
                  配置した位置を目で追いながら記憶
                </li>
                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>•</span>
                  想起時にも同じ位置を目でなぞると再現性が高まる
                </li>
              </ul>

              <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', fontSize: '1.2rem' }}>
                4. 境界を広げて覚える
              </h4>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>•</span>
                  中心情報だけでなく、その周辺の背景や空間も意識的に描く
                </li>
                <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)' }}>•</span>
                  境界拡張を意図的に活用することで記憶はより長期化する
                </li>
              </ul>
            </div>

            <PhilosophicalBox>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                認知的考察：空間と時間の統合
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                海馬が空間と記憶を統合するメカニズムは、人間の意識そのものの本質を理解する鍵となる可能性がある。
                私たちは「今、ここ」にいながら、常に過去と未来の空間を行き来している。
              </p>
              <p style={{ marginBottom: 0 }}>
                この空間的記憶システムは、人工知能の設計においても重要な示唆を与える。
                単なる情報処理ではなく、空間的コンテキストを持つ知性の実現に向けて。
              </p>
            </PhilosophicalBox>

            <h2>結論──海馬は"記憶の建築家"である</h2>
            <p>
              記憶は、静止したデータではなく、空間という舞台で生成されるダイナミックなシーンだ。
              私たちは無意識に情報を空間に配置し、想起のときには視線でその仮想空間をなぞっている。
            </p>

            <p>
              海馬はその舞台設計を担う、小さな建築家。
              そしてその建築現場は、あなたが思っている以上に広く、豊かで、創造的なのだ。
            </p>

            <div style={{
              background: 'var(--primary-color)',
              padding: '2rem',
              borderRadius: '8px',
              border: '1px solid var(--accent-color)',
              marginTop: '3rem'
            }}>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                読者への思考プロンプト
              </h3>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)', marginTop: '0.2rem' }}>🧭</span>
                  <div>
                    あなたが最も覚えやすい「場所」はどこですか？その場所の特徴を分析してみてください。
                  </div>
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)', marginTop: '0.2rem' }}>🎭</span>
                  <div>
                    記憶が「創造的構築」であるなら、過去の出来事の「正確さ」をどう捉えるべきでしょうか？
                  </div>
                </li>
                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)', marginTop: '0.2rem' }}>🗺️</span>
                  <div>
                    記憶宮殿法を試してみて、どのような情報が最も空間に配置しやすいか実験してみてください。
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--accent-color)', marginTop: '0.2rem' }}>🤖</span>
                  <div>
                    人工知能に空間的記憶システムを実装したら、どのような新しい能力が生まれると思いますか？
                  </div>
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
                  <a href="/tech/ai-reasoning" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img 
                      src="/images/ai.png" 
                      alt="AI Reasoning" 
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <ArticleTag style={{ marginBottom: '1rem' }}>テクノロジー</ArticleTag>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        marginBottom: '1rem',
                        color: 'var(--text-color)'
                      }}>
                        AI推論の革命：人間の思考を超える新時代の扉
                      </h3>
                      <p style={{ 
                        color: 'var(--secondary-color)',
                        marginBottom: '1.5rem',
                        fontSize: '1rem'
                      }}>
                        AIの段階的推論技術が切り開く、人間とAIの新たな協働の可能性。
                      </p>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--secondary-color)',
                        fontSize: '0.9rem'
                      }}>
                        <span>2025年7月29日</span>
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
                  <a href="/health/sleep-science" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img 
                      src="/images/chat.png" 
                      alt="Sleep Science" 
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <ArticleTag style={{ marginBottom: '1rem' }}>健康科学</ArticleTag>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        marginBottom: '1rem',
                        color: 'var(--text-color)'
                      }}>
                        AIが解明する睡眠の科学革命
                      </h3>
                      <p style={{ 
                        color: 'var(--secondary-color)',
                        marginBottom: '1.5rem',
                        fontSize: '1rem'
                      }}>
                        睡眠中の記憶定着プロセスをAIが解析する新たな研究成果。
                      </p>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--secondary-color)',
                        fontSize: '0.9rem'
                      }}>
                        <span>2025年8月10日</span>
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
                <PopularLink href="/tech/ai-reasoning">
                  <PopularTitle>
                    AI推論の革命：人間の思考を超える新時代の扉
                  </PopularTitle>
                  <PopularMeta>2025年7月29日</PopularMeta>
                </PopularLink>
              </PopularItem>

              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/health/sleep-science">
                  <PopularTitle>
                    AIが解明する睡眠の科学革命
                  </PopularTitle>
                  <PopularMeta>2025年8月10日</PopularMeta>
                </PopularLink>
              </PopularItem>

              <PopularItem
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PopularLink href="/health/vacation-science">
                  <PopularTitle>
                    休暇の科学：脳の疲労回復メカニズムを解明
                  </PopularTitle>
                  <PopularMeta>2025年8月12日</PopularMeta>
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
              神経科学
            </ArticleTag>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block', marginRight: '0.5rem' }}
            >
              記憶研究
            </ArticleTag>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block' }}
            >
              認知科学
            </ArticleTag>
          </SidebarWidget>
        </Sidebar>
      </ContentLayout>
    </Container>
  );
};

export default HippocampusMemoryArticle;