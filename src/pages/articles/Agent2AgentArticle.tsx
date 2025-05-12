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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <ArticleTitle>
                AIエージェント連携革命：Googleが「Agent2Agentプロトコル」を発表、50社が支持
              </ArticleTitle>
              <ArticleMeta>公開日: 2025年4月</ArticleMeta>
            </motion.div>
          </ArticleHeader>
        </HeroContent>
      </HeroSection>

      <ContentLayout>
        <MainContent>
          <ArticleContent initial="initial" animate="animate" variants={fadeIn}>
            <p>
              2025年4月、Google Cloudは「Google Cloud Next 2025」において、AIエージェントの連携を実現する新たな通信プロトコル「Agent2Agent（A2A）」を発表しました。既に50社以上のテクノロジーパートナーが支持を表明しており、業界に大きなインパクトを与えています。
            </p>

            <h2>A2Aプロトコルとは何か</h2>
            <p>
              Agent2Agentプロトコルは、複数のAIエージェントがベンダーや基盤を超えて協力し合うことを目的とした、オープンかつ拡張性の高いプロトコルです。Anthropic提唱の「Model Context Protocol（MCP）」を補完する形で設計されており、音声・映像といった非構造データにも対応可能。HTTPやJSON-RPCなど既存技術と親和性が高く、企業導入のハードルも低く設定されています。
            </p>

            <h2>エージェントの役割と構成</h2>
            <p>
              A2Aでは、タスク指示を行う「クライアントエージェント」と、実行や応答を担当する「リモートエージェント」が存在。これにより、複数のAIが役割分担しながら一連の処理を協調して実行する、柔軟なマルチエージェントシステムが構築可能となります。
            </p>

            <h2>産業界への波及とユースケース</h2>
            <p>
              サポートを表明した企業には、クラウド・ロボティクス・自動化領域をリードする大手も含まれ、今後はヘルスケアや製造、教育など、複数AIの協調が求められる分野への応用が期待されます。特に、カスタマーサポート、研究開発、データ分析分野での活用は加速するでしょう。
            </p>

            <h2>今後の展望と課題</h2>
            <p>
              Googleは同時に「Agent Development Kit」も公開し、開発の民主化を後押し。オープンソースで100行以下のコードからエージェント構築が可能となり、開発コミュニティの拡大も視野に入れています。一方で、セキュリティや認証、責任の所在といった新たな倫理・運用課題も議論を呼ぶと考えられます。
            </p>

            <p>
              Agent2Agentプロトコルの登場は、AIが単体で動作する時代から、AI同士が“チーム”として連携する時代へのシフトを意味します。Googleの描く「AIエージェントの共創未来」は、すでに始まりつつあるのです。
            </p>

            <div className="keywords">
              キーワード: #AI #Agent2Agent #GoogleCloud #MCP #マルチエージェント
            </div>
          </ArticleContent>
        </MainContent>
      </ContentLayout>
    </Container>
  );
};

export default Agent2AgentArticle;
