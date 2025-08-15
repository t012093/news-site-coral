import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import ConversationList from '../components/message/ConversationList';
import ChatWindow from '../components/message/ChatWindow';
import { 
  Message, 
  Conversation, 
  MessageUser, 
  ChatState,
  ConversationFilters,
  MessageFilters
} from '../types/message';
import { 
  getConversations, 
  getMessages, 
  sendMessage,
  markAsRead,
  createConversation 
} from '../services/messageApi';
import { useSocket } from '../services/socketService';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background: var(--background-color);
  padding-top: 80px; /* Navigation height offset */
`;

const Sidebar = styled.div<{ $showMobile?: boolean }>`
  width: 350px;
  min-width: 350px;
  height: 100%;
  background: var(--primary-color);
  
  @media (max-width: 768px) {
    width: 100%;
    position: ${props => props.$showMobile ? 'static' : 'absolute'};
    z-index: 10;
  }
`;

const MainContent = styled.div<{ $showMobile?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  @media (max-width: 768px) {
    display: ${props => props.$showMobile ? 'none' : 'flex'};
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
  background: var(--background-color);
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 2rem;
  opacity: 0.3;
`;

const EmptyTitle = styled.h2`
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
`;

const StartChatButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--accent-color), #8b5fe6);
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #8b5fe6, var(--accent-color));
  }
`;


const MessagePage: React.FC = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [chatState, setChatState] = useState<ChatState>({
    conversations: [],
    activeConversationId: null,
    messages: {},
    users: {},
    unreadTotal: 0,
    isLoading: true
  });
  const [error, setError] = useState<string | null>(null);

  const currentUser: MessageUser = {
    id: user?.id || 'current-user',
    displayName: user?.displayName || user?.name || 'あなた',
    avatar: user?.avatar,
    isOnline: true
  };

  // 会話一覧を読み込む
  const loadConversations = async () => {
    try {
      setChatState(prev => ({ ...prev, isLoading: true }));
      const filters: ConversationFilters = {
        limit: 50,
        offset: 0
      };
      
      const result = await getConversations(filters);
      
      // ユーザー情報を抽出
      const users: Record<string, MessageUser> = {};
      result.conversations.forEach(conv => {
        conv.participants.forEach(participant => {
          users[participant.userId] = {
            id: participant.userId,
            displayName: participant.user.name,
            avatar: participant.user.avatar,
            isOnline: false // 初期値、WebSocketで更新
          };
        });
      });

      const unreadTotal = result.conversations.reduce(
        (sum, conv) => sum + (conv.unreadCount || 0),
        0
      );

      setChatState(prev => ({
        ...prev,
        conversations: result.conversations,
        users,
        unreadTotal,
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Failed to load conversations:', error);
      setError(error.message);
      setChatState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // メッセージを読み込む
  const loadMessages = async (conversationId: string) => {
    try {
      const filters: MessageFilters = {
        conversationId,
        limit: 50,
        offset: 0
      };
      
      const result = await getMessages(filters);
      
      setChatState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: result.messages
        }
      }));
    } catch (error: any) {
      console.error('Failed to load messages:', error);
      setError(error.message);
    }
  };

  // 初期化
  useEffect(() => {
    if (user) {
      loadConversations();
      
      // WebSocket接続
      socket.connect().then(() => {
        console.log('WebSocket connected for messaging');
        
        // WebSocketイベントリスナーを設定
        socket.on('newMessage', ({ message }) => {
          setChatState(prev => ({
            ...prev,
            messages: {
              ...prev.messages,
              [message.conversationId]: [
                ...(prev.messages[message.conversationId] || []),
                message
              ]
            }
          }));
          
          // 会話一覧を更新
          loadConversations();
        });

        socket.on('messagesRead', ({ conversationId, messageId, userId }) => {
          setChatState(prev => ({
            ...prev,
            messages: {
              ...prev.messages,
              [conversationId]: prev.messages[conversationId]?.map(msg => {
                if (msg.id === messageId || msg.createdAt <= new Date(messageId)) {
                  return {
                    ...msg,
                    readBy: [
                      ...msg.readBy.filter(r => r.userId !== userId),
                      { userId, readAt: new Date() }
                    ]
                  };
                }
                return msg;
              }) || []
            }
          }));
        });

        socket.on('userOnline', ({ userId }) => {
          setChatState(prev => ({
            ...prev,
            users: {
              ...prev.users,
              [userId]: {
                ...prev.users[userId],
                isOnline: true
              }
            }
          }));
        });

        socket.on('userOffline', ({ userId }) => {
          setChatState(prev => ({
            ...prev,
            users: {
              ...prev.users,
              [userId]: {
                ...prev.users[userId],
                isOnline: false
              }
            }
          }));
        });
      }).catch(error => {
        console.error('WebSocket connection failed:', error);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleConversationSelect = async (conversationId: string) => {
    setChatState(prev => ({
      ...prev,
      activeConversationId: conversationId
    }));

    // WebSocketで会話に参加
    socket.joinConversation(conversationId);

    // メッセージを読み込む
    if (!chatState.messages[conversationId]) {
      await loadMessages(conversationId);
    }

    // 既読マークを付ける
    const conversation = chatState.conversations.find(c => c.id === conversationId);
    if (conversation?.lastMessage) {
      try {
        await markAsRead(conversationId, conversation.lastMessage.id);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!chatState.activeConversationId || !content.trim()) return;

    try {
      // APIでメッセージを送信
      const message = await sendMessage(chatState.activeConversationId, {
        content: content.trim(),
        messageType: 'text'
      });

      // ローカル状態を更新
      setChatState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [chatState.activeConversationId!]: [
            ...(prev.messages[chatState.activeConversationId!] || []),
            message
          ]
        }
      }));

      // WebSocketでリアルタイム送信
      socket.sendMessage(chatState.activeConversationId, content.trim(), 'text');

    } catch (error: any) {
      console.error('Failed to send message:', error);
      setError(error.message);
    }
  };

  const handleStartNewChat = () => {
    // 新しい会話を開始するモーダルを表示する処理
    // 実装は後でモーダルコンポーネントを作成時に追加
    console.log('Start new chat');
  };

  const activeConversation = chatState.conversations.find(
    conv => conv.id === chatState.activeConversationId
  );

  const otherUser = activeConversation 
    ? chatState.users[activeConversation.participants.find(p => p.userId !== currentUser.id)?.userId || '']
    : undefined;

  const currentMessages = chatState.activeConversationId 
    ? chatState.messages[chatState.activeConversationId] || []
    : [];

  if (error) {
    return (
      <PageContainer>
        <EmptyState>
          <EmptyIcon>⚠️</EmptyIcon>
          <EmptyTitle>エラーが発生しました</EmptyTitle>
          <EmptyText>{error}</EmptyText>
          <StartChatButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setError(null);
              loadConversations();
            }}
          >
            再試行
          </StartChatButton>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar>
        <ConversationList
          conversations={chatState.conversations}
          users={chatState.users}
          activeConversationId={chatState.activeConversationId}
          onConversationSelect={handleConversationSelect}
          currentUserId={currentUser.id}
        />
      </Sidebar>

      <MainContent>
        {activeConversation && otherUser ? (
          <ChatWindow
            messages={currentMessages}
            currentUser={currentUser}
            otherUser={otherUser}
            onSendMessage={handleSendMessage}
            isLoading={chatState.isLoading}
          />
        ) : (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyTitle>
              {chatState.isLoading ? 'メッセージを読み込み中...' : 'メッセージを選択してください'}
            </EmptyTitle>
            <EmptyText>
              {chatState.isLoading ? (
                'しばらくお待ちください'
              ) : (
                <>
                  左側の会話一覧から会話を選択するか、<br/>
                  新しい会話を開始してください。
                </>
              )}
            </EmptyText>
            {!chatState.isLoading && (
              <StartChatButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartNewChat}
              >
                新しい会話を開始
              </StartChatButton>
            )}
          </EmptyState>
        )}
      </MainContent>
    </PageContainer>
  );
};

export default MessagePage;