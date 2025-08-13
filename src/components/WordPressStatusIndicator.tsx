import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useWordPressStatus } from '../hooks/useWordPress';

const StatusContainer = styled(motion.div)<{ connected: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.connected ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 152, 0, 0.9)'};
  color: white;
  padding: 12px 16px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  max-width: 300px;
`;

const StatusIcon = styled.span<{ connected: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#4CAF50' : '#FF9800'};
  margin-right: 8px;
  animation: ${props => props.connected ? 'none' : 'pulse 2s infinite'};

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const StatusDetails = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  margin-top: 4px;
`;

export const WordPressStatusIndicator = () => {
  const { data: status, isLoading } = useWordPressStatus();

  if (isLoading || !status) {
    return null;
  }

  return (
    <StatusContainer
      connected={status.connected}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <div>
        <StatusIcon connected={status.connected} />
        {status.connected ? 'WordPress接続済み' : 'WordPress接続待機中'}
      </div>
      <StatusDetails>
        {status.connected ? (
          `記事数: ${status.postsCount}`
        ) : (
          'デモデータ表示中'
        )}
      </StatusDetails>
    </StatusContainer>
  );
};