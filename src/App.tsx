import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useEffect, Suspense, lazy } from 'react';
import { Global } from '@emotion/react';
import { Toaster } from 'react-hot-toast';
import { globalStyles } from './styles/globalStyles';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import { WordPressStatusIndicator } from './components/WordPressStatusIndicator';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';

// Critical pages - loaded immediately
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

// Lazy-loaded pages - split into separate chunks
const MusicPage = lazy(() => import('./pages/MusicPage'));
const TechPage = lazy(() => import('./pages/TechPage'));
const SpiritualPage = lazy(() => import('./pages/SpiritualPage'));
const HealthPage = lazy(() => import('./pages/HealthPage'));
const ArtsPage = lazy(() => import('./pages/ArtsPage'));
const PoliticsPage = lazy(() => import('./pages/PoliticsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));

// Heavy feature pages
const InternationalArtCollabPage = lazy(() => import('./pages/projects/InternationalArtCollabPage'));
const InternationalPlatformDevPage = lazy(() => import('./pages/projects/InternationalPlatformDevPage'));
const ShiftDashboard = lazy(() => import('./pages/ShiftDashboard'));
const TaskDashboard = lazy(() => import('./pages/TaskDashboard'));
const MessagePage = lazy(() => import('./pages/MessagePage'));

// Article pages - grouped by category
const SubcultureMusicPage = lazy(() => import('./pages/articles/SubcultureMusicPage'));
const BarbapapaMusicPage = lazy(() => import('./pages/articles/BarbapapaMusicPage'));
const AIWritingArticle = lazy(() => import('./pages/articles/AIWritingArticle'));
const AIReasoningBreakthroughArticle = lazy(() => import('./pages/articles/AIReasoningBreakthroughArticle'));
const AISleepScienceRevolutionArticle = lazy(() => import('./pages/articles/AISleepScienceRevolutionArticle'));
const GiftOfIgnorancePage = lazy(() => import('./pages/articles/GiftOfIgnorancePage'));
const HotspotDramaPage = lazy(() => import('./pages/articles/HotspotDramaPage'));
const GibberLinkAIArticle = lazy(() => import('./pages/articles/GibberLinkAIArticle'));
const StripePayPayDeNAArticle = lazy(() => import('./pages/articles/StripePayPayDeNAArticle'));
const OffensiveDefensiveVacationArticle = lazy(() => import('./pages/articles/OffensiveDefensiveVacationArticle'));
const HippocampusMemoryArticle = lazy(() => import('./pages/articles/HippocampusMemoryArticle'));

// Dynamic pages
const ArticlePage = lazy(() => import('./pages/ArticlePage').then(module => ({ default: module.ArticlePage })));

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;
  background-color: var(--background-color);
  
  @media (max-width: 768px) {
    padding: 10px;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    padding: 5px;
    max-width: 100vw;
  }
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
  // Enable performance monitoring in development
  usePerformanceMonitor(import.meta.env.DEV);

  return (
    <HelmetProvider>
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
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
              <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
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
              <Route path="/projects" element={<PageWrapper><ProjectsPage /></PageWrapper>} />
              <Route path="/projects/international-art-collaboration" element={<PageWrapper><InternationalArtCollabPage /></PageWrapper>} />
              <Route path="/projects/international-platform-development" element={<PageWrapper><InternationalPlatformDevPage /></PageWrapper>} />
              <Route path="/articles/gift-of-ignorance" element={<PageWrapper><GiftOfIgnorancePage /></PageWrapper>} />
              <Route path="/articles/hotspot-drama" element={<PageWrapper><HotspotDramaPage /></PageWrapper>} />
              <Route path="/article/:slug" element={<PageWrapper><ArticlePage /></PageWrapper>} />
              
              {/* シフト管理 */}
              <Route path="/shift" element={
                <PageWrapper>
                  <ProtectedRoute>
                    <ShiftDashboard />
                  </ProtectedRoute>
                </PageWrapper>
              } />
              
              {/* タスク管理 */}
              <Route path="/tasks" element={
                <PageWrapper>
                  <ProtectedRoute>
                    <TaskDashboard />
                  </ProtectedRoute>
                </PageWrapper>
              } />
              
              {/* メッセージ機能 */}
              <Route path="/messages" element={
                <PageWrapper>
                  <ProtectedRoute>
                    <MessagePage />
                  </ProtectedRoute>
                </PageWrapper>
              } />
              
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
            </Suspense>
          </MainContent>
          <Footer />
          {import.meta.env.DEV && <WordPressStatusIndicator />}
        </AppContainer>
      </AuthProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App;
