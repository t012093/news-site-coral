import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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

// Subtle alternated background band to break monotony
const SectionBand = styled(Section)`
  background: linear-gradient(180deg, rgba(156,124,244,0.07), transparent 60%);
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 16px;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.6rem;
  color: var(--text-color);
  margin-bottom: 2.25rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 72px;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-color), transparent);
    margin: 0.9rem auto 0;
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
  max-width: 940px;
  margin: 0 auto;
  line-height: 1.9;
  color: var(--text-color);
  font-size: 1.125rem;
  
  @media (max-width: 1024px) {
    max-width: 92%;
    font-size: 1.06rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.75;
  }
  
  @media (max-width: 480px) {
    font-size: 0.98rem;
    line-height: 1.65;
  }
`;

// Balanced activities grid (uniform cards)
const ActivitiesGrid = styled.div`
  display: grid;
  gap: 1.25rem;
  margin-top: 1.5rem;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1199px) and (min-width: 769px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ActivityCard = styled(motion.article)`
  background: var(--primary-color);
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 1.25rem 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  min-height: 240px;
  transition: transform 120ms ease, border-color 120ms ease;
  &:hover { transform: translateY(-2px); border-color: var(--accent-color); }
`;

const ActivityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
`;

const ActivityTitle = styled.h4`
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActivityBody = styled.div`
  margin-top: 0.35rem;
`;

const ActivityFooter = styled.div`
  margin-top: auto;
`;

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
`;

const Tag = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  line-height: 1;
  padding: 0.35rem 0.5rem;
  border-radius: 999px;
  color: var(--text-color);
  background: rgba(156, 124, 244, 0.15);
  border: 1px solid rgba(156, 124, 244, 0.35);
`;

const BulletList = styled.ul`
  margin: 0.25rem 0 0.75rem;
  padding-left: 1.1rem;
  color: var(--secondary-color);
  font-size: 0.95rem;
  li { margin: 0.15rem 0; }
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 0.25rem;
`;

const CTALink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  color: #fff;
  background: var(--accent-color);
  border: 1px solid rgba(255,255,255,0.12);
  text-decoration: none;
  transition: transform 0.15s ease;
  &:hover { transform: translateY(-1px); }
`;

const MissionGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (min-width: 1025px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  @media (max-width: 1024px) and (min-width: 769px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    margin-top: 1.5rem;
  }
`;

const MissionCard = styled(motion.div)<{ bgImage?: string; variant?: 'wide' | 'tall' | 'featured' }>`
  position: relative;
  background: var(--primary-color);
  padding: 1.75rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  transition: all 0.3s ease;
  overflow: hidden;
  min-height: 220px;
  
  /* Decorative accent border for featured cards */
  ${props => props.variant === 'featured' && `
    border: 1px solid transparent;
    background-image: linear-gradient(var(--primary-color), var(--primary-color)),
      radial-gradient(100% 100% at 0% 0%, rgba(156,124,244,0.5), rgba(156,124,244,0.1));
    background-origin: border-box;
    background-clip: padding-box, border-box;
  `}

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
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(156, 124, 244, 0.2);
    border-color: var(--accent-color);
  }

  /* Staggered layout variants for desktop */
  @media (min-width: 1025px) {
    ${props => props.variant === 'wide' && `grid-column: span 2;`}
    ${props => props.variant === 'tall' && `grid-row: span 2;`}
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
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: radial-gradient(100% 100% at 0% 0%, rgba(156,124,244,0.35), rgba(156,124,244,0.15));
  border: 1px solid rgba(156,124,244,0.35);
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
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

        <SectionBand>
          <SectionTitle {...fadeInUp}>活動内容</SectionTitle>
          <ActivitiesGrid>
            <ActivityCard whileHover={{ scale: 1.005 }}>
              <ActivityHeader>
                <ActivityTitle>情報発信</ActivityTitle>
                <ActivityMeta><MissionIcon>📚</MissionIcon></ActivityMeta>
              </ActivityHeader>
              <TagGroup>
                <Tag>メディア</Tag><Tag>コンテンツ</Tag>
              </TagGroup>
              <ActivityBody>
                <p>テクノロジー・アート・文化の今を、独自目線で深掘り。</p>
                <BulletList>
                  <li>特集記事・インタビュー・レポート</li>
                  <li>月次テーマと連動した連載企画</li>
                  <li>コミュニティ投稿の編集・掲載</li>
                </BulletList>
              </ActivityBody>
              <ActivityFooter>
                <CTAGroup><CTALink to="/tech">特集を読む →</CTALink></CTAGroup>
              </ActivityFooter>
            </ActivityCard>

            <ActivityCard whileHover={{ scale: 1.005 }}>
              <ActivityHeader>
                <ActivityTitle>アートワーク</ActivityTitle>
                <ActivityMeta><MissionIcon>🎨</MissionIcon></ActivityMeta>
              </ActivityHeader>
              <TagGroup>
                <Tag>アート</Tag><Tag>コラボ</Tag>
              </TagGroup>
              <ActivityBody>
                <p>デジタル×伝統の表現を国際的にプロデュース。</p>
                <BulletList>
                  <li>海外作家との共同制作</li>
                  <li>展示/オンラインギャラリー</li>
                  <li>クリエイティブワークショップ</li>
                </BulletList>
              </ActivityBody>
              <ActivityFooter>
                <CTAGroup><CTALink to="/projects/international-art-collaboration">実績を見る →</CTALink></CTAGroup>
              </ActivityFooter>
            </ActivityCard>

            <ActivityCard whileHover={{ scale: 1.005 }}>
              <ActivityHeader>
                <ActivityTitle>研究開発</ActivityTitle>
                <ActivityMeta><MissionIcon>🔬</MissionIcon></ActivityMeta>
              </ActivityHeader>
              <TagGroup>
                <Tag>R&D</Tag><Tag>技術</Tag>
              </TagGroup>
              <ActivityBody>
                <p>AI/ブロックチェーン/IoTで社会課題を解く。</p>
                <BulletList>
                  <li>プロトタイプ/PoCの設計・検証</li>
                  <li>オープンソース連携と技術公開</li>
                  <li>産学官との共同リサーチ</li>
                </BulletList>
              </ActivityBody>
              <ActivityFooter>
                <CTAGroup><CTALink to="/projects/international-platform-development">R&Dを見る →</CTALink></CTAGroup>
              </ActivityFooter>
            </ActivityCard>

            <ActivityCard whileHover={{ scale: 1.005 }}>
              <ActivityHeader>
                <ActivityTitle>ワークショップ</ActivityTitle>
                <ActivityMeta><MissionIcon>🎓</MissionIcon></ActivityMeta>
              </ActivityHeader>
              <TagGroup>
                <Tag>イベント</Tag><Tag>学習</Tag>
              </TagGroup>
              <ActivityBody>
                <p>実践重視で学ぶ、少人数/交流型のプログラム。</p>
                <BulletList>
                  <li>ハンズオン/メンタリング</li>
                  <li>基礎〜応用の段階的カリキュラム</li>
                  <li>成果発表・コミュニティ連携</li>
                </BulletList>
              </ActivityBody>
              <ActivityFooter>
                <CTAGroup><CTALink to="/events">開催予定を見る →</CTALink></CTAGroup>
              </ActivityFooter>
            </ActivityCard>

            <ActivityCard whileHover={{ scale: 1.005 }}>
              <ActivityHeader>
                <ActivityTitle>ソーシャルインパクト</ActivityTitle>
                <ActivityMeta><MissionIcon>🌱</MissionIcon></ActivityMeta>
              </ActivityHeader>
              <TagGroup>
                <Tag>社会</Tag><Tag>サステナビリティ</Tag>
              </TagGroup>
              <ActivityBody>
                <p>環境/教育/地域に資する実装と普及啓発。</p>
                <BulletList>
                  <li>教育・リテラシー支援</li>
                  <li>環境配慮の運営/制作</li>
                  <li>地域連携のプロジェクト創発</li>
                </BulletList>
              </ActivityBody>
              <ActivityFooter>
                <CTAGroup><CTALink to="/projects">取り組みを見る →</CTALink></CTAGroup>
              </ActivityFooter>
            </ActivityCard>

            <ActivityCard whileHover={{ scale: 1.005 }}>
              <ActivityHeader>
                <ActivityTitle>プロジェクト</ActivityTitle>
                <ActivityMeta><MissionIcon>🤖</MissionIcon></ActivityMeta>
              </ActivityHeader>
              <TagGroup>
                <Tag>連携</Tag><Tag>実証</Tag>
              </TagGroup>
              <ActivityBody>
                <p>NPO/企業/研究機関と共創し、社会実装へ。</p>
                <BulletList>
                  <li>課題定義〜実証までの伴走</li>
                  <li>資金/人材/技術のコーディネート</li>
                  <li>成果公開・スケール展開</li>
                </BulletList>
              </ActivityBody>
              <ActivityFooter>
                <CTAGroup><CTALink to="/projects">すべてのプロジェクト →</CTALink></CTAGroup>
              </ActivityFooter>
            </ActivityCard>
          </ActivitiesGrid>
        </SectionBand>

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
                <TimelineDate>2024年9月</TimelineDate>
                <TimelineTitle>活動開始</TimelineTitle>
                <TimelineDescription>
                  コミュニティ活動を本格スタート。テクノロジーとアートの両輪で企画を始動
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem align="right" {...fadeInUp}>
              <TimelineContent align="right">
                <TimelineDate>2024年10月</TimelineDate>
                <TimelineTitle>ボランティア募集</TimelineTitle>
                <TimelineDescription>
                  編集・開発・デザインなど幅広いロールで募集を開始
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem align="left" {...fadeInUp}>
              <TimelineContent align="left">
                <TimelineDate>2024年12月</TimelineDate>
                <TimelineTitle>サイトオープン</TimelineTitle>
                <TimelineDescription>
                  Webサイトを公開し、情報発信と参加導線を整備
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem align="right" {...fadeInUp}>
              <TimelineContent align="right">
                <TimelineDate>2025年3月</TimelineDate>
                <TimelineTitle>ハッカソン開催</TimelineTitle>
                <TimelineDescription>
                  社会課題解決をテーマにしたオープンな開発イベントを開催
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem align="left" {...fadeInUp}>
              <TimelineContent align="left">
                <TimelineDate>2025年5月</TimelineDate>
                <TimelineTitle>オンライン国際交流</TimelineTitle>
                <TimelineDescription>
                  海外コミュニティとのオンライン交流を実施し、国際連携を強化
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem align="right" {...fadeInUp}>
              <TimelineContent align="right">
                <TimelineDate>2025年7月</TimelineDate>
                <TimelineTitle>NPO設立</TimelineTitle>
                <TimelineDescription>
                  特定非営利活動法人として法人化し、活動基盤を強化
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem align="left" {...fadeInUp}>
              <TimelineContent align="left">
                <TimelineDate>2025年8月</TimelineDate>
                <TimelineTitle>アート支援プロジェクト始動</TimelineTitle>
                <TimelineDescription>
                  クリエイター支援の仕組みづくりを開始。トークンエコノミーの計画・設計を進行
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem align="right" {...fadeInUp}>
              <TimelineContent align="right">
                <TimelineDate>2025年9月</TimelineDate>
                <TimelineTitle>Coral Magazine創刊</TimelineTitle>
                <TimelineDescription>
                  総合情報メディアを正式ローンチ。特集・連載・コラボ記事を継続発信
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
