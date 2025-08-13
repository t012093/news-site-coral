import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { Global } from '@emotion/react';
import { Toaster } from 'react-hot-toast';
import { globalStyles } from './styles/globalStyles';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import MusicPage from './pages/MusicPage';
import SubcultureMusicPage from './pages/articles/SubcultureMusicPage';
import BarbapapaMusicPage from './pages/articles/BarbapapaMusicPage';
import AIWritingArticle from './pages/articles/AIWritingArticle';
import AIReasoningBreakthroughArticle from './pages/articles/AIReasoningBreakthroughArticle';
import AISleepScienceRevolutionArticle from './pages/articles/AISleepScienceRevolutionArticle';
import GiftOfIgnorancePage from './pages/articles/GiftOfIgnorancePage';
import HotspotDramaPage from './pages/articles/HotspotDramaPage';
import GibberLinkAIArticle from './pages/articles/GibberLinkAIArticle';
import StripePayPayDeNAArticle from './pages/articles/StripePayPayDeNAArticle';
import OffensiveDefensiveVacationArticle from './pages/articles/OffensiveDefensiveVacationArticle';
import HippocampusMemoryArticle from './pages/articles/HippocampusMemoryArticle';
import TechPage from './pages/TechPage';
import SpiritualPage from './pages/SpiritualPage';
import HealthPage from './pages/HealthPage';
import ArtsPage from './pages/ArtsPage';
import PoliticsPage from './pages/PoliticsPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage';
import { ArticlePage } from './pages/ArticlePage';
import { WordPressStatusIndicator } from './components/WordPressStatusIndicator';

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
      <AuthProvider>
        <Global styles={globalStyles} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #2a2a2a',
            },
            success: {
              iconTheme: {
                primary: 'var(--accent-color)',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff6b6b',
                secondary: '#ffffff',
              },
            },
          }}
        />
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
              <Route path="/tech/stripe-paypay-dena" element={<PageWrapper><StripePayPayDeNAArticle /></PageWrapper>} />
              <Route path="/tech/ai-writing" element={<PageWrapper><AIWritingArticle /></PageWrapper>} />
              <Route path="/tech/ai-reasoning-breakthrough" element={<PageWrapper><AIReasoningBreakthroughArticle /></PageWrapper>} />
              <Route path="/tech/gibberlink" element={<PageWrapper><GibberLinkAIArticle /></PageWrapper>} />
              <Route path="/spiritual" element={<PageWrapper><SpiritualPage /></PageWrapper>} />
              <Route path="/health" element={<PageWrapper><HealthPage /></PageWrapper>} />
              <Route path="/health/ai-sleep-science-revolution" element={<PageWrapper><AISleepScienceRevolutionArticle /></PageWrapper>} />
              <Route path="/health/offensive-defensive-vacation" element={<PageWrapper><OffensiveDefensiveVacationArticle /></PageWrapper>} />
              <Route path="/health/hippocampus-memory" element={<PageWrapper><HippocampusMemoryArticle /></PageWrapper>} />
              <Route path="/arts" element={<PageWrapper><ArtsPage /></PageWrapper>} />
              <Route path="/politics" element={<PageWrapper><PoliticsPage /></PageWrapper>} />
              <Route path="/events" element={<PageWrapper><EventsPage /></PageWrapper>} />
              <Route path="/events/:slug" element={<PageWrapper><EventDetailPage /></PageWrapper>} />
              <Route path="/articles/gift-of-ignorance" element={<PageWrapper><GiftOfIgnorancePage /></PageWrapper>} />
              <Route path="/articles/hotspot-drama" element={<PageWrapper><HotspotDramaPage /></PageWrapper>} />
              <Route path="/article/:slug" element={<PageWrapper><ArticlePage /></PageWrapper>} />
              
              {/* 認証関連のルート */}
              <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
              
              {/* 保護されたルート */}
              <Route path="/profile" element={
                <PageWrapper>
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                </PageWrapper>
              } />
            </Routes>
          </MainContent>
          <Footer />
          <WordPressStatusIndicator />
        </AppContainer>
      </AuthProvider>
    </Router>
  );
}

export default App;
