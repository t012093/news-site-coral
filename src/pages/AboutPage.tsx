import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import SEOHelmet from '../components/SEOHelmet';

const Container = styled.div`
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  margin-bottom: 4rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  opacity: 0.95;
`;

const Section = styled.section`
  margin-bottom: 5rem;
  padding: 0 2rem;
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
`;

const SectionContent = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.8;
  color: var(--text-color);
  font-size: 1.1rem;
`;

const MissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const MissionCard = styled(motion.div)`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(156, 124, 244, 0.2);
    border-color: var(--accent-color);
  }
`;

const MissionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const MissionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const MissionDescription = styled.p`
  color: var(--secondary-color);
  line-height: 1.6;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TeamMember = styled(motion.div)`
  text-align: center;
`;

const MemberAvatar = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
`;

const MemberName = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
`;

const MemberRole = styled.p`
  color: var(--secondary-color);
  font-size: 0.95rem;
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
      left: 30px;
    }
  }
`;

const TimelineItem = styled(motion.div)<{ align: 'left' | 'right' }>`
  display: flex;
  justify-content: ${props => props.align === 'left' ? 'flex-end' : 'flex-start'};
  padding: 1rem 0;
  position: relative;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 60px;
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
      left: -38px;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
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
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
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
              <MissionCard whileHover={{ scale: 1.02 }}>
                <MissionIcon>🌐</MissionIcon>
                <MissionTitle>グローバルな視点</MissionTitle>
                <MissionDescription>
                  国境を越えた協力とコミュニケーションを促進し、
                  世界中の人々と知識や経験を共有します。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }}>
                <MissionIcon>💡</MissionIcon>
                <MissionTitle>イノベーションの推進</MissionTitle>
                <MissionDescription>
                  最新技術と創造性を組み合わせ、
                  社会課題の解決に向けた革新的なソリューションを開発します。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }}>
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
              <MissionCard whileHover={{ scale: 1.02 }}>
                <MissionIcon>📚</MissionIcon>
                <MissionTitle>情報発信</MissionTitle>
                <MissionDescription>
                  Coral Magazineを通じて、テクノロジー、アート、文化に関する
                  質の高い情報を発信し、知識の共有と啓発活動を行っています。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }}>
                <MissionIcon>🎨</MissionIcon>
                <MissionTitle>アートプロジェクト</MissionTitle>
                <MissionDescription>
                  デジタルアートと伝統文化を融合させた
                  国際的なコラボレーションプロジェクトを企画・運営しています。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }}>
                <MissionIcon>🔬</MissionIcon>
                <MissionTitle>研究開発</MissionTitle>
                <MissionDescription>
                  AI、ブロックチェーン、IoTなどの先端技術を活用した
                  社会課題解決のための研究開発を推進しています。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }}>
                <MissionIcon>🎓</MissionIcon>
                <MissionTitle>教育プログラム</MissionTitle>
                <MissionDescription>
                  次世代のイノベーターを育成するための
                  ワークショップやセミナーを定期的に開催しています。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }}>
                <MissionIcon>🌱</MissionIcon>
                <MissionTitle>社会貢献活動</MissionTitle>
                <MissionDescription>
                  環境保護、教育支援、地域活性化など、
                  持続可能な社会の実現に向けた活動を展開しています。
                </MissionDescription>
              </MissionCard>
              
              <MissionCard whileHover={{ scale: 1.02 }}>
                <MissionIcon>🤖</MissionIcon>
                <MissionTitle>技術コンサルティング</MissionTitle>
                <MissionDescription>
                  NPOや社会企業に対して、デジタル化支援や
                  技術導入のコンサルティングサービスを提供しています。
                </MissionDescription>
              </MissionCard>
            </MissionGrid>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle {...fadeInUp}>チームメンバー</SectionTitle>
          <TeamGrid>
            <TeamMember whileHover={{ scale: 1.05 }}>
              <MemberAvatar>👤</MemberAvatar>
              <MemberName>代表理事</MemberName>
              <MemberRole>戦略立案・組織運営</MemberRole>
            </TeamMember>
            
            <TeamMember whileHover={{ scale: 1.05 }}>
              <MemberAvatar>👩‍💻</MemberAvatar>
              <MemberName>技術責任者</MemberName>
              <MemberRole>技術開発・システム設計</MemberRole>
            </TeamMember>
            
            <TeamMember whileHover={{ scale: 1.05 }}>
              <MemberAvatar>🎨</MemberAvatar>
              <MemberName>クリエイティブディレクター</MemberName>
              <MemberRole>デザイン・コンテンツ制作</MemberRole>
            </TeamMember>
            
            <TeamMember whileHover={{ scale: 1.05 }}>
              <MemberAvatar>📝</MemberAvatar>
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