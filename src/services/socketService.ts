import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { Message } from './messageApi';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = Cookies.get('auth_token');
      if (!token) {
        reject(new Error('認証トークンがありません'));
        return;
      }

      const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
      
      this.socket = io(serverUrl, {
        auth: {
          token,
        },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectInterval,
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket.IO connected:', this.socket?.id);
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('authenticated', (data) => {
        console.log('🔐 Socket.IO authenticated:', data);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('WebSocket接続に失敗しました'));
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Socket.IO disconnected:', reason);
        
        if (reason === 'io server disconnect') {
          // サーバーから切断された場合は手動で再接続
          this.socket?.connect();
        }
      });

      this.socket.on('error', (error) => {
        console.error('❌ Socket.IO error:', error);
      });

      // プロジェクト関連イベント
      this.socket.on('project_joined', (data) => {
        console.log('📂 Joined project:', data.projectId);
      });

      this.socket.on('project_left', (data) => {
        console.log('📂 Left project:', data.projectId);
      });

      // タスク関連イベント
      this.socket.on('task_updated', (data) => {
        console.log('📋 Task updated:', data);
        // タスク更新イベントを発火
        this.emit('taskUpdated', data);
      });

      // メッセージ関連イベント
      this.socket.on('conversation_joined', (data) => {
        console.log('💬 Joined conversation:', data.conversationId);
      });

      this.socket.on('conversation_left', (data) => {
        console.log('💬 Left conversation:', data.conversationId);
      });

      this.socket.on('new_message', (data) => {
        console.log('📤 New message received:', data);
        this.emit('newMessage', data);
      });

      this.socket.on('message_sent', (data) => {
        console.log('✅ Message sent confirmation:', data);
        this.emit('messageSent', data);
      });

      this.socket.on('message_error', (data) => {
        console.error('❌ Message error:', data);
        this.emit('messageError', data);
      });

      this.socket.on('typing_start', (data) => {
        console.log('⌨️ User started typing:', data);
        this.emit('typingStart', data);
      });

      this.socket.on('typing_stop', (data) => {
        console.log('⌨️ User stopped typing:', data);
        this.emit('typingStop', data);
      });

      this.socket.on('messages_read', (data) => {
        console.log('👁️ Messages marked as read:', data);
        this.emit('messagesRead', data);
      });

      // ユーザープレゼンス関連イベント
      this.socket.on('user_online', (data) => {
        console.log('🟢 User came online:', data.userId);
        this.emit('userOnline', data);
      });

      this.socket.on('user_offline', (data) => {
        console.log('🔴 User went offline:', data.userId);
        this.emit('userOffline', data);
      });

      this.socket.on('user_status_changed', (data) => {
        console.log('👤 User status changed:', data);
        this.emit('userStatusChanged', data);
      });

      this.socket.on('online_users', (data) => {
        console.log('👥 Online users:', data.onlineUsers);
        this.emit('onlineUsers', data);
      });

      // ヘルスチェック
      this.socket.on('pong', (data) => {
        console.log('🏓 Pong received:', data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // プロジェクト関連メソッド
  joinProject(projectId: string): void {
    this.socket?.emit('join_project', { projectId });
  }

  leaveProject(projectId: string): void {
    this.socket?.emit('leave_project', { projectId });
  }

  // タスク関連メソッド
  notifyTaskUpdate(taskId: string, projectId: string, updates: any): void {
    this.socket?.emit('task_updated', { taskId, projectId, updates });
  }

  // メッセージ関連メソッド
  joinConversation(conversationId: string): void {
    this.socket?.emit('join_conversation', { conversationId });
  }

  leaveConversation(conversationId: string): void {
    this.socket?.emit('leave_conversation', { conversationId });
  }

  sendMessage(conversationId: string, content: string, messageType?: string, replyToId?: string): void {
    this.socket?.emit('send_message', {
      conversationId,
      content,
      messageType,
      replyToId,
    });
  }

  startTyping(conversationId: string): void {
    this.socket?.emit('typing_start', { conversationId });
  }

  stopTyping(conversationId: string): void {
    this.socket?.emit('typing_stop', { conversationId });
  }

  markAsRead(conversationId: string, messageId: string): void {
    this.socket?.emit('mark_as_read', { conversationId, messageId });
  }

  // ユーザープレゼンス関連メソッド
  updateUserStatus(status: 'online' | 'away' | 'busy' | 'offline'): void {
    this.socket?.emit('user_status_update', { status });
  }

  getOnlineUsers(userIds?: string[]): void {
    this.socket?.emit('get_online_users', { userIds });
  }

  // ヘルスチェック
  ping(): void {
    this.socket?.emit('ping');
  }

  // イベントリスナーのための簡単なEventEmitter実装
  private eventListeners: Map<string, Array<(...args: any[]) => void>> = new Map();

  on(event: string, listener: (...args: any[]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off(event: string, listener: (...args: any[]) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }

  // 接続状態の確認
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Socket.IOインスタンスの取得（必要に応じて）
  getSocket(): Socket | null {
    return this.socket;
  }
}

// シングルトンインスタンス
export const socketService = new SocketService();

// フック用のヘルパー関数
export const useSocket = () => {
  return {
    connect: () => socketService.connect(),
    disconnect: () => socketService.disconnect(),
    on: (event: string, listener: (...args: any[]) => void) => socketService.on(event, listener),
    off: (event: string, listener: (...args: any[]) => void) => socketService.off(event, listener),
    emit: (event: string, ...args: any[]) => socketService.getSocket()?.emit(event, ...args),
    isConnected: () => socketService.isConnected(),
    
    // プロジェクト関連
    joinProject: (projectId: string) => socketService.joinProject(projectId),
    leaveProject: (projectId: string) => socketService.leaveProject(projectId),
    
    // タスク関連
    notifyTaskUpdate: (taskId: string, projectId: string, updates: any) => 
      socketService.notifyTaskUpdate(taskId, projectId, updates),
    
    // メッセージ関連
    joinConversation: (conversationId: string) => socketService.joinConversation(conversationId),
    leaveConversation: (conversationId: string) => socketService.leaveConversation(conversationId),
    sendMessage: (conversationId: string, content: string, messageType?: string, replyToId?: string) =>
      socketService.sendMessage(conversationId, content, messageType, replyToId),
    startTyping: (conversationId: string) => socketService.startTyping(conversationId),
    stopTyping: (conversationId: string) => socketService.stopTyping(conversationId),
    markAsRead: (conversationId: string, messageId: string) => 
      socketService.markAsRead(conversationId, messageId),
    
    // ユーザープレゼンス関連
    updateUserStatus: (status: 'online' | 'away' | 'busy' | 'offline') => 
      socketService.updateUserStatus(status),
    getOnlineUsers: (userIds?: string[]) => socketService.getOnlineUsers(userIds),
    
    // ヘルスチェック
    ping: () => socketService.ping(),
  };
};