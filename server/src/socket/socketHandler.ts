import { Server as SocketIOServer, Socket } from 'socket.io';
import { jwtManager } from '@/utils/jwt';
import { MessageService } from '@/services/messageService';

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

      const payload = jwtManager.verifyAccessToken(token);
      socket.userId = payload.userId;
      socket.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
      
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    console.log(`👋 User ${userId} connected: ${socket.id}`);

    // Store connection
    connectedUsers.set(userId, socket.id);
    userOnlineStatus.set(userId, true);

    // Notify about online status
    socket.broadcast.emit('user_online', { userId, timestamp: new Date().toISOString() });

    // Authentication success
    socket.emit('authenticated', { 
      status: 'success',
      user: socket.user,
      timestamp: new Date().toISOString()
    });

    // Project-related events
    socket.on('join_project', (data: { projectId: string }) => {
      console.log(`📂 User ${userId} joining project: ${data.projectId}`);
      socket.join(`project:${data.projectId}`);
      socket.emit('project_joined', { 
        projectId: data.projectId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('leave_project', (data: { projectId: string }) => {
      console.log(`📂 User ${userId} leaving project: ${data.projectId}`);
      socket.leave(`project:${data.projectId}`);
      socket.emit('project_left', { 
        projectId: data.projectId,
        timestamp: new Date().toISOString()
      });
    });

    // Task-related events
    socket.on('task_updated', (data: { taskId: string; projectId: string; updates: any }) => {
      console.log(`📋 Task updated: ${data.taskId} in project ${data.projectId}`);
      // Broadcast to all users in the project
      socket.to(`project:${data.projectId}`).emit('task_updated', {
        taskId: data.taskId,
        updates: data.updates,
        updatedBy: userId,
        timestamp: new Date().toISOString()
      });
    });

    // Message-related events
    socket.on('join_conversation', (data: { conversationId: string }) => {
      console.log(`💬 User ${userId} joining conversation: ${data.conversationId}`);
      socket.join(`conversation:${data.conversationId}`);
      socket.emit('conversation_joined', { 
        conversationId: data.conversationId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('leave_conversation', (data: { conversationId: string }) => {
      console.log(`💬 User ${userId} leaving conversation: ${data.conversationId}`);
      
      // Remove from typing users if typing
      if (typingUsers.has(data.conversationId)) {
        const typingSet = typingUsers.get(data.conversationId)!;
        typingSet.delete(userId);
        if (typingSet.size === 0) {
          typingUsers.delete(data.conversationId);
        } else {
          // Notify others that user stopped typing
          socket.to(`conversation:${data.conversationId}`).emit('typing_stop', {
            userId,
            conversationId: data.conversationId,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      socket.leave(`conversation:${data.conversationId}`);
      socket.emit('conversation_left', { 
        conversationId: data.conversationId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('send_message', async (data: { conversationId: string; content: string; messageType?: string; replyToId?: string }) => {
      try {
        console.log(`📤 User ${userId} sending message to conversation: ${data.conversationId}`);
        
        // Send message through the service
        const message = await MessageService.sendMessage(data.conversationId, userId, {
          content: data.content,
          messageType: data.messageType as any,
          replyToId: data.replyToId,
        });

        // Broadcast to all users in the conversation
        io.to(`conversation:${data.conversationId}`).emit('new_message', {
          message,
          timestamp: new Date().toISOString()
        });

        // Send confirmation to sender
        socket.emit('message_sent', {
          messageId: message.id,
          conversationId: data.conversationId,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', {
          error: 'Failed to send message',
          conversationId: data.conversationId,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('typing_start', (data: { conversationId: string }) => {
      console.log(`⌨️  User ${userId} started typing in conversation: ${data.conversationId}`);
      
      if (!typingUsers.has(data.conversationId)) {
        typingUsers.set(data.conversationId, new Set());
      }
      typingUsers.get(data.conversationId)!.add(userId);

      // Notify others in the conversation
      socket.to(`conversation:${data.conversationId}`).emit('typing_start', {
        userId,
        conversationId: data.conversationId,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('typing_stop', (data: { conversationId: string }) => {
      console.log(`⌨️  User ${userId} stopped typing in conversation: ${data.conversationId}`);
      
      if (typingUsers.has(data.conversationId)) {
        typingUsers.get(data.conversationId)!.delete(userId);
        if (typingUsers.get(data.conversationId)!.size === 0) {
          typingUsers.delete(data.conversationId);
        }
      }

      // Notify others in the conversation
      socket.to(`conversation:${data.conversationId}`).emit('typing_stop', {
        userId,
        conversationId: data.conversationId,
        timestamp: new Date().toISOString()
      });
    });

    // Mark messages as read
    socket.on('mark_as_read', async (data: { conversationId: string; messageId: string }) => {
      try {
        await MessageService.markMessagesAsRead(data.conversationId, userId, data.messageId);
        
        // Notify others in the conversation
        socket.to(`conversation:${data.conversationId}`).emit('messages_read', {
          userId,
          conversationId: data.conversationId,
          messageId: data.messageId,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // User presence events
    socket.on('user_status_update', (data: { status: 'online' | 'away' | 'busy' | 'offline' }) => {
      console.log(`👤 User ${userId} status updated to: ${data.status}`);
      userOnlineStatus.set(userId, data.status === 'online');
      
      // Broadcast status update
      socket.broadcast.emit('user_status_changed', {
        userId,
        status: data.status,
        timestamp: new Date().toISOString()
      });
    });

    // Get online users
    socket.on('get_online_users', (data: { userIds?: string[] }) => {
      const requestedUsers = data.userIds || Array.from(userOnlineStatus.keys());
      const onlineUsers = requestedUsers.filter(id => userOnlineStatus.get(id) === true);
      
      socket.emit('online_users', {
        onlineUsers,
        timestamp: new Date().toISOString()
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`👋 User ${userId} disconnected: ${socket.id}, reason: ${reason}`);
      
      // Remove from connected users
      connectedUsers.delete(userId);
      userOnlineStatus.set(userId, false);

      // Remove from all typing indicators
      typingUsers.forEach((typingSet, conversationId) => {
        if (typingSet.has(userId)) {
          typingSet.delete(userId);
          if (typingSet.size === 0) {
            typingUsers.delete(conversationId);
          }
          // Notify others that user stopped typing
          socket.to(`conversation:${conversationId}`).emit('typing_stop', {
            userId,
            conversationId,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Notify about offline status
      socket.broadcast.emit('user_offline', { 
        userId, 
        timestamp: new Date().toISOString() 
      });
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`❌ Socket error for user ${userId} (${socket.id}):`, error);
    });

    // Ping-pong for connection health
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });
  });

  // Handle connection errors
  io.engine.on('connection_error', (err) => {
    console.error('❌ Socket.IO connection error:', err);
  });

  console.log('✅ Socket.IO server initialized successfully');
};

// Export utilities for use in other modules
export const getConnectedUsers = () => connectedUsers;
export const getUserOnlineStatus = (userId: string) => userOnlineStatus.get(userId) || false;
export const getTypingUsers = (conversationId: string) => typingUsers.get(conversationId) || new Set();