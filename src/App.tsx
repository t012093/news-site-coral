import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { Global } from '@emotion/react';
import { globalStyles } from './styles/globalStyles';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MusicPage from './pages/MusicPage';
import SubcultureMusicPage from './pages/articles/SubcultureMusicPage';
import BarbapapaMusicPage from './pages/articles/BarbapapaMusicPage';
import AIWritingArticle from './pages/articles/AIWritingArticle';
import GiftOfIgnorancePage from './pages/articles/GiftOfIgnorancePage';
import HotspotDramaPage from './pages/articles/HotspotDramaPage';
import TechPage from './pages/TechPage';
import SpiritualPage from './pages/SpiritualPage';
import HealthPage from './pages/HealthPage';
import ArtsPage from './pages/ArtsPage';
import PoliticsPage from './pages/PoliticsPage';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;
`;

const PageTransition = styled(motion.div)`
  width: 100%;
`;

// スクロール制御用のコンポーネント
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location]);

  return null;
};

// ページ遷移のアニメーション設定
const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

// ページコンテンツをラップするコンポーネント
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <PageTransition
        key={location.pathname}
        variants={pageTransitionVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </PageTransition>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Global styles={globalStyles} />
      <AppContainer>
        <ScrollToTop />
        <Navigation />
        <MainContent>
          <Routes>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/music" element={<PageWrapper><MusicPage /></PageWrapper>} />
            <Route path="/music/subculture" element={<PageWrapper><SubcultureMusicPage /></PageWrapper>} />
            <Route path="/music/barbapapa" element={<PageWrapper><BarbapapaMusicPage /></PageWrapper>} />
            <Route path="/tech" element={<PageWrapper><TechPage /></PageWrapper>} />
            <Route path="/tech/ai-writing" element={<PageWrapper><AIWritingArticle /></PageWrapper>} />
            <Route path="/spiritual" element={<PageWrapper><SpiritualPage /></PageWrapper>} />
            <Route path="/health" element={<PageWrapper><HealthPage /></PageWrapper>} />
            <Route path="/arts" element={<PageWrapper><ArtsPage /></PageWrapper>} />
            <Route path="/politics" element={<PageWrapper><PoliticsPage /></PageWrapper>} />
            <Route path="/articles/gift-of-ignorance" element={<PageWrapper><GiftOfIgnorancePage /></PageWrapper>} />
            <Route path="/articles/hotspot-drama" element={<PageWrapper><HotspotDramaPage /></PageWrapper>} />
          </Routes>
        </MainContent>
        <Footer />
      </AppContainer>
    </Router>
  );
}

export default App;
