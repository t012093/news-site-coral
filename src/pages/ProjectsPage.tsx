import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGitHubIssues, useGitHubProjects } from '../hooks/useGitHub';
import { githubService } from '../services/githubService';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.header`
  margin-bottom: 4rem;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(59, 130, 246) 100%);
  color: white;
  border-radius: 12px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
  line-height: 1.6;
`;

const CategorySection = styled.section`
  margin-bottom: 4rem;
`;

const CategoryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const CategoryTitle = styled.h2`
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const CategoryIcon = styled.span`
  font-size: 2rem;
`;

const CategoryDescription = styled.p`
  font-size: 1.1rem;
  color: var(--secondary-color);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.article)`
  background: var(--primary-color);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #2a2a2a;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 8px 32px rgba(156, 124, 244, 0.2);
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ProjectIcon = styled.div`
  font-size: 2rem;
  min-width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(156, 124, 244, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(156, 124, 244, 0.3);
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const ProjectSubtitle = styled.p`
  color: var(--accent-color);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: var(--secondary-color);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ProjectFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FeatureTag = styled.span`
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const DetailIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(156, 124, 244, 0.1);
  border: 1px solid rgba(156, 124, 244, 0.3);
  border-radius: 8px;
  color: var(--accent-color);
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(156, 124, 244, 0.2);
    transform: translateY(-2px);
  }
`;

const GitHubIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  color: #22c55e;
  font-size: 0.9rem;
  font-weight: 600;
`;

const GitHubLinks = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const GitHubLink = styled.a`
  color: #22c55e;
  text-decoration: none;
  padding: 0.3rem 0.6rem;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 4px;
  font-size: 0.8rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(34, 197, 94, 0.3);
    transform: translateY(-1px);
  }
`;

const GitHubStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => 
    props.status === 'active' ? 'rgba(34, 197, 94, 0.2)' :
    props.status === 'planning' ? 'rgba(251, 191, 36, 0.2)' :
    'rgba(59, 130, 246, 0.2)'
  };
  color: ${props => 
    props.status === 'active' ? '#22c55e' :
    props.status === 'planning' ? '#fbbf24' :
    '#3b82f6'
  };
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ProjectCardWrapper = styled.div`
  position: relative;
`;

const ProjectsPage = () => {
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const navigate = useNavigate();
  const { data: gitHubIssues, isLoading: issuesLoading } = useGitHubIssues();
  const { data: gitHubProjects, isLoading: projectsLoading } = useGitHubProjects();

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleProjectClick = (projectId: string, detailPath?: string) => {
    if (detailPath) {
      navigate(detailPath);
    } else {
      toggleProject(projectId);
    }
  };

  const projectCategories = [
    {
      id: 'international',
      title: '国際交流・多文化共生',
      icon: '🌍',
      description: 'アジア留学生や外国人材との交流を通じて、多文化理解と国際的なネットワークづくりを推進しています。',
      projects: [
        {
          id: 'exchange-events',
          title: 'アジア留学生交流プログラム',
          subtitle: '文化交流・言語学習',
          icon: '🤝',
          description: '日本在住のアジア留学生と地域住民との交流イベントを定期開催。言語交換会、文化体験ワークショップ、国際料理教室など多彩なプログラムを通じて相互理解を深めます。',
          features: ['月2回開催', 'オンライン・オフライン', '20ヶ国参加実績'],
          status: 'active'
        },
        {
          id: 'art-projects',
          title: '国際アートコラボレーション',
          subtitle: '文化創造・芸術交流',
          icon: '🎨',
          description: 'アーティスト、デザイナー、クリエイターが国境を越えて協働する文化プロジェクト。デジタルアートから伝統工芸まで幅広い表現活動を支援します。',
          features: ['年4回展示会', 'NFTアート制作', '伝統×現代融合'],
          status: 'active',
          detailPath: '/projects/international-art-collaboration'
        },
        {
          id: 'platform-dev',
          title: '国際交流プラットフォーム開発',
          subtitle: 'デジタル基盤・マッチング',
          icon: '💻',
          description: '日本と海外をつなぐオンラインプラットフォームの開発。言語学習、文化交流、ビジネスマッチングを統合したシステムを構築中。',
          features: ['多言語対応', 'AIマッチング', 'VR交流機能'],
          status: 'development',
          githubIntegration: true,
          detailPath: '/projects/international-platform-development'
        }
      ]
    },
    {
      id: 'education',
      title: '教育・人材育成',
      icon: '📚',
      description: '未来を担う人材の育成を目指し、AIやプログラミング、デザインなどの先端技術教育から不登校児支援まで幅広い学習機会を提供しています。',
      projects: [
        {
          id: 'e-school',
          title: 'eスクール型フリースクール',
          subtitle: '先端技術教育・自由学習',
          icon: '🎓',
          description: 'AI、プログラミング、デザイン、英語を軸とした新しい形の教育プログラム。一人ひとりの興味や才能を伸ばすオーダーメイド学習を提供します。',
          features: ['個別カリキュラム', 'プロジェクト学習', '実践型教育'],
          status: 'active'
        },
        {
          id: 'support-program',
          title: '不登校児学習支援プログラム',
          subtitle: 'オンライン・オフライン学習',
          icon: '🌱',
          description: '不登校の子どもたちが安心して学べる環境づくり。オンライン授業と対面サポートを組み合わせ、一人ひとりのペースに合わせた学習支援を行います。',
          features: ['1対1指導', '保護者サポート', '復学支援'],
          status: 'active'
        },
        {
          id: 'intern-program',
          title: 'インターンプログラム',
          subtitle: '実務経験・キャリア形成',
          icon: '💼',
          description: '学生や転職希望者向けの実践的なインターンシップ。Web開発、デザイン、国際交流事業など多様な分野で実務経験を積める機会を提供します。',
          features: ['3〜6ヶ月プログラム', 'メンター制度', '就職サポート'],
          status: 'planning'
        }
      ]
    },
    {
      id: 'dx',
      title: '地域DX推進',
      icon: '🚀',
      description: '保育や行政サービスのデジタル化を通じて地域課題を解決。NPOや地域団体の業務効率化支援も行い、持続可能な地域社会づくりに貢献しています。',
      projects: [
        {
          id: 'childcare-dx',
          title: '保育・病児保育DXシステム',
          subtitle: 'デジタル化・電子署名',
          icon: '👶',
          description: '保育園や病児保育施設向けのデジタル化システム。電子署名機能、自治体連携システム、保護者アプリなど包括的なソリューションを開発しています。',
          features: ['電子署名対応', '自治体API連携', 'リアルタイム連絡'],
          status: 'development'
        },
        {
          id: 'npo-support',
          title: 'NPO業務効率化支援',
          subtitle: 'システム導入・講座開催',
          icon: '🏢',
          description: 'NPOや地域団体向けの業務効率化講座とシステム導入支援。会計管理、会員管理、イベント運営などのデジタルツール活用をサポートします。',
          features: ['月1回講座', '導入後サポート', 'カスタマイズ対応'],
          status: 'active'
        },
        {
          id: 'opendata',
          title: 'オープンデータ活用プロジェクト',
          subtitle: '地域課題解決・データ分析',
          icon: '📊',
          description: '行政のオープンデータを活用した地域課題の可視化と解決策の提案。データ分析、可視化ツールの開発、政策提言まで一貫して取り組みます。',
          features: ['データ可視化', '政策提言', '市民参加型'],
          status: 'planning'
        }
      ]
    },
    {
      id: 'creative',
      title: 'アート・クリエイティブ',
      icon: '🎭',
      description: 'アーティストやクリエイターの創作活動を支援し、新しい表現の場を創出。AIやデジタルツールを活用した革新的な創作支援も展開しています。',
      projects: [
        {
          id: 'artist-support',
          title: 'アーティスト支援プログラム',
          subtitle: '創作支援・発表機会',
          icon: '🎨',
          description: 'アーティストの創作活動を多面的にサポート。作品制作費支援、展示会場提供、PR支援、販売プラットフォーム提供など包括的な支援を行います。',
          features: ['制作費支援', '展示会開催', 'オンライン販売'],
          status: 'active'
        },
        {
          id: 'music-events',
          title: '音楽イベント・ワークショップ',
          subtitle: 'ライブ開催・音楽教育',
          icon: '🎵',
          description: '地域の音楽文化振興を目的とした定期ライブイベントと音楽ワークショップ。プロ・アマ問わず幅広いアーティストに発表の場を提供します。',
          features: ['月1回ライブ', '楽器体験会', '音楽制作講座'],
          status: 'active'
        },
        {
          id: 'ai-creation',
          title: 'AI創作支援プラットフォーム',
          subtitle: 'AI活用・デジタル創作',
          icon: '🤖',
          description: 'AIやデジタルツールを活用したクリエイティブ制作の支援プラットフォーム。画像生成AI、音楽制作AI、動画編集ツールなどを統合した創作環境を提供。',
          features: ['AI画像生成', '音楽AI', '動画自動編集'],
          status: 'development'
        }
      ]
    }
  ];

  return (
    <Container>
      <PageHeader>
        <PageTitle>Our Projects</PageTitle>
        <PageDescription>
          国際交流、教育、地域DX、アート・クリエイティブの4つの分野で、
          多様なプロジェクトを通じて社会課題の解決と新たな価値創造に取り組んでいます
        </PageDescription>
      </PageHeader>

      {projectCategories.map((category, categoryIndex) => (
        <CategorySection key={category.id}>
          <CategoryHeader>
            <CategoryTitle>
              <CategoryIcon>{category.icon}</CategoryIcon>
              {category.title}
            </CategoryTitle>
            <CategoryDescription>{category.description}</CategoryDescription>
          </CategoryHeader>

          <ProjectsGrid>
            {category.projects.map((project, projectIndex) => (
              <ProjectCardWrapper key={project.id}>
                <StatusBadge status={project.status}>
                  {project.status === 'active' ? '実施中' :
                   project.status === 'planning' ? '企画中' :
                   '開発中'}
                </StatusBadge>
                <ProjectCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: (categoryIndex * 0.1) + (projectIndex * 0.1) 
                  }}
                  whileHover={{ y: -5 }}
                  onClick={() => handleProjectClick(project.id, (project as any).detailPath)}
                >
                  <ProjectHeader>
                    <ProjectIcon>{project.icon}</ProjectIcon>
                    <ProjectInfo>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectSubtitle>{project.subtitle}</ProjectSubtitle>
                    </ProjectInfo>
                  </ProjectHeader>

                  <ProjectDescription>{project.description}</ProjectDescription>

                  <ProjectFeatures>
                    {project.features.map((feature, index) => (
                      <FeatureTag key={index}>{feature}</FeatureTag>
                    ))}
                  </ProjectFeatures>

                  {(project as any).detailPath && (
                    <DetailIndicator>
                      📋 詳細を見る
                    </DetailIndicator>
                  )}

                  {(project as any).githubIntegration && (
                    <GitHubIndicator>
                      <GitHubStats>
                        <span>🐙 GitHub連携</span>
                        {!issuesLoading && gitHubIssues && (
                          <span>{gitHubIssues.length} issues</span>
                        )}
                        {!projectsLoading && gitHubProjects && (
                          <span>{gitHubProjects.length} projects</span>
                        )}
                      </GitHubStats>
                      <GitHubLinks>
                        <GitHubLink 
                          href={githubService.getIssuesUrl()} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Issues
                        </GitHubLink>
                        <GitHubLink 
                          href={githubService.getProjectsUrl()} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Projects
                        </GitHubLink>
                      </GitHubLinks>
                    </GitHubIndicator>
                  )}
                </ProjectCard>
              </ProjectCardWrapper>
            ))}
          </ProjectsGrid>
        </CategorySection>
      ))}
    </Container>
  );
};

export default ProjectsPage;