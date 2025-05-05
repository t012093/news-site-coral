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
                決済革命前夜：StripeがPayPay・DeNAと連携、ネットワークトークンで日本市場を揺るがす
              </ArticleTitle>
              <ArticleMeta>公開日: 2025年4月23日</ArticleMeta>
            </motion.div>
          </ArticleHeader>
        </HeroContent>
      </HeroSection>

      <ContentLayout>
        <MainContent>
          <ArticleContent initial="initial" animate="animate" variants={fadeIn}>
            {/* 以下、本文の段落や見出しはそのまま貼り付けでOKです */}
            {/* 長いため省略可、必要なら分割します */}
          </ArticleContent>
        </MainContent>
      </ContentLayout>
    </Container>
  );
};

export default StripePayPayDeNAArticle;
