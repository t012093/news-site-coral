import { Server as SocketIOServer, Socket } from 'socket.io';
import { jwtManager } from '@/utils/jwt';

// Store active connections and user status
const connectedUsers = new Map<string, string>(); // userId -> socketId
const userOnlineStatus = new Map<string, boolean>(); // userId -> isOnline
const typingUsers = new Map<string, Set<string>>(); // conversationId -> Set<userId>

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const initializeSocketIO = (io: SocketIOServer): void => {
  console.log('🔌 Initializing Socket.IO server...');

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      // Verify JWT token
      const payload = jwtManager.verifyAccessToken(token);
      
      if (!payload || !payload.userId) {
        return next(new Error('Invalid token payload'));
      }

      // Attach user data to socket
      socket.userId = payload.userId;
      socket.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Handle new connections
  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;
    
    if (!userId) {
      console.error('No userId found on authenticated socket');
      socket.disconnect();
      return;
    }

    console.log(`✅ User ${userId} connected (${socket.id})`);

    // Store connection
    connectedUsers.set(userId, socket.id);
    userOnlineStatus.set(userId, true);

    // Broadcast user online status
    socket.broadcast.emit('user_status', {
      userId,
      isOnline: true,
      lastSeen: new Date(),
    });

    // Join user to their conversations
    socket.on('join_conversations', async (conversationIds: string[]) => {
      try {
        for (const conversationId of conversationIds) {
          await socket.join(`conversation:${conversationId}`);
        }
        console.log(`User ${userId} joined ${conversationIds.length} conversations`);
      } catch (error) {
        console.error('Error joining conversations:', error);
      }
    });

    // Handle sending messages
    socket.on('send_message', async (data: {
      conversationId: string;
      content: string;
      messageType?: string;
      replyToId?: string;
    }) => {
      try {
        // TODO: Implement message creation when MessageService is ready
        const message = {
          id: 'temp-id',
          conversationId: data.conversationId,
          senderId: userId,
          content: data.content,
          messageType: data.messageType || 'text',
          createdAt: new Date(),
        };

        // Emit to all users in the conversation
        io.to(`conversation:${data.conversationId}`).emit('new_message', message);
        
        console.log(`Message sent in conversation ${data.conversationId} by user ${userId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', {
          error: 'Failed to send message',
          conversationId: data.conversationId,
        });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data: { conversationId: string }) => {
      const { conversationId } = data;
      
      if (!typingUsers.has(conversationId)) {
        typingUsers.set(conversationId, new Set());
      }
      
      typingUsers.get(conversationId)?.add(userId);
      
      // Notify other users in the conversation
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        isTyping: true,
      });
    });

    socket.on('typing_stop', (data: { conversationId: string }) => {
      const { conversationId } = data;
      
      typingUsers.get(conversationId)?.delete(userId);
      
      // Notify other users in the conversation
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        isTyping: false,
      });
    });

    // Handle message read receipts
    socket.on('mark_read', async (data: {
      messageId: string;
      conversationId: string;
    }) => {
      try {
        // TODO: Implement mark as read when MessageService is ready
        
        // Notify other users in the conversation
        socket.to(`conversation:${data.conversationId}`).emit('message_read', {
          messageId: data.messageId,
          userId,
          readAt: new Date(),
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle user presence updates
    socket.on('update_presence', (data: { status: 'online' | 'away' | 'busy' }) => {
      userOnlineStatus.set(userId, data.status === 'online');
      
      // Broadcast status update
      socket.broadcast.emit('user_status', {
        userId,
        status: data.status,
        lastSeen: new Date(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason: string) => {
      console.log(`❌ User ${userId} disconnected: ${reason} (${socket.id})`);
      
      // Remove from connected users
      connectedUsers.delete(userId);
      userOnlineStatus.set(userId, false);
      
      // Clean up typing indicators
      for (const [conversationId, typingSet] of typingUsers.entries()) {
        if (typingSet.has(userId)) {
          typingSet.delete(userId);
          // Notify others that user stopped typing
          socket.broadcast.to(`conversation:${conversationId}`).emit('user_typing', {
            conversationId,
            userId,
            isTyping: false,
          });
        }
      }
      
      // Broadcast user offline status
      socket.broadcast.emit('user_status', {
        userId,
        isOnline: false,
        lastSeen: new Date(),
      });
    });

    // Handle errors
    socket.on('error', (error: any) => {
      console.error(`Socket error for user ${userId} (${socket.id}):`, error);
    });

    // Send initial connection confirmation
    socket.emit('connected', {
      socketId: socket.id,
      userId,
      timestamp: new Date(),
    });
  });

  io.on('error', (err: any) => {
    console.error('Socket.IO server error:', err);
  });

  console.log('✅ Socket.IO server initialized');
};

// Utility functions for external use
export const getConnectedUsers = (): Map<string, string> => connectedUsers;
export const isUserOnline = (userId: string): boolean => userOnlineStatus.get(userId) || false;
export const getUserTypingStatus = (conversationId: string): string[] => {
  return Array.from(typingUsers.get(conversationId) || []);
};