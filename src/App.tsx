import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from '@emotion/styled';
import { Global } from '@emotion/react';
import { globalStyles } from './styles/globalStyles';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
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
`;

function App() {
  return (
    <Router>
      <Global styles={globalStyles} />
      <AppContainer>
        <Navigation />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tech" element={<TechPage />} />
            <Route path="/spiritual" element={<SpiritualPage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/arts" element={<ArtsPage />} />
            <Route path="/politics" element={<PoliticsPage />} />
          </Routes>
        </MainContent>
        <Footer />
      </AppContainer>
    </Router>
  );
}

export default App;
