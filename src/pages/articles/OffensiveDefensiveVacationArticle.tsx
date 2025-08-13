import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  position: relative;
  text-align: center;
  margin-bottom: 4rem;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/she15.png') center/cover no-repeat;
    opacity: 0.15;
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  color: white;
`;

const MainTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const ArticleLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const MainContent = styled.main``;

const ContentSection = styled(motion.section)`
  background: var(--primary-color);
  border-radius: 16px;
  padding: 3rem;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #2a2a2a;
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: var(--accent-color);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 60px;
    height: 3px;
    background: var(--accent-color);
    border-radius: 2px;
  }
`;

const SectionSubtitle = styled.h3`
  font-size: 1.8rem;
  margin: 2.5rem 0 1.5rem;
  color: white;
  font-weight: 600;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-left: 4px solid var(--accent-color);
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 8px;
  
  p {
    margin-bottom: 1rem;
    font-weight: 500;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const DefinitionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DefinitionBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h4 {
    color: var(--accent-color);
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
    font-size: 1rem;
  }
`;


const PracticalTips = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  
  li {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-left: 4px solid var(--accent-color);
    
    &::before {
      content: '✓';
      color: var(--accent-color);
      font-weight: bold;
      margin-right: 1rem;
    }
  }
`;

const PhilosophicalQuote = styled.blockquote`
  background: linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
  border-radius: 12px;
  padding: 2.5rem;
  margin: 3rem 0;
  text-align: center;
  font-size: 1.3rem;
  font-style: italic;
  color: white;
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: 0.5rem;
    left: 1rem;
    font-size: 4rem;
    color: var(--accent-color);
    opacity: 0.3;
  }
  
  .author {
    margin-top: 1.5rem;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    font-style: normal;
  }
`;

const Sidebar = styled.aside``;

const SidebarWidget = styled.div`
  background: var(--primary-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #2a2a2a;
`;

const WidgetTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: white;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const Tag = styled.span`
  background-color: rgba(102, 126, 234, 0.2);
  color: var(--accent-color);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(102, 126, 234, 0.3);
`;

const RelatedArticles = styled.div`
  .article-item {
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    h4 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      color: white;
      line-height: 1.4;
    }
    
    p {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }
  }
`;

const References = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    color: var(--accent-color);
    margin-bottom: 1.5rem;
  }
  
  ol {
    color: rgba(255, 255, 255, 0.8);
    
    li {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      line-height: 1.6;
    }
  }
`;

const OffensiveDefensiveVacationArticle = () => {
  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <MainTitle>攻めの休暇と守りの休暇</MainTitle>
          <Subtitle>
            休息の本質を問い直す：現代社会における「休み方」の哲学と科学
          </Subtitle>
        </HeroContent>
      </HeroSection>

      <ArticleLayout>
        <MainContent>
          <ContentSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle>休暇という概念の再定義</SectionTitle>
            <Paragraph>
              現代社会において、「休暇」という概念は根本的な変革を迫られている。従来の「疲れたから休む」という受動的なアプローチから、「成長のために休む」という能動的なアプローチへ。この転換点に立つ私たちは、休暇を「攻め」と「守り」という二つの戦略的視点から捉え直す必要があるのではないだろうか。
            </Paragraph>
            
            <HighlightBox>
              <p>「休暇は単なる労働からの逃避ではない。それは人間の潜在能力を最大化するための戦略的投資である」</p>
              <p>— 現代労働心理学の基本理念</p>
            </HighlightBox>

            <DefinitionGrid>
              <DefinitionBox>
                <h4>🎯 攻めの休暇（Offensive Vacation）</h4>
                <p>積極的に新しい体験や学習を求める休暇スタイル。創造性の向上、スキル習得、人的ネットワークの拡大を目的とする。</p>
                <p><strong>キーワード：</strong>探索、挑戦、成長、刺激</p>
              </DefinitionBox>
              
              <DefinitionBox>
                <h4>🛡️ 守りの休暇（Defensive Vacation）</h4>
                <p>心身の回復とメンテナンスに焦点を当てた休暇スタイル。ストレス軽減、健康維持、内省を重視する。</p>
                <p><strong>キーワード：</strong>回復、癒し、内省、安定</p>
              </DefinitionBox>
            </DefinitionGrid>
          </ContentSection>

          <ContentSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SectionTitle>科学的根拠に基づく休暇の効果</SectionTitle>
            
            <SectionSubtitle>🧠 神経科学の視点から見る「攻めの休暇」</SectionSubtitle>
            
            <Paragraph>
              神経科学の研究によると、新しい環境や体験に触れることは脳の神経可塑性を向上させることが知られています。これは「攻めの休暇」の理論的根拠となる重要な概念です。新奇性（novelty）への曝露は、脳内でドーパミンやノルアドレナリンの分泌を促進し、学習や記憶の形成を活性化させます。
            </Paragraph>
            
            <HighlightBox>
              <p><strong>神経可塑性理論の応用:</strong></p>
              <p>新しい体験や環境への適応過程で、脳は既存の神経回路を再編成し、新たな神経結合を形成します。これにより創造性、問題解決能力、認知的柔軟性の向上が期待できるとされています。</p>
            </HighlightBox>

            <SectionSubtitle>💚 心理学理論から見る「守りの休暇」の意義</SectionSubtitle>
            
            <Paragraph>
              心理学の注意回復理論（Attention Restoration Theory）によると、継続的な集中や意志力の使用により消耗した認知資源は、自然環境や静的な環境での休息により回復されるとされています。これが「守りの休暇」の理論的基盤となります。
            </Paragraph>
            
            <HighlightBox>
              <p><strong>注意回復理論の要素:</strong></p>
              <p>• <strong>離脱（Being Away）:</strong> 日常の環境からの物理的・心理的距離</p>
              <p>• <strong>魅力（Fascination）:</strong> 努力を要しない注意の対象</p>
              <p>• <strong>適合性（Compatibility）:</strong> 個人の傾向と環境の調和</p>
              <p>• <strong>包括性（Extent）:</strong> 環境の一体性と連続性</p>
            </HighlightBox>

            <PhilosophicalQuote>
              真の休息とは、単に活動を停止することではない。それは、内なる創造力と再生力を呼び覚ますための意識的な選択である。
              <div className="author">— 現代ウェルビーイング哲学の核心概念</div>
            </PhilosophicalQuote>
          </ContentSection>

          <ContentSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SectionTitle>メリット・デメリットの深層分析</SectionTitle>
            
            <SectionSubtitle>攻めの休暇：光と影</SectionSubtitle>
            
            <DefinitionGrid>
              <div>
                <h4 style={{ color: '#4CAF50' }}>✅ メリット</h4>
                <PracticalTips>
                  <li>新しいスキルや知識の習得による市場価値向上</li>
                  <li>異文化体験による視野の拡大と柔軟性の向上</li>
                  <li>チャレンジによる自信とレジリエンスの向上</li>
                  <li>人的ネットワークの拡大と新たな機会の創出</li>
                  <li>創造性と革新的思考力の飛躍的向上</li>
                </PracticalTips>
              </div>
              
              <div>
                <h4 style={{ color: '#f44336' }}>⚠️ デメリット</h4>
                <PracticalTips>
                  <li>計画や準備によるストレス増加の可能性</li>
                  <li>期待値が高すぎることによる失望リスク</li>
                  <li>コストが高くなりがちな経済的負担</li>
                  <li>完全な休息が得られない場合の疲労蓄積</li>
                  <li>常に刺激を求める「体験中毒」のリスク</li>
                </PracticalTips>
              </div>
            </DefinitionGrid>

            <SectionSubtitle>守りの休暇：安定と停滞の間</SectionSubtitle>
            
            <DefinitionGrid>
              <div>
                <h4 style={{ color: '#4CAF50' }}>✅ メリット</h4>
                <PracticalTips>
                  <li>深いリラクゼーションによる心身の完全回復</li>
                  <li>内省時間の確保による自己理解の深化</li>
                  <li>ストレスホルモンの正常化と免疫力向上</li>
                  <li>家族や親しい人との絆の深化</li>
                  <li>コストを抑えた持続可能な休暇スタイル</li>
                </PracticalTips>
              </div>
              
              <div>
                <h4 style={{ color: '#f44336' }}>⚠️ デメリット</h4>
                <PracticalTips>
                  <li>新しい刺激や学習機会の不足</li>
                  <li>成長や変化への機会の逸失</li>
                  <li>社会的孤立や情報格差のリスク</li>
                  <li>惰性や現状維持バイアスの強化</li>
                  <li>キャリア停滞の可能性</li>
                </PracticalTips>
              </div>
            </DefinitionGrid>
          </ContentSection>

          <ContentSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SectionTitle>現代社会における休暇の意味と価値</SectionTitle>
            
            <Paragraph>
              デジタル革命とグローバル化が加速する現代において、休暇の意味は従来の「労働からの一時的な解放」を遥かに超えている。それは、個人の人生戦略における重要な要素であり、組織の競争力を左右する人的資源管理の核心でもある。
            </Paragraph>

            <SectionSubtitle>🌐 ハイブリッドワーク時代の休暇革命</SectionSubtitle>
            
            <Paragraph>
              リモートワークとオンサイトワークが混在する現代において、仕事とプライベートの境界は曖昧になっている。この状況下で、休暇は単なる時間的区切りではなく、「意識の切り替え」という質的な変化を意味するようになった。
            </Paragraph>

            <HighlightBox>
              <p>ハイブリッドワーク環境では、物理的な境界の曖昧さにより多くの労働者が休暇中も仕事について考えてしまう傾向があります。しかし、意識的な休暇設計を行うことで、この問題を緩和し、より効果的な回復と生産性向上を実現できると考えられています。</p>
            </HighlightBox>

            <SectionSubtitle>🧘‍♀️ ウェルビーイング経営との融合</SectionSubtitle>
            
            <Paragraph>
              企業の人事戦略において、従業員のウェルビーイング（心身の健康と幸福）は最重要課題となっている。先進的な企業では、従業員の休暇スタイルを分析し、個人の特性や業務内容に応じた「パーソナライズド休暇制度」を導入し始めている。
            </Paragraph>

            <Paragraph>
              先進的な企業では、従業員の個人特性や業務特性に応じたパーソナライズド休暇制度の検討が進んでいます。この背景には、画一的な休暇制度では個人のニーズや回復パターンの多様性に対応できないという認識があります。個人の性格特性、ストレスレベル、キャリア段階などを考慮した休暇設計により、より効果的な回復と成長が期待できると考えられています。
            </Paragraph>
          </ContentSection>

          <ContentSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <SectionTitle>実践的アドバイス：最適な休暇デザイン</SectionTitle>
            
            <SectionSubtitle>🎯 攻めの休暇の効果的な実践法</SectionSubtitle>
            
            <PracticalTips>
              <li><strong>学習目標の明確化：</strong>休暇前に「何を学びたいか」「どんな体験をしたいか」を具体的に設定する</li>
              <li><strong>快適圏外活動：</strong>普段の生活では体験できない活動を意識的に選択する（新しい言語、スポーツ、芸術など）</li>
              <li><strong>地域密着型体験：</strong>観光地ではなく、地元の人々との交流を重視した滞在を選ぶ</li>
              <li><strong>スキルハッキング：</strong>休暇中に集中的に新しいスキルを習得する「ハッカソン型休暇」の実践</li>
              <li><strong>リフレクション日記：</strong>体験から得た気づきや学びを毎日記録し、帰国後の実生活への応用を計画する</li>
            </PracticalTips>

            <SectionSubtitle>🛡️ 守りの休暇の深化テクニック</SectionSubtitle>
            
            <PracticalTips>
              <li><strong>デジタルデトックス：</strong>完全なオフライン時間を確保し、脳の情報処理能力を回復させる</li>
              <li><strong>マインドフルネス実践：</strong>瞑想、ヨガ、森林浴など、現在の瞬間に集中する活動を取り入れる</li>
              <li><strong>睡眠最適化：</strong>普段不足している睡眠を量と質の両面で補完し、体内リズムを整える</li>
              <li><strong>感情の整理：</strong>日記やアート活動を通じて、蓄積されたストレスや感情を健全に処理する</li>
              <li><strong>人間関係の再構築：</strong>家族や友人との深い対話時間を確保し、社会的絆を強化する</li>
            </PracticalTips>

            <SectionSubtitle>⚖️ バランス型休暇の設計原理</SectionSubtitle>
            
            <Paragraph>
              理論的考察において、攻めと守りのバランスを取った「ハイブリッド休暇」が最も効果的とする見解があります。休暇設計理論における「理論的配分モデル」では：
            </Paragraph>

            <DefinitionGrid>
              <div>
                <h4>70% - コア体験</h4>
                <p>自分の現在の興味や目標に直結する活動（攻めまたは守りのメイン要素）</p>
              </div>
              <div>
                <h4>20% - 補完体験</h4>
                <p>メイン要素を支える対照的な活動（攻めなら守り、守りなら攻めの要素）</p>
              </div>
            </DefinitionGrid>
            
            <div style={{ marginTop: '1rem' }}>
              <h4>10% - 実験的体験</h4>
              <p>全く新しい、予想がつかない活動（セレンディピティの創出）</p>
            </div>
          </ContentSection>

          <ContentSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <SectionTitle>哲学的考察：休暇と人間存在の本質</SectionTitle>
            
            <Paragraph>
              古代ギリシャの哲学者アリストテレスは、人間の活動を「労働（Labor）」「仕事（Work）」「活動（Action）」の三つに分類した。現代の休暇概念は、この第三の領域である「活動」に深く関わっている。それは、生存のためでも生産のためでもない、純粋に人間的な営みの領域である。
            </Paragraph>

            <PhilosophicalQuote>
              我思う、ゆえに我あり。しかし現代においては、「我休む、ゆえに我成る」と言えるかもしれない。休暇は自己の再発見と再創造の時間である。
              <div className="author">— 哲学的考察より</div>
            </PhilosophicalQuote>

            <SectionSubtitle>🌱 存在論的休暇論</SectionSubtitle>
            
            <Paragraph>
              ドイツの哲学者マルティン・ハイデガーが提唱した「存在と時間」の概念を現代の休暇論に応用すると、興味深い洞察が得られる。彼の言う「本来的存在」への回帰こそが、真の休暇の本質なのではないだろうか。
            </Paragraph>

            <HighlightBox>
              <p>「攻めの休暇」は、世界-内-存在としての自己の可能性を拡張する営み。</p>
              <p>「守りの休暇」は、本来的自己への回帰と内的時間の回復の営み。</p>
              <p>両者は相補的に作用し、人間存在の全体性を構成する。</p>
            </HighlightBox>

            <SectionSubtitle>🎭 現代社会の「休暇に関する社会的圧力」現象</SectionSubtitle>
            
            <Paragraph>
              マルクスの疎外論を現代の休暇に適用すると、多くの人々が「休暇に関する社会的圧力」状態にあることが見えてくる。SNSでの承認欲求、消費主義的な休暇産業、効率性への強迫観念—これらすべてが、本来的な休暇体験を阻害している。
            </Paragraph>

            <Paragraph>
              現代社会において、多くの人々が休暇中でも社会的な視線や期待を意識してしまう「表面的な休暇行動」現象が指摘されています。SNSの普及により、休暇体験も他者との比較や承認欲求の対象となり、本来の休息効果を阻害する要因となっている可能性があります。この現象は、真の休息とは正反対の心理的負担を生み出すと考えられています。
            </Paragraph>

            <SectionSubtitle>🌀 時間哲学としての休暇</SectionSubtitle>
            
            <Paragraph>
              フランスの哲学者アンリ・ベルクソンの「持続」概念は、休暇の時間的性質を理解するための重要な鍵となる。量的時間（クロノス）ではなく、質的時間（カイロス）としての休暇—それは、時計の針が刻む均質な時間ではなく、体験の深さと豊かさによって測られる時間である。
            </Paragraph>

            <PhilosophicalQuote>
              真の休暇とは、時間を消費することではなく、時間を創造することである。それは、日常の時間秩序から解放され、自分だけの時間を紡ぎ出す創造的行為なのだ。
              <div className="author">— 時間哲学における質的時間概念</div>
            </PhilosophicalQuote>
          </ContentSection>

          <References>
            <h3>理論的基盤・参考文献</h3>
            <ol>
              <li>Kaplan, R. & Kaplan, S. "The Experience of Nature: A Psychological Perspective", Cambridge University Press, 1989（注意回復理論）</li>
              <li>Deci, E. L. & Ryan, R. M. "Self-Determination Theory: Basic Psychological Needs in Motivation, Development, and Wellness", Guilford Press, 2017</li>
              <li>Csikszentmihalyi, M. "Flow: The Psychology of Optimal Experience", Harper & Row, 1990</li>
              <li>Baumeister, R. F. & Tierney, J. "Willpower: Rediscovering the Greatest Human Strength", Penguin Press, 2011（認知資源理論）</li>
              <li>Hobfoll, S. E. "Conservation of Resources Theory", Applied Psychology, 1989（資源保存理論）</li>
              <li>Martin Heidegger, "Being and Time", 1927（邦訳：存在と時間）</li>
              <li>Henri Bergson, "Time and Free Will", 1896（邦訳：時間と自由意志）</li>
              <li>Hannah Arendt, "The Human Condition", 1958（邦訳：人間の条件）</li>
              <li>Aristotle, "Nicomachean Ethics"（邦訳：ニコマコス倫理学）</li>
              <li>現代労働心理学・ウェルビーイング研究の各種理論的枠組み</li>
            </ol>
          </References>
        </MainContent>

        <Sidebar>
          <SidebarWidget>
            <WidgetTitle>記事タグ</WidgetTitle>
            <TagList>
              <Tag>休暇哲学</Tag>
              <Tag>ウェルビーイング</Tag>
              <Tag>神経科学</Tag>
              <Tag>心理学</Tag>
              <Tag>ライフスタイル</Tag>
              <Tag>現代社会論</Tag>
            </TagList>
          </SidebarWidget>

          <SidebarWidget>
            <WidgetTitle>関連記事</WidgetTitle>
            <RelatedArticles>
              <div className="article-item">
                <h4>睡眠科学の最前線：質の高い休息を設計する</h4>
                <p>最新の睡眠研究から学ぶ、効果的な回復戦略</p>
              </div>
              <div className="article-item">
                <h4>マインドフルネス革命：現代人の心の健康</h4>
                <p>瞑想科学が明かす、心の平穏を取り戻す方法</p>
              </div>
              <div className="article-item">
                <h4>デジタルデトックスの科学的根拠</h4>
                <p>情報過多時代における、意識的な距離の取り方</p>
              </div>
            </RelatedArticles>
          </SidebarWidget>

          <SidebarWidget>
            <WidgetTitle>読者への問いかけ</WidgetTitle>
            <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
              <p>あなたの最後の休暇は「攻め」でしたか、「守り」でしたか？</p>
              <p>その選択は、あなたの人生にどのような影響を与えましたか？</p>
              <p>理想的な休暇があるとしたら、それはどのような形でしょうか？</p>
            </div>
          </SidebarWidget>
        </Sidebar>
      </ArticleLayout>
    </Container>
  );
};

export default OffensiveDefensiveVacationArticle;