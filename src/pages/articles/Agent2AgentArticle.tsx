import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  position: relative;
  height: 50vh;
  min-height: 400px;
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
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 3rem;
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
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1.3;
  font-weight: 700;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`;

const ArticleMeta = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
`;

const ContentLayout = styled.div`
  margin: 0 auto;
  padding: 0 2rem;
  max-width: 900px;
`;

const MainContent = styled.div`
  width: 100%;
`;

const ArticleContent = styled(motion.div)`
  line-height: 1.7;
  font-size: 1.1rem;
  color: var(--text-color);

  p {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.8rem;
    margin: 2.5rem 0 1rem;
    color: var(--accent-color);
    font-weight: 600;
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin: 2rem 0 1rem;
    color: var(--secondary-color);
    font-weight: 600;
  }

  .keywords {
    margin-top: 3rem;
    font-size: 0.9rem;
    color: var(--secondary-color);
    font-style: italic;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1rem;
  }
`;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const Agent2AgentArticle: React.FC = () => {
  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <ArticleHeader>
            <motion.div initial="initial" animate="animate" variants={fadeIn}>
              <ArticleTitle>
                AIエージェント連携革命：Googleの「Agent2Agent」とは何か？
              </ArticleTitle>
              <ArticleMeta>公開日: 2025年4月</ArticleMeta>
            </motion.div>
          </ArticleHeader>
        </HeroContent>
      </HeroSection>

      <ContentLayout>
        <MainContent>
          <ArticleContent initial="initial" animate="animate" variants={fadeIn}>
            <h2>そもそもAgent2Agentとは？（かんたん解説）</h2>
            <p>
              Agent2Agent（A2A）とは、AI同士が話し合って協力するための“共通言語”のようなものです。
              たとえば、レストラン予約が得意なAIと、天気予報が得意なAIが、同じユーザーのために連携して行動する——そんな未来を実現します。
            </p>
            <p>
              これまで、AI同士は開発会社が違うと情報交換が難しかったのですが、A2Aはその壁をなくし、誰でも自由にAIをつなげられる仕組みです。
            </p>

            <h2>A2Aの仕組みをもう少し詳しく</h2>
            <p>
              A2Aでは、AIエージェントが「クライアント」と「リモート」に分かれます。
              ユーザーが指示を出すのがクライアントエージェント、実際に作業を行うのがリモートエージェントです。
              リモート側は“エージェントカード”という自己紹介のような形式で、自分の能力を説明できます。
            </p>

            <h2>技術者・ビジネス層向け：A2Aの仕様ポイント</h2>
            <ul>
              <li>通信形式はJSON over HTTP／JSON-RPCに準拠</li>
              <li>「Agent Card」は能力記述を行う標準化されたJSON構造</li>
              <li>セッション管理やエージェント探索は、明示的な状態管理を避けた設計</li>
              <li>交渉可能な機能：例「画像を出せる」「動画も見せられる」など</li>
              <li>他のプロトコル（MCP）との併用で外部APIとも連携可能</li>
            </ul>

            <h2>期待される活用領域</h2>
            <p>
              すでにSalesforce、Atlassian、PayPalなど50社以上がこのプロトコルに参加を表明しています。
              ユースケースとしては、BtoB向けの業務自動化、カスタマーサポートの分業、複数AIの意思決定の協調などが考えられます。
            </p>

            <h2>未来の展望と課題</h2>
            <p>
              A2Aはまだ発展途上ですが、将来的にはAIが“相手を選んでチームを組む”時代の核になります。
              同時に、セキュリティ・認証・責任範囲などの運用課題も新たに浮上してくるでしょう。
            </p>

            <div className="keywords">
              キーワード: #Agent2Agent #AIエージェント #通信プロトコル #MCP #連携技術
            </div>
          </ArticleContent>
        </MainContent>
      </ContentLayout>
    </Container>
  );
};

export default Agent2AgentArticle;
