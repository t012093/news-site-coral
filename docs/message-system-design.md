# メッセージ機能 バックエンド設計書

## 概要

リアルタイムメッセージング機能の包括的なバックエンド設計ドキュメント。
ユーザー間の1対1メッセージング、友達申請システム、リアルタイム通信を含む。

## アーキテクチャ概要

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │WebSocket    │ │◄──►│ │Socket.io    │ │    │ │Messages     │ │
│ │Client       │ │    │ │Server       │ │    │ │Conversations│ │
│ └─────────────┘ │    │ └─────────────┘ │    │ │Users        │ │
└─────────────────┘    └─────────────────┘    │ │Friendships  │ │
                                               │ └─────────────┘ │
                       ┌─────────────────┐    └─────────────────┘
                       │   Redis         │
                       │   (Cache)       │
                       │                 │
                       │ ┌─────────────┐ │
                       │ │Session      │ │
                       │ │Cache        │ │
                       │ │Online Users │ │
                       │ └─────────────┘ │
                       └─────────────────┘
```

## データベース設計

### テーブル構造

#### 1. users テーブル（既存のアカウントシステムと統合）
```sql
-- 既存のusersテーブルを拡張してメッセージ機能に対応
-- account-system-design.mdで定義済みのテーブルに以下のカラムを追加

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE;

-- privacy_settingsのJSONBに以下のメッセージ関連設定を追加
-- 既存: preferences.notifications (メール・プッシュ通知設定)
-- 追加: preferences.messaging (メッセージング設定)
```

**統合されたprivacy_settings構造**:
```typescript
interface UserPreferences {
  language: 'ja' | 'en';
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    categories: {
      events: boolean;
      newsletter: boolean;
      projects: boolean;
      system: boolean;
      messages: boolean;      // 🆕 メッセージ通知
      friend_requests: boolean; // 🆕 友達申請通知
    };
  };
  messaging: {                 // 🆕 メッセージング設定
    allow_messages_from: 'everyone' | 'friends_only' | 'nobody';
    show_online_status: boolean;
    show_last_seen: boolean;
    allow_friend_requests: boolean;
    read_receipts: boolean;
  };
}
```

```sql
CREATE INDEX idx_users_online ON users(is_online);
CREATE INDEX idx_users_last_seen ON users(last_seen);
```

#### 2. friendships テーブル
```sql
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, blocked
    message TEXT, -- 申請時のメッセージ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(requester_id, addressee_id),
    CHECK (requester_id != addressee_id),
    CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked'))
);

CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);
```

#### 3. conversations テーブル
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL DEFAULT 'direct', -- direct, group (将来拡張用)
    title VARCHAR(255), -- グループチャット用
    last_message_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CHECK (type IN ('direct', 'group'))
);

CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
```

#### 4. conversation_participants テーブル
```sql
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    last_read_message_id UUID,
    unread_count INTEGER DEFAULT 0,
    is_muted BOOLEAN DEFAULT false,
    
    UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
```

#### 5. messages テーブル
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL DEFAULT 'text', -- text, image, file, system
    reply_to_id UUID REFERENCES messages(id),
    metadata JSONB, -- ファイル情報、画像サイズ等
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CHECK (message_type IN ('text', 'image', 'file', 'system'))
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_reply_to ON messages(reply_to_id);
```

#### 6. message_receipts テーブル
```sql
CREATE TABLE message_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL, -- delivered, read
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(message_id, user_id, status),
    CHECK (status IN ('delivered', 'read'))
);

CREATE INDEX idx_message_receipts_message ON message_receipts(message_id);
CREATE INDEX idx_message_receipts_user ON message_receipts(user_id);
```

## REST API 設計

### 認証エンドポイント
```typescript
// JWT認証ヘッダー必須
Authorization: Bearer <jwt_token>
```

### 友達申請 API

#### 友達申請送信
```
POST /api/friends/request
Content-Type: application/json

{
  "userId": "uuid",
  "message": "よろしくお願いします！"
}

Response:
{
  "success": true,
  "friendship": {
    "id": "uuid",
    "status": "pending",
    "createdAt": "2024-08-14T..."
  }
}
```

#### 友達申請一覧取得
```
GET /api/friends/requests?type=received&status=pending

Response:
{
  "requests": [
    {
      "id": "uuid",
      "requester": {
        "id": "uuid",
        "displayName": "田中太郎",
        "avatar": "url"
      },
      "message": "よろしくお願いします！",
      "status": "pending",
      "createdAt": "2024-08-14T..."
    }
  ],
  "total": 1
}
```

#### 友達申請承認/拒否
```
PUT /api/friends/request/:requestId
Content-Type: application/json

{
  "status": "accepted" // or "rejected"
}

Response:
{
  "success": true,
  "friendship": {
    "id": "uuid",
    "status": "accepted",
    "updatedAt": "2024-08-14T..."
  }
}
```

#### 友達一覧取得
```
GET /api/friends?search=田中

Response:
{
  "friends": [
    {
      "id": "uuid",
      "displayName": "田中太郎",
      "avatar": "url",
      "isOnline": true,
      "lastSeen": "2024-08-14T...",
      "friendship": {
        "id": "uuid",
        "createdAt": "2024-08-14T..."
      }
    }
  ],
  "total": 1
}
```

### メッセージ API

#### 会話一覧取得
```
GET /api/conversations?limit=20&offset=0

Response:
{
  "conversations": [
    {
      "id": "uuid",
      "type": "direct",
      "participants": [
        {
          "id": "uuid",
          "displayName": "田中太郎",
          "avatar": "url",
          "isOnline": true
        }
      ],
      "lastMessage": {
        "id": "uuid",
        "content": "こんにちは！",
        "createdAt": "2024-08-14T...",
        "sender": {...}
      },
      "unreadCount": 2,
      "updatedAt": "2024-08-14T..."
    }
  ],
  "total": 1
}
```

#### 会話作成/取得
```
POST /api/conversations
Content-Type: application/json

{
  "participantId": "uuid"
}

Response:
{
  "conversation": {
    "id": "uuid",
    "type": "direct",
    "participants": [...],
    "createdAt": "2024-08-14T..."
  }
}
```

#### メッセージ履歴取得
```
GET /api/conversations/:conversationId/messages?limit=50&before=messageId

Response:
{
  "messages": [
    {
      "id": "uuid",
      "content": "こんにちは！",
      "messageType": "text",
      "sender": {
        "id": "uuid",
        "displayName": "田中太郎",
        "avatar": "url"
      },
      "replyTo": null,
      "receipts": [
        {
          "userId": "uuid",
          "status": "read",
          "timestamp": "2024-08-14T..."
        }
      ],
      "createdAt": "2024-08-14T...",
      "isEdited": false
    }
  ],
  "hasMore": true
}
```

#### メッセージ送信
```
POST /api/conversations/:conversationId/messages
Content-Type: application/json

{
  "content": "こんにちは！",
  "messageType": "text",
  "replyToId": "uuid" // optional
}

Response:
{
  "message": {
    "id": "uuid",
    "content": "こんにちは！",
    "messageType": "text",
    "createdAt": "2024-08-14T...",
    "sender": {...}
  }
}
```

#### メッセージ既読
```
PUT /api/messages/:messageId/read

Response:
{
  "success": true
}
```

### ファイル送信 API

#### ファイルアップロード
```
POST /api/upload/message
Content-Type: multipart/form-data

FormData:
- file: File
- conversationId: string
- messageType: "image" | "file"

Response:
{
  "message": {
    "id": "uuid",
    "content": "画像を送信しました",
    "messageType": "image",
    "metadata": {
      "filename": "image.jpg",
      "size": 1024000,
      "url": "https://...",
      "thumbnailUrl": "https://..."
    },
    "createdAt": "2024-08-14T..."
  }
}
```

## WebSocket 通信設計

### Socket.io イベント設計

#### クライアント → サーバー

```typescript
// 接続時の認証
socket.emit('authenticate', { token: 'jwt_token' });

// 会話に参加
socket.emit('join_conversation', { conversationId: 'uuid' });

// 会話から離脱
socket.emit('leave_conversation', { conversationId: 'uuid' });

// メッセージ送信
socket.emit('send_message', {
  conversationId: 'uuid',
  content: 'こんにちは！',
  messageType: 'text',
  replyToId?: 'uuid'
});

// タイピング状態送信
socket.emit('typing_start', { conversationId: 'uuid' });
socket.emit('typing_stop', { conversationId: 'uuid' });

// オンライン状態更新
socket.emit('status_update', { isOnline: true });
```

#### サーバー → クライアント

```typescript
// 認証成功
socket.on('authenticated', { userId: 'uuid', status: 'success' });

// 新しいメッセージ受信
socket.on('message_received', {
  message: {
    id: 'uuid',
    conversationId: 'uuid',
    content: 'こんにちは！',
    sender: {...},
    createdAt: '2024-08-14T...'
  }
});

// メッセージ既読通知
socket.on('message_read', {
  messageId: 'uuid',
  userId: 'uuid',
  timestamp: '2024-08-14T...'
});

// タイピング状態受信
socket.on('user_typing', {
  conversationId: 'uuid',
  user: { id: 'uuid', displayName: '田中太郎' },
  isTyping: true
});

// ユーザーオンライン状態変更
socket.on('user_status_changed', {
  userId: 'uuid',
  isOnline: true,
  lastSeen?: '2024-08-14T...'
});

// 新しい友達申請
socket.on('friend_request_received', {
  request: {
    id: 'uuid',
    requester: {...},
    message: 'よろしくお願いします！',
    createdAt: '2024-08-14T...'
  }
});

// 友達申請承認通知
socket.on('friend_request_accepted', {
  friendship: {
    id: 'uuid',
    friend: {...},
    createdAt: '2024-08-14T...'
  }
});
```

## セキュリティ設計

### 認証・認可（統合設計）
- **JWT トークンベース認証**（全システム共通）
- **Socket.io 接続時の認証確認**
- **メッセージ送信権限の確認**（友達関係 + 会員ステータスチェック）
- **会員タイプによる機能制限**（account-system-design.mdと連携）

### 統合されたセキュリティポリシー
```typescript
// 統合セキュリティチェック例
function canSendMessage(sender: User, receiver: User): boolean {
  // 1. 会員ステータスチェック
  if (sender.membershipInfo.status !== 'active') {
    return false;
  }
  
  // 2. プライバシー設定チェック
  const receiverSettings = receiver.preferences.messaging;
  if (receiverSettings.allow_messages_from === 'nobody') {
    return false;
  }
  
  // 3. 友達関係チェック（friends_only設定の場合）
  if (receiverSettings.allow_messages_from === 'friends_only') {
    return areFriends(sender.id, receiver.id);
  }
  
  // 4. 会員タイプによる制限チェック
  const limits = MESSAGING_LIMITS_BY_MEMBERSHIP[sender.membershipInfo.type];
  return checkDailyLimits(sender.id, limits);
}
```

### プライバシー設定（統合版）
```sql
-- 既存のUserPreferencesに統合されたprivacy_settings
-- account-system-design.mdで定義済みの構造を拡張
```

### レート制限（会員タイプ統合版）
```typescript
// 会員タイプに応じた動的レート制限
function getMessageRateLimit(membershipType: MembershipType) {
  const limits = {
    general: { windowMs: 60 * 1000, max: 10 },
    supporting: { windowMs: 60 * 1000, max: 20 },
    regular: { windowMs: 60 * 1000, max: 50 },
    director: { windowMs: 60 * 1000, max: 100 }
  };
  
  return {
    ...limits[membershipType],
    message: 'メッセージ送信が制限されています'
  };
}

// 友達申請制限（会員タイプ考慮）
function getFriendRequestRateLimit(membershipType: MembershipType) {
  const limits = {
    general: { windowMs: 60 * 60 * 1000, max: 3 },
    supporting: { windowMs: 60 * 60 * 1000, max: 10 },
    regular: { windowMs: 60 * 60 * 1000, max: 25 },
    director: { windowMs: 60 * 60 * 1000, max: 50 }
  };
  
  return {
    ...limits[membershipType],
    message: '友達申請が制限されています'
  };
}
```

### データ検証
```typescript
// メッセージバリデーション
const messageSchema = {
  content: {
    type: 'string',
    minLength: 1,
    maxLength: 2000,
    required: true
  },
  messageType: {
    type: 'string',
    enum: ['text', 'image', 'file'],
    required: true
  }
};
```

## パフォーマンス最適化

### データベース最適化
```sql
-- パーティショニング（メッセージテーブル）
CREATE TABLE messages_2024_08 PARTITION OF messages
FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');

-- インデックス最適化
CREATE INDEX CONCURRENTLY idx_messages_conversation_created 
ON messages(conversation_id, created_at DESC) 
WHERE created_at > NOW() - INTERVAL '30 days';
```

### Redis キャッシュ戦略
```typescript
// オンラインユーザーキャッシュ
Redis.setex(`user:${userId}:online`, 300, 'true');

// 未読メッセージ数キャッシュ
Redis.setex(`user:${userId}:unread_count`, 60, unreadCount);

// 会話参加者キャッシュ
Redis.setex(`conversation:${conversationId}:participants`, 3600, 
  JSON.stringify(participants));
```

### Connection Pool設定
```typescript
// PostgreSQL接続プール
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 20, // 最大接続数
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 監視・ロギング

### メトリクス収集
```typescript
// Prometheus メトリクス例
const messagesSentTotal = new Counter({
  name: 'messages_sent_total',
  help: '送信されたメッセージ総数',
  labelNames: ['message_type']
});

const activeConnections = new Gauge({
  name: 'websocket_connections_active',
  help: 'アクティブなWebSocket接続数'
});
```

### ログ設計
```typescript
// 構造化ログ例
logger.info('Message sent', {
  userId: 'uuid',
  conversationId: 'uuid',
  messageType: 'text',
  timestamp: new Date().toISOString()
});

logger.warn('Rate limit exceeded', {
  userId: 'uuid',
  endpoint: '/api/messages',
  rateLimitType: 'message_sending'
});
```

## デプロイメント設計

### Docker Compose例
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/messages
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: messages
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 他システムとの統合

### タスク管理システムとの統合

#### プロジェクトチャット機能
```typescript
// タスク管理システムのプロジェクトと連動したグループチャット
interface ProjectConversation extends Conversation {
  projectId: string;  // task-management-production-design.mdのprojects.id
  taskId?: string;    // 特定のタスクに関連する会話
  type: 'project_general' | 'task_specific';
}
```

#### タスク関連通知の統合
```sql
-- タスク管理システムのnotificationsテーブルと統合
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS source_system VARCHAR(20) DEFAULT 'messaging';
-- 'messaging', 'task_management', 'general'など

-- タスク完了時の自動メッセージ例
INSERT INTO messages (conversation_id, sender_id, content, message_type)
SELECT 
  pc.conversation_id,
  'system' as sender_id,
  CONCAT('タスク「', t.title, '」が完了しました！🎉') as content,
  'system' as message_type
FROM project_conversations pc
JOIN tasks t ON pc.project_id = t.project_id
WHERE t.status = 'completed';
```

#### 共通API設計の統合
```typescript
// 統一されたJWT Payload
interface UnifiedJWTPayload {
  userId: string;
  email: string;
  displayName: string;
  
  // アカウントシステムの権限
  membershipType: 'general' | 'supporting' | 'regular' | 'director';
  
  // タスク管理システムの権限
  projectRoles: Record<string, 'owner' | 'admin' | 'member' | 'viewer'>;
  
  // メッセージング権限
  messagingPermissions: {
    canSendMessages: boolean;
    canCreateGroups: boolean;
    maxFileSize: number;
  };
  
  iat: number;
  exp: number;
}
```

### 会員システムとの統合

#### 会員特典としてのメッセージ機能
```typescript
// 会員タイプによる機能制限
const MESSAGING_LIMITS_BY_MEMBERSHIP = {
  general: {
    maxFriendsPerDay: 5,
    maxMessageLength: 1000,
    fileUploadSize: 5 * 1024 * 1024, // 5MB
    canCreateGroups: false
  },
  supporting: {
    maxFriendsPerDay: 15,
    maxMessageLength: 2000,
    fileUploadSize: 25 * 1024 * 1024, // 25MB
    canCreateGroups: true,
    maxGroupSize: 10
  },
  regular: {
    maxFriendsPerDay: 50,
    maxMessageLength: 5000,
    fileUploadSize: 100 * 1024 * 1024, // 100MB
    canCreateGroups: true,
    maxGroupSize: 50
  },
  director: {
    maxFriendsPerDay: -1, // 無制限
    maxMessageLength: -1, // 無制限
    fileUploadSize: 500 * 1024 * 1024, // 500MB
    canCreateGroups: true,
    maxGroupSize: 200
  }
};
```

## 今後の拡張予定

### フェーズ2: プロジェクト連携強化
- プロジェクト専用チャットルーム
- タスク進捗の自動通知
- ファイル共有とプロジェクト資料の統合

### フェーズ3: 高度な機能
- 音声・ビデオ通話（WebRTC）
- メッセージの暗号化
- 自動翻訳機能
- 会員向けボット統合

### フェーズ4: エンタープライズ機能
- 組織管理（既存の会員システムと連携）
- 監査ログ
- データ保持ポリシー
- シングルサインオン（SSO）

---

この設計書は、スケーラブルで安全なメッセージングシステムの基盤を提供します。
段階的な実装により、基本機能から高度な機能まで対応可能です。