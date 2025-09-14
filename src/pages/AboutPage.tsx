import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import SEOHelmet from '../components/SEOHelmet';

const Container = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
    margin-bottom: 3rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 1rem;
    margin-bottom: 2rem;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 1024px) {
    font-size: 3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    line-height: 1.2;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 1024px) {
    font-size: 1.2rem;
    max-width: 700px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 90%;
    line-height: 1.6;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    br {
      display: none;
    }
  }
`;


const Section = styled.section`
  margin-bottom: 5rem;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 3rem;
    padding: 0 1rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 2rem;
    padding: 0 0.5rem;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: var(--accent-color);
    margin: 1rem auto;
    border-radius: 2px;
  }
  
  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    
    &:after {
      width: 60px;
      height: 3px;
      margin: 0.8rem auto;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const SectionContent = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.8;
  color: var(--text-color);
  font-size: 1.1rem;
  
  @media (max-width: 1024px) {
    max-width: 90%;
    font-size: 1.05rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.7;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

const MissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.2rem;
    margin-top: 2rem;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const MissionCard = styled(motion.div)<{ bgImage?: string }>`
  position: relative;
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  transition: all 0.3s ease;
  overflow: hidden;
  
  ${props => props.bgImage && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 150px;
      background: url('${props.bgImage}') center/cover;
      opacity: 0.15;
      z-index: 0;
    }
  `}
  
  > * {
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(156, 124, 244, 0.2);
    border-color: var(--accent-color);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 8px;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.2rem;
  }
`;

const MissionIcon = styled.div`
  display: none;
`;

const MissionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const MissionDescription = styled.p`
  color: var(--secondary-color);
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.2rem;
    margin-top: 2rem;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const TeamMember = styled(motion.div)`
  text-align: center;
`;

const MemberAvatar = styled.img`
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent-color);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    border-width: 2px;
  }
  
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const MemberName = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const MemberRole = styled.p`
  color: var(--secondary-color);
  font-size: 0.95rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const TimelineContainer = styled.div`
  position: relative;
  padding: 2rem 0;
  
  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--accent-color);
    transform: translateX(-50%);
    
    @media (max-width: 768px) {
      left: 20px;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0;
  }
`;

const TimelineItem = styled(motion.div)<{ align: 'left' | 'right' }>`
  display: flex;
  justify-content: ${props => props.align === 'left' ? 'flex-end' : 'flex-start'};
  padding: 1rem 0;
  position: relative;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 50px;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem 0 0.8rem 40px;
  }
`;

const TimelineContent = styled.div<{ align: 'left' | 'right' }>`
  background: var(--primary-color);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  width: 45%;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    ${props => props.align === 'left' ? 'right: -8px' : 'left: -8px'};
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background: var(--accent-color);
    border-radius: 50%;
    
    @media (max-width: 768px) {
      left: -28px;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 1.2rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    
    &:before {
      left: -23px;
      width: 12px;
      height: 12px;
    }
  }
`;

const TimelineDate = styled.div`
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
`;

const TimelineTitle = styled.h4`
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const TimelineDescription = styled.p`
  color: var(--secondary-color);
  font-size: 0.95rem;
  line-height: 1.6;
`;

const ContactSection = styled.section`
  background: var(--primary-color);
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  margin-top: 4rem;
  border: 1px solid #2a2a2a;
  
  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
    margin-top: 3rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem;
    margin-top: 2rem;
    border-radius: 8px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 2rem;
    margin-top: 1.5rem;
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const AboutPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <SEOHelmet
        title="About - Open Coral Network"
        description="Open Coral NetworkおよびNPO法人Open Coral Networkは、テクノロジー、アート、社会活動を通じて新しい価値を創造し、持続可能な社会の実現を目指す非営利団体です。"
        url="https://cora-network.com/about"
        keywords="Open Coral Network, NPO法人, オープンコーラルネットワーク, 非営利団体, 社会活動, テクノロジー, アート"
      />
      
      <Container>
        <HeroSection>
          <HeroTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Open Coral Network
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            NPO法人 Open Coral Network<br />
            テクノロジーとアートの融合で、新しい価値を創造し、<br />
            持続可能な社会の実現を目指します
          </HeroSubtitle>
        </HeroSection>

        <Section>
          <SectionTitle {...fadeInUp}>私たちのミッション</SectionTitle>
          <SectionContent {...fadeInUp}>
            <p>
              Open Coral Networkは、急速に変化する現代社会において、テクノロジー、アート、文化の架け橋となることを使命としています。
              私たちは、多様な分野の専門家や創造的な個人が集まり、協力し合うことで、社会に新しい価値を提供することを目指しています。
            </p>
            
            <MissionGrid>
              <MissionCard whileHover={{ scale: 1.02 }} bgImage="/images/city.png">
                <MissionIcon>🌐</MissionIcon>
                <MissionTitle>グローバルな視点</MissionTitle>
                <MissionDescription>
                  国境を越えた協力とコミュニケーションを促進し、
                  世界中の人々と知識や経験を共有します。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }} bgImage="/images/ai.png">
                <MissionIcon>💡</MissionIcon>
                <MissionTitle>イノベーションの推進</MissionTitle>
                <MissionDescription>
                  最新技術と創造性を組み合わせ、
                  社会課題の解決に向けた革新的なソリューションを開発します。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }} bgImage="/images/hato.png">
                <MissionIcon>🤝</MissionIcon>
                <MissionTitle>コミュニティの構築</MissionTitle>
                <MissionDescription>
                  多様な背景を持つ人々が集まり、
                  互いに学び合い、成長できる場を提供します。
                </MissionDescription>
              </MissionCard>
            </MissionGrid>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle {...fadeInUp}>活動内容</SectionTitle>
          <SectionContent {...fadeInUp}>
            <MissionGrid>
              <MissionCard whileHover={{ scale: 1.02 }} bgImage="/images/coral2.png">
                <MissionIcon>📚</MissionIcon>
                <MissionTitle>情報発信</MissionTitle>
                <MissionDescription>
                  Coral Magazineを通じて、テクノロジー、アート、文化に関する
                  質の高い情報を発信し、知識の共有と啓発活動を行っています。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }} bgImage="/images/pixel2.png">
                <MissionIcon>🎨</MissionIcon>
                <MissionTitle>アートワーク</MissionTitle>
                <MissionDescription>
                  デジタルアートと伝統文化を融合させた
                  国際的なコラボレーション作品を企画・制作しています。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }} bgImage="/images/labo.png">
                <MissionIcon>🔬</MissionIcon>
                <MissionTitle>研究開発</MissionTitle>
                <MissionDescription>
                  AI、ブロックチェーン、IoTなどの先端技術を活用した
                  社会課題解決のための研究開発を推進しています。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }} bgImage="/images/toudai.png">
                <MissionIcon>🎓</MissionIcon>
                <MissionTitle>ワークショップ</MissionTitle>
                <MissionDescription>
                  次世代のイノベーターを育成するための
                  実践的なワークショップやセミナーを定期的に開催しています。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }} bgImage="/images/tokyo.png">
                <MissionIcon>🌱</MissionIcon>
                <MissionTitle>ソーシャルインパクト</MissionTitle>
                <MissionDescription>
                  環境保護、教育支援、地域活性化など、
                  持続可能な社会の実現に向けたインパクトを創出しています。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }} bgImage="/images/chat.png">
                <MissionIcon>🤖</MissionIcon>
                <MissionTitle>プロジェクト</MissionTitle>
                <MissionDescription>
                  NPOや社会企業と協力して、社会課題解決に向けた
                  革新的なプロジェクトを企画・立案・実行しています。
                </MissionDescription>
              </MissionCard>
            </MissionGrid>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle {...fadeInUp}>チームメンバー</SectionTitle>
          <TeamGrid>
            <TeamMember whileHover={{ scale: 1.05 }}>
              <MemberAvatar src="/images/man.png" alt="代表理事" />
              <MemberName>代表理事</MemberName>
              <MemberRole>戦略立案・組織運営</MemberRole>
            </TeamMember>
            
            <TeamMember whileHover={{ scale: 1.05 }}>
              <MemberAvatar src="/images/she5.png" alt="技術責任者" />
              <MemberName>技術責任者</MemberName>
              <MemberRole>技術開発・システム設計</MemberRole>
            </TeamMember>
            
            <TeamMember whileHover={{ scale: 1.05 }}>
              <MemberAvatar src="/images/she2.png" alt="クリエイティブディレクター" />
              <MemberName>クリエイティブディレクター</MemberName>
              <MemberRole>デザイン・コンテンツ制作</MemberRole>
            </TeamMember>
            
            <TeamMember whileHover={{ scale: 1.05 }}>
              <MemberAvatar src="/images/man4.png" alt="編集長" />
              <MemberName>編集長</MemberName>
              <MemberRole>Coral Magazine運営</MemberRole>
            </TeamMember>
          </TeamGrid>
        </Section>

        <Section>
          <SectionTitle {...fadeInUp}>沿革</SectionTitle>
          <TimelineContainer>
            <TimelineItem align="left" {...fadeInUp}>
              <TimelineContent align="left">
                <TimelineDate>2023年1月</TimelineDate>
                <TimelineTitle>Open Coral Network設立</TimelineTitle>
                <TimelineDescription>
                  テクノロジーとアートの融合を目指す有志により設立
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem align="right" {...fadeInUp}>
              <TimelineContent align="right">
                <TimelineDate>2023年6月</TimelineDate>
                <TimelineTitle>NPO法人認証取得</TimelineTitle>
                <TimelineDescription>
                  特定非営利活動法人として正式に認証を取得
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem align="left" {...fadeInUp}>
              <TimelineContent align="left">
                <TimelineDate>2023年9月</TimelineDate>
                <TimelineTitle>Coral Magazine創刊</TimelineTitle>
                <TimelineDescription>
                  総合情報メディア「Coral Magazine」の運営を開始
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem align="right" {...fadeInUp}>
              <TimelineContent align="right">
                <TimelineDate>2024年3月</TimelineDate>
                <TimelineTitle>国際アートコラボレーション開始</TimelineTitle>
                <TimelineDescription>
                  海外アーティストとの共同プロジェクトを発足
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem align="left" {...fadeInUp}>
              <TimelineContent align="left">
                <TimelineDate>2024年11月</TimelineDate>
                <TimelineTitle>技術研究ラボ設立</TimelineTitle>
                <TimelineDescription>
                  AI・ブロックチェーン研究開発部門を新設
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          </TimelineContainer>
        </Section>

        <ContactSection>
          <SectionTitle style={{ marginBottom: '1rem' }}>お問い合わせ</SectionTitle>
          <p style={{ color: 'var(--secondary-color)', marginBottom: '2rem' }}>
            Open Coral Networkへのご質問、ご提案、協業のご相談など、お気軽にお問い合わせください。
          </p>
          <ContactInfo>
            <ContactItem>
              <span>📧</span>
              <span>info@cora-network.com</span>
            </ContactItem>
            <ContactItem>
              <span>🐦</span>
              <span>@opencoralnet</span>
            </ContactItem>
            <ContactItem>
              <span>📍</span>
              <span>日本</span>
            </ContactItem>
          </ContactInfo>
        </ContactSection>
      </Container>
    </>
  );
};

export default AboutPage;