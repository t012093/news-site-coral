import React from 'react';
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
  background-image: url('/images/agent2agent.png');
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
  max-width: 900px;
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
  font-size: 1rem;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
`;

const ContentLayout = styled.div`
  margin: 0 auto;
  padding: 0 2rem;
  max-width: 900px;
`;

const ArticleContent = styled(motion.div)`
  line-height: 1.8;
  font-size: 1.2rem;
  color: var(--text-color);

  p {
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 2rem;
    margin: 3rem 0 1.5rem;
    color: var(--accent-color);
    font-weight: 600;
  }
`;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
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
              <ArticleTitle>未来を変えるAIの対話：Agent2Agentが開く新世界</ArticleTitle>
              <ArticleMeta>2025年4月 / Google Cloud Next 2025</ArticleMeta>
            </motion.div>
          </ArticleHeader>
        </HeroContent>
      </HeroSection>

      <ContentLayout>
        <ArticleContent initial="initial" animate="animate" variants={fadeIn}>
          <p>
            あなたが話している相手が実はAIだったとして、その相手がまた別のAIに相談していたとしたら？そんな近未来が現実になろうとしています。Googleが発表した「Agent2Agent（A2A）」は、AI同士が協力しながら複雑なタスクをこなすための共通言語。AIが“チーム”として動き出す、その第一歩です。
          </p>

          <h2>Agent2Agentとは？</h2>
          <p>
            A2Aは、異なる企業や基盤で構築されたAIエージェント同士をつなぐオープンプロトコル。Googleはこの発表で、AIが孤立した存在から「連携・協働する存在」へ進化するビジョンを提示しました。構造はシンプル。クライアントエージェントがタスクを受け取り、最適なリモートエージェントに引き継ぐ。それだけでAI同士が自然に“会話”を始めます。
          </p>

          <h2>ユースケース：予約から研究まで</h2>
          <p>
            例えば「この条件で優秀なエンジニアを探して」と言えば、採用エージェントがデータベースを横断し、適任をリスト化し、面談日程まで調整。それを裏で支えるのは、まさにA2Aを通じてつながれたAIたち。今後は医療、教育、物流といった、複数の専門エージェントが協働する領域での活用が加速するでしょう。
          </p>

          <h2>技術の核心と可能性</h2>
          <p>
            リモートエージェントは自身の得意分野や形式（映像や表形式など）を「エージェントカード」として自己紹介。その情報を元にクライアントエージェントが“交渉”を開始します。例えば「カードで見せて」「iframe対応してる？」「OK、じゃあこれで」──まるで人間のような協力関係が、わずか数秒で構築されていきます。
          </p>

          <h2>未来の情報エコシステムへ</h2>
          <p>
            A2Aの本質は「分断の橋渡し」です。単一エージェントの限界を超え、複数のAIがチームとして協働する──それは、デジタル社会全体の“連携力”を底上げする試みでもあります。既にSalesforceやAtlassian、PayPalをはじめ50社以上がこの動きに賛同。正式版のリリースは2025年後半、AIの未来が静かに、しかし確かに動き出しています。
          </p>

          <p style={{ fontStyle: 'italic', color: 'var(--secondary-color)' }}>
            ＃AI ＃Agent2Agent ＃マルチエージェント ＃GoogleCloud ＃A2A革命
          </p>
        </ArticleContent>
      </ContentLayout>
    </Container>
  );
};

export default Agent2AgentArticle;
