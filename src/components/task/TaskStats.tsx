import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { TaskStats as TaskStatsType } from '../../types/task';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const StatCard = styled(motion.div)`
  background: #2a2a2a;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  border-left: 4px solid var(--accent-color);
`;

const StatValue = styled.div<{ color?: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.color || 'var(--accent-color)'};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const DetailedStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 6px 8px;
  background: #2a2a2a;
  border-radius: 6px;
`;

const StatRowLabel = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatRowValue = styled.span<{ color?: string }>`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.color || 'var(--text-color)'};
`;

const ProgressChart = styled.div`
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
  background: #3a3a3a;
`;

const ProgressSegment = styled(motion.div)<{ width: number; color: string }>`
  height: 100%;
  background: ${props => props.color};
  width: ${props => props.width}%;
  transition: width 0.5s ease;
`;

const CompletionRate = styled.div`
  text-align: center;
  margin-top: 12px;
  padding: 8px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 6px;
`;

const CompletionValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #22c55e;
`;

const CompletionLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(34, 197, 94, 0.8);
  margin-top: 2px;
`;

interface TaskStatsProps {
  stats: TaskStatsType;
}

const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const activeTasksRate = stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0;
  
  const getProgressData = () => {
    if (stats.total === 0) return [];
    
    return [
      { label: '完了', value: stats.completed, color: '#22c55e', percentage: (stats.completed / stats.total) * 100 },
      { label: '進行中', value: stats.inProgress, color: '#0ea5e9', percentage: (stats.inProgress / stats.total) * 100 },
      { label: 'レビュー中', value: stats.review, color: '#f59e0b', percentage: (stats.review / stats.total) * 100 },
      { label: 'ブロック', value: stats.blocked, color: '#ef4444', percentage: (stats.blocked / stats.total) * 100 },
      { label: '未着手', value: stats.todo, color: '#64748b', percentage: (stats.todo / stats.total) * 100 },
    ].filter(item => item.value > 0);
  };

  const progressData = getProgressData();

  return (
    <StatsContainer>
      <StatsTitle>
        📊 タスク統計
      </StatsTitle>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue>{stats.total}</StatValue>
          <StatLabel>総タスク数</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue color="#0ea5e9">{stats.inProgress}</StatValue>
          <StatLabel>進行中</StatLabel>
        </StatCard>
      </StatsGrid>

      <CompletionRate>
        <CompletionValue>{completionRate}%</CompletionValue>
        <CompletionLabel>完了率</CompletionLabel>
      </CompletionRate>

      <DetailedStats>
        <StatRow>
          <StatRowLabel>
            ✅ 完了
          </StatRowLabel>
          <StatRowValue color="#22c55e">{stats.completed}</StatRowValue>
        </StatRow>
        
        <StatRow>
          <StatRowLabel>
            🔄 レビュー中
          </StatRowLabel>
          <StatRowValue color="#f59e0b">{stats.review}</StatRowValue>
        </StatRow>
        
        <StatRow>
          <StatRowLabel>
            📋 未着手
          </StatRowLabel>
          <StatRowValue color="#64748b">{stats.todo}</StatRowValue>
        </StatRow>
        
        {stats.blocked > 0 && (
          <StatRow>
            <StatRowLabel>
              🚫 ブロック
            </StatRowLabel>
            <StatRowValue color="#ef4444">{stats.blocked}</StatRowValue>
          </StatRow>
        )}
        
        {stats.overdue > 0 && (
          <StatRow style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)' 
          }}>
            <StatRowLabel>
              ⚠️ 期限超過
            </StatRowLabel>
            <StatRowValue color="#ef4444">{stats.overdue}</StatRowValue>
          </StatRow>
        )}
      </DetailedStats>

      {progressData.length > 0 && (
        <div>
          <StatRowLabel style={{ marginBottom: '8px', justifyContent: 'center' }}>
            📈 ステータス分布
          </StatRowLabel>
          <ProgressChart>
            {progressData.map((segment, index) => (
              <ProgressSegment
                key={segment.label}
                width={segment.percentage}
                color={segment.color}
                initial={{ width: 0 }}
                animate={{ width: `${segment.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                title={`${segment.label}: ${segment.value}件 (${Math.round(segment.percentage)}%)`}
              />
            ))}
          </ProgressChart>
        </div>
      )}
    </StatsContainer>
  );
};

export default TaskStats;