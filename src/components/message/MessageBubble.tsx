import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Message, MessageUser } from '../../types/message';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface MessageBubbleProps {
  message: Message;
  sender: MessageUser;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

const BubbleContainer = styled(motion.div)<{ isOwn: boolean }>`
  display: flex;
  flex-direction: ${props => props.isOwn ? 'row-reverse' : 'row'};
  align-items: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0 1rem;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const MessageContent = styled.div<{ isOwn: boolean }>`
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
`;

const SenderName = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  padding: 0 0.5rem;
`;

const Bubble = styled.div<{ isOwn: boolean }>`
  background: ${props => props.isOwn 
    ? 'linear-gradient(135deg, var(--accent-color), #8b5fe6)' 
    : '#2a2a2a'
  };
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  border-top-left-radius: ${props => props.isOwn ? '18px' : '4px'};
  border-top-right-radius: ${props => props.isOwn ? '4px' : '18px'};
  position: relative;
  word-wrap: break-word;
  max-width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    ${props => props.isOwn ? `
      border-left-color: var(--accent-color);
      right: -12px;
      bottom: 0;
    ` : `
      border-right-color: #2a2a2a;
      left: -12px;
      bottom: 0;
    `}
  }
`;

const MessageText = styled.p`
  margin: 0;
  line-height: 1.4;
  font-size: 0.9rem;
`;

const MessageMeta = styled.div<{ isOwn: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  ${props => props.isOwn ? 'justify-content: flex-end;' : ''}
`;

const StatusIcon = styled.span<{ status: Message['status'] }>`
  font-size: 0.7rem;
  color: ${props => {
    switch (props.status) {
      case 'sending': return '#ffa502';
      case 'sent': return '#747d8c';
      case 'delivered': return '#747d8c';
      case 'read': return '#2ed573';
      default: return '#747d8c';
    }
  }};
`;

const ReplyIndicator = styled.div`
  border-left: 3px solid var(--accent-color);
  padding-left: 0.75rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-style: italic;
`;

const getStatusIcon = (status: Message['status']): string => {
  switch (status) {
    case 'sending': return '⏳';
    case 'sent': return '✓';
    case 'delivered': return '✓✓';
    case 'read': return '✓✓';
    default: return '';
  }
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  isOwn,
  showAvatar = true,
  showTimestamp = true
}) => {
  return (
    <BubbleContainer
      isOwn={isOwn}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showAvatar && !isOwn && (
        <Avatar 
          src={sender.avatar || '/images/man.png'} 
          alt={sender.displayName} 
        />
      )}
      
      <MessageContent isOwn={isOwn}>
        {!isOwn && <SenderName>{sender.displayName}</SenderName>}
        
        <Bubble isOwn={isOwn}>
          {message.replyTo && (
            <ReplyIndicator>
              返信中...
            </ReplyIndicator>
          )}
          <MessageText>{message.content}</MessageText>
        </Bubble>
        
        {showTimestamp && (
          <MessageMeta isOwn={isOwn}>
            <span>
              {format(new Date(message.createdAt), 'HH:mm', { locale: ja })}
            </span>
            {isOwn && (
              <StatusIcon status={message.status}>
                {getStatusIcon(message.status)}
              </StatusIcon>
            )}
          </MessageMeta>
        )}
      </MessageContent>
      
      {showAvatar && isOwn && (
        <Avatar 
          src={sender.avatar || '/images/man.png'} 
          alt={sender.displayName} 
        />
      )}
    </BubbleContainer>
  );
};

export default MessageBubble;