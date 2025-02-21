import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Nav = styled.nav`
  background-color: var(--background-color);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-family: var(--font-secondary);
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion(Link))`
  color: var(--secondary-color);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 0;
  position: relative;

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
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--primary-color);

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navigation = () => {
  const linkHoverAnimation = {
    scale: 1.05,
    transition: { duration: 0.2 }
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">CORAL</Logo>
        <NavLinks>
          <NavLink 
            to="/tech"
            whileHover={linkHoverAnimation}
          >
            Tech
          </NavLink>
          <NavLink 
            to="/spiritual"
            whileHover={linkHoverAnimation}
          >
            Spiritual
          </NavLink>
          <NavLink 
            to="/health"
            whileHover={linkHoverAnimation}
          >
            Health
          </NavLink>
          <NavLink 
            to="/arts"
            whileHover={linkHoverAnimation}
          >
            Arts
          </NavLink>
          <NavLink 
            to="/politics"
            whileHover={linkHoverAnimation}
          >
            Politics
          </NavLink>
        </NavLinks>
        <MobileMenuButton>☰</MobileMenuButton>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;
