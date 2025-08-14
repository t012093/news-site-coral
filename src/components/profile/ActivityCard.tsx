import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { ActivityHistory, ACTIVITY_TYPE_LABELS } from '../../types/user';

const Card = styled(motion.div)`
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #404040;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 4px 20px rgba(156, 124, 244, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.h4`
  color: var(--text-color);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const ActivityMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--secondary-color);
  font-size: 0.9rem;
`;

const ActivityDescription = styled.p`
  color: var(--secondary-color);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  background: ${props => 
    props.status === 'active' ? 'rgba(34, 197, 94, 0.2)' :
    props.status === 'completed' ? 'rgba(59, 130, 246, 0.2)' :
    'rgba(156, 163, 175, 0.2)'
  };
  color: ${props => 
    props.status === 'active' ? '#22c55e' :
    props.status === 'completed' ? '#3b82f6' :
    '#9ca3af'
  };
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const TypeBadge = styled.span<{ type: string }>`
  background: ${props => 
    props.type === 'project' ? 'rgba(156, 124, 244, 0.2)' :
    props.type === 'event' ? 'rgba(251, 191, 36, 0.2)' :
    'rgba(34, 197, 94, 0.2)'
  };
  color: ${props => 
    props.type === 'project' ? '#9c7cf4' :
    props.type === 'event' ? '#fbbf24' :
    '#22c55e'
  };
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SkillTag = styled.span`
  background: rgba(156, 124, 244, 0.1);
  color: var(--accent-color);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(156, 124, 244, 0.3);
`;

const CertificateButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #8b5fe6;
    transform: translateY(-1px);
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #404040;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 0.2rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--secondary-color);
`;

interface ActivityCardProps {
  activity: ActivityHistory;
  onDownloadCertificate?: (certificateUrl: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onDownloadCertificate 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '参加中';
      case 'completed':
        return '完了';
      case 'cancelled':
        return 'キャンセル';
      default:
        return status;
    }
  };

  const getDuration = () => {
    if (!activity.endDate) return null;
    
    const start = new Date(activity.startDate);
    const end = new Date(activity.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays}日間`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}ヶ月間`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return remainingMonths > 0 ? `${years}年${remainingMonths}ヶ月間` : `${years}年間`;
    }
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <CardHeader>
        <ActivityInfo>
          <ActivityTitle>{activity.title}</ActivityTitle>
          
          <ActivityMeta>
            <TypeBadge type={activity.type}>
              {ACTIVITY_TYPE_LABELS[activity.type]}
            </TypeBadge>
            
            <StatusBadge status={activity.status}>
              {getStatusLabel(activity.status)}
            </StatusBadge>
            
            <MetaItem>
              📅 {formatDate(activity.startDate)}
              {activity.endDate && ` - ${formatDate(activity.endDate)}`}
            </MetaItem>
            
            {getDuration() && (
              <MetaItem>
                ⏱️ {getDuration()}
              </MetaItem>
            )}
            
            {activity.location && (
              <MetaItem>
                📍 {activity.location}
              </MetaItem>
            )}
          </ActivityMeta>
        </ActivityInfo>
      </CardHeader>

      <ActivityDescription>{activity.description}</ActivityDescription>

      {activity.skills.length > 0 && (
        <SkillsContainer>
          {activity.skills.map((skill, index) => (
            <SkillTag key={index}>{skill}</SkillTag>
          ))}
        </SkillsContainer>
      )}

      {(activity.hoursContributed || activity.certificateUrl) && (
        <StatsContainer>
          {activity.hoursContributed && (
            <StatItem>
              <StatValue>{activity.hoursContributed}</StatValue>
              <StatLabel>貢献時間</StatLabel>
            </StatItem>
          )}
        </StatsContainer>
      )}

      {activity.certificateUrl && onDownloadCertificate && (
        <CertificateButton 
          onClick={() => onDownloadCertificate(activity.certificateUrl!)}
        >
          📜 証明書をダウンロード
        </CertificateButton>
      )}
    </Card>
  );
};

export default ActivityCard;