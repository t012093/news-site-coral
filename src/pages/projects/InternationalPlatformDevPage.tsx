import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGitHubIssues } from '../../hooks/useGitHub';
import { GitHubIssue, githubService } from '../../services/githubService';

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
  background: linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(59, 130, 246) 100%);
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

const GitHubIntegrationSection = styled.section`
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

const GitHubStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #22c55e;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
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

const TaskCard = styled(motion.div)<{ isGitHubIssue?: boolean }>`
  background: ${props => props.isGitHubIssue ? 'rgba(34, 197, 94, 0.1)' : '#2a2a2a'};
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid ${props => props.isGitHubIssue ? 'rgba(34, 197, 94, 0.3)' : '#404040'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 4px 20px rgba(156, 124, 244, 0.1);
  }
`;

const GitHubBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
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

const GitHubLink = styled.a`
  color: #22c55e;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
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

// GitHub Issue Modal Components
const IssueModal = styled(motion.div)`
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

const IssueModalContent = styled.div`
  background: var(--primary-color);
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid #2a2a2a;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const IssueModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const IssueModalTitle = styled.h3`
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

const IssueMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const IssueNumber = styled.span`
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const IssueState = styled.span<{ state: string }>`
  background: ${props => props.state === 'open' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 124, 244, 0.2)'};
  color: ${props => props.state === 'open' ? '#22c55e' : '#9c7cf4'};
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const IssueDate = styled.span`
  color: var(--secondary-color);
  font-size: 0.9rem;
`;

const IssueBody = styled.div`
  color: var(--text-color);
  line-height: 1.7;
  margin-bottom: 2rem;
  font-size: 1rem;
  
  p {
    margin-bottom: 1rem;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--text-color);
    margin: 1.5rem 0 1rem 0;
  }
  
  code {
    background: #2a2a2a;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Consolas', monospace;
  }
  
  pre {
    background: #2a2a2a;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
  }
`;

const IssueLabels = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const IssueLabel = styled.span<{ color: string }>`
  background: ${props => `#${props.color}20`};
  color: ${props => `#${props.color}`};
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid ${props => `#${props.color}40`};
`;

const IssueActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #2a2a2a;
`;

const ActionButton = styled.a`
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid rgba(34, 197, 94, 0.3);

  &:hover {
    background: rgba(34, 197, 94, 0.3);
    transform: translateY(-2px);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--secondary-color);
`;

interface LocalTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'inProgress' | 'done';
  isGitHubIssue?: boolean;
  githubIssueNumber?: number;
  githubIssueUrl?: string;
}

const InternationalPlatformDevPage = () => {
  const [selectedTask, setSelectedTask] = useState<LocalTask | GitHubIssue | null>(null);
  const [selectedGitHubIssue, setSelectedGitHubIssue] = useState<GitHubIssue | null>(null);
  const [loadingIssueDetail, setLoadingIssueDetail] = useState(false);
  const { data: gitHubIssues, isLoading: issuesLoading } = useGitHubIssues();
  const [syncedTasks, setSyncedTasks] = useState<{
    todo: LocalTask[];
    inProgress: LocalTask[];
    done: LocalTask[];
  }>({
    todo: [],
    inProgress: [],
    done: []
  });

  const projectData = {
    title: '国際交流プラットフォーム開発',
    subtitle: '日本と海外をつなぐオンラインプラットフォームの開発。言語学習、文化交流、ビジネスマッチングを統合したシステム。',
    status: 'development',
    startDate: '2024年9月',
    duration: '18ヶ月',
    budget: '¥8,500,000',
    progress: 35
  };

  // ローカルタスクデータ
  const localTasks = {
    todo: [
      {
        id: 'local-1',
        title: 'UIコンポーネントライブラリ設計',
        description: '多言語対応を考慮したコンポーネント設計書の作成',
        priority: 'high' as const,
        status: 'todo' as const
      },
      {
        id: 'local-2',
        title: 'データベース設計最終化',
        description: 'ユーザー、メッセージ、マッチングテーブルの詳細設計',
        priority: 'medium' as const,
        status: 'todo' as const
      }
    ],
    inProgress: [
      {
        id: 'local-3',
        title: '認証システム実装',
        description: 'OAuth2.0とJWT認証システムの開発',
        priority: 'high' as const,
        status: 'inProgress' as const
      }
    ],
    done: [
      {
        id: 'local-4',
        title: 'プロジェクト環境構築',
        description: 'Docker、CI/CD、開発環境のセットアップ完了',
        priority: 'low' as const,
        status: 'done' as const
      }
    ]
  };

  // GitHub Issuesとローカルタスクを同期
  useEffect(() => {
    if (!gitHubIssues) {
      setSyncedTasks(localTasks);
      return;
    }

    const githubTasks: LocalTask[] = gitHubIssues.map((issue: GitHubIssue) => ({
      id: `github-${issue.id}`,
      title: issue.title,
      description: issue.body?.substring(0, 100) + '...' || 'GitHub Issue',
      priority: issue.labels.some(label => label.name.includes('high')) ? 'high' :
                issue.labels.some(label => label.name.includes('medium')) ? 'medium' : 'low',
      status: issue.state === 'open' ? 'todo' : 'done',
      isGitHubIssue: true,
      githubIssueNumber: issue.number,
      githubIssueUrl: `https://github.com/NPO-OpenCoralNetwork/global-project/issues/${issue.number}`
    }));

    // GitHub IssuesとローカルタスクをマージしてKanbanボードに配置
    const openGitHubTasks = githubTasks.filter(task => task.status === 'todo');
    const closedGitHubTasks = githubTasks.filter(task => task.status === 'done');

    setSyncedTasks({
      todo: [...localTasks.todo, ...openGitHubTasks],
      inProgress: [...localTasks.inProgress],
      done: [...localTasks.done, ...closedGitHubTasks]
    });
  }, [gitHubIssues]);

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '中';
    }
  };

  const totalGitHubIssues = gitHubIssues?.length || 0;
  const openIssues = gitHubIssues?.filter(issue => issue.state === 'open').length || 0;
  const closedIssues = gitHubIssues?.filter(issue => issue.state === 'closed').length || 0;

  // GitHub Issueの詳細を取得する関数
  const handleGitHubIssueClick = async (task: LocalTask) => {
    if (!task.isGitHubIssue || !task.githubIssueNumber) {
      setSelectedTask(task);
      return;
    }

    setLoadingIssueDetail(true);
    try {
      const issueDetail = await githubService.getIssueById(task.githubIssueNumber);
      if (issueDetail) {
        setSelectedGitHubIssue(issueDetail);
      } else {
        setSelectedTask(task);
      }
    } catch (error) {
      console.error('Failed to fetch issue detail:', error);
      setSelectedTask(task);
    } finally {
      setLoadingIssueDetail(false);
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
                  🔄 開発中
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

      <GitHubIntegrationSection>
        <SectionTitle>🐙 GitHub連携ステータス</SectionTitle>
        <GitHubStats>
          <StatCard>
            <StatValue>{totalGitHubIssues}</StatValue>
            <StatLabel>総Issues数</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{openIssues}</StatValue>
            <StatLabel>オープンIssues</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{closedIssues}</StatValue>
            <StatLabel>クローズ済みIssues</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{issuesLoading ? '...' : '✅'}</StatValue>
            <StatLabel>同期ステータス</StatLabel>
          </StatCard>
        </GitHubStats>
        <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>
          <p>GitHub Issues が自動的にKanbanボードに同期されています。オープンなIssuesは「未着手」、クローズ済みは「完了」に表示されます。</p>
        </div>
      </GitHubIntegrationSection>

      <ProjectDescription>
        <MainDescription>
          <SectionTitle>🌍 プラットフォーム概要</SectionTitle>
          <DescriptionText>
            国際交流プラットフォーム開発プロジェクトは、言語や文化の壁を越えて人々がつながることができる
            次世代のオンラインプラットフォームを構築することを目的としています。
          </DescriptionText>
          <DescriptionText>
            AI マッチング機能により、学習目標や興味関心に基づいて最適なパートナーを見つけることができ、
            VR交流機能では仮想空間での臨場感あふれる文化体験を提供します。
          </DescriptionText>
          <DescriptionText>
            多言語対応（日本語・英語・中国語・韓国語・スペイン語）により、
            グローバルなユーザーベースの構築を目指しています。
          </DescriptionText>
        </MainDescription>

        <Sidebar>
          <TeamSection>
            <SectionTitle>🎯 主要機能</SectionTitle>
            <ul style={{ color: 'var(--text-color)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>AI言語学習マッチング</li>
              <li>リアルタイム多言語翻訳</li>
              <li>VR文化体験空間</li>
              <li>ビジネスマッチングシステム</li>
              <li>イベント企画・参加機能</li>
            </ul>
          </TeamSection>

          <TeamSection>
            <SectionTitle>📊 技術スタック</SectionTitle>
            <ul style={{ color: 'var(--text-color)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Frontend: React + TypeScript</li>
              <li>Backend: Node.js + Express</li>
              <li>Database: PostgreSQL + Redis</li>
              <li>AI/ML: Python + TensorFlow</li>
              <li>VR: WebXR + Three.js</li>
            </ul>
          </TeamSection>
        </Sidebar>
      </ProjectDescription>

      <KanbanSection>
        <SectionTitle>📋 タスク管理ボード (GitHub連携)</SectionTitle>
        <KanbanBoard>
          <KanbanColumn>
            <ColumnHeader>
              <ColumnTitle>📋 未着手</ColumnTitle>
              <TaskCount>{syncedTasks.todo.length}</TaskCount>
            </ColumnHeader>
            <TaskList>
              {syncedTasks.todo.map((task) => (
                <TaskCard
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleGitHubIssueClick(task)}
                  isGitHubIssue={task.isGitHubIssue}
                >
                  {task.isGitHubIssue && <GitHubBadge>GitHub Issue</GitHubBadge>}
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskDescription>{task.description}</TaskDescription>
                  <TaskMeta>
                    <TaskPriority priority={task.priority}>
                      {getPriorityText(task.priority)}
                    </TaskPriority>
                    {task.isGitHubIssue && task.githubIssueUrl && (
                      <GitHubLink 
                        href={task.githubIssueUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        #{task.githubIssueNumber}
                      </GitHubLink>
                    )}
                  </TaskMeta>
                </TaskCard>
              ))}
            </TaskList>
          </KanbanColumn>

          <KanbanColumn>
            <ColumnHeader>
              <ColumnTitle>🚀 進行中</ColumnTitle>
              <TaskCount>{syncedTasks.inProgress.length}</TaskCount>
            </ColumnHeader>
            <TaskList>
              {syncedTasks.inProgress.map((task) => (
                <TaskCard
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleGitHubIssueClick(task)}
                  isGitHubIssue={task.isGitHubIssue}
                >
                  {task.isGitHubIssue && <GitHubBadge>GitHub Issue</GitHubBadge>}
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskDescription>{task.description}</TaskDescription>
                  <TaskMeta>
                    <TaskPriority priority={task.priority}>
                      {getPriorityText(task.priority)}
                    </TaskPriority>
                    {task.isGitHubIssue && task.githubIssueUrl && (
                      <GitHubLink 
                        href={task.githubIssueUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        #{task.githubIssueNumber}
                      </GitHubLink>
                    )}
                  </TaskMeta>
                </TaskCard>
              ))}
            </TaskList>
          </KanbanColumn>

          <KanbanColumn>
            <ColumnHeader>
              <ColumnTitle>✅ 完了</ColumnTitle>
              <TaskCount>{syncedTasks.done.length}</TaskCount>
            </ColumnHeader>
            <TaskList>
              {syncedTasks.done.map((task) => (
                <TaskCard
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleGitHubIssueClick(task)}
                  isGitHubIssue={task.isGitHubIssue}
                >
                  {task.isGitHubIssue && <GitHubBadge>GitHub Issue</GitHubBadge>}
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskDescription>{task.description}</TaskDescription>
                  <TaskMeta>
                    <TaskPriority priority={task.priority}>
                      {getPriorityText(task.priority)}
                    </TaskPriority>
                    {task.isGitHubIssue && task.githubIssueUrl && (
                      <GitHubLink 
                        href={task.githubIssueUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        #{task.githubIssueNumber}
                      </GitHubLink>
                    )}
                  </TaskMeta>
                </TaskCard>
              ))}
            </TaskList>
          </KanbanColumn>
        </KanbanBoard>
      </KanbanSection>

      {/* GitHub Issue 詳細モーダル */}
      <AnimatePresence>
        {selectedGitHubIssue && (
          <IssueModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedGitHubIssue(null);
              }
            }}
          >
            <motion.div
              style={{
                background: 'var(--primary-color)',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                border: '1px solid #2a2a2a',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IssueModalHeader>
                <IssueModalTitle>{selectedGitHubIssue.title}</IssueModalTitle>
                <CloseButton onClick={() => setSelectedGitHubIssue(null)}>
                  ✕
                </CloseButton>
              </IssueModalHeader>

              <IssueMeta>
                <IssueNumber>#{selectedGitHubIssue.number}</IssueNumber>
                <IssueState state={selectedGitHubIssue.state}>
                  {selectedGitHubIssue.state === 'open' ? '🟢 オープン' : '🟣 クローズ'}
                </IssueState>
                <IssueDate>
                  作成日: {new Date(selectedGitHubIssue.created_at).toLocaleDateString('ja-JP')}
                </IssueDate>
                {selectedGitHubIssue.updated_at !== selectedGitHubIssue.created_at && (
                  <IssueDate>
                    更新日: {new Date(selectedGitHubIssue.updated_at).toLocaleDateString('ja-JP')}
                  </IssueDate>
                )}
              </IssueMeta>

              {selectedGitHubIssue.labels && selectedGitHubIssue.labels.length > 0 && (
                <IssueLabels>
                  {selectedGitHubIssue.labels.map((label, index) => (
                    <IssueLabel key={index} color={label.color}>
                      {label.name}
                    </IssueLabel>
                  ))}
                </IssueLabels>
              )}

              <IssueBody>
                {selectedGitHubIssue.body ? (
                  <div dangerouslySetInnerHTML={{ 
                    __html: selectedGitHubIssue.body.replace(/\n/g, '<br/>') 
                  }} />
                ) : (
                  <p style={{ color: 'var(--secondary-color)', fontStyle: 'italic' }}>
                    説明はありません
                  </p>
                )}
              </IssueBody>

              {selectedGitHubIssue.assignees && selectedGitHubIssue.assignees.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>👤 担当者</h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {selectedGitHubIssue.assignees.map((assignee, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img 
                          src={assignee.avatar_url} 
                          alt={assignee.login}
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%',
                            border: '1px solid var(--accent-color)'
                          }}
                        />
                        <span style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>
                          {assignee.login}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <IssueActions>
                <ActionButton
                  href={`https://github.com/NPO-OpenCoralNetwork/global-project/issues/${selectedGitHubIssue.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔗 GitHubで開く
                </ActionButton>
              </IssueActions>
            </motion.div>
          </IssueModal>
        )}
      </AnimatePresence>

      {/* ローディング表示 */}
      <AnimatePresence>
        {loadingIssueDetail && (
          <IssueModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner>
              <div>GitHub Issue を読み込み中...</div>
            </LoadingSpinner>
          </IssueModal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default InternationalPlatformDevPage;