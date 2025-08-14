# 本番環境タスク管理システム設計仕様書

## 概要

本ドキュメントは、現在のプロトタイプから本番環境に向けた、スケーラブルなタスク管理システムの設計仕様を定義します。

## システム要件

### 機能要件
- タスクの作成、編集、削除、ステータス変更
- プロジェクト管理とタスクの紐付け
- ユーザー認証・認可システム
- リアルタイム更新機能
- 通知システム（メール・プッシュ通知）
- ファイルアップロード・添付機能
- タスク履歴・アクティビティログ
- レポート・分析機能

### 非機能要件
- 同時接続数: 1,000ユーザー
- レスポンス時間: API < 500ms
- 可用性: 99.5%以上
- データ保持期間: 無制限
- セキュリティ: OWASP準拠

## システムアーキテクチャ

### 全体構成
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   React + TS    │────│   Node.js       │────│   PostgreSQL    │
│                 │    │   Express       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Redis Cache   │
                       │   Session Store │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │  File Storage   │
                       │   AWS S3        │
                       └─────────────────┘
```

## データベース設計

### ERD (Entity Relationship Diagram)

#### テーブル構造

```sql
-- ユーザーテーブル
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role user_role_enum DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクトテーブル
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    icon VARCHAR(50) DEFAULT '📁',
    status project_status_enum DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    owner_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクトメンバーテーブル
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role project_member_role_enum DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- タスクテーブル
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    priority task_priority_enum DEFAULT 'medium',
    status task_status_enum DEFAULT 'todo',
    category task_category_enum DEFAULT 'other',
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    due_date TIMESTAMP,
    estimated_hours INTEGER,
    actual_hours INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- タスクタグテーブル
CREATE TABLE task_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    UNIQUE(task_id, tag_name)
);

-- タスク依存関係テーブル
CREATE TABLE task_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, depends_on_task_id),
    CHECK (task_id != depends_on_task_id)
);

-- タスクコメントテーブル
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- タスク添付ファイルテーブル
CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- タスクアクティビティログテーブル
CREATE TABLE task_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type activity_type_enum NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 通知テーブル
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ENUM型定義
CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'member', 'viewer');
CREATE TYPE project_status_enum AS ENUM ('active', 'completed', 'on_hold', 'cancelled');
CREATE TYPE project_member_role_enum AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE task_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status_enum AS ENUM ('todo', 'in_progress', 'review', 'completed', 'blocked', 'cancelled');
CREATE TYPE task_category_enum AS ENUM ('development', 'design', 'marketing', 'content', 'research', 'meeting', 'other');
CREATE TYPE activity_type_enum AS ENUM ('created', 'updated', 'assigned', 'status_changed', 'commented', 'completed', 'deleted');
CREATE TYPE notification_type_enum AS ENUM ('assigned', 'due_soon', 'overdue', 'completed', 'mentioned', 'status_changed', 'comment_added');
```

### インデックス設計

```sql
-- パフォーマンス最適化のためのインデックス
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_task_activities_task_id ON task_activities(task_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- 複合インデックス
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_assignee_status ON tasks(assigned_to, status);
```

## API設計

### RESTful API エンドポイント

#### 認証関連
```
POST   /api/auth/login      - ユーザーログイン
POST   /api/auth/logout     - ユーザーログアウト
POST   /api/auth/register   - ユーザー登録
POST   /api/auth/refresh    - トークンリフレッシュ
POST   /api/auth/forgot     - パスワード忘れ
POST   /api/auth/reset      - パスワードリセット
```

#### ユーザー管理
```
GET    /api/users           - ユーザー一覧取得
GET    /api/users/:id       - ユーザー詳細取得
PUT    /api/users/:id       - ユーザー情報更新
DELETE /api/users/:id       - ユーザー削除
```

#### プロジェクト管理
```
GET    /api/projects        - プロジェクト一覧取得
POST   /api/projects        - プロジェクト作成
GET    /api/projects/:id    - プロジェクト詳細取得
PUT    /api/projects/:id    - プロジェクト更新
DELETE /api/projects/:id    - プロジェクト削除
```

#### タスク管理
```
GET    /api/tasks           - タスク一覧取得
POST   /api/tasks           - タスク作成
GET    /api/tasks/:id       - タスク詳細取得
PUT    /api/tasks/:id       - タスク更新
DELETE /api/tasks/:id       - タスク削除
PATCH  /api/tasks/:id/status - タスクステータス更新
POST   /api/tasks/bulk      - タスク一括操作
```

#### ファイル管理
```
POST   /api/files/upload    - ファイルアップロード
GET    /api/files/:id       - ファイル取得
DELETE /api/files/:id       - ファイル削除
```

### WebSocket イベント

#### クライアント → サーバー
```typescript
// プロジェクトルームに参加
socket.emit('join_project', { projectId: string });

// タスクルームに参加
socket.emit('join_task', { taskId: string });

// タスク更新開始（排他制御）
socket.emit('start_editing_task', { taskId: string });

// タスク更新終了
socket.emit('stop_editing_task', { taskId: string });
```

#### サーバー → クライアント
```typescript
// タスク更新通知
socket.emit('task_updated', { taskId: string, task: Task, updatedBy: string });

// タスク削除通知
socket.emit('task_deleted', { taskId: string, deletedBy: string });

// 新しいコメント通知
socket.emit('comment_added', { taskId: string, comment: Comment, author: string });

// ユーザーがタスクを編集中
socket.emit('user_editing_task', { taskId: string, user: string });
```

## セキュリティ設計

### 認証・認可

#### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  iat: number;
  exp: number;
}
```

#### ロールベースアクセス制御
```typescript
const permissions = {
  admin: ['*'],
  manager: [
    'projects:create', 'projects:update', 'projects:delete',
    'tasks:create', 'tasks:update', 'tasks:delete',
    'users:read', 'users:invite'
  ],
  member: [
    'projects:read',
    'tasks:create', 'tasks:update', 'tasks:read',
    'comments:create', 'files:upload'
  ],
  viewer: [
    'projects:read', 'tasks:read', 'comments:read'
  ]
};
```

### データ保護
- パスワード: bcrypt (salt rounds: 12)
- API通信: HTTPS必須
- CORS設定: 本番ドメインのみ許可
- Rate Limiting: 1分間に100リクエスト
- SQL Injection対策: Prepared Statements
- XSS対策: Content Security Policy

## パフォーマンス最適化

### キャッシュ戦略

#### Redis キャッシュ
```typescript
// セッション情報 (TTL: 24時間)
`session:${sessionId}` → UserSession

// ユーザー情報 (TTL: 1時間)
`user:${userId}` → User

// プロジェクト情報 (TTL: 30分)
`project:${projectId}` → Project

// タスク一覧 (TTL: 10分)
`tasks:${projectId}:${filters}` → Task[]
```

#### データベース最適化
- 接続プール: 最大20接続
- クエリタイムアウト: 30秒
- 読み取り専用レプリカの活用
- パーティショニング (作成日ベース)

### モニタリング

#### メトリクス
- API レスポンス時間
- データベースクエリ実行時間
- WebSocket接続数
- エラー発生率
- メモリ使用量

#### アラート
- レスポンス時間 > 1秒
- エラー率 > 5%
- データベース接続失敗
- ディスク使用量 > 80%

## デプロイメント設計

### インフラ構成 (AWS)

```yaml
Production Environment:
  - Application: ECS Fargate (Auto Scaling)
  - Database: RDS PostgreSQL (Multi-AZ)
  - Cache: ElastiCache Redis (Cluster Mode)
  - File Storage: S3 + CloudFront
  - Load Balancer: ALB
  - Monitoring: CloudWatch + DataDog

Staging Environment:
  - Application: ECS Fargate (Fixed Size)
  - Database: RDS PostgreSQL (Single-AZ)
  - Cache: ElastiCache Redis (Single Node)
  - File Storage: S3
```

### CI/CD パイプライン

```yaml
name: Production Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    - Unit Tests
    - Integration Tests
    - E2E Tests
    
  build:
    - Build Docker Image
    - Push to ECR
    
  deploy:
    - Database Migration
    - Blue/Green Deployment
    - Health Check
    - Rollback on Failure
```

## 運用・保守

### バックアップ戦略
- データベース: 日次自動バックアップ (7日保持)
- ファイル: S3 Cross-Region Replication
- アプリケーション: Docker Image保持 (直近10バージョン)

### ログ管理
- アプリケーションログ: CloudWatch Logs
- アクセスログ: ALB Access Logs → S3
- データベースログ: CloudWatch Logs
- 保持期間: 90日

### スケーリング戦略
- 水平スケーリング: CPU使用率 > 70%で自動スケールアウト
- 垂直スケーリング: メモリ使用量監視
- データベース: Read Replicaの追加

## 移行計画

### フェーズ1: 基盤構築 (4週間)
1. インフラ環境構築
2. データベースセットアップ
3. 基本API実装
4. 認証システム実装

### フェーズ2: コア機能実装 (6週間)
1. タスク管理機能
2. プロジェクト管理機能
3. ユーザー管理機能
4. ファイル管理機能

### フェーズ3: 高度な機能 (4週間)
1. リアルタイム機能
2. 通知システム
3. レポート機能
4. パフォーマンス最適化

### フェーズ4: 本番移行 (2週間)
1. 負荷テスト
2. セキュリティ監査
3. 本番デプロイ
4. 運用監視開始

## 概算コスト (月額)

### AWS インフラ
- ECS Fargate: $200
- RDS PostgreSQL: $300
- ElastiCache: $150
- S3 + CloudFront: $100
- ALB + その他: $100
- **合計: $850/月**

### 開発・運用
- 開発者 (2名): $16,000
- DevOps: $8,000
- **合計: $24,000/月**

**総コスト: $24,850/月**

## 終わりに

本設計書は現在のプロトタイプを本番環境に適用するための包括的な設計を提供しています。実装時は段階的なアプローチを取り、各フェーズでのテストと検証を確実に実施することが重要です。