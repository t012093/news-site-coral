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
  background-image: url('/images/toudai.png');
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
    background: var(--primary-color);
    font-style: italic;
    border-radius: 0 8px 8px 0;
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

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const HighlightBox = styled.div`
  background: var(--primary-color);
  border: 1px solid var(--accent-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const GiftOfIgnorancePage = () => {
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
              <ArticleTitle>無知という贈り物</ArticleTitle>
              <ArticleMeta>
                <ArticleTag
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  哲学
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
              私たちは日々、新しいことを学び、知識を蓄えていきます。しかし、学べば学ぶほど、自分がどれほど知らないかを
              思い知らされる瞬間が増えていくのではないでしょうか。これは、まるで無限に広がる宇宙を覗き込むような感覚です。
              知識を深めるほど、自分の無知が浮き彫りになり、時にはその事実に落胆してしまうこともあります。
              しかし、「無知」であることは決してネガティブなものではありません。むしろ、それこそが最大の贈り物なのです。
            </p>

            <h2>無知がもたらす自由</h2>
            <p>
              「知らないからこそできること」が世の中には数多く存在します。例えば、新しい挑戦に対して、あまり深く考えずに
              飛び込めるのは、無知が持つ力の一つです。もし最初からすべての困難やリスクを知っていたら、恐れを感じて
              踏み出せなかったかもしれません。
            </p>

            <p>
              歴史を見ても、偉大な発明や革新は、多くの場合、無知から生まれています。飛行機を発明したライト兄弟は、
              航空力学の専門家ではなく、自転車屋の兄弟でした。彼らが「飛行は不可能」という常識に囚われていたら、
              空を飛ぶという夢は実現しなかったかもしれません。無知だからこそ、不可能に挑戦する勇気を持てたのです。
            </p>

            <h2>知ることで無知を知る</h2>
            <HighlightBox>
              <blockquote>
                "自分が何も知らないと知ることこそが知恵である" - ソクラテス
              </blockquote>
            </HighlightBox>
            
            <p>
              ソクラテスの「無知の知」という言葉は、「自分が何も知らないと知ることこそが知恵である」と説いています。
              私たちは知識を得るたびに、より広い世界の存在を知り、自分の知らないことの多さに気づきます。
              このプロセスをポジティブに捉えることができれば、知的探究心は尽きることがありません。
            </p>

            <p>
              しかし、逆に「知りすぎること」で不安を感じる人も少なくありません。世界の問題、社会の課題、
              複雑な人間関係――知れば知るほど、自分の無力さを感じることもあるでしょう。でも、そこにこそ学びの価値があります。
              無知を自覚することは、自分を成長させる第一歩なのです。
            </p>

            <h2>無知と謙虚さ</h2>
            <p>
              無知を受け入れることで、人は謙虚になります。他者の意見に耳を傾け、柔軟に物事を考えられるようになります。
              「自分はすべてを知っている」と思った瞬間に、学びは止まり、傲慢さが生まれます。しかし、「自分はまだまだ知らない」と
              思える人は、どこまでも成長し続けることができます。
            </p>

            <HighlightBox>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                成功者に共通する「無知」との向き合い方
              </h3>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '1rem' }}>
                  ✓ 常に学び続ける姿勢を持つ
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  ✓ 自分の限界を知り、他者の知恵を借りる
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  ✓ 失敗を学びの機会として捉える
                </li>
                <li>
                  ✓ 好奇心を持ち続ける
                </li>
              </ul>
            </HighlightBox>

            <p>
              成功者の多くは、知識を持ちながらも「学び続ける姿勢」を忘れません。イーロン・マスクや
              スティーブ・ジョブズのような人物も、常に新しい知識を吸収し、自分の未熟さを認識しながら
              前に進んでいました。彼らのように、私たちも「知らないことがある」という事実を恐れず、
              それを成長の糧にしていくべきです。
            </p>

            <h2>無知を楽しむ</h2>
            <p>
              無知であることを悲観するのではなく、それを楽しむことが大切です。「知らないことがある」というのは、
              未来に新しい驚きや発見が待っている証拠です。子供のように、好奇心を持ち続けることで、
              人生はより豊かになります。
            </p>

            <p>
              もし「知ること」が辛くなったときは、少し視点を変えてみましょう。無知であることを楽しみ、
              学び続ける喜びを感じることで、新たな可能性が広がっていきます。
            </p>

            <HighlightBox>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                無知を活かす3つのポイント
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem'
              }}>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    好奇心
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    新しいことへの興味を持ち続ける
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    謙虚さ
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    学ぶ姿勢を忘れない
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                    勇気
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                    失敗を恐れない
                  </p>
                </div>
              </div>
            </HighlightBox>

            <p>
              無知は決して欠点ではなく、私たちに与えられた最大の贈り物です。それをどう活かすかは、自分次第なのです。
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

            <BackButton
              href="/spiritual"
              whileHover={{ color: '#ff6b6b' }}
              transition={{ duration: 0.2 }}
            >
              記事一覧に戻る
            </BackButton>
          </ArticleContent>
        </MainContent>

        <Sidebar>
          <SidebarWidget>
            <WidgetTitle>関連トピック</WidgetTitle>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block', marginRight: '0.5rem' }}
            >
              哲学
            </ArticleTag>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block', marginRight: '0.5rem' }}
            >
              自己啓発
            </ArticleTag>
            <ArticleTag
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: '0.8rem', display: 'inline-block' }}
            >
              マインドフルネス
            </ArticleTag>
          </SidebarWidget>
        </Sidebar>
      </ContentLayout>
    </Container>
  );
};

export default GiftOfIgnorancePage;
