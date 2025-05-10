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
  background-image: url('/images/pay.png');
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

const StripePayPayDeNAArticle: React.FC = () => {
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
                Stripe、PayPayと連携しDeNA採用へ──ネットワークトークンと3Dセキュアで決済革命
              </ArticleTitle>
              <ArticleMeta>公開日: 2025年4月22日</ArticleMeta>
            </motion.div>
          </ArticleHeader>
        </HeroContent>
      </HeroSection>

      <ContentLayout>
        <MainContent>
          <ArticleContent initial="initial" animate="animate" variants={fadeIn}>
            <p>
              Stripeは決済技術の最前線を走り続けています。「Stripe Payment Summit 2025」では、日本市場向けにPayPayオンライン決済、カード分割払い機能、DeNA Payとの連携、ネットワークトークンの導入といった多数のアップデートが発表されました。
            </p>
            <h2>PayPay決済の本格導入</h2>
            <p>
              日本最大のコード決済であるPayPayが、Stripeで利用可能になりました。モバイルに最適化された設計と高速な入金サイクルにより、スムーズで安心な決済体験が提供されます。
            </p>
            <h2>DeNA Payとの連携強化</h2>
            <p>
              DeNAが提供する「DeNA Pay」は、公式アプリやリセールサービスで利用されており、今回Stripeを決済パートナーとして正式採用。不正防止AIの効果や開発ドキュメントの充実度が評価されました。
            </p>
            <h2>カード分割払いの提供</h2>
            <p>
              Stripeが提供する新機能により、ユーザーは最大60回までの分割やボーナス払いが可能。企業にとっては4営業日での入金によりキャッシュフローが安定し、導入負担も最小限です。
            </p>
            <h2>3DセキュアとAIによる不正対策</h2>
            <p>
              StripeのAIエンジンは3Dセキュア対応を自動で最適化。ユーザーの操作負担を減らしつつ不正利用を防止。Stripe Radarとの併用で、検知精度を高めながら売上を守る設計になっています。
            </p>
            <h2>ネットワークトークンによる次世代決済</h2>
            <p>
              日本で初めてStripeが導入したネットワークトークンは、カード情報の漏洩リスクを減らし、安定した決済体験を実現。カード有効期限切れでも自動更新され、顧客満足度の向上が期待されます。
            </p>
            <div className="keywords">
              キーワード: #Stripe #PayPay #DeNA #ネットワークトークン #3Dセキュア #キャッシュレス #フィンテック
            </div>
          </ArticleContent>
        </MainContent>
      </ContentLayout>
    </Container>
  );
};

export default StripePayPayDeNAArticle;
