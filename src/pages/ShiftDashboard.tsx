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
  grid-template-columns: 320px 1fr;
  grid-template-rows: auto 1fr;
  gap: 32px;
  height: calc(100vh - 160px);
  padding: 0 8px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 280px 1fr;
    gap: 24px;
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    height: auto;
    gap: 20px;
  }
`;

const Header = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, var(--primary-color), #1a1a1a);
  border-radius: 16px;
  border: 1px solid #2a2a2a;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  background: linear-gradient(135deg, var(--accent-color), #8b5fe6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
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
  background: linear-gradient(135deg, var(--primary-color), #1a1a1a);
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: linear-gradient(135deg, var(--accent-color), #8b5fe6);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(147, 51, 234, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
  
  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
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
  background: linear-gradient(145deg, var(--primary-color), #1a1a1a);
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(147, 51, 234, 0.1);
    border-color: rgba(147, 51, 234, 0.3);
  }
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
  gap: 10px;
`;

const ScheduleItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #2a2a2a, #252525);
  border-radius: 12px;
  border-left: 4px solid var(--accent-color);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: linear-gradient(135deg, #3a3a3a, #2f2f2f);
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(147, 51, 234, 0.2);
  }
`;

const TimeSlot = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-color);
  min-width: 70px;
  background: rgba(147, 51, 234, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  text-align: center;
`;

const EventTitle = styled.span`
  font-size: 0.9rem;
  color: var(--text-color);
  flex: 1;
`;

const ViewToggle = styled.div`
  display: flex;
  background: linear-gradient(135deg, #2a2a2a, #252525);
  border-radius: 12px;
  padding: 6px;
  margin-bottom: 20px;
  border: 1px solid #3a3a3a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 10px 18px;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, var(--accent-color), #8b5fe6)' 
    : 'transparent'
  };
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, var(--accent-color), #8b5fe6)'
      : 'linear-gradient(135deg, #3a3a3a, #2f2f2f)'
    };
    transform: translateY(-1px);
  }
  
  @media (max-width: 640px) {
    padding: 8px 12px;
    font-size: 0.8rem;
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
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            margin: '8px 0 0 0',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            ようこそ、{user?.displayName || 'ユーザー'}さん 👋
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
              <ScheduleItem 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
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