import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Task, TaskSort } from '../../types/task';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
`;

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 120px 100px 120px 100px 80px;
  gap: 16px;
  padding: 16px 20px;
  background: #3a3a3a;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid #4a4a4a;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SortButton = styled.button<{ active: boolean; direction?: 'asc' | 'desc' }>`
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  
  &:hover {
    color: var(--accent-color);
  }
  
  ${props => props.active && `
    color: var(--accent-color);
  `}
  
  &::after {
    content: ${props => {
      if (!props.active) return '""';
      return props.direction === 'asc' ? '"↑"' : '"↓"';
    }};
    font-size: 0.8rem;
  }
`;

const TaskRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 120px 100px 120px 100px 80px;
  gap: 16px;
  padding: 16px 20px;
  background: var(--primary-color);
  transition: background 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: #2a2a2a;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const TaskTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TaskDescription = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
`;

const ProjectName = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const Tags = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: var(--accent-color)30;
  color: var(--accent-color);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
`;

const StatusBadge = styled.div<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  
  ${props => {
    switch (props.status) {
      case 'todo':
        return `
          background: rgba(100, 116, 139, 0.2);
          color: #94a3b8;
          border: 1px solid rgba(100, 116, 139, 0.3);
        `;
      case 'in_progress':
        return `
          background: rgba(14, 165, 233, 0.2);
          color: #0ea5e9;
          border: 1px solid rgba(14, 165, 233, 0.3);
        `;
      case 'review':
        return `
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      case 'completed':
        return `
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;
      case 'blocked':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      case 'cancelled':
        return `
          background: rgba(107, 114, 128, 0.2);
          color: #6b7280;
          border: 1px solid rgba(107, 114, 128, 0.3);
        `;
      default:
        return `
          background: rgba(100, 116, 139, 0.2);
          color: #94a3b8;
        `;
    }
  }}
`;

const PriorityBadge = styled.div<{ priority: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  
  ${props => {
    switch (props.priority) {
      case 'low':
        return `
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;
      case 'medium':
        return `
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      case 'high':
        return `
          background: rgba(249, 115, 22, 0.2);
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.3);
        `;
      case 'urgent':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      default:
        return `
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        `;
    }
  }}
`;

const Assignee = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #3a3a3a;
`;

const AssigneeName = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DueDate = styled.div<{ overdue?: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.overdue ? '#ef4444' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.overdue ? '600' : '400'};
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const MobileTaskCard = styled(motion.div)`
  display: none;
  background: var(--primary-color);
  padding: 16px;
  border-bottom: 1px solid #2a2a2a;
  cursor: pointer;
  
  &:hover {
    background: #2a2a2a;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileTaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const MobileTaskBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MobileTaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

interface TaskListProps {
  tasks: Task[];
  sort: TaskSort;
  onSortChange: (sort: TaskSort) => void;
  onTaskClick?: (task: Task) => void;
}

const statusLabels: Record<string, string> = {
  'todo': '未着手',
  'in_progress': '進行中',
  'review': 'レビュー中',
  'completed': '完了',
  'blocked': 'ブロック',
  'cancelled': 'キャンセル'
};

const priorityLabels: Record<string, string> = {
  'low': '低',
  'medium': '中',
  'high': '高',
  'urgent': '緊急'
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  sort,
  onSortChange,
  onTaskClick
}) => {
  const handleSort = (field: TaskSort['field']) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ field, direction });
  };

  const isOverdue = (task: Task) => {
    return task.dueDate && task.dueDate < new Date() && task.status !== 'completed';
  };

  return (
    <>
      {/* Desktop View */}
      <ListContainer style={{ display: 'block' }}>
        <ListHeader>
          <SortButton
            active={sort.field === 'title'}
            direction={sort.field === 'title' ? sort.direction : undefined}
            onClick={() => handleSort('title')}
          >
            タスク
          </SortButton>
          <div>プロジェクト</div>
          <SortButton
            active={sort.field === 'status'}
            direction={sort.field === 'status' ? sort.direction : undefined}
            onClick={() => handleSort('status')}
          >
            ステータス
          </SortButton>
          <SortButton
            active={sort.field === 'priority'}
            direction={sort.field === 'priority' ? sort.direction : undefined}
            onClick={() => handleSort('priority')}
          >
            優先度
          </SortButton>
          <div>担当者</div>
          <SortButton
            active={sort.field === 'dueDate'}
            direction={sort.field === 'dueDate' ? sort.direction : undefined}
            onClick={() => handleSort('dueDate')}
          >
            期限
          </SortButton>
        </ListHeader>

        {tasks.map((task, index) => (
          <TaskRow
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onTaskClick?.(task)}
            whileHover={{ scale: 1.01 }}
          >
            <TaskInfo>
              <TaskTitle>{task.title}</TaskTitle>
              <TaskDescription>{task.description}</TaskDescription>
              {task.tags.length > 0 && (
                <Tags>
                  {task.tags.slice(0, 3).map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                  {task.tags.length > 3 && (
                    <Tag>+{task.tags.length - 3}</Tag>
                  )}
                </Tags>
              )}
            </TaskInfo>

            <ProjectInfo>
              <ProjectName>{task.projectName}</ProjectName>
            </ProjectInfo>

            <StatusBadge status={task.status}>
              {statusLabels[task.status]}
            </StatusBadge>

            <PriorityBadge priority={task.priority}>
              {priorityLabels[task.priority]}
            </PriorityBadge>

            <Assignee>
              {task.assignedToAvatar && (
                <Avatar src={task.assignedToAvatar} alt={task.assignedToName} />
              )}
              <AssigneeName>
                {task.assignedToName || '未割当'}
              </AssigneeName>
            </Assignee>

            <DueDate overdue={isOverdue(task)}>
              {task.dueDate ? format(task.dueDate, 'M/d', { locale: ja }) : '-'}
            </DueDate>
          </TaskRow>
        ))}
      </ListContainer>

      {/* Mobile View */}
      <div style={{ display: 'none' }}>
        {tasks.map((task, index) => (
          <MobileTaskCard
            key={`mobile-${task.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onTaskClick?.(task)}
            whileTap={{ scale: 0.98 }}
          >
            <MobileTaskHeader>
              <div style={{ flex: 1 }}>
                <TaskTitle>{task.title}</TaskTitle>
                <ProjectName>{task.projectName}</ProjectName>
              </div>
              {isOverdue(task) && (
                <div style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: '600' }}>
                  期限超過
                </div>
              )}
            </MobileTaskHeader>

            <MobileTaskBody>
              <TaskDescription>{task.description}</TaskDescription>
              
              {task.tags.length > 0 && (
                <Tags>
                  {task.tags.slice(0, 2).map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                  {task.tags.length > 2 && (
                    <Tag>+{task.tags.length - 2}</Tag>
                  )}
                </Tags>
              )}
            </MobileTaskBody>

            <MobileTaskMeta>
              <div style={{ display: 'flex', gap: '8px' }}>
                <StatusBadge status={task.status}>
                  {statusLabels[task.status]}
                </StatusBadge>
                <PriorityBadge priority={task.priority}>
                  {priorityLabels[task.priority]}
                </PriorityBadge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {task.assignedToAvatar && (
                  <Avatar src={task.assignedToAvatar} alt={task.assignedToName} />
                )}
                <DueDate overdue={isOverdue(task)}>
                  {task.dueDate ? format(task.dueDate, 'M/d', { locale: ja }) : '-'}
                </DueDate>
              </div>
            </MobileTaskMeta>
          </MobileTaskCard>
        ))}
      </div>
    </>
  );
};

export default TaskList;