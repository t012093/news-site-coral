import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Conversation, MessageUser } from '../../types/message';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ConversationListProps {
  conversations: Conversation[];
  users: Record<string, MessageUser>;
  activeConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  currentUserId: string;
}

const ListContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  background: var(--primary-color);
  border-right: 1px solid #2a2a2a;
`;

const ListHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #2a2a2a;
  background: var(--background-color);
`;

const HeaderTitle = styled.h3`
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  background: var(--primary-color);
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.9rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const ConversationItem = styled(motion.div)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: ${props => props.isActive ? 'rgba(139, 95, 230, 0.1)' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid var(--accent-color);
`;

const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
`;

const LastMessage = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ConversationMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`;

const TimeStamp = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
`;

const UnreadBadge = styled.div`
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

const OnlineIndicator = styled.div<{ isOnline: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.isOnline ? '#2ed573' : '#747d8c'};
  position: absolute;
  bottom: 2px;
  right: 2px;
  border: 2px solid var(--primary-color);
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-right: 1rem;
`;

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  users,
  activeConversationId,
  onConversationSelect,
  currentUserId
}) => {
  const getOtherUserId = (conversation: Conversation): string => {
    return conversation.participants.find(id => id !== currentUserId) || '';
  };

  const getOtherUser = (conversation: Conversation): MessageUser | undefined => {
    const otherUserId = getOtherUserId(conversation);
    return users[otherUserId];
  };

  return (
    <ListContainer>
      <ListHeader>
        <HeaderTitle>💬 メッセージ</HeaderTitle>
        <SearchInput 
          placeholder="ユーザーまたは会話を検索..." 
        />
      </ListHeader>
      
      {conversations.map(conversation => {
        const otherUser = getOtherUser(conversation);
        if (!otherUser) return null;
        
        return (
          <ConversationItem
            key={conversation.id}
            isActive={conversation.id === activeConversationId}
            whileHover={{ x: 4 }}
            onClick={() => onConversationSelect(conversation.id)}
          >
            <AvatarContainer>
              <Avatar 
                src={otherUser.avatar || '/images/man.png'} 
                alt={otherUser.displayName}
              />
              <OnlineIndicator isOnline={otherUser.isOnline} />
            </AvatarContainer>
            
            <ConversationInfo>
              <UserName>{otherUser.displayName}</UserName>
              <LastMessage>
                {conversation.lastMessage?.content || 'まだメッセージがありません'}
              </LastMessage>
            </ConversationInfo>
            
            <ConversationMeta>
              {conversation.lastActivity && (
                <TimeStamp>
                  {formatDistanceToNow(new Date(conversation.lastActivity), { 
                    addSuffix: true, 
                    locale: ja 
                  })}
                </TimeStamp>
              )}
              {conversation.unreadCount > 0 && (
                <UnreadBadge>
                  {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                </UnreadBadge>
              )}
            </ConversationMeta>
          </ConversationItem>
        );
      })}
    </ListContainer>
  );
};

export default ConversationList;