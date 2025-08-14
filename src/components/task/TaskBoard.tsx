import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Task, TaskStatus } from '../../types/task';

const BoardContainer = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 4px;
  min-height: 500px;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2a2a2a;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  background: #2a2a2a;
  border-radius: 12px;
  padding: 16px;
  max-height: 600px;
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #3a3a3a;
`;

const ColumnTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TaskCount = styled.span`
  background: #3a3a3a;
  color: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 3px;
  }
`;

const TaskCard = styled(motion.div)<{ priority: string; overdue?: boolean }>`
  background: var(--primary-color);
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid ${props => {
    if (props.overdue) return '#ef4444';
    switch (props.priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#64748b';
    }
  }};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2a2a2a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const TaskTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  line-height: 1.3;
  flex: 1;
  margin-right: 8px;
`;

const PriorityIndicator = styled.div<{ priority: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#64748b';
    }
  }};
  flex-shrink: 0;
`;

const TaskDescription = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const TaskMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TaskMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectTag = styled.div`
  background: var(--accent-color)30;
  color: var(--accent-color);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Assignee = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #3a3a3a;
`;

const AssigneeName = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
`;

const DueDate = styled.div<{ overdue?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.overdue ? '#ef4444' : 'rgba(255, 255, 255, 0.6)'};
  font-weight: ${props => props.overdue ? '600' : '400'};
`;

const Tags = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const Tag = styled.span`
  background: #3a3a3a;
  color: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 500;
`;

const DropZone = styled(motion.div)<{ isDragging: boolean }>`
  min-height: 60px;
  border: 2px dashed ${props => props.isDragging ? 'var(--accent-color)' : '#3a3a3a'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isDragging ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: ${props => props.isDragging ? 'rgba(147, 51, 234, 0.1)' : 'transparent'};
`;

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
}

const columns: { status: TaskStatus; title: string; icon: string; color: string }[] = [
  { status: 'todo', title: '未着手', icon: '📋', color: '#64748b' },
  { status: 'in_progress', title: '進行中', icon: '🔄', color: '#0ea5e9' },
  { status: 'review', title: 'レビュー中', icon: '👀', color: '#f59e0b' },
  { status: 'completed', title: '完了', icon: '✅', color: '#22c55e' },
  { status: 'blocked', title: 'ブロック', icon: '🚫', color: '#ef4444' }
];

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTaskMove,
  onTaskClick
}) => {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const isOverdue = (task: Task) => {
    return task.dueDate && task.dueDate < new Date() && task.status !== 'completed';
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask && onTaskMove) {
      onTaskMove(draggedTask, status);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return (
    <BoardContainer>
      {columns.map(column => {
        const columnTasks = getTasksByStatus(column.status);
        const isDraggingOver = dragOverColumn === column.status;

        return (
          <Column key={column.status}>
            <ColumnHeader>
              <ColumnTitle>
                {column.icon} {column.title}
              </ColumnTitle>
              <TaskCount>{columnTasks.length}</TaskCount>
            </ColumnHeader>

            <TasksContainer
              onDragOver={(e) => handleDragOver(e, column.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <AnimatePresence>
                {columnTasks.map((task, index) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    style={{ cursor: 'grab' }}
                  >
                    <TaskCard
                      priority={task.priority}
                      overdue={isOverdue(task)}
                      onClick={() => onTaskClick?.(task)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                    <TaskHeader>
                      <TaskTitle>{task.title}</TaskTitle>
                      <PriorityIndicator priority={task.priority} />
                    </TaskHeader>

                    <TaskDescription>{task.description}</TaskDescription>

                    <TaskMeta>
                      <TaskMetaRow>
                        <ProjectTag>{task.projectName}</ProjectTag>
                        {task.assignedTo && (
                          <Assignee>
                            {task.assignedToAvatar && (
                              <Avatar src={task.assignedToAvatar} alt={task.assignedToName} />
                            )}
                            <AssigneeName>{task.assignedToName}</AssigneeName>
                          </Assignee>
                        )}
                      </TaskMetaRow>

                      {task.dueDate && (
                        <TaskMetaRow>
                          <span></span>
                          <DueDate overdue={isOverdue(task)}>
                            {isOverdue(task) && '⚠️ '}
                            {format(task.dueDate, 'M月d日', { locale: ja })}
                          </DueDate>
                        </TaskMetaRow>
                      )}
                    </TaskMeta>

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
                  </TaskCard>
                  </div>
                ))}
              </AnimatePresence>

              {columnTasks.length === 0 && (
                <DropZone
                  isDragging={isDraggingOver}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {isDraggingOver ? 'ここにドロップ' : 'タスクなし'}
                </DropZone>
              )}

              {columnTasks.length > 0 && isDraggingOver && (
                <DropZone
                  isDragging={true}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  ここにドロップ
                </DropZone>
              )}
            </TasksContainer>
          </Column>
        );
      })}
    </BoardContainer>
  );
};

export default TaskBoard;