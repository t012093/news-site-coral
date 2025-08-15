import React, { useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Message, MessageUser } from '../../types/message';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  messages: Message[];
  currentUser: MessageUser;
  otherUser: MessageUser;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--background-color);
`;

const ChatHeader = styled.div`
  background: var(--primary-color);
  border-bottom: 1px solid #2a2a2a;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-color);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const UserStatus = styled.div<{ isOnline: boolean }>`
  color: ${props => props.isOnline ? '#2ed573' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.isOnline ? '#2ed573' : '#747d8c'};
  }
`;

const ChatActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--accent-color);
    border-color: var(--accent-color);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const LoadingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.5);
  gap: 0.5rem;
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  font-size: 0.9rem;
`;

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  currentUser,
  otherUser,
  onSendMessage,
  isLoading = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatLastSeen = (lastSeen?: string): string => {
    if (!lastSeen) return '';
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return '最後のアクティビティ: 今';
    if (diffMinutes < 60) return `最後のアクティビティ: ${diffMinutes}分前`;
    if (diffMinutes < 1440) return `最後のアクティビティ: ${Math.floor(diffMinutes / 60)}時間前`;
    return `最後のアクティビティ: ${Math.floor(diffMinutes / 1440)}日前`;
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <Avatar 
          src={otherUser.avatar || '/images/man.png'} 
          alt={otherUser.displayName} 
        />
        
        <UserInfo>
          <UserName>{otherUser.displayName}</UserName>
          <UserStatus isOnline={otherUser.isOnline}>
            {otherUser.isOnline ? 'オンライン' : formatLastSeen(otherUser.lastSeen)}
          </UserStatus>
        </UserInfo>
        
        <ChatActions>
          <ActionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="通話"
          >
            📞
          </ActionButton>
          
          <ActionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="ビデオ通話"
          >
            📹
          </ActionButton>
          
          <ActionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="情報"
          >
            ℹ️
          </ActionButton>
        </ChatActions>
      </ChatHeader>

      <MessagesContainer>
        {isLoading ? (
          <LoadingIndicator
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              ⏳
            </motion.div>
            読み込み中...
          </LoadingIndicator>
        ) : messages.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>まだメッセージがありません</EmptyText>
            <EmptySubtext>
              {otherUser.displayName}さんとの最初のメッセージを送信してみましょう
            </EmptySubtext>
          </EmptyState>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.senderId === currentUser.id;
              const sender = isOwn ? currentUser : otherUser;
              const showAvatar = index === messages.length - 1 || 
                messages[index + 1]?.senderId !== message.senderId;
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  sender={sender}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                />
              );
            })}
            
            {/* Typing indicator would go here */}
            {/* <TypingIndicator>
              {otherUser.displayName}が入力中...
            </TypingIndicator> */}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </MessagesContainer>

      <MessageInput
        onSendMessage={onSendMessage}
        placeholder={`${otherUser.displayName}さんにメッセージ...`}
        disabled={isLoading}
      />
    </ChatContainer>
  );
};

export default ChatWindow;