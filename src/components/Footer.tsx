import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background-color: var(--primary-color);
  color: white;
  padding: 4rem 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
`;

const FooterSection = styled.div`
  h3 {
    color: white;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  }
`;

const FooterLink = styled(motion.a)`
  display: block;
  color: #b3b3b3;
  text-decoration: none;
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent-color);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled(motion.a)`
  color: white;
  font-size: 1.5rem;
  text-decoration: none;

  &:hover {
    color: var(--accent-color);
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const Newsletter = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  flex: 1;
  font-family: var(--font-primary);
`;

const SubscribeButton = styled(motion.button)`
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #e6367a;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>About CORAL</h3>
          <p style={{ color: '#b3b3b3', marginBottom: '1rem' }}>
            Exploring the intersection of technology, spirituality, and culture through compelling storytelling.
          </p>
          <SocialLinks>
            <SocialIcon 
              href="https://twitter.com" 
              target="_blank"
              whileHover={{ scale: 1.1 }}
            >
              𝕏
            </SocialIcon>
            <SocialIcon 
              href="https://instagram.com" 
              target="_blank"
              whileHover={{ scale: 1.1 }}
            >
              📸
            </SocialIcon>
            <SocialIcon 
              href="https://linkedin.com" 
              target="_blank"
              whileHover={{ scale: 1.1 }}
            >
              💼
            </SocialIcon>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Categories</h3>
          <FooterLink href="/tech" whileHover={{ x: 5 }}>Technology</FooterLink>
          <FooterLink href="/spiritual" whileHover={{ x: 5 }}>Spirituality</FooterLink>
          <FooterLink href="/health" whileHover={{ x: 5 }}>Health & Wellness</FooterLink>
          <FooterLink href="/arts" whileHover={{ x: 5 }}>Arts & Culture</FooterLink>
          <FooterLink href="/politics" whileHover={{ x: 5 }}>Politics</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>Subscribe</h3>
          <p style={{ color: '#b3b3b3', marginBottom: '1rem' }}>
            Get the latest stories delivered to your inbox.
          </p>
          <Newsletter onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="Enter your email" />
            <SubscribeButton 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </SubscribeButton>
          </Newsletter>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {currentYear} CORAL Magazine. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
