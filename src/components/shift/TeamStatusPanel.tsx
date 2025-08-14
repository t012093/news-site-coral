import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { TeamMember } from '../../types/shift';

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TeamTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OnlineIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const StatusDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
`;

const MemberCard = styled(motion.div)<{ isOnline: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #2a2a2a;
  border-radius: 8px;
  border-left: 4px solid ${props => props.isOnline ? '#22c55e' : '#64748b'};
  opacity: ${props => props.isOnline ? 1 : 0.7};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: #3a3a3a;
    transform: translateX(4px);
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${props => props.color || 'var(--accent-color)'};
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2px;
`;

const MemberRole = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const MemberStatus = styled.div<{ status: string }>`
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  background: ${props => {
    switch (props.status) {
      case 'online': return '#22c55e20';
      case 'busy': return '#f59e0b20';
      case 'away': return '#64748b20';
      default: return '#64748b20';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'online': return '#22c55e';
      case 'busy': return '#f59e0b';
      case 'away': return '#64748b';
      default: return '#64748b';
    }
  }};
  white-space: nowrap;
`;

const FilterTabs = styled.div`
  display: flex;
  background: #2a2a2a;
  border-radius: 6px;
  padding: 2px;
  margin-bottom: 12px;
`;

const FilterTab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 6px 12px;
  background: ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--accent-color)' : '#3a3a3a'};
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #3a3a3a;
  color: var(--text-color);
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2a2a2a;
    border-color: var(--accent-color);
  }
`;

const ShiftSummary = styled.div`
  background: #2a2a2a;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const SummaryValue = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-color);
`;

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: '田中太郎',
    email: 'tanaka@example.com',
    avatar: '/images/man.png',
    role: 'マネージャー',
    department: '営業部',
    skills: ['営業', '管理', 'プレゼン'],
    workHours: { start: '09:00', end: '18:00' },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: false, sunday: false
    },
    isOnline: true,
    lastActive: new Date()
  },
  {
    id: '2',
    name: '山田花子',
    email: 'yamada@example.com',
    avatar: '/images/she.png',
    role: 'エンジニア',
    department: '開発部',
    skills: ['React', 'TypeScript', 'Node.js'],
    workHours: { start: '10:00', end: '19:00' },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: false, sunday: false
    },
    isOnline: true,
    lastActive: new Date()
  },
  {
    id: '3',
    name: '佐藤次郎',
    email: 'sato@example.com',
    avatar: '/images/man4.png',
    role: 'デザイナー',
    department: 'デザイン部',
    skills: ['UI/UX', 'Figma', 'イラスト'],
    workHours: { start: '09:30', end: '18:30' },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: false, sunday: false
    },
    isOnline: false,
    lastActive: new Date(Date.now() - 30 * 60 * 1000) // 30分前
  },
  {
    id: '4',
    name: '鈴木美咲',
    email: 'suzuki@example.com',
    avatar: '/images/she2.png',
    role: 'マーケター',
    department: 'マーケティング部',
    skills: ['SNS', 'コンテンツ制作', '分析'],
    workHours: { start: '09:00', end: '17:30' },
    availability: {
      monday: true, tuesday: true, wednesday: true,
      thursday: true, friday: true, saturday: false, sunday: false
    },
    isOnline: true,
    lastActive: new Date()
  }
];

const TeamStatusPanel: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'online' | 'available'>('all');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const filteredMembers = mockTeamMembers.filter(member => {
    switch (filter) {
      case 'online':
        return member.isOnline;
      case 'available':
        // 簡単な availability チェック (実際には現在時刻と work hours を比較)
        return member.isOnline && new Date().getDay() >= 1 && new Date().getDay() <= 5;
      default:
        return true;
    }
  });

  const onlineCount = mockTeamMembers.filter(m => m.isOnline).length;
  const totalMembers = mockTeamMembers.length;
  const availableCount = filteredMembers.length;

  const getStatusText = (member: TeamMember) => {
    if (!member.isOnline) return 'オフライン';
    
    const now = new Date();
    const currentHour = now.getHours();
    const startHour = parseInt(member.workHours.start.split(':')[0]);
    const endHour = parseInt(member.workHours.end.split(':')[0]);
    
    if (currentHour >= startHour && currentHour < endHour) {
      return '勤務中';
    } else {
      return 'オンライン';
    }
  };

  const getStatusColor = (member: TeamMember) => {
    if (!member.isOnline) return '#64748b';
    
    const statusText = getStatusText(member);
    switch (statusText) {
      case '勤務中': return '#22c55e';
      case 'オンライン': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <TeamContainer>
      <TeamHeader>
        <TeamTitle>
          👥 チーム状況
        </TeamTitle>
        <OnlineIndicator>
          <StatusDot color="#22c55e" />
          {onlineCount}/{totalMembers}
        </OnlineIndicator>
      </TeamHeader>

      <ShiftSummary>
        <SummaryRow>
          <SummaryLabel>オンライン:</SummaryLabel>
          <SummaryValue>{onlineCount}人</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>勤務中:</SummaryLabel>
          <SummaryValue>
            {mockTeamMembers.filter(m => getStatusText(m) === '勤務中').length}人
          </SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>今日のシフト:</SummaryLabel>
          <SummaryValue>8/10 充足</SummaryValue>
        </SummaryRow>
      </ShiftSummary>

      <FilterTabs>
        <FilterTab 
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          すべて
        </FilterTab>
        <FilterTab 
          active={filter === 'online'}
          onClick={() => setFilter('online')}
        >
          オンライン
        </FilterTab>
        <FilterTab 
          active={filter === 'available'}
          onClick={() => setFilter('available')}
        >
          対応可能
        </FilterTab>
      </FilterTabs>

      <MembersList>
        {filteredMembers.map((member, index) => (
          <MemberCard
            key={member.id}
            isOnline={member.isOnline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setExpandedMember(
              expandedMember === member.id ? null : member.id
            )}
            whileHover={{ scale: 1.02 }}
          >
            <Avatar 
              src={member.avatar || '/images/man.png'} 
              alt={member.name}
              color={getStatusColor(member)}
            />
            <MemberInfo>
              <MemberName>{member.name}</MemberName>
              <MemberRole>{member.role} • {member.department}</MemberRole>
            </MemberInfo>
            <MemberStatus status={member.isOnline ? 'online' : 'offline'}>
              {getStatusText(member)}
            </MemberStatus>
          </MemberCard>
        ))}
      </MembersList>

      <QuickActions>
        <ActionButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📞 緊急連絡
        </ActionButton>
        <ActionButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📋 シフト表
        </ActionButton>
      </QuickActions>
    </TeamContainer>
  );
};

export default TeamStatusPanel;