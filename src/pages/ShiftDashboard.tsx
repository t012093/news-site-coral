import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import InteractiveCalendar from '../components/shift/InteractiveCalendar';
import TeamStatusPanel from '../components/shift/TeamStatusPanel';
import ShiftRequestForm from '../components/shift/ShiftRequestForm';
import ShiftStats from '../components/shift/ShiftStats';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  gap: 24px;
  height: calc(100vh - 160px);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    height: auto;
  }
`;

const Header = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid #2a2a2a;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  background: linear-gradient(135deg, var(--accent-color), #8b5fe6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const ActionButton = styled(motion.button)`
  padding: 12px 24px;
  background: var(--primary-color);
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--accent-color);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(147, 51, 234, 0.3);
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    grid-row: 2;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  
  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    grid-row: 3;
  }
`;

const Card = styled(motion.div)`
  background: var(--primary-color);
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TodaySchedule = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ScheduleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #2a2a2a;
  border-radius: 8px;
  border-left: 4px solid var(--accent-color);
`;

const TimeSlot = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-color);
  min-width: 80px;
`;

const EventTitle = styled.span`
  font-size: 0.9rem;
  color: var(--text-color);
  flex: 1;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 16px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--accent-color)' : '#3a3a3a'};
  }
`;

const ShiftDashboard: React.FC = () => {
  const { user } = useAuth();
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [showRequestForm, setShowRequestForm] = useState(false);

  const todaySchedule = [
    { time: '09:00', title: 'シフト開始', type: 'shift' },
    { time: '10:30', title: 'チームミーティング', type: 'meeting' },
    { time: '12:00', title: '昼休み', type: 'break' },
    { time: '15:00', title: 'クライアント打ち合わせ', type: 'meeting' },
    { time: '18:00', title: 'シフト終了', type: 'shift' },
  ];

  return (
    <DashboardContainer>
      <Header>
        <div>
          <Title>📅 シフト管理</Title>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '8px 0 0 0' }}>
            ようこそ、{user?.displayName || 'ユーザー'}さん
          </p>
        </div>
        <QuickActions>
          <ActionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRequestForm(true)}
          >
            🆕 シフト申請
          </ActionButton>
          <ActionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📊 レポート
          </ActionButton>
        </QuickActions>
      </Header>

      <Sidebar>
        <Card
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardTitle>📋 今日の予定</CardTitle>
          <TodaySchedule>
            {todaySchedule.map((item, index) => (
              <ScheduleItem key={index}>
                <TimeSlot>{item.time}</TimeSlot>
                <EventTitle>{item.title}</EventTitle>
              </ScheduleItem>
            ))}
          </TodaySchedule>
        </Card>

        <Card
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ShiftStats />
        </Card>

        <Card
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TeamStatusPanel />
        </Card>
      </Sidebar>

      <MainContent>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardTitle>📅 カレンダー</CardTitle>
          <ViewToggle>
            <ToggleButton 
              active={calendarView === 'month'}
              onClick={() => setCalendarView('month')}
            >
              月表示
            </ToggleButton>
            <ToggleButton 
              active={calendarView === 'week'}
              onClick={() => setCalendarView('week')}
            >
              週表示
            </ToggleButton>
            <ToggleButton 
              active={calendarView === 'day'}
              onClick={() => setCalendarView('day')}
            >
              日表示
            </ToggleButton>
          </ViewToggle>
          <InteractiveCalendar view={calendarView} />
        </Card>
      </MainContent>

      {showRequestForm && (
        <ShiftRequestForm 
          onClose={() => setShowRequestForm(false)}
          onSubmit={(request) => {
            console.log('Shift request:', request);
            setShowRequestForm(false);
          }}
        />
      )}
    </DashboardContainer>
  );
};

export default ShiftDashboard;