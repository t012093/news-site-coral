import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { ShiftStats as ShiftStatsType } from '../../types/shift';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(135deg, #2a2a2a, #252525);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 4px solid var(--accent-color);
  border: 1px solid #3a3a3a;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(147, 51, 234, 0.1);
    border-color: rgba(147, 51, 234, 0.3);
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatValue = styled.span<{ highlight?: boolean; color?: string }>`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${props => 
    props.color ? props.color :
    props.highlight ? 'var(--accent-color)' : 'var(--text-color)'
  };
  text-shadow: ${props => 
    props.highlight ? '0 0 10px rgba(147, 51, 234, 0.5)' : 'none'
  };
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #3a3a3a;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ProgressFill = styled(motion.div)<{ color?: string }>`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.color || 'var(--accent-color)'}, ${props => props.color || 'var(--accent-color)'}80);
  border-radius: 3px;
  box-shadow: 0 0 10px ${props => props.color || 'var(--accent-color)'}60;
`;

const MiniChart = styled.div`
  display: flex;
  gap: 2px;
  margin-top: 8px;
  height: 20px;
  align-items: end;
`;

const ChartBar = styled(motion.div)<{ height: number; color?: string }>`
  flex: 1;
  background: ${props => props.color || 'var(--accent-color)40'};
  border-radius: 1px;
  height: ${props => props.height}%;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: ${props => props.color || 'var(--accent-color)'};
  }
`;

const QuickStat = styled(motion.div)`
  text-align: center;
  padding: 12px;
  background: linear-gradient(135deg, #2a2a2a, #252525);
  border-radius: 10px;
  border: 1px solid #3a3a3a;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const QuickStatValue = styled.div<{ color?: string }>`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${props => props.color || 'var(--accent-color)'};
  text-shadow: 0 0 15px ${props => props.color || 'var(--accent-color)'}40;
  margin-bottom: 4px;
`;

const QuickStatLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const mockStats: ShiftStatsType = {
  totalShifts: 28,
  pendingRequests: 3,
  approvedShifts: 24,
  coverageRate: 85.7,
  averageHours: 7.5,
  overtimeHours: 2.3
};

const weeklyData = [75, 82, 68, 90, 85, 77, 88]; // 過去7日間のカバレッジ率

const ShiftStats: React.FC = () => {
  const approvalRate = (mockStats.approvedShifts / mockStats.totalShifts) * 100;
  const pendingRate = (mockStats.pendingRequests / mockStats.totalShifts) * 100;

  return (
    <StatsContainer>
      <StatsTitle>
        📊 統計情報
      </StatsTitle>

      <StatsGrid>
        <QuickStat
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <QuickStatValue color="#22c55e">
            {mockStats.totalShifts}
          </QuickStatValue>
          <QuickStatLabel>今月のシフト</QuickStatLabel>
        </QuickStat>
        
        <QuickStat
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <QuickStatValue color="#f59e0b">
            {mockStats.pendingRequests}
          </QuickStatValue>
          <QuickStatLabel>申請中</QuickStatLabel>
        </QuickStat>
        
        <QuickStat
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <QuickStatValue color="#ef4444">
            {mockStats.overtimeHours}h
          </QuickStatValue>
          <QuickStatLabel>残業時間</QuickStatLabel>
        </QuickStat>
      </StatsGrid>

      <StatCard
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatRow>
          <StatLabel>
            🎯 カバレッジ率
          </StatLabel>
          <StatValue 
            highlight={mockStats.coverageRate >= 80}
            color={mockStats.coverageRate >= 80 ? '#22c55e' : '#f59e0b'}
          >
            {mockStats.coverageRate.toFixed(1)}%
          </StatValue>
        </StatRow>
        <ProgressBar>
          <ProgressFill
            initial={{ width: 0 }}
            animate={{ width: `${mockStats.coverageRate}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            color={mockStats.coverageRate >= 80 ? '#22c55e' : '#f59e0b'}
          />
        </ProgressBar>
      </StatCard>

      <StatCard
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatRow>
          <StatLabel>
            ✅ 承認率
          </StatLabel>
          <StatValue color="#22c55e">
            {approvalRate.toFixed(1)}%
          </StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>
            ⏳ 申請中
          </StatLabel>
          <StatValue color="#f59e0b">
            {pendingRate.toFixed(1)}%
          </StatValue>
        </StatRow>
      </StatCard>

      <StatCard
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StatRow>
          <StatLabel>
            ⏰ 平均勤務時間
          </StatLabel>
          <StatValue>
            {mockStats.averageHours}時間
          </StatValue>
        </StatRow>
        
        <StatLabel style={{ marginTop: '8px', fontSize: '0.8rem' }}>
          📈 週間カバレッジ推移
        </StatLabel>
        <MiniChart>
          {weeklyData.map((value, index) => (
            <ChartBar
              key={index}
              height={value}
              initial={{ height: 0 }}
              animate={{ height: `${value}%` }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              color={
                value >= 80 ? '#22c55e80' :
                value >= 60 ? '#f59e0b80' : '#ef444480'
              }
              title={`${['月', '火', '水', '木', '金', '土', '日'][index]}: ${value}%`}
            />
          ))}
        </MiniChart>
      </StatCard>

      <StatCard
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StatRow>
          <StatLabel>
            🚨 要注意
          </StatLabel>
          <StatValue color="#ef4444">
            2件
          </StatValue>
        </StatRow>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
          • 明日のシフト不足<br/>
          • 来週の休日対応
        </div>
      </StatCard>
    </StatsContainer>
  );
};

export default ShiftStats;