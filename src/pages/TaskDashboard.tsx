import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Project, TaskFilter, TaskSort, TaskBoard, TaskStatus } from '../types/task';
import TaskSearch from '../components/task/TaskSearch';
import TaskFilters from '../components/task/TaskFilters';
import TaskList from '../components/task/TaskList';
import TaskBoardComponent from '../components/task/TaskBoard';
import TaskStats from '../components/task/TaskStats';
import TaskCreateForm from '../components/task/TaskCreateForm';
import ProjectSelector from '../components/task/ProjectSelector';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 4px;
  gap: 2px;
`;

const ViewButton = styled(motion.button)<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--accent-color)' : '#3a3a3a'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const CreateButton = styled(motion.button)`
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s ease;
  
  &:hover {
    background: #8b5fe6;
  }
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 1200px) {
    order: 2;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 600px;
  
  @media (max-width: 1200px) {
    order: 1;
  }
`;

const SearchAndFilters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--primary-color);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #2a2a2a;
`;

const StatsContainer = styled.div`
  background: var(--primary-color);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #2a2a2a;
`;

const ContentArea = styled.div`
  background: var(--primary-color);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #2a2a2a;
  min-height: 500px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--text-color);
  margin: 0 0 8px 0;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
`;

// モックデータ
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'News Site Coral',
    description: 'メインのニュースサイトプロジェクト',
    color: '#9333ea',
    icon: '🌊',
    status: 'active',
    startDate: new Date('2024-01-01'),
    progress: 75,
    teamMembers: [],
    taskStats: {
      total: 48,
      todo: 12,
      inProgress: 8,
      review: 4,
      completed: 22,
      blocked: 2,
      cancelled: 0,
      overdue: 3
    }
  },
  {
    id: '2', 
    name: 'International Art Collaboration',
    description: '国際アートコラボレーションプラットフォーム',
    color: '#0ea5e9',
    icon: '🎨',
    status: 'active',
    startDate: new Date('2024-02-01'),
    progress: 45,
    teamMembers: [],
    taskStats: {
      total: 32,
      todo: 14,
      inProgress: 6,
      review: 2,
      completed: 10,
      blocked: 0,
      cancelled: 0,
      overdue: 1
    }
  },
  {
    id: '3',
    name: 'Platform Development',
    description: '国際プラットフォーム開発',
    color: '#16a34a',
    icon: '🚀',
    status: 'active',
    startDate: new Date('2024-03-01'),
    progress: 30,
    teamMembers: [],
    taskStats: {
      total: 56,
      todo: 28,
      inProgress: 12,
      review: 6,
      completed: 8,
      blocked: 2,
      cancelled: 0,
      overdue: 5
    }
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'シフト管理システムのUI改善',
    description: 'ユーザビリティを向上させるためのUI改善を実施',
    priority: 'high',
    status: 'in_progress',
    category: 'development',
    projectId: '1',
    projectName: 'News Site Coral',
    assignedTo: 'user1',
    assignedToName: '田中太郎',
    assignedToAvatar: '/images/man.png',
    createdBy: 'user2',
    createdByName: '山田花子',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-13'),
    dueDate: new Date('2024-12-20'),
    estimatedHours: 16,
    actualHours: 8,
    tags: ['UI/UX', 'React', 'TypeScript'],
    isArchived: false
  },
  {
    id: '2',
    title: 'タスク管理機能の実装',
    description: 'プロジェクトタスク管理機能を実装する',
    priority: 'urgent',
    status: 'todo',
    category: 'development',
    projectId: '1',
    projectName: 'News Site Coral',
    assignedTo: 'user1',
    assignedToName: '田中太郎',
    assignedToAvatar: '/images/man.png',
    createdBy: 'user2',
    createdByName: '山田花子',
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14'),
    dueDate: new Date('2024-12-18'),
    estimatedHours: 24,
    tags: ['Feature', 'React', 'TypeScript', 'Database'],
    isArchived: false
  },
  {
    id: '3',
    title: 'アート投稿機能のデザイン',
    description: 'アーティストが作品を投稿できる機能のUIデザインを作成',
    priority: 'medium',
    status: 'review',
    category: 'design',
    projectId: '2',
    projectName: 'International Art Collaboration',
    assignedTo: 'user3',
    assignedToName: '佐藤次郎',
    assignedToAvatar: '/images/man4.png',
    createdBy: 'user2',
    createdByName: '山田花子',
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-12'),
    dueDate: new Date('2024-12-15'),
    estimatedHours: 12,
    actualHours: 10,
    tags: ['UI/UX', 'Figma', 'Design System'],
    isArchived: false
  },
  {
    id: '4',
    title: 'API エンドポイントの実装',
    description: 'ユーザー管理とプロジェクト管理のAPIエンドポイントを実装',
    priority: 'high',
    status: 'completed',
    category: 'development',
    projectId: '3',
    projectName: 'Platform Development',
    assignedTo: 'user4',
    assignedToName: '鈴木美咲',
    assignedToAvatar: '/images/she2.png',
    createdBy: 'user1',
    createdByName: '田中太郎',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-11'),
    dueDate: new Date('2024-12-12'),
    estimatedHours: 20,
    actualHours: 18,
    tags: ['API', 'Node.js', 'Database'],
    isArchived: false
  },
  {
    id: '5',
    title: 'セキュリティ監査',
    description: 'プラットフォームのセキュリティ脆弱性の監査を実施',
    priority: 'urgent',
    status: 'blocked',
    category: 'other',
    projectId: '3',
    projectName: 'Platform Development',
    createdBy: 'user1',
    createdByName: '田中太郎',
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-13'),
    dueDate: new Date('2024-12-16'),
    estimatedHours: 8,
    tags: ['Security', 'Audit'],
    isArchived: false
  }
];

type ViewType = 'list' | 'board' | 'calendar';

const TaskDashboard: React.FC = () => {
  const [view, setView] = useState<ViewType>('list');
  const [filter, setFilter] = useState<TaskFilter>({});
  const [sort, setSort] = useState<TaskSort>({ field: 'updatedAt', direction: 'desc' });
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);

  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      if (selectedProject !== 'all' && task.projectId !== selectedProject) return false;
      if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.status && filter.status.length > 0 && !filter.status.includes(task.status)) return false;
      if (filter.priority && filter.priority.length > 0 && !filter.priority.includes(task.priority)) return false;
      if (filter.category && filter.category.length > 0 && !filter.category.includes(task.category)) return false;
      if (filter.assignedTo && task.assignedTo !== filter.assignedTo) return false;
      if (filter.isOverdue) {
        const now = new Date();
        if (!task.dueDate || task.dueDate >= now || task.status === 'completed') return false;
      }
      return true;
    });

    // ソート適用
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sort.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { 'low': 0, 'medium': 1, 'high': 2, 'urgent': 3 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          aValue = a.dueDate ? a.dueDate.getTime() : 0;
          bValue = b.dueDate ? b.dueDate.getTime() : 0;
          break;
        default:
          aValue = a[sort.field];
          bValue = b[sort.field];
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, filter, sort, selectedProject]);

  const taskStats = useMemo(() => {
    const stats = {
      total: 0,
      todo: 0,
      inProgress: 0,
      review: 0,
      completed: 0,
      blocked: 0,
      cancelled: 0,
      overdue: 0
    };

    filteredTasks.forEach(task => {
      stats.total++;
      stats[task.status.replace('-', '') as keyof typeof stats]++;
      
      if (task.dueDate && task.dueDate < new Date() && task.status !== 'completed') {
        stats.overdue++;
      }
    });

    return stats;
  }, [filteredTasks]);

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date() }
          : task
      )
    );
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderTitle>
          📋 タスク管理
        </HeaderTitle>
        
        <ActionButtons>
          <ViewToggle>
            <ViewButton
              active={view === 'list'}
              onClick={() => setView('list')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📄 リスト
            </ViewButton>
            <ViewButton
              active={view === 'board'}
              onClick={() => setView('board')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📋 ボード
            </ViewButton>
            <ViewButton
              active={view === 'calendar'}
              onClick={() => setView('calendar')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📅 カレンダー
            </ViewButton>
          </ViewToggle>

          <CreateButton
            onClick={() => setShowCreateForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ タスク作成
          </CreateButton>
        </ActionButtons>
      </DashboardHeader>

      <DashboardContent>
        <Sidebar>
          <SearchAndFilters>
            <TaskSearch
              value={filter.search || ''}
              onChange={(search) => setFilter({ ...filter, search })}
            />
            <ProjectSelector
              projects={mockProjects}
              selected={selectedProject}
              onChange={setSelectedProject}
            />
            <TaskFilters
              filter={filter}
              onChange={setFilter}
            />
          </SearchAndFilters>

          <StatsContainer>
            <TaskStats stats={taskStats} />
          </StatsContainer>
        </Sidebar>

        <MainContent>
          <ContentArea>
            {filteredTasks.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>📋</EmptyStateIcon>
                <EmptyStateTitle>タスクが見つかりません</EmptyStateTitle>
                <EmptyStateText>
                  検索条件を変更するか、新しいタスクを作成してください。
                </EmptyStateText>
              </EmptyState>
            ) : (
              <AnimatePresence mode="wait">
                {view === 'list' && (
                  <TaskList
                    key="list"
                    tasks={filteredTasks}
                    sort={sort}
                    onSortChange={setSort}
                  />
                )}
                {view === 'board' && (
                  <TaskBoardComponent
                    key="board"
                    tasks={filteredTasks}
                    onTaskMove={handleTaskMove}
                  />
                )}
                {view === 'calendar' && (
                  <div key="calendar">
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: '40px' }}>
                      カレンダービューは近日実装予定です
                    </p>
                  </div>
                )}
              </AnimatePresence>
            )}
          </ContentArea>
        </MainContent>
      </DashboardContent>

      <AnimatePresence>
        {showCreateForm && (
          <TaskCreateForm
            projects={mockProjects}
            onClose={() => setShowCreateForm(false)}
            onSubmit={(task) => {
              console.log('New task:', task);
              setShowCreateForm(false);
            }}
          />
        )}
      </AnimatePresence>
    </DashboardContainer>
  );
};

export default TaskDashboard;