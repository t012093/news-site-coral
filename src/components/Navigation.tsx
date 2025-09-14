import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import MessageIcon from './message/MessageIcon';
import { PerformantMotion, optimizedAnimations } from './PerformantMotion';

const Nav = styled.nav`
  background-color: var(--background-color);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem 0.5rem;
  }
`;

const NavContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 0.5rem;
  }
`;

const Logo = styled(Link)`
  font-family: var(--font-secondary);
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: inherit;
  }
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    font-weight: 500;
    letter-spacing: -0.01em;
  }
  
  @media (max-width: 360px) {
    font-size: 1.2rem;
  }
`;

const LogoText = styled.span`
  @media (max-width: 640px) {
    .full { display: none; }
    .short { display: inline; }
  }
  
  @media (min-width: 641px) {
    .full { display: inline; }
    .short { display: none; }
  }
  
  @media (max-width: 380px) {
    .short { display: none; }
    .icon { display: inline; }
  }
  
  @media (min-width: 381px) {
    .icon { display: none; }
  }
`;

const NavLinks = styled.div<{ isOpen?: boolean }>`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--background-color);
    flex-direction: column;
    padding: 2rem;
    border-bottom: 1px solid #2a2a2a;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    gap: 1.5rem;
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  @media (max-width: 768px) {
    gap: 0.6rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--accent-color);
  object-fit: cover;
`;

const AuthButton = styled.button`
  background: transparent;
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: var(--accent-color);
    color: white;
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
    border-radius: 4px;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
`;

const LoginButton = styled(AuthButton)`
  background: var(--accent-color);
  color: white;

  &:hover {
    background: #8b5fe6;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--primary-color);
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 180px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: #2a2a2a;
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--text-color);
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2a2a2a;
  }
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--accent-color);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
  
  &:hover {
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    text-align: center;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };


  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <LogoText>
            <span className="full">Coral Magazine</span>
            <span className="short">Coral</span>
            <span className="icon">🪸</span>
          </LogoText>
        </Logo>
        <NavLinks isOpen={mobileMenuOpen}>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/music" onClick={() => setMobileMenuOpen(false)}>
            Music
          </NavLink>
          <NavLink to="/tech" onClick={() => setMobileMenuOpen(false)}>
            Tech
          </NavLink>
          <NavLink to="/spiritual" onClick={() => setMobileMenuOpen(false)}>
            Spiritual
          </NavLink>
          <NavLink to="/health" onClick={() => setMobileMenuOpen(false)}>
            Health
          </NavLink>
          <NavLink to="/arts" onClick={() => setMobileMenuOpen(false)}>
            Arts
          </NavLink>
          <NavLink to="/politics" onClick={() => setMobileMenuOpen(false)}>
            Politics
          </NavLink>
          <NavLink to="/events" onClick={() => setMobileMenuOpen(false)}>
            Events
          </NavLink>
          <NavLink to="/projects" onClick={() => setMobileMenuOpen(false)}>
            Projects
          </NavLink>
        </NavLinks>
        
        <AuthSection>
            {isAuthenticated && user ? (
              <>
                <MessageIcon unreadCount={2} />
                <DropdownContainer>
                <UserInfo 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ cursor: 'pointer' }}
                >
                  <Avatar src={user.avatar || '/images/man.png'} alt={user.displayName} />
                  <span>{user.displayName}</span>
                </UserInfo>
                
                <AnimatePresence>
                  {showDropdown && (
                    <DropdownMenu
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DropdownItem to="/profile" onClick={() => setShowDropdown(false)}>
                        📋 マイページ
                      </DropdownItem>
                      <DropdownItem to="/shift" onClick={() => setShowDropdown(false)}>
                        🗓️ シフト管理
                      </DropdownItem>
                      <DropdownItem to="/tasks" onClick={() => setShowDropdown(false)}>
                        📋 タスク管理
                      </DropdownItem>
                      <DropdownButton onClick={handleLogout}>
                        🚪 ログアウト
                      </DropdownButton>
                    </DropdownMenu>
                  )}
                </AnimatePresence>
              </DropdownContainer>
              </>
            ) : (
              <>
                <AuthButton onClick={() => navigate('/register')}>
                  新規登録
                </AuthButton>
                <LoginButton onClick={() => navigate('/login')}>
                  ログイン
                </LoginButton>
              </>
            )}
        </AuthSection>
        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;
