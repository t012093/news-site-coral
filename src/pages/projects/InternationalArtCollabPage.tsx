import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-color);
  text-decoration: none;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProjectHeader = styled.header`
  background: linear-gradient(135deg, rgb(239, 68, 68) 0%, rgb(249, 115, 22) 50%, rgb(245, 158, 11) 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
`;

const ProjectHeaderContent = styled.div`
  position: relative;
  z-index: 2;
`;

const ProjectTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProjectSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const ProjectMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetaCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const MetaLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
`;

const MetaValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
`;

const ProgressSection = styled.section`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  background: #2a2a2a;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div<{ progress: number }>`
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  height: 100%;
  width: ${props => props.progress}%;
  border-radius: 6px;
  transition: width 0.3s ease;
`;

const ProgressStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 8px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const KanbanSection = styled.section`
  margin-bottom: 3rem;
`;

const KanbanBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const KanbanColumn = styled.div`
  background: var(--primary-color);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #2a2a2a;
  min-height: 400px;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2a2a2a;
`;

const ColumnTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TaskCount = styled.span`
  background: #2a2a2a;
  color: var(--secondary-color);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TaskCard = styled(motion.div)`
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #404040;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 4px 20px rgba(156, 124, 244, 0.1);
  }
`;

const TaskTitle = styled.h4`
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const TaskDescription = styled.p`
  color: var(--secondary-color);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const TaskPriority = styled.span<{ priority: string }>`
  background: ${props => 
    props.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' :
    props.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' :
    'rgba(34, 197, 94, 0.2)'
  };
  color: ${props => 
    props.priority === 'high' ? '#ef4444' :
    props.priority === 'medium' ? '#f59e0b' :
    '#22c55e'
  };
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const TaskAssignee = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--accent-color);
`;

const TaskModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const TaskModalContent = styled.div`
  background: var(--primary-color);
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid #2a2a2a;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const TaskModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const TaskModalTitle = styled.h3`
  color: var(--text-color);
  font-size: 1.5rem;
  margin: 0;
  line-height: 1.3;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--secondary-color);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #2a2a2a;
    color: var(--text-color);
  }
`;

const TaskModalMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const TaskModalDescription = styled.div`
  color: var(--text-color);
  line-height: 1.7;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const TaskModalSection = styled.div`
  margin-bottom: 2rem;
`;

const TaskModalSectionTitle = styled.h4`
  color: var(--text-color);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TaskDetails = styled.div`
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #404040;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: var(--secondary-color);
  font-size: 0.9rem;
`;

const DetailValue = styled.span`
  color: var(--text-color);
  font-weight: 500;
`;

const TaskComments = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const CommentItem = styled.div`
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #404040;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.span`
  color: var(--text-color);
  font-weight: 600;
  font-size: 0.9rem;
`;

const CommentDate = styled.span`
  color: var(--secondary-color);
  font-size: 0.8rem;
`;

const CommentText = styled.p`
  color: var(--text-color);
  margin: 0;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const TaskProgress = styled.div`
  margin-bottom: 1rem;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const TaskProgressBar = styled.div`
  background: #404040;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

const TaskProgressFill = styled.div<{ progress: number }>`
  background: linear-gradient(90deg, var(--accent-color) 0%, #8b5fe6 100%);
  height: 100%;
  width: ${props => props.progress}%;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProjectDescription = styled.section`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MainDescription = styled.div`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
`;

const DescriptionText = styled.p`
  color: var(--text-color);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TeamSection = styled.div`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const TeamMember = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 8px;
`;

const MemberAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--accent-color);
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.div`
  color: var(--text-color);
  font-weight: 600;
  font-size: 0.9rem;
`;

const MemberRole = styled.div`
  color: var(--secondary-color);
  font-size: 0.8rem;
`;

const InternationalArtCollabPage = () => {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const projectData = {
    title: '国際アートコラボレーション',
    subtitle: 'アーティスト、デザイナー、クリエイターが国境を越えて協働する文化プロジェクト',
    status: 'active',
    startDate: '2024年4月',
    duration: '12ヶ月',
    budget: '¥2,500,000',
    progress: 65,
    team: [
      { id: 1, name: '田中美咲', role: 'プロジェクトマネージャー', avatar: '/images/woman.png' },
      { id: 2, name: '李 雅文', role: 'アートディレクター', avatar: '/images/woman.png' },
      { id: 3, name: 'Smith John', role: 'デジタルアーティスト', avatar: '/images/man.png' },
      { id: 4, name: '佐藤健一', role: 'テクニカルサポート', avatar: '/images/man.png' }
    ]
  };

  const kanbanData = {
    todo: [
      {
        id: 1,
        title: 'VRギャラリー空間デザイン',
        description: 'メタバース上での展示空間のデザインコンセプト策定',
        priority: 'high',
        assignee: { name: '李 雅文', avatar: '/images/woman.png' },
        status: 'todo',
        progress: 0,
        dueDate: '2024年12月20日',
        estimatedHours: 40,
        actualHours: 0,
        fullDescription: 'VR/AR技術を活用したバーチャルギャラリーの3D空間設計。ユーザー体験を重視したインタラクティブな展示環境の構築を目指します。WebXRフレームワークを使用し、クロスプラットフォーム対応の仮想空間を制作します。',
        tags: ['VR/AR', 'UX Design', '3D Modeling'],
        comments: [
          {
            id: 1,
            author: '田中美咲',
            date: '2024年11月15日',
            text: 'WebXRフレームワークの選定についてリサーチを進めています。A-Frameが有力候補です。',
            avatar: '/images/woman.png'
          }
        ]
      },
      {
        id: 2,
        title: '参加アーティスト追加募集',
        description: 'ヨーロッパ・アフリカ地域のアーティスト5名を追加募集',
        priority: 'medium',
        assignee: { name: '田中美咲', avatar: '/images/woman.png' },
        status: 'todo',
        progress: 25,
        dueDate: '2024年12月5日',
        estimatedHours: 20,
        actualHours: 5,
        fullDescription: 'プロジェクトの国際性を高めるため、ヨーロッパとアフリカ地域から新たに5名のアーティストを募集します。多様な文化背景を持つクリエイターとのコラボレーションにより、より豊かな表現活動を実現します。',
        tags: ['Recruitment', 'International', 'Diversity'],
        comments: [
          {
            id: 1,
            author: '李 雅文',
            date: '2024年11月10日',
            text: 'パリとケープタウンのアートギャラリーにコンタクトを取り、2名の候補者を見つけました。',
            avatar: '/images/woman.png'
          },
          {
            id: 2,
            author: '田中美咲',
            date: '2024年11月12日',
            text: 'ベルリンのデジタルアート団体からも興味を示していただいています。面談設定を進めます。',
            avatar: '/images/woman.png'
          }
        ]
      }
    ],
    inProgress: [
      {
        id: 3,
        title: 'NFTマーケットプレイス開発',
        description: '作品のNFT化とマーケットプレイス機能の実装',
        priority: 'high',
        assignee: { name: 'Smith John', avatar: '/images/man.png' },
        status: 'inProgress',
        progress: 60,
        dueDate: '2024年12月15日',
        estimatedHours: 80,
        actualHours: 48,
        fullDescription: 'アーティストの作品をNFTとして発行・販売できるマーケットプレイス機能の開発。Ethereum、Polygon、Solanaチェーンに対応し、ガス費用を抑えたクリエイター・コレクター双方にとって利用しやすいプラットフォームを構築します。',
        tags: ['Blockchain', 'NFT', 'Web3', 'Smart Contract'],
        comments: [
          {
            id: 1,
            author: 'Smith John',
            date: '2024年11月8日',
            text: 'Polygonネットワークでのスマートコントラクトデプロイが完了しました。テスト環境での動作確認中です。',
            avatar: '/images/man.png'
          },
          {
            id: 2,
            author: '佐藤健一',
            date: '2024年11月13日',
            text: 'フロントエンドのウォレット連携機能、MetaMaskとWalletConnectに対応しました。',
            avatar: '/images/man.png'
          }
        ]
      },
      {
        id: 4,
        title: '多言語対応システム',
        description: '日英中韓の4言語対応インターフェース開発',
        priority: 'medium',
        assignee: { name: '佐藤健一', avatar: '/images/man.png' },
        status: 'inProgress',
        progress: 40,
        dueDate: '2024年12月10日',
        estimatedHours: 30,
        actualHours: 12,
        fullDescription: 'グローバルユーザーに対応するため、日本語、英語、中国語、韓国語の4言語インターフェースを開発。React i18nフレームワークを使用し、動的言語切り替えとSEO対応を実装します。',
        tags: ['i18n', 'Localization', 'React'],
        comments: [
          {
            id: 1,
            author: '佐藤健一',
            date: '2024年11月9日',
            text: '日英の翻訳作業が完了しました。中韓の翻訳者との打ち合わせを進めています。',
            avatar: '/images/man.png'
          }
        ]
      },
      {
        id: 5,
        title: '第1回オンライン展示会',
        description: '参加アーティスト15名による初回展示イベント準備',
        priority: 'high',
        assignee: { name: '李 雅文', avatar: '/images/woman.png' },
        status: 'inProgress',
        progress: 85,
        dueDate: '2024年11月30日',
        estimatedHours: 50,
        actualHours: 42,
        fullDescription: '国際アートコラボレーションプロジェクトの記念すべき第1回オンライン展示会の開催準備。15名のアーティストによる多彩な作品展示、ライブストリーミング、インタラクティブ体験を提供します。',
        tags: ['Exhibition', 'Live Event', 'Streaming'],
        comments: [
          {
            id: 1,
            author: '田中美咲',
            date: '2024年11月14日',
            text: '会場設営とライブ配信の技術テストが完了しました。当日のスケジュールを最終確認中です。',
            avatar: '/images/woman.png'
          }
        ]
      }
    ],
    done: [
      {
        id: 6,
        title: 'プロジェクト企画書完成',
        description: 'ステークホルダー向けプロジェクト提案書作成完了',
        priority: 'low',
        assignee: { name: '田中美咲', avatar: '/images/woman.png' },
        status: 'done',
        progress: 100,
        dueDate: '2024年10月15日',
        estimatedHours: 25,
        actualHours: 23,
        fullDescription: 'プロジェクトの目標、スケジュール、予算、期待される成果を明確に記載した企画書を作成。ステークホルダーからの承認を得て、プロジェクト開始の正式な許可を獲得しました。',
        tags: ['Planning', 'Documentation', 'Approval'],
        comments: []
      },
      {
        id: 7,
        title: 'アーティスト初期リクルート',
        description: 'アジア圏10名のアーティストとのパートナーシップ締結',
        priority: 'medium',
        assignee: { name: '李 雅文', avatar: '/images/woman.png' },
        status: 'done',
        progress: 100,
        dueDate: '2024年10月30日',
        estimatedHours: 40,
        actualHours: 35,
        fullDescription: '日本、韓国、中国、台湾、タイから計10名のアーティストとパートナーシップを締結。多様な表現技法とデジタルアートへの造詣を持つクリエイターを集めました。',
        tags: ['Recruitment', 'Partnership', 'Asia'],
        comments: []
      },
      {
        id: 8,
        title: 'プラットフォーム基盤構築',
        description: 'WebGLベースの3D展示プラットフォーム基礎開発',
        priority: 'high',
        assignee: { name: 'Smith John', avatar: '/images/man.png' },
        status: 'done',
        progress: 100,
        dueDate: '2024年11月5日',
        estimatedHours: 60,
        actualHours: 58,
        fullDescription: 'Three.jsとWebGLを活用した3D展示プラットフォームの基礎システムを構築。複数ユーザーの同時閲覧、作品のインタラクティブ操作、リアルタイムチャット機能を実装しました。',
        tags: ['WebGL', 'Three.js', 'Platform'],
        comments: []
      }
    ]
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '中';
    }
  };

  return (
    <Container>
      <BackLink to="/projects">
        ← プロジェクト一覧に戻る
      </BackLink>

      <ProjectHeader>
        <ProjectHeaderContent>
          <ProjectTitle>{projectData.title}</ProjectTitle>
          <ProjectSubtitle>{projectData.subtitle}</ProjectSubtitle>
          
          <ProjectMeta>
            <MetaCard>
              <MetaLabel>ステータス</MetaLabel>
              <MetaValue>
                <StatusBadge status={projectData.status}>
                  🟢 実施中
                </StatusBadge>
              </MetaValue>
            </MetaCard>
            <MetaCard>
              <MetaLabel>開始日</MetaLabel>
              <MetaValue>{projectData.startDate}</MetaValue>
            </MetaCard>
            <MetaCard>
              <MetaLabel>期間</MetaLabel>
              <MetaValue>{projectData.duration}</MetaValue>
            </MetaCard>
            <MetaCard>
              <MetaLabel>予算</MetaLabel>
              <MetaValue>{projectData.budget}</MetaValue>
            </MetaCard>
          </ProjectMeta>
        </ProjectHeaderContent>
      </ProjectHeader>

      <ProgressSection>
        <SectionTitle>📊 プロジェクト進捗</SectionTitle>
        <ProgressBar>
          <ProgressFill progress={projectData.progress} />
        </ProgressBar>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-color)' }}>
            {projectData.progress}% 完了
          </span>
        </div>
        
        <ProgressStats>
          <StatCard>
            <StatValue>8</StatValue>
            <StatLabel>完了タスク</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>5</StatValue>
            <StatLabel>進行中タスク</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>2</StatValue>
            <StatLabel>未着手タスク</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>15</StatValue>
            <StatLabel>参加アーティスト</StatLabel>
          </StatCard>
        </ProgressStats>
      </ProgressSection>

      <ProjectDescription>
        <MainDescription>
          <SectionTitle>🎨 プロジェクト概要</SectionTitle>
          <DescriptionText>
            国際アートコラボレーションは、世界各国のアーティスト、デザイナー、クリエイターが国境を越えて協働する革新的な文化プロジェクトです。
            デジタル技術とアートの融合により、新たな表現形式を探求し、文化交流を促進します。
          </DescriptionText>
          <DescriptionText>
            本プロジェクトでは、VR/AR技術を活用したバーチャルギャラリー、NFTマーケットプレイス、
            リアルタイム共同制作プラットフォームを構築し、物理的制約を超えた新しいアート体験を創造します。
          </DescriptionText>
          <DescriptionText>
            参加アーティストは現在15名（アジア10名、ヨーロッパ3名、北米2名）で、
            さらなる地域拡大を目指して追加募集を行っています。各アーティストが持つ独自の文化的背景と
            現代的な表現技術を組み合わせることで、従来のアート表現の境界を押し広げていきます。
          </DescriptionText>
        </MainDescription>

        <Sidebar>
          <TeamSection>
            <SectionTitle>👥 プロジェクトチーム</SectionTitle>
            <TeamGrid>
              {projectData.team.map((member) => (
                <TeamMember key={member.id}>
                  <MemberAvatar src={member.avatar} alt={member.name} />
                  <MemberInfo>
                    <MemberName>{member.name}</MemberName>
                    <MemberRole>{member.role}</MemberRole>
                  </MemberInfo>
                </TeamMember>
              ))}
            </TeamGrid>
          </TeamSection>

          <TeamSection>
            <SectionTitle>🎯 主要目標</SectionTitle>
            <ul style={{ color: 'var(--text-color)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>15ヶ国50名のアーティストネットワーク構築</li>
              <li>月間10万PVのバーチャルギャラリー運営</li>
              <li>年間100作品のNFT化・販売</li>
              <li>4つの国際展示会開催</li>
            </ul>
          </TeamSection>
        </Sidebar>
      </ProjectDescription>

      <KanbanSection>
        <SectionTitle>📋 タスク管理ボード</SectionTitle>
        <KanbanBoard>
          <KanbanColumn>
            <ColumnHeader>
              <ColumnTitle>
                📋 未着手
              </ColumnTitle>
              <TaskCount>{kanbanData.todo.length}</TaskCount>
            </ColumnHeader>
            <TaskList>
              {kanbanData.todo.map((task) => (
                <TaskCard
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedTask(task)}
                >
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskDescription>{task.description}</TaskDescription>
                  <TaskMeta>
                    <TaskPriority priority={task.priority}>
                      {getPriorityText(task.priority)}
                    </TaskPriority>
                    <TaskAssignee>
                      <Avatar src={task.assignee.avatar} alt={task.assignee.name} />
                    </TaskAssignee>
                  </TaskMeta>
                </TaskCard>
              ))}
            </TaskList>
          </KanbanColumn>

          <KanbanColumn>
            <ColumnHeader>
              <ColumnTitle>
                🚀 進行中
              </ColumnTitle>
              <TaskCount>{kanbanData.inProgress.length}</TaskCount>
            </ColumnHeader>
            <TaskList>
              {kanbanData.inProgress.map((task) => (
                <TaskCard
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedTask(task)}
                >
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskDescription>{task.description}</TaskDescription>
                  <TaskMeta>
                    <TaskPriority priority={task.priority}>
                      {getPriorityText(task.priority)}
                    </TaskPriority>
                    <TaskAssignee>
                      <Avatar src={task.assignee.avatar} alt={task.assignee.name} />
                    </TaskAssignee>
                  </TaskMeta>
                </TaskCard>
              ))}
            </TaskList>
          </KanbanColumn>

          <KanbanColumn>
            <ColumnHeader>
              <ColumnTitle>
                ✅ 完了
              </ColumnTitle>
              <TaskCount>{kanbanData.done.length}</TaskCount>
            </ColumnHeader>
            <TaskList>
              {kanbanData.done.map((task) => (
                <TaskCard
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedTask(task)}
                >
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskDescription>{task.description}</TaskDescription>
                  <TaskMeta>
                    <TaskPriority priority={task.priority}>
                      {getPriorityText(task.priority)}
                    </TaskPriority>
                    <TaskAssignee>
                      <Avatar src={task.assignee.avatar} alt={task.assignee.name} />
                    </TaskAssignee>
                  </TaskMeta>
                </TaskCard>
              ))}
            </TaskList>
          </KanbanColumn>
        </KanbanBoard>
      </KanbanSection>

      {/* タスク詳細モーダル */}
      <AnimatePresence>
        {selectedTask && (
          <TaskModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedTask(null);
              }
            }}
          >
            <TaskModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TaskModalHeader>
                <TaskModalTitle>{selectedTask.title}</TaskModalTitle>
                <CloseButton onClick={() => setSelectedTask(null)}>
                  ✕
                </CloseButton>
              </TaskModalHeader>

              <TaskModalMeta>
                <TaskPriority priority={selectedTask.priority}>
                  {getPriorityText(selectedTask.priority)}
                </TaskPriority>
                <StatusBadge status={selectedTask.status}>
                  {selectedTask.status === 'todo' ? '📋 未着手' :
                   selectedTask.status === 'inProgress' ? '🚀 進行中' :
                   '✅ 完了'}
                </StatusBadge>
              </TaskModalMeta>

              <TaskModalDescription>
                {selectedTask.fullDescription || selectedTask.description}
              </TaskModalDescription>

              {selectedTask.tags && (
                <TaskModalSection>
                  <TaskModalSectionTitle>🏷️ タグ</TaskModalSectionTitle>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedTask.tags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        style={{
                          background: 'rgba(34, 197, 94, 0.2)',
                          color: '#22c55e',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TaskModalSection>
              )}

              {selectedTask.progress !== undefined && (
                <TaskModalSection>
                  <TaskModalSectionTitle>📊 進捗状況</TaskModalSectionTitle>
                  <TaskProgress>
                    <ProgressLabel>
                      <span style={{ color: 'var(--text-color)' }}>進捗</span>
                      <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>
                        {selectedTask.progress}%
                      </span>
                    </ProgressLabel>
                    <TaskProgressBar>
                      <TaskProgressFill progress={selectedTask.progress} />
                    </TaskProgressBar>
                  </TaskProgress>
                </TaskModalSection>
              )}

              <TaskModalSection>
                <TaskModalSectionTitle>📋 詳細情報</TaskModalSectionTitle>
                <TaskDetails>
                  <DetailRow>
                    <DetailLabel>担当者</DetailLabel>
                    <DetailValue>
                      <TaskAssignee>
                        <Avatar src={selectedTask.assignee.avatar} alt={selectedTask.assignee.name} />
                        {selectedTask.assignee.name}
                      </TaskAssignee>
                    </DetailValue>
                  </DetailRow>
                  {selectedTask.dueDate && (
                    <DetailRow>
                      <DetailLabel>期限</DetailLabel>
                      <DetailValue>{selectedTask.dueDate}</DetailValue>
                    </DetailRow>
                  )}
                  {selectedTask.estimatedHours && (
                    <DetailRow>
                      <DetailLabel>予定工数</DetailLabel>
                      <DetailValue>{selectedTask.estimatedHours}時間</DetailValue>
                    </DetailRow>
                  )}
                  {selectedTask.actualHours !== undefined && (
                    <DetailRow>
                      <DetailLabel>実工数</DetailLabel>
                      <DetailValue>{selectedTask.actualHours}時間</DetailValue>
                    </DetailRow>
                  )}
                </TaskDetails>
              </TaskModalSection>

              {selectedTask.comments && selectedTask.comments.length > 0 && (
                <TaskModalSection>
                  <TaskModalSectionTitle>💬 コメント</TaskModalSectionTitle>
                  <TaskComments>
                    {selectedTask.comments.map((comment: any) => (
                      <CommentItem key={comment.id}>
                        <CommentHeader>
                          <Avatar src={comment.avatar} alt={comment.author} />
                          <CommentAuthor>{comment.author}</CommentAuthor>
                          <CommentDate>{comment.date}</CommentDate>
                        </CommentHeader>
                        <CommentText>{comment.text}</CommentText>
                      </CommentItem>
                    ))}
                  </TaskComments>
                </TaskModalSection>
              )}
            </TaskModalContent>
          </TaskModal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default InternationalArtCollabPage;