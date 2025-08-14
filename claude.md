# CORAL 統合プラットフォーム設計

## 概要

CORALサイトの統合プラットフォーム設計です。Headless WordPress CMSによるコンテンツ管理と、プロジェクト・タスク管理システムを統合し、編集ワークフローの効率化とスケーラビリティを実現します。

## 統合アーキテクチャ概要

### システム構成
```
┌─────────────────────────────────────────────────┐
│              Frontend (React 19)                │
├─────────────────┬───────────────────────────────┤
│   Content CMS   │    Project Management        │
│   (WordPress)   │    (Custom Backend)          │
├─────────────────┼───────────────────────────────┤
│         Unified Authentication (JWT)            │
├─────────────────┼───────────────────────────────┤
│    PostgreSQL   │         Redis Cache          │
│  (Main Database)│     (Session & Cache)        │
└─────────────────┴───────────────────────────────┘
```

### 統合の利点
- **Single Sign-On**: 1つの認証で全機能利用
- **編集ワークフロー**: 記事執筆タスクとコンテンツの連携
- **統合ダッシュボード**: コンテンツ管理とプロジェクト管理の一元化
- **リアルタイム同期**: 記事ステータスとタスク進捗の即時反映

### フロントエンド構成
- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite 6.3.4
- **スタイリング**: Emotion (`@emotion/react`, `@emotion/styled`)
- **状態管理**: React Query + Context API (統合状態管理)
- **リアルタイム通信**: Socket.io
- **ルーティング**: React Router DOM 7.2.0
- **デプロイ**: Vercel

### バックエンド構成
- **API Gateway**: Node.js + Express
- **データベース**: PostgreSQL (統合ユーザー・プロジェクト・タスク)
- **CMS**: WordPress (Headless, コンテンツ専用)
- **キャッシュ**: Redis
- **リアルタイム**: Socket.io
- **認証**: JWT (統合認証システム)

---

# 統合認証システム設計

## 統一ユーザー管理

### ユーザーモデル設計
```typescript
interface UnifiedUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  wordpress_id?: number; // WordPressとの連携用
  roles: {
    cms: 'admin' | 'editor' | 'author' | 'contributor' | 'viewer';
    projects: 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
  };
  permissions: string[]; // ['read:articles', 'write:articles', 'manage:projects']
  is_active: boolean;
  last_login: Date;
  created_at: Date;
  updated_at: Date;
}
```

### データベース設計
```sql
-- 統合ユーザーテーブル
CREATE TABLE unified_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  wordpress_id INTEGER UNIQUE, -- WordPressユーザーID
  password_hash VARCHAR(255), -- 統合認証用
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 権限管理テーブル
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES unified_users(id) ON DELETE CASCADE,
  service VARCHAR(50) NOT NULL, -- 'cms' | 'projects'
  permission VARCHAR(100) NOT NULL, -- 'read:articles', 'manage:projects'
  granted_by UUID REFERENCES unified_users(id),
  granted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- 期限付き権限
  UNIQUE(user_id, service, permission)
);

-- セッション管理テーブル
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES unified_users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  device_info JSONB,
  ip_address INET,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### JWT統合設計
```typescript
interface UnifiedJWT {
  sub: string; // user_id
  email: string;
  name: string;
  permissions: {
    cms: string[];      // ['read:articles', 'write:articles', 'manage:media']
    projects: string[]; // ['read:tasks', 'write:tasks', 'manage:projects']
  };
  wordpress_token?: string; // WordPress API用トークン
  session_id: string;
  iat: number;
  exp: number;
}

// 認証サービス
export class UnifiedAuthService {
  async login(email: string, password: string): Promise<{
    user: UnifiedUser;
    accessToken: string;
    refreshToken: string;
  }> {
    // 1. ユーザー認証
    const user = await this.authenticateUser(email, password);
    
    // 2. WordPress連携確認
    if (user.wordpress_id) {
      const wpToken = await this.getWordPressToken(user.wordpress_id);
      user.wordpress_token = wpToken;
    }
    
    // 3. 権限取得
    const permissions = await this.getUserPermissions(user.id);
    
    // 4. JWT生成
    const accessToken = this.generateAccessToken(user, permissions);
    const refreshToken = this.generateRefreshToken(user.id);
    
    // 5. セッション記録
    await this.createSession(user.id, refreshToken);
    
    return { user, accessToken, refreshToken };
  }

  private async getUserPermissions(userId: string): Promise<{
    cms: string[];
    projects: string[];
  }> {
    const permissions = await UserPermission.findAll({
      where: { userId, expiresAt: { [Op.or]: [null, { [Op.gt]: new Date() }] } }
    });

    return permissions.reduce((acc, perm) => {
      if (!acc[perm.service as keyof typeof acc]) {
        acc[perm.service as keyof typeof acc] = [];
      }
      acc[perm.service as keyof typeof acc].push(perm.permission);
      return acc;
    }, { cms: [] as string[], projects: [] as string[] });
  }
}
```

---

# 統合API設計

## APIゲートウェイアーキテクチャ

### 統合エンドポイント構成
```typescript
// 統合APIルーティング
const apiRoutes = {
  // 認証関連
  auth: {
    'POST /auth/login': 'UnifiedAuthController.login',
    'POST /auth/logout': 'UnifiedAuthController.logout',
    'POST /auth/refresh': 'UnifiedAuthController.refresh',
    'GET /auth/me': 'UnifiedAuthController.getProfile',
    'PUT /auth/profile': 'UnifiedAuthController.updateProfile'
  },

  // コンテンツ管理 (WordPress統合)
  content: {
    'GET /api/articles': 'ContentController.getArticles',
    'GET /api/articles/:slug': 'ContentController.getArticle',
    'POST /api/articles': 'ContentController.createArticle',
    'PUT /api/articles/:id': 'ContentController.updateArticle',
    'DELETE /api/articles/:id': 'ContentController.deleteArticle',
    'GET /api/categories': 'ContentController.getCategories',
    'GET /api/media': 'ContentController.getMedia',
    'POST /api/media': 'ContentController.uploadMedia'
  },

  // プロジェクト管理
  projects: {
    'GET /api/projects': 'ProjectController.getProjects',
    'POST /api/projects': 'ProjectController.createProject',
    'GET /api/projects/:id': 'ProjectController.getProject',
    'PUT /api/projects/:id': 'ProjectController.updateProject',
    'GET /api/projects/:id/tasks': 'ProjectController.getTasks',
    'GET /api/projects/:id/board': 'ProjectController.getKanbanBoard'
  },

  // タスク管理
  tasks: {
    'GET /api/tasks': 'TaskController.getTasks',
    'POST /api/tasks': 'TaskController.createTask',
    'GET /api/tasks/:id': 'TaskController.getTask',
    'PUT /api/tasks/:id': 'TaskController.updateTask',
    'PATCH /api/tasks/:id/status': 'TaskController.updateStatus',
    'DELETE /api/tasks/:id': 'TaskController.deleteTask'
  },

  // 統合機能 (編集ワークフロー)
  editorial: {
    'POST /api/editorial/workflows': 'EditorialController.createWorkflow',
    'GET /api/editorial/workflows': 'EditorialController.getWorkflows',
    'GET /api/editorial/workflows/:id': 'EditorialController.getWorkflow',
    'PUT /api/editorial/workflows/:id': 'EditorialController.updateWorkflow',
    'POST /api/editorial/workflows/:id/advance': 'EditorialController.advanceStage'
  }
};
```

### 統合ミドルウェア
```typescript
// 権限チェックミドルウェア
export const requirePermission = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as UnifiedJWT;
      
      // 権限チェック
      const hasPermission = permissions.some(perm => {
        const [service] = perm.split(':');
        return decoded.permissions[service as keyof typeof decoded.permissions]?.includes(perm);
      });

      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

// WordPress統合ミドルウェア
export const withWordPressAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.wordpress_token) {
    // WordPressAPIクライアントにトークンを設定
    req.wpAPI = createWordPressClient({
      baseURL: WP_API_URL,
      headers: { Authorization: `Bearer ${req.user.wordpress_token}` }
    });
  }
  next();
};
```

## 編集ワークフロー統合

### ワークフロー設計
```typescript
// 編集ワークフロー型定義
interface EditorialWorkflow {
  id: string;
  title: string;
  description: string;
  article_id?: number; // WordPress記事ID
  article_slug?: string;
  project_id: string;
  assigned_author: string;
  assigned_editor?: string;
  stage: WorkflowStage;
  due_date: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  tasks: WorkflowTask[];
  created_at: Date;
  updated_at: Date;
}

type WorkflowStage = 
  | 'idea'        // アイデア段階
  | 'planning'    // 企画・構成
  | 'writing'     // 執筆中
  | 'review'      // レビュー中
  | 'editing'     // 編集中
  | 'approval'    // 承認待ち
  | 'scheduled'   // 公開予約
  | 'published'   // 公開済み
  | 'archived';   // アーカイブ

interface WorkflowTask {
  id: string;
  workflow_id: string;
  task_id: string; // タスク管理システムのタスクID
  stage: WorkflowStage;
  title: string;
  is_required: boolean;
  is_completed: boolean;
  assigned_to?: string;
  due_date?: Date;
}
```

### データベーススキーマ
```sql
-- 編集ワークフローテーブル
CREATE TABLE editorial_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  article_id INTEGER, -- WordPressの記事ID
  article_slug VARCHAR(255),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  assigned_author UUID REFERENCES unified_users(id),
  assigned_editor UUID REFERENCES unified_users(id),
  stage workflow_stage_enum DEFAULT 'idea',
  due_date TIMESTAMP,
  priority priority_enum DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE workflow_stage_enum AS ENUM (
  'idea', 'planning', 'writing', 'review', 'editing', 
  'approval', 'scheduled', 'published', 'archived'
);

-- ワークフロータスク連携テーブル  
CREATE TABLE workflow_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES editorial_workflows(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  stage workflow_stage_enum NOT NULL,
  is_required BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ワークフロー進捗履歴
CREATE TABLE workflow_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES editorial_workflows(id) ON DELETE CASCADE,
  from_stage workflow_stage_enum,
  to_stage workflow_stage_enum NOT NULL,
  changed_by UUID REFERENCES unified_users(id),
  comment TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 編集ワークフロー統合サービス
```typescript
export class EditorialWorkflowService {
  constructor(
    private wordpressAPI: WordPressAPI,
    private taskAPI: TaskAPI,
    private socketIO: Server
  ) {}

  // 新しい編集ワークフローを作成
  async createWorkflow(data: CreateWorkflowData): Promise<EditorialWorkflow> {
    const transaction = await db.transaction();
    
    try {
      // 1. ワークフロー作成
      const workflow = await EditorialWorkflow.create({
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assignedAuthor: data.assignedAuthor,
        assignedEditor: data.assignedEditor,
        stage: 'idea',
        dueDate: data.dueDate,
        priority: data.priority,
        tags: data.tags
      }, { transaction });

      // 2. WordPressで下書き作成（オプション）
      let wpArticle = null;
      if (data.createDraft) {
        wpArticle = await this.wordpressAPI.createArticle({
          title: data.title,
          content: data.description || '',
          status: 'draft',
          categories: data.categories,
          tags: data.tags
        });

        await workflow.update({
          articleId: wpArticle.id,
          articleSlug: wpArticle.slug
        }, { transaction });
      }

      // 3. 関連タスクを自動生成
      const tasks = await this.createWorkflowTasks(workflow, transaction);

      await transaction.commit();

      // 4. リアルタイム通知
      this.socketIO.to(`project:${workflow.projectId}`).emit('workflow_created', {
        workflow,
        tasks,
        article: wpArticle
      });

      return workflow;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ワークフローステージを進行
  async advanceStage(
    workflowId: string, 
    newStage: WorkflowStage,
    userId: string,
    comment?: string
  ): Promise<EditorialWorkflow> {
    const workflow = await EditorialWorkflow.findByPk(workflowId, {
      include: [{ model: WorkflowTask, include: [Task] }]
    });

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const transaction = await db.transaction();
    
    try {
      const oldStage = workflow.stage;

      // 1. ワークフロー更新
      await workflow.update({ stage: newStage }, { transaction });

      // 2. 履歴記録
      await WorkflowHistory.create({
        workflowId,
        fromStage: oldStage,
        toStage: newStage,
        changedBy: userId,
        comment
      }, { transaction });

      // 3. WordPress記事ステータス同期
      if (workflow.articleId) {
        await this.syncArticleStatus(workflow.articleId, newStage);
      }

      // 4. 関連タスクの自動完了/作成
      await this.handleStageTransition(workflow, oldStage, newStage, transaction);

      await transaction.commit();

      // 5. リアルタイム通知
      this.socketIO.to(`project:${workflow.projectId}`).emit('workflow_stage_changed', {
        workflowId,
        fromStage: oldStage,
        toStage: newStage,
        changedBy: userId,
        timestamp: new Date()
      });

      return workflow.reload();
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ステージ遷移時の自動処理
  private async handleStageTransition(
    workflow: EditorialWorkflow,
    fromStage: WorkflowStage,
    toStage: WorkflowStage,
    transaction: Transaction
  ) {
    const stageTaskMap = {
      'writing': '執筆',
      'review': 'レビュー',
      'editing': '編集',
      'approval': '承認'
    };

    // 前のステージのタスクを完了
    if (stageTaskMap[fromStage as keyof typeof stageTaskMap]) {
      const taskKeyword = stageTaskMap[fromStage as keyof typeof stageTaskMap];
      const workflowTasks = await WorkflowTask.findAll({
        where: { workflowId: workflow.id, stage: fromStage },
        include: [{ model: Task, where: { title: { [Op.like]: `%${taskKeyword}%` } } }]
      });

      for (const workflowTask of workflowTasks) {
        await workflowTask.task.update({ status: 'completed' }, { transaction });
        await workflowTask.update({ isCompleted: true }, { transaction });
      }
    }

    // 新しいステージのタスクを作成
    if (stageTaskMap[toStage as keyof typeof stageTaskMap]) {
      const taskKeyword = stageTaskMap[toStage as keyof typeof stageTaskMap];
      const newTask = await this.taskAPI.createTask({
        title: `${taskKeyword}: ${workflow.title}`,
        description: `記事「${workflow.title}」の${taskKeyword}を行う`,
        category: 'content',
        priority: workflow.priority,
        status: 'todo',
        projectId: workflow.projectId,
        assignedTo: toStage === 'writing' ? workflow.assignedAuthor : workflow.assignedEditor,
        dueDate: workflow.dueDate
      }, transaction);

      await WorkflowTask.create({
        workflowId: workflow.id,
        taskId: newTask.id,
        stage: toStage,
        isRequired: true
      }, { transaction });
    }
  }

  // WordPress記事ステータス同期
  private async syncArticleStatus(articleId: number, stage: WorkflowStage) {
    const statusMap = {
      'idea': 'draft',
      'planning': 'draft',
      'writing': 'draft',
      'review': 'pending',
      'editing': 'pending',
      'approval': 'pending',
      'scheduled': 'future',
      'published': 'publish',
      'archived': 'private'
    };

    const wpStatus = statusMap[stage];
    if (wpStatus) {
      await this.wordpressAPI.updateArticle(articleId, {
        status: wpStatus,
        meta: {
          editorial_stage: stage,
          last_stage_update: new Date().toISOString()
        }
      });
    }
  }

  // ワークフロー用タスクを自動生成
  private async createWorkflowTasks(
    workflow: EditorialWorkflow,
    transaction: Transaction
  ): Promise<Task[]> {
    const taskTemplates = [
      {
        title: `企画: ${workflow.title}`,
        description: '記事の企画・構成を検討する',
        stage: 'planning' as WorkflowStage,
        assignedTo: workflow.assignedAuthor,
        category: 'content' as const,
        estimatedHours: 2
      },
      {
        title: `執筆: ${workflow.title}`,
        description: '記事の執筆を行う',
        stage: 'writing' as WorkflowStage,
        assignedTo: workflow.assignedAuthor,
        category: 'content' as const,
        estimatedHours: 6
      },
      {
        title: `レビュー: ${workflow.title}`,
        description: '記事のレビュー・校正を行う',
        stage: 'review' as WorkflowStage,
        assignedTo: workflow.assignedEditor,
        category: 'content' as const,
        estimatedHours: 2
      }
    ];

    const tasks: Task[] = [];
    
    for (const template of taskTemplates) {
      const task = await this.taskAPI.createTask({
        title: template.title,
        description: template.description,
        category: template.category,
        priority: workflow.priority,
        status: template.stage === 'planning' ? 'todo' : 'blocked',
        projectId: workflow.projectId,
        assignedTo: template.assignedTo,
        dueDate: workflow.dueDate,
        estimatedHours: template.estimatedHours,
        tags: [...workflow.tags, 'editorial']
      }, transaction);

      await WorkflowTask.create({
        workflowId: workflow.id,
        taskId: task.id,
        stage: template.stage,
        isRequired: true
      }, { transaction });

      tasks.push(task);
    }

    return tasks;
  }
}
```

---

# Headless WordPress CMS アーキテクチャ

### WordPress設定

#### 1. WordPress インスタンス設定
- **ホスティング**: WordPress.com Business / WP Engine / 独自サーバー
- **ドメイン**: cms.coral-news.com（推奨）
- **SSL**: 必須
- **PHP**: 8.1以上推奨

#### 2. 必要プラグイン
```
- WPGraphQL（GraphQL API）
- Advanced Custom Fields（カスタムフィールド）
- Yoast SEO（SEO最適化）
- JWT Authentication（認証）
- CORS Headers（CORS設定）
- WP REST API Cache（キャッシュ）
```

#### 3. カスタム投稿タイプ
```php
// functions.php
register_post_type('article', [
    'public' => true,
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'article',
    'graphql_plural_name' => 'articles',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
    'taxonomies' => ['category', 'post_tag']
]);
```

### データスキーマ

#### 記事エンティティ
```typescript
interface WordPressArticle {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  acf: {
    featured_image_alt?: string;
    article_subtitle?: string;
    reading_time?: number;
    author_bio?: string;
    related_articles?: number[];
  };
  _embedded: {
    'wp:featuredmedia': Array<{
      source_url: string;
      alt_text: string;
      media_details: {
        sizes: {
          thumbnail: { source_url: string };
          medium: { source_url: string };
          large: { source_url: string };
          full: { source_url: string };
        };
      };
    }>;
    'wp:term': Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}
```

## フロントエンド実装

### 1. API設定

#### 環境変数 (.env.local)
```env
VITE_WP_API_URL=https://cms.coral-news.com/wp-json/wp/v2
VITE_WP_GRAPHQL_URL=https://cms.coral-news.com/graphql
VITE_WP_AUTH_TOKEN=your_jwt_token
```

#### APIクライアント (src/lib/wordpress.ts)
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_WP_API_URL;

export const wpApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API関数
export const wordPressAPI = {
  // 記事一覧取得
  getArticles: async (params?: {
    page?: number;
    per_page?: number;
    categories?: string;
    tags?: string;
    search?: string;
  }) => {
    const { data } = await wpApi.get('/articles', {
      params: {
        ...params,
        _embed: true, // メディアとタクソノミー情報を含める
      },
    });
    return data;
  },

  // 記事詳細取得
  getArticle: async (slug: string) => {
    const { data } = await wpApi.get('/articles', {
      params: {
        slug,
        _embed: true,
      },
    });
    return data[0];
  },

  // カテゴリー一覧
  getCategories: async () => {
    const { data } = await wpApi.get('/categories');
    return data;
  },

  // タグ一覧
  getTags: async () => {
    const { data } = await wpApi.get('/tags');
    return data;
  },
};
```

### 2. React Query統合

#### パッケージ追加
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

#### Query Client設定 (src/lib/queryClient.ts)
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分
      gcTime: 1000 * 60 * 30, // 30分（旧cacheTime）
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 3. カスタムフック (src/hooks/useWordPress.ts)

```typescript
import { useQuery } from '@tanstack/react-query';
import { wordPressAPI } from '@/lib/wordpress';

export function useArticles(params?: {
  page?: number;
  per_page?: number;
  categories?: string;
  tags?: string;
}) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => wordPressAPI.getArticles(params),
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => wordPressAPI.getArticle(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => wordPressAPI.getCategories(),
  });
}
```

### 4. コンポーネントの更新

#### ArticleCard コンポーネント
```typescript
import { WordPressArticle } from '@/types/wordpress';

interface ArticleCardProps {
  article: WordPressArticle;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const featuredImage = article._embedded?.['wp:featuredmedia']?.[0];
  const categories = article._embedded?.['wp:term']?.[0] || [];
  
  return (
    <FeaturedArticle>
      <ArticleBackground
        style={{
          backgroundImage: `url(${featuredImage?.source_url})`,
        }}
      />
      <ArticleContent>
        <ArticleTag>
          {categories[0]?.name || 'ニュース'}
        </ArticleTag>
        <ArticleTitle>
          {article.title.rendered}
        </ArticleTitle>
        <ArticleMeta>
          <span>{new Date(article.date).toLocaleDateString('ja-JP')}</span>
        </ArticleMeta>
      </ArticleContent>
    </FeaturedArticle>
  );
};
```

## データ移行計画

### 1. フェーズ1: WordPress環境構築（1週間）
- WordPressインスタンスのセットアップ
- 必要プラグインのインストールと設定
- カスタム投稿タイプとフィールドの作成
- REST API/GraphQLの設定とテスト

### 2. フェーズ2: フロントエンド統合（1-2週間）
- React Query の統合
- WordPress API クライアントの実装
- 既存コンポーネントのWordPressデータ対応
- ルーティングの動的化

### 3. フェーズ3: コンテンツ移行（1週間）
- 既存記事のWordPressへの移行
- 画像ファイルのWordPressメディアライブラリへ移行
- カテゴリーとタグの設定
- SEO設定の移行

### 4. フェーズ4: 最適化とテスト（1週間）
- パフォーマンス最適化
- キャッシュ戦略の実装
- エラーハンドリング強化
- プロダクション環境での検証

## パフォーマンス最適化

### 1. キャッシュ戦略
```typescript
// ISR相当の実装
export async function generateStaticParams() {
  const articles = await wordPressAPI.getArticles({ per_page: 100 });
  return articles.map((article: WordPressArticle) => ({
    slug: article.slug,
  }));
}
```

### 2. 画像最適化
- WordPressの画像最適化プラグイン（Smush, Optimole）
- レスポンシブ画像の自動生成
- WebP対応

### 3. CDNとキャッシュ
```typescript
// Vercel Edge Functions活用
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const response = await wordPressAPI.getArticles();
  
  return new Response(JSON.stringify(response), {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'Content-Type': 'application/json',
    },
  });
}
```

## SEO対策

### 1. メタデータ管理
```typescript
// WordPressからSEOデータ取得
export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  const article = await wordPressAPI.getArticle(params.slug);
  
  return {
    title: article.title.rendered,
    description: article.excerpt.rendered.replace(/<[^>]*>/g, ''),
    openGraph: {
      title: article.title.rendered,
      description: article.excerpt.rendered.replace(/<[^>]*>/g, ''),
      images: [article._embedded?.['wp:featuredmedia']?.[0]?.source_url],
    },
  };
};
```

### 2. サイトマップ自動生成
- WordPress XML Sitemaps プラグイン活用
- フロントエンドでのサイトマップ統合

## セキュリティ対策

### 1. WordPress セキュリティ
- ログインページの変更
- 2FA認証の有効化
- セキュリティプラグイン（Wordfence）
- 定期的なバックアップ

### 2. API セキュリティ
```php
// JWT認証設定
add_filter('jwt_auth_whitelist', function($whitelist) {
    $whitelist[] = '/wp-json/wp/v2/articles';
    return $whitelist;
});
```

## 運用とメンテナンス

### 1. 自動化
- GitHub Actions でのデプロイ自動化
- WordPressプラグインの自動更新
- セキュリティ監視

### 2. バックアップ戦略
- 毎日の自動バックアップ
- AWS S3 / Google Cloud Storage連携
- 復旧手順の文書化

### 3. 監視
- Uptime監視（UptimeRobot）
- パフォーマンス監視（New Relic）
- エラー監視（Sentry）

## 必要リソース

### 技術的要件
- WordPress ホスティング: $20-100/月
- CDN (Cloudflare): 無料-$20/月
- 監視ツール: $10-50/月

### 開発工数
- 総工数: 4-5週間（1人）
- WordPress構築: 1週間
- フロントエンド実装: 1-2週間
- 移行作業: 1週間
- テスト・最適化: 1週間

## 次のステップ

1. WordPress ホスティング環境の決定
2. ドメイン設定（cms.coral-news.com）
3. WordPress プラグインの検証
4. プロトタイプ開発の開始

このアーキテクチャにより、コンテンツ管理の効率化とスケーラビリティの向上を実現できます。

---

# 統合フロントエンド設計

## 統合状態管理アーキテクチャ

### グローバル状態設計
```typescript
// 統合アプリケーション状態
interface UnifiedAppState {
  // 認証・ユーザー状態
  auth: {
    user: UnifiedUser | null;
    isAuthenticated: boolean;
    permissions: {
      cms: string[];
      projects: string[];
    };
    loading: boolean;
  };

  // コンテンツ管理状態
  content: {
    articles: Article[];
    categories: Category[];
    media: MediaItem[];
    workflows: EditorialWorkflow[];
    loading: {
      articles: boolean;
      workflows: boolean;
    };
    filters: {
      category?: string;
      status?: string;
      author?: string;
    };
  };

  // プロジェクト管理状態
  projects: {
    projects: Project[];
    currentProject?: Project;
    tasks: Task[];
    boards: { [projectId: string]: KanbanBoard };
    loading: {
      projects: boolean;
      tasks: boolean;
      boards: boolean;
    };
    filters: TaskFilter;
  };

  // UI状態
  ui: {
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;
    activeView: 'dashboard' | 'content' | 'projects' | 'workflows';
    modals: {
      createTask: boolean;
      createWorkflow: boolean;
      createArticle: boolean;
    };
    notifications: Notification[];
  };

  // リアルタイム状態
  realtime: {
    connected: boolean;
    joinedRooms: string[];
    lastUpdate: Date;
  };
}
```

### 統合Contextプロバイダー
```typescript
// 統合アプリケーションプロバイダー
export const UnifiedAppProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(unifiedReducer, initialState);
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);

  // 認証状態の監視
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !state.auth.isAuthenticated) {
      dispatch({ type: 'AUTH_RESTORE_SESSION', payload: { token } });
    }
  }, []);

  // Socket.io接続管理
  useEffect(() => {
    if (state.auth.isAuthenticated && !socket) {
      const newSocket = io(API_BASE_URL, {
        auth: { token: localStorage.getItem('auth_token') }
      });

      // 接続イベント
      newSocket.on('connect', () => {
        dispatch({ type: 'REALTIME_CONNECTED' });
        
        // プロジェクトルームに自動参加
        if (state.projects.currentProject) {
          newSocket.emit('join-project', state.projects.currentProject.id);
        }
        
        // ユーザータスクルームに参加
        newSocket.emit('join-user-tasks');
      });

      // リアルタイムイベントリスナー
      newSocket.on('task_updated', (data) => {
        dispatch({ type: 'TASK_UPDATED', payload: data.task });
        queryClient.setQueryData(['tasks'], (old: Task[]) => 
          old?.map(task => task.id === data.task.id ? data.task : task)
        );
        
        // 通知表示
        if (data.task.assignedTo === state.auth.user?.id) {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now().toString(),
              type: 'info',
              title: 'タスク更新',
              message: `「${data.task.title}」が更新されました`,
              timestamp: new Date()
            }
          });
        }
      });

      newSocket.on('workflow_stage_changed', (data) => {
        dispatch({ type: 'WORKFLOW_STAGE_CHANGED', payload: data });
        
        // ワークフロー一覧を更新
        queryClient.invalidateQueries(['workflows']);
      });

      newSocket.on('article_updated', (data) => {
        dispatch({ type: 'ARTICLE_UPDATED', payload: data.article });
        queryClient.setQueryData(['articles'], (old: Article[]) =>
          old?.map(article => article.id === data.article.id ? data.article : article)
        );
      });

      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        dispatch({ type: 'REALTIME_DISCONNECTED' });
      }
    };
  }, [state.auth.isAuthenticated]);

  const contextValue = {
    state,
    dispatch,
    socket,
    
    // 便利なヘルパー関数
    helpers: {
      hasPermission: (permission: string) => {
        const [service] = permission.split(':');
        return state.auth.permissions[service as keyof typeof state.auth.permissions]?.includes(permission) ?? false;
      },
      
      joinProject: (projectId: string) => {
        socket?.emit('join-project', projectId);
        dispatch({ type: 'JOIN_PROJECT_ROOM', payload: projectId });
      },
      
      leaveProject: (projectId: string) => {
        socket?.emit('leave-project', projectId);
        dispatch({ type: 'LEAVE_PROJECT_ROOM', payload: projectId });
      },

      showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date()
          }
        });
      }
    }
  };

  return (
    <UnifiedAppContext.Provider value={contextValue}>
      {children}
    </UnifiedAppContext.Provider>
  );
};
```

## 統合ダッシュボードコンポーネント

### メインダッシュボード
```typescript
// 統合ダッシュボード
const UnifiedDashboard: React.FC = () => {
  const { state, helpers } = useUnifiedApp();
  const { user, isAuthenticated } = state.auth;
  
  // ユーザーのタスクと担当ワークフローを取得
  const { data: userTasks } = useQuery({
    queryKey: ['user-tasks', user?.id],
    queryFn: () => taskAPI.getUserTasks(user!.id),
    enabled: !!user
  });

  const { data: userWorkflows } = useQuery({
    queryKey: ['user-workflows', user?.id],
    queryFn: () => editorialAPI.getUserWorkflows(user!.id),
    enabled: !!user
  });

  const { data: recentArticles } = useQuery({
    queryKey: ['recent-articles'],
    queryFn: () => contentAPI.getRecentArticles(5),
    staleTime: 5 * 60 * 1000 // 5分
  });

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <DashboardLayout>
      <DashboardHeader>
        <WelcomeSection user={user} />
        <QuickActions />
      </DashboardHeader>

      <DashboardGrid>
        {/* タスク概要 */}
        <DashboardCard title="📋 マイタスク" colSpan={1}>
          <TaskSummaryWidget 
            tasks={userTasks} 
            onViewAll={() => helpers.dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'projects' })}
          />
        </DashboardCard>

        {/* 編集ワークフロー */}
        <DashboardCard title="✍️ 担当記事" colSpan={1}>
          <WorkflowSummaryWidget 
            workflows={userWorkflows}
            onViewAll={() => helpers.dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'workflows' })}
          />
        </DashboardCard>

        {/* 最近の記事 */}
        <DashboardCard title="📰 最新記事" colSpan={2}>
          <ArticleSummaryWidget 
            articles={recentArticles}
            onViewAll={() => helpers.dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'content' })}
          />
        </DashboardCard>

        {/* アクティビティフィード */}
        <DashboardCard title="🔔 最新アクティビティ" colSpan={1}>
          <ActivityFeedWidget />
        </DashboardCard>

        {/* 統計情報 */}
        <DashboardCard title="📊 統計" colSpan={1}>
          <DashboardStatsWidget />
        </DashboardCard>
      </DashboardGrid>
    </DashboardLayout>
  );
};

// タスク概要ウィジェット
const TaskSummaryWidget: React.FC<{
  tasks?: Task[];
  onViewAll: () => void;
}> = ({ tasks = [], onViewAll }) => {
  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      overdue: tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length
    };
  }, [tasks]);

  const urgentTasks = useMemo(() => 
    tasks
      .filter(t => t.priority === 'urgent' && t.status !== 'completed')
      .slice(0, 3),
    [tasks]
  );

  return (
    <WidgetContainer>
      <StatsGrid>
        <StatItem>
          <StatValue color="#3b82f6">{taskStats.total}</StatValue>
          <StatLabel>総タスク</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue color="#f59e0b">{taskStats.inProgress}</StatValue>
          <StatLabel>進行中</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue color="#ef4444">{taskStats.overdue}</StatValue>
          <StatLabel>期限切れ</StatLabel>
        </StatItem>
      </StatsGrid>

      {urgentTasks.length > 0 && (
        <UrgentTasksList>
          <SectionTitle>🚨 緊急タスク</SectionTitle>
          {urgentTasks.map(task => (
            <TaskItem key={task.id}>
              <TaskTitle>{task.title}</TaskTitle>
              <TaskDueDate overdue={task.dueDate && new Date(task.dueDate) < new Date()}>
                {task.dueDate && format(new Date(task.dueDate), 'MM/dd')}
              </TaskDueDate>
            </TaskItem>
          ))}
        </UrgentTasksList>
      )}

      <ViewAllButton onClick={onViewAll}>
        すべてのタスクを表示 →
      </ViewAllButton>
    </WidgetContainer>
  );
};

// ワークフロー概要ウィジェット
const WorkflowSummaryWidget: React.FC<{
  workflows?: EditorialWorkflow[];
  onViewAll: () => void;
}> = ({ workflows = [], onViewAll }) => {
  const activeWorkflows = useMemo(() => 
    workflows.filter(w => !['published', 'archived'].includes(w.stage)),
    [workflows]
  );

  const workflowsByStage = useMemo(() => {
    const stages = ['writing', 'review', 'editing', 'approval'];
    return stages.map(stage => ({
      stage,
      count: activeWorkflows.filter(w => w.stage === stage).length,
      label: {
        writing: '執筆中',
        review: 'レビュー中',
        editing: '編集中',
        approval: '承認待ち'
      }[stage]
    }));
  }, [activeWorkflows]);

  return (
    <WidgetContainer>
      <StatsGrid columns={2}>
        {workflowsByStage.map(({ stage, count, label }) => (
          <StatItem key={stage}>
            <StatValue color={getStageColor(stage)}>{count}</StatValue>
            <StatLabel>{label}</StatLabel>
          </StatItem>
        ))}
      </StatsGrid>

      {activeWorkflows.slice(0, 3).map(workflow => (
        <WorkflowItem key={workflow.id}>
          <WorkflowTitle>{workflow.title}</WorkflowTitle>
          <WorkflowStage stage={workflow.stage}>
            {getStageLabel(workflow.stage)}
          </WorkflowStage>
        </WorkflowItem>
      ))}

      <ViewAllButton onClick={onViewAll}>
        編集ワークフローを表示 →
      </ViewAllButton>
    </WidgetContainer>
  );
};
```

## ナビゲーション統合

### 統合ナビゲーションコンポーネント
```typescript
// 統合ナビゲーション
const UnifiedNavigation: React.FC = () => {
  const { state, helpers } = useUnifiedApp();
  const { activeView } = state.ui;
  const { user } = state.auth;
  
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'ダッシュボード',
      icon: '🏠',
      path: '/',
      requiresAuth: true
    },
    {
      id: 'content',
      label: 'コンテンツ',
      icon: '📝',
      path: '/content',
      requiresAuth: true,
      permission: 'cms:read',
      subItems: [
        { id: 'articles', label: '記事管理', path: '/content/articles' },
        { id: 'media', label: 'メディア', path: '/content/media' },
        { id: 'categories', label: 'カテゴリ', path: '/content/categories' }
      ]
    },
    {
      id: 'workflows',
      label: '編集ワークフロー',
      icon: '✍️',
      path: '/workflows',
      requiresAuth: true,
      permission: 'cms:write'
    },
    {
      id: 'projects',
      label: 'プロジェクト',
      icon: '📊',
      path: '/projects',
      requiresAuth: true,
      permission: 'projects:read',
      subItems: [
        { id: 'project-list', label: 'プロジェクト一覧', path: '/projects' },
        { id: 'my-tasks', label: 'マイタスク', path: '/projects/my-tasks' },
        { id: 'team', label: 'チーム', path: '/projects/team' }
      ]
    }
  ];

  const visibleItems = navigationItems.filter(item => {
    if (item.requiresAuth && !user) return false;
    if (item.permission && !helpers.hasPermission(item.permission)) return false;
    return true;
  });

  return (
    <NavigationContainer collapsed={state.ui.sidebarCollapsed}>
      <NavigationHeader>
        <Logo collapsed={state.ui.sidebarCollapsed}>
          <span>🌊 CORAL</span>
        </Logo>
        <CollapseButton
          onClick={() => helpers.dispatch({ type: 'TOGGLE_SIDEBAR' })}
        >
          {state.ui.sidebarCollapsed ? '→' : '←'}
        </CollapseButton>
      </NavigationHeader>

      <NavigationBody>
        {visibleItems.map(item => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={activeView === item.id}
            collapsed={state.ui.sidebarCollapsed}
            onClick={() => helpers.dispatch({ 
              type: 'SET_ACTIVE_VIEW', 
              payload: item.id as any 
            })}
          />
        ))}
      </NavigationBody>

      <NavigationFooter>
        <UserProfile user={user} collapsed={state.ui.sidebarCollapsed} />
        <ThemeToggle />
      </NavigationFooter>
    </NavigationContainer>
  );
};

const NavigationItem: React.FC<{
  item: NavigationItemType;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}> = ({ item, isActive, collapsed, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <NavigationItemContainer>
      <NavigationLink
        isActive={isActive}
        collapsed={collapsed}
        onClick={onClick}
      >
        <NavigationIcon>{item.icon}</NavigationIcon>
        {!collapsed && (
          <>
            <NavigationLabel>{item.label}</NavigationLabel>
            {item.subItems && (
              <ExpandIcon
                expanded={expanded}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
              >
                {expanded ? '▼' : '▶'}
              </ExpandIcon>
            )}
          </>
        )}
      </NavigationLink>

      {!collapsed && item.subItems && expanded && (
        <SubNavigationList>
          {item.subItems.map(subItem => (
            <SubNavigationItem key={subItem.id}>
              <Link to={subItem.path}>{subItem.label}</Link>
            </SubNavigationItem>
          ))}
        </SubNavigationList>
      )}
    </NavigationItemContainer>
  );
};
```

---

# プロジェクト・タスク管理システム詳細設計

## データベース統合設計

### 統合ERD
```
unified_users (1) ─── (N) user_permissions
     │                      │
     └── (N) project_members ── (1) projects (1) ── (N) editorial_workflows
     │            │                    │                      │
     └── (N) tasks ─────────────────── (1)                   │
          │                                                   │
          └── (N) workflow_tasks ─────────────────────────────┘
               │
               └── (N) task_events, task_comments, task_time_entries
```

## 要件

### 機能要件
- プロジェクト別のカンバンボード管理
- 個人タスクダッシュボード
- リアルタイム状態同期
- タスクのドラッグ&ドロップによるステータス変更
- アサイン・優先度・期限管理
- 変更履歴・コメント機能
- 通知システム

### 非機能要件
- リアルタイム性（レスポンス時間 < 100ms）
- スケーラビリティ（同時接続1000+）
- 可用性（99.9%以上）
- データ整合性の保証

## 推奨技術スタック

### バックエンド
- **Node.js + Express** - APIサーバー
- **PostgreSQL** - メインデータベース
- **Redis** - キャッシュ・セッション管理
- **Socket.io** - リアルタイム通信
- **Bull Queue** - バックグラウンド処理

### インフラ
- **Docker + Docker Compose** - 開発環境
- **AWS ECS** または **Railway** - 本番環境
- **AWS RDS** または **Supabase** - データベース
- **AWS ElastiCache** - Redis

## データベース設計

### ERD概要
```
Users (1) ─── (N) ProjectMembers (N) ─── (1) Projects
                         │                      │
                         │                      │
Users (1) ─── (N) Tasks (N) ─────────────────── (1) Projects
  │             │
  │             │
  └──── (N) TaskComments
        (N) TaskEvents
        (N) TaskTimeEntries
```

### テーブル定義

#### 1. ユーザー管理
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role user_role_enum DEFAULT 'member',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'member', 'viewer');
```

#### 2. プロジェクト管理
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#9333ea',
  icon VARCHAR(50) DEFAULT '📋',
  status project_status_enum DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE project_status_enum AS ENUM ('active', 'completed', 'on_hold', 'cancelled');

CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role project_member_role_enum DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

CREATE TYPE project_member_role_enum AS ENUM ('owner', 'admin', 'member', 'viewer');
```

#### 3. タスク管理（中心エンティティ）
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  priority task_priority_enum DEFAULT 'medium',
  status task_status_enum DEFAULT 'todo',
  category task_category_enum DEFAULT 'other',
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date TIMESTAMP,
  estimated_hours INTEGER CHECK (estimated_hours >= 0),
  actual_hours INTEGER DEFAULT 0 CHECK (actual_hours >= 0),
  tags TEXT[] DEFAULT '{}',
  position INTEGER DEFAULT 0, -- カンバンボード内の順序
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- 検索用インデックス
  CONSTRAINT valid_hours CHECK (actual_hours <= (estimated_hours * 2)) -- 実績工数は予定の2倍まで
);

CREATE TYPE task_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status_enum AS ENUM ('todo', 'in_progress', 'review', 'completed', 'blocked', 'cancelled');
CREATE TYPE task_category_enum AS ENUM ('development', 'design', 'marketing', 'content', 'research', 'meeting', 'other');

-- インデックス設定
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_position_status ON tasks(project_id, status, position); -- カンバンボード用
```

#### 4. リアルタイム同期用イベントログ
```sql
CREATE TABLE task_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type task_event_type_enum NOT NULL,
  old_data JSONB,
  new_data JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE task_event_type_enum AS ENUM (
  'created', 'updated', 'status_changed', 'assigned', 'unassigned', 
  'priority_changed', 'due_date_changed', 'completed', 'archived', 'deleted'
);

-- イベントログ用インデックス
CREATE INDEX idx_task_events_task_id ON task_events(task_id);
CREATE INDEX idx_task_events_project_id ON task_events(project_id);
CREATE INDEX idx_task_events_created_at ON task_events(created_at DESC);
CREATE INDEX idx_task_events_type ON task_events(event_type);
```

#### 5. コメント・時間トラッキング
```sql
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  mentions UUID[] DEFAULT '{}', -- メンション機能
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE task_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  is_running BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 同一タスク・ユーザーで実行中のエントリは1つまで
CREATE UNIQUE INDEX idx_running_time_entries ON task_time_entries(task_id, user_id) 
WHERE is_running = true;
```

## API設計

### REST APIエンドポイント

#### 認証・ユーザー管理
```typescript
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/profile
```

#### プロジェクト管理
```typescript
GET    /api/projects                    // 参加プロジェクト一覧
POST   /api/projects                    // プロジェクト作成
GET    /api/projects/:id                // プロジェクト詳細
PUT    /api/projects/:id                // プロジェクト更新
DELETE /api/projects/:id                // プロジェクト削除
GET    /api/projects/:id/members        // メンバー一覧
POST   /api/projects/:id/members        // メンバー追加
DELETE /api/projects/:id/members/:userId // メンバー削除
GET    /api/projects/:id/board          // カンバンボード
```

#### タスク管理
```typescript
GET    /api/tasks                       // フィルタリング対応
POST   /api/tasks                       // タスク作成
GET    /api/tasks/:id                   // タスク詳細
PUT    /api/tasks/:id                   // タスク更新
DELETE /api/tasks/:id                   // タスク削除
PATCH  /api/tasks/:id/status            // ステータス変更
PATCH  /api/tasks/:id/assign            // アサイン変更
PATCH  /api/tasks/:id/position          // 位置変更（カンバン用）
GET    /api/tasks/:id/comments          // コメント一覧
POST   /api/tasks/:id/comments          // コメント作成
GET    /api/tasks/:id/time-entries      // 時間エントリ一覧
POST   /api/tasks/:id/time-entries      // 時間記録開始/停止
```

#### プロジェクト別・ユーザー別タスク
```typescript
GET    /api/projects/:id/tasks          // プロジェクトタスク
GET    /api/users/me/tasks              // 自分のタスク
GET    /api/users/:id/tasks             // 特定ユーザーのタスク
```

### GraphQL API（オプション）
```graphql
type Query {
  projects: [Project!]!
  project(id: ID!): Project
  tasks(filter: TaskFilter): [Task!]!
  task(id: ID!): Task
  myTasks(filter: TaskFilter): [Task!]!
}

type Mutation {
  createTask(input: CreateTaskInput!): Task!
  updateTask(id: ID!, input: UpdateTaskInput!): Task!
  updateTaskStatus(id: ID!, status: TaskStatus!): Task!
  assignTask(id: ID!, userId: ID): Task!
}

type Subscription {
  taskUpdated(projectId: ID!): Task!
  projectUpdated(id: ID!): Project!
}
```

## リアルタイム同期システム

### Socket.io接続管理
```typescript
// server/socket.ts
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });

  // 認証ミドルウェア
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = jwt.verify(token, process.env.JWT_SECRET!);
      socket.userId = user.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    // プロジェクトルームに参加
    socket.on('join-project', async (projectId) => {
      const isMember = await checkProjectMembership(socket.userId, projectId);
      if (isMember) {
        socket.join(`project:${projectId}`);
        console.log(`User ${socket.userId} joined project:${projectId}`);
      }
    });

    // 個人タスクルームに参加
    socket.on('join-user-tasks', () => {
      socket.join(`user:${socket.userId}`);
    });

    // プロジェクトルームから退出
    socket.on('leave-project', (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });

  return io;
};
```

### タスク更新の同期処理
```typescript
// services/taskService.ts
import { io } from '../socket';
import { TaskEvent } from '../models/TaskEvent';
import { redis } from '../lib/redis';

export class TaskService {
  static async updateTask(taskId: string, updates: Partial<Task>, userId: string) {
    const transaction = await db.transaction();
    
    try {
      // 1. 現在のタスクを取得
      const oldTask = await Task.findById(taskId, { transaction });
      if (!oldTask) {
        throw new Error('Task not found');
      }

      // 2. 楽観的ロック（updated_atで競合検出）
      if (updates.lastModified && oldTask.updatedAt > updates.lastModified) {
        throw new ConflictError('Task was modified by another user', oldTask);
      }

      // 3. タスク更新
      const updatedTask = await oldTask.update({
        ...updates,
        updatedAt: new Date()
      }, { transaction });

      // 4. イベントログに記録
      await TaskEvent.create({
        taskId,
        projectId: updatedTask.projectId,
        userId,
        eventType: this.determineEventType(oldTask, updatedTask),
        oldData: oldTask.toJSON(),
        newData: updatedTask.toJSON()
      }, { transaction });

      await transaction.commit();

      // 5. リアルタイム配信
      await this.broadcastTaskUpdate(updatedTask, oldTask, userId);

      // 6. キャッシュ更新
      await this.invalidateCache(updatedTask.projectId);

      return updatedTask;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private static async broadcastTaskUpdate(
    newTask: Task, 
    oldTask: Task, 
    userId: string
  ) {
    // プロジェクトメンバーに配信
    io.to(`project:${newTask.projectId}`).emit('task_updated', {
      task: newTask,
      changes: this.getChanges(oldTask, newTask),
      updatedBy: userId,
      timestamp: new Date()
    });

    // アサインされたユーザーに配信（プロジェクトメンバーでない場合もあり得る）
    if (newTask.assignedTo) {
      io.to(`user:${newTask.assignedTo}`).emit('user_task_updated', {
        task: newTask,
        changes: this.getChanges(oldTask, newTask),
        updatedBy: userId
      });
    }

    // 以前アサインされていたユーザーにも通知
    if (oldTask.assignedTo && oldTask.assignedTo !== newTask.assignedTo) {
      io.to(`user:${oldTask.assignedTo}`).emit('user_task_updated', {
        task: newTask,
        changes: this.getChanges(oldTask, newTask),
        updatedBy: userId
      });
    }
  }

  private static determineEventType(oldTask: Task, newTask: Task): TaskEventType {
    if (oldTask.status !== newTask.status) {
      return newTask.status === 'completed' ? 'completed' : 'status_changed';
    }
    if (oldTask.assignedTo !== newTask.assignedTo) {
      return newTask.assignedTo ? 'assigned' : 'unassigned';
    }
    if (oldTask.priority !== newTask.priority) {
      return 'priority_changed';
    }
    return 'updated';
  }
}
```

### キャッシュ戦略（Redis）
```typescript
// services/cacheService.ts
import { redis } from '../lib/redis';

export class CacheService {
  // プロジェクトのカンバンボード状態をキャッシュ
  static async getProjectBoard(projectId: string): Promise<KanbanBoard | null> {
    const cacheKey = `project:${projectId}:board`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const board = await this.buildBoardFromDB(projectId);
    await redis.setex(cacheKey, 300, JSON.stringify(board)); // 5分キャッシュ
    
    return board;
  }

  // ユーザーのタスク一覧をキャッシュ
  static async getUserTasks(userId: string, filter?: TaskFilter): Promise<Task[]> {
    const cacheKey = `user:${userId}:tasks:${this.hashFilter(filter)}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const tasks = await this.getUserTasksFromDB(userId, filter);
    await redis.setex(cacheKey, 180, JSON.stringify(tasks)); // 3分キャッシュ
    
    return tasks;
  }

  // キャッシュ無効化
  static async invalidateProjectCache(projectId: string) {
    const patterns = [
      `project:${projectId}:*`,
      `user:*:tasks:*` // ユーザーキャッシュも無効化（プロジェクトタスクが含まれるため）
    ];
    
    for (const pattern of patterns) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }
  }

  static async invalidateUserCache(userId: string) {
    const pattern = `user:${userId}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  private static async buildBoardFromDB(projectId: string): Promise<KanbanBoard> {
    const tasks = await Task.findAll({
      where: { projectId, isArchived: false },
      include: [{ model: User, as: 'assignee' }],
      order: [['position', 'ASC']]
    });

    return {
      columns: {
        todo: tasks.filter(t => t.status === 'todo'),
        in_progress: tasks.filter(t => t.status === 'in_progress'),
        review: tasks.filter(t => t.status === 'review'),
        completed: tasks.filter(t => t.status === 'completed'),
        blocked: tasks.filter(t => t.status === 'blocked')
      },
      stats: this.calculateBoardStats(tasks),
      lastUpdated: new Date()
    };
  }
}
```

## フロントエンド統合

### Socket.io クライアント設定
```typescript
// lib/socket.ts
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(process.env.REACT_APP_API_URL!, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      retries: 3
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // サーバー側から切断された場合は再接続
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.handleReconnection();
    });

    return this.socket;
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.socket?.connect();
      }, delay);
    }
  }

  joinProject(projectId: string) {
    this.socket?.emit('join-project', projectId);
  }

  leaveProject(projectId: string) {
    this.socket?.emit('leave-project', projectId);
  }

  joinUserTasks() {
    this.socket?.emit('join-user-tasks');
  }

  onTaskUpdated(callback: (data: any) => void) {
    this.socket?.on('task_updated', callback);
  }

  onUserTaskUpdated(callback: (data: any) => void) {
    this.socket?.on('user_task_updated', callback);
  }

  offTaskUpdated() {
    this.socket?.off('task_updated');
  }

  offUserTaskUpdated() {
    this.socket?.off('user_task_updated');
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
```

### リアルタイム更新フック
```typescript
// hooks/useRealtimeSync.ts
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketService } from '../lib/socket';
import { Task } from '../types/task';

export const useRealtimeSync = (projectId?: string, userId?: string) => {
  const queryClient = useQueryClient();

  const handleTaskUpdate = useCallback((data: { task: Task; changes: any; updatedBy: string }) => {
    const { task, updatedBy } = data;

    // 自分の変更の場合はスキップ（楽観的更新済み）
    if (updatedBy === userId) {
      return;
    }

    // クエリキャッシュを更新
    queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
      if (!oldTasks) return oldTasks;
      return oldTasks.map(t => t.id === task.id ? task : t);
    });

    // プロジェクトボードキャッシュを更新
    if (projectId) {
      queryClient.setQueryData([`project:${projectId}:board`], (oldBoard: any) => {
        if (!oldBoard) return oldBoard;
        // ボードの該当タスクを更新
        return updateBoardTask(oldBoard, task);
      });
    }

    // ユーザータスクキャッシュを更新
    queryClient.setQueryData([`user:${userId}:tasks`], (oldTasks: Task[] | undefined) => {
      if (!oldTasks) return oldTasks;
      return oldTasks.map(t => t.id === task.id ? task : t);
    });

    // 通知表示
    if (task.assignedTo === userId && data.changes.includes('status')) {
      showNotification(`タスク「${task.title}」のステータスが更新されました`);
    }
  }, [queryClient, projectId, userId]);

  useEffect(() => {
    if (!socketService.socket) return;

    if (projectId) {
      socketService.joinProject(projectId);
      socketService.onTaskUpdated(handleTaskUpdate);
    }

    if (userId) {
      socketService.joinUserTasks();
      socketService.onUserTaskUpdated(handleTaskUpdate);
    }

    return () => {
      socketService.offTaskUpdated();
      socketService.offUserTaskUpdated();
      if (projectId) {
        socketService.leaveProject(projectId);
      }
    };
  }, [projectId, userId, handleTaskUpdate]);
};
```

### 楽観的更新の実装
```typescript
// hooks/useTaskMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '../services/api';
import { Task, TaskStatus } from '../types/task';

export const useUpdateTaskStatus = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, newStatus }: { taskId: string; newStatus: TaskStatus }) =>
      taskAPI.updateTaskStatus(taskId, newStatus),
      
    onMutate: async ({ taskId, newStatus }) => {
      // 進行中のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // 楽観的更新
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
        if (!oldTasks) return oldTasks;
        return oldTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus, updatedAt: new Date() }
            : task
        );
      });

      // プロジェクトボードも楽観的更新
      if (projectId) {
        queryClient.setQueryData([`project:${projectId}:board`], (oldBoard: any) => {
          if (!oldBoard) return oldBoard;
          return optimisticallyUpdateBoard(oldBoard, taskId, newStatus);
        });
      }

      // ロールバック用のスナップショットを返す
      return { previousTasks: queryClient.getQueryData(['tasks']) };
    },

    onError: (err, variables, context) => {
      // エラー時はロールバック
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      
      // エラー通知
      showErrorNotification('タスクの更新に失敗しました');
    },

    onSettled: () => {
      // 最新データで再フェッチ
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: [`project:${projectId}:board`] });
      }
    },
  });
};
```

## パフォーマンス最適化

### 1. データベース最適化
```sql
-- パーティショニング（大規模データ対応）
CREATE TABLE task_events_2024_12 PARTITION OF task_events
FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- インデックスの最適化
CREATE INDEX CONCURRENTLY idx_tasks_composite 
ON tasks(project_id, status, position) 
WHERE is_archived = false;

-- 統計情報の定期更新
SELECT 'ANALYZE tasks;' FROM generate_series(1,1);
```

### 2. アプリケーション層の最適化
```typescript
// バッチ処理でタスク位置を更新
export class TaskBatchService {
  static async reorderTasks(
    projectId: string, 
    reorders: Array<{ taskId: string; newPosition: number; newStatus?: TaskStatus }>
  ) {
    const transaction = await db.transaction();
    
    try {
      // バッチでSQLを実行
      const updatePromises = reorders.map(({ taskId, newPosition, newStatus }) => {
        const updates: any = { position: newPosition };
        if (newStatus) updates.status = newStatus;
        
        return Task.update(updates, { 
          where: { id: taskId }, 
          transaction 
        });
      });

      await Promise.all(updatePromises);
      await transaction.commit();

      // 一括でキャッシュ無効化
      await CacheService.invalidateProjectCache(projectId);
      
      // WebSocket通知も一括で送信
      const updatedTasks = await Task.findAll({
        where: { id: reorders.map(r => r.taskId) },
        include: [{ model: User, as: 'assignee' }]
      });

      io.to(`project:${projectId}`).emit('tasks_reordered', {
        tasks: updatedTasks,
        timestamp: new Date()
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
```

### 3. フロントエンド最適化
```typescript
// 仮想化されたカンバンボード
import { FixedSizeList as List } from 'react-window';

const VirtualizedTaskColumn = ({ tasks, status }: { tasks: Task[]; status: TaskStatus }) => {
  const renderTask = useCallback(({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <TaskCard key={tasks[index].id} task={tasks[index]} />
    </div>
  ), [tasks]);

  return (
    <List
      height={600}
      itemCount={tasks.length}
      itemSize={120}
      overscanCount={5} // パフォーマンスのためプリレンダリング
    >
      {renderTask}
    </List>
  );
};

// メモ化による不要な再レンダリング防止
const TaskCard = memo(({ task }: { task: Task }) => {
  const { mutate: updateStatus } = useUpdateTaskStatus();
  
  const handleStatusChange = useCallback((newStatus: TaskStatus) => {
    updateStatus({ taskId: task.id, newStatus });
  }, [task.id, updateStatus]);

  return (
    // TaskCardの実装
  );
}, (prevProps, nextProps) => {
  // 深い比較を避け、必要なプロパティのみチェック
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.updatedAt.getTime() === nextProps.task.updatedAt.getTime()
  );
});
```

## セキュリティ対策

### 1. 認証・認可
```typescript
// JWT認証ミドルウェア
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// プロジェクトアクセス権限チェック
export const checkProjectAccess = (minRole: ProjectMemberRole = 'viewer') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const membership = await ProjectMember.findOne({
      where: { projectId, userId }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const roleLevel = { viewer: 0, member: 1, admin: 2, owner: 3 };
    if (roleLevel[membership.role] < roleLevel[minRole]) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.projectMembership = membership;
    next();
  };
};
```

### 2. データ検証
```typescript
// Zod スキーマ
import { z } from 'zod';

export const TaskCreateSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['todo', 'in_progress', 'review', 'completed', 'blocked', 'cancelled']),
  category: z.enum(['development', 'design', 'marketing', 'content', 'research', 'meeting', 'other']),
  projectId: z.string().uuid(),
  assignedTo: z.string().uuid().optional(),
  dueDate: z.date().optional(),
  estimatedHours: z.number().int().min(0).max(1000).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

// バリデーションミドルウェア
export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
      }
      next(error);
    }
  };
};
```

### 3. レート制限
```typescript
import rateLimit from 'express-rate-limit';

// API呼び出し制限
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// タスク作成は厳しく制限
export const taskCreationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分
  max: 10, // 最大10タスク
  keyGenerator: (req) => req.user?.id || req.ip,
});
```

## 運用・監視

### 1. ヘルスチェック
```typescript
// /health エンドポイント
export const healthCheck = async (req: Request, res: Response) => {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      socketio: 'unknown'
    },
    version: process.env.npm_package_version || 'unknown'
  };

  // データベース接続確認
  try {
    await db.authenticate();
    checks.services.database = 'ok';
  } catch (error) {
    checks.services.database = 'error';
    checks.status = 'degraded';
  }

  // Redis接続確認
  try {
    await redis.ping();
    checks.services.redis = 'ok';
  } catch (error) {
    checks.services.redis = 'error';
    checks.status = 'degraded';
  }

  // Socket.io確認
  checks.services.socketio = io.engine.clientsCount >= 0 ? 'ok' : 'error';

  res.status(checks.status === 'ok' ? 200 : 503).json(checks);
};
```

### 2. ログ設定
```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// 本番環境以外はコンソール出力も
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 3. メトリクス収集
```typescript
// Prometheus メトリクス
import client from 'prom-client';

// カスタムメトリクス
const taskUpdateCounter = new client.Counter({
  name: 'tasks_updated_total',
  help: 'Total number of task updates',
  labelNames: ['project_id', 'status_from', 'status_to']
});

const socketConnectionGauge = new client.Gauge({
  name: 'socket_connections_current',
  help: 'Current number of socket connections'
});

// メトリクス更新
export const incrementTaskUpdate = (projectId: string, statusFrom: string, statusTo: string) => {
  taskUpdateCounter.inc({ project_id: projectId, status_from: statusFrom, status_to: statusTo });
};

export const updateSocketConnections = (count: number) => {
  socketConnectionGauge.set(count);
};
```

## デプロイメント

### 1. Docker構成
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm ci --only=production

# アプリケーションファイル
COPY . .

# ビルド
RUN npm run build

EXPOSE 3000

# 非rootユーザーで実行
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/taskdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: taskdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d taskdb"]

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]

volumes:
  postgres_data:
  redis_data:
```

### 2. CI/CDパイプライン（GitHub Actions）
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        run: |
          docker build -t ${{ secrets.DOCKER_REGISTRY }}/task-api:${{ github.sha }} .
          docker push ${{ secrets.DOCKER_REGISTRY }}/task-api:${{ github.sha }}
      
      - name: Deploy to production
        run: |
          # Railway CLI またはAWS CLI等でデプロイ
```

## 開発・テスト環境

### 1. 開発環境セットアップ
```bash
# 1. リポジトリクローン
git clone <repository-url>
cd task-management-backend

# 2. 依存関係インストール
npm install

# 3. 環境変数設定
cp .env.example .env.local
# .env.local を編集

# 4. データベース起動（Docker）
docker-compose up -d db redis

# 5. データベース初期化
npm run db:migrate
npm run db:seed

# 6. 開発サーバー起動
npm run dev
```

### 2. テスト構成
```typescript
// tests/integration/tasks.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { setupTestDB, teardownTestDB } from '../helpers/database';

describe('Task API', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test description',
        priority: 'medium',
        status: 'todo',
        category: 'development',
        projectId: 'test-project-id'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${testToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body).toMatchObject({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority
      });
    });
  });

  describe('Socket.io Events', () => {
    it('should broadcast task updates to project members', async () => {
      const client = await connectSocket(testToken);
      
      client.emit('join-project', 'test-project-id');
      
      // タスク更新
      await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ status: 'in_progress' })
        .expect(200);

      // Socket.ioイベント受信確認
      await expect(client).toReceiveEvent('task_updated', {
        timeout: 1000
      });
    });
  });
});
```

## 今後の拡張予定

### フェーズ2: 高度な機能
- **AI支援**: タスクの自動分類・優先度提案
- **時間予測**: 過去データに基づく工数予測
- **ガントチャート**: プロジェクトタイムライン表示
- **カスタムワークフロー**: プロジェクト別のカスタムステータス

### フェーズ3: エンタープライズ機能
- **マルチテナント対応**: 組織単位での管理
- **高度な権限管理**: ロールベースアクセス制御
- **監査ログ**: 詳細な変更履歴追跡
- **API制限**: 組織別のレート制限

---

# 段階的移行計画

## フェーズ1: 基盤整備（2-3週間）

### 目標
- 統合認証システムの構築
- 統一ユーザーデータベースの設計・実装
- 基本的なAPI統合基盤の構築

### 実装内容
1. **統合データベース設計**
   - unified_users テーブル作成
   - user_permissions テーブル作成
   - 既存システムとの連携テーブル設計

2. **統合認証システム**
   - JWT統合認証の実装
   - WordPress認証との連携
   - セッション管理システム

3. **基本API統合**
   - APIゲートウェイの基本構造
   - 認証ミドルウェアの実装
   - 基本的な権限チェック機能

### 完了基準
- [ ] 統合ユーザーでのログインが可能
- [ ] WordPress と タスクシステム両方にアクセス可能
- [ ] 基本的な権限管理が動作

## フェーズ2: 編集ワークフロー実装（3-4週間）

### 目標
- 記事執筆からタスク管理への統合機能実装
- 編集ワークフローシステムの構築

### 実装内容
1. **ワークフローデータモデル**
   - editorial_workflows テーブル
   - workflow_tasks 連携テーブル
   - workflow_history 履歴管理

2. **編集ワークフロー機能**
   - ワークフロー作成・管理
   - ステージ遷移の自動化
   - WordPress記事との連携

3. **タスク自動生成**
   - 記事企画からタスク生成
   - ワークフローステージ連動
   - 担当者自動アサイン

### 完了基準
- [ ] 記事企画からワークフローが作成可能
- [ ] ワークフローステージとタスクが連動
- [ ] WordPress記事ステータスが同期

## フェーズ3: 統合UI実装（4-5週間）

### 目標
- 統合ダッシュボードの実装
- リアルタイム同期機能の構築
- 一元化されたユーザー体験の実現

### 実装内容
1. **統合ダッシュボード**
   - 統一状態管理システム
   - 統合ナビゲーション
   - ダッシュボードウィジェット

2. **リアルタイム機能**
   - Socket.io統合
   - リアルタイムタスク更新
   - ワークフロー状態同期

3. **ユーザー体験統合**
   - Single Sign-On実装
   - 統合通知システム
   - 権限ベースUI表示

### 完了基準
- [ ] 統合ダッシュボードが表示
- [ ] リアルタイム更新が動作
- [ ] すべての機能にシームレスにアクセス可能

## フェーズ4: 最適化・運用準備（2-3週間）

### 目標
- パフォーマンス最適化
- 監視・ログ機能の整備
- 本番環境デプロイ準備

### 実装内容
1. **パフォーマンス最適化**
   - キャッシュ戦略の実装
   - データベースクエリ最適化
   - フロントエンド最適化

2. **監視・ログ**
   - アプリケーション監視
   - エラートラッキング
   - パフォーマンス監視

3. **本番環境準備**
   - Docker化
   - CI/CDパイプライン
   - セキュリティ監査

### 完了基準
- [ ] 本番環境での安定稼働
- [ ] 監視・アラート機能が動作
- [ ] セキュリティチェック完了

---

# 技術選定と推奨構成

## 開発環境推奨構成

### フロントエンド
```json
{
  "name": "coral-unified-platform",
  "dependencies": {
    "react": "^19.0.0",
    "typescript": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "socket.io-client": "^4.7.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "framer-motion": "^12.0.0",
    "react-router-dom": "^7.0.0",
    "date-fns": "^3.0.0",
    "react-window": "^1.8.8",
    "react-beautiful-dnd": "^13.1.1"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0"
  }
}
```

### バックエンド
```json
{
  "name": "coral-unified-backend",
  "dependencies": {
    "express": "^4.19.0",
    "socket.io": "^4.7.0",
    "pg": "^8.11.0",
    "sequelize": "^6.35.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0",
    "winston": "^3.11.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "nodemon": "^3.0.0",
    "jest": "^29.0.0",
    "supertest": "^7.0.0"
  }
}
```

## インフラ推奨構成

### 開発環境
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://coral:coral@db:5432/coral_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev_secret_key
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: coral_dev
      POSTGRES_USER: coral
      POSTGRES_PASSWORD: coral
    volumes:
      - postgres_dev:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_dev:/data

  wordpress:
    image: wordpress:6.4-php8.1-apache
    environment:
      WORDPRESS_DB_HOST: wp_db
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: wp_user
      WORDPRESS_DB_PASSWORD: wp_pass
    volumes:
      - wordpress_data:/var/www/html
    ports:
      - "8080:80"
    depends_on:
      - wp_db

  wp_db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wp_user
      MYSQL_PASSWORD: wp_pass
      MYSQL_ROOT_PASSWORD: root_pass
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  postgres_dev:
  redis_dev:
  wordpress_data:
  mysql_data:
```

### 本番環境（Railway/Vercel推奨）

#### フロントエンド (Vercel)
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "env": {
    "VITE_API_URL": "@api_url",
    "VITE_WS_URL": "@websocket_url"
  }
}
```

#### バックエンド (Railway)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## セキュリティ設定

### 環境変数管理
```bash
# .env.production
NODE_ENV=production
DATABASE_URL=${RAILWAY_POSTGRESQL_URL}
REDIS_URL=${RAILWAY_REDIS_URL}
JWT_SECRET=${JWT_SECRET_KEY}
WORDPRESS_API_URL=${WP_API_URL}
CORS_ORIGIN=${FRONTEND_URL}
SESSION_SECRET=${SESSION_SECRET}
```

### セキュリティヘッダー設定
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.WS_URL!]
    }
  },
  crossOriginEmbedderPolicy: false
}));
```

---

# 運用・メンテナンス計画

## モニタリング設定

### アプリケーション監視
```typescript
// 監視設定
import { createPrometheusMetrics } from './monitoring/prometheus';
import { setupHealthCheck } from './monitoring/health';

const metrics = createPrometheusMetrics();

// カスタムメトリクス
export const trackUserAction = (action: string, userId: string) => {
  metrics.userActions.inc({ action, user: userId });
};

export const trackWorkflowTransition = (from: string, to: string) => {
  metrics.workflowTransitions.inc({ from_stage: from, to_stage: to });
};
```

### ログ管理
```typescript
import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});
```

## バックアップ戦略

### データベースバックアップ
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="coral_production"

# PostgreSQL バックアップ
pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# Redis バックアップ
redis-cli --rdb $BACKUP_DIR/redis_backup_$DATE.rdb

# 古いバックアップの削除（30日以上経過）
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +30 -delete

echo "Backup completed: $DATE"
```

## パフォーマンス最適化

### キャッシュ戦略
```typescript
// キャッシュ階層
export class CacheManager {
  // Level 1: メモリキャッシュ (Node.js)
  private memoryCache = new Map();
  
  // Level 2: Redis キャッシュ
  private redis: Redis;
  
  async get(key: string) {
    // メモリから取得
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // Redisから取得
    const cached = await this.redis.get(key);
    if (cached) {
      const data = JSON.parse(cached);
      this.memoryCache.set(key, data);
      return data;
    }
    
    return null;
  }
  
  async set(key: string, value: any, ttl: number = 300) {
    // メモリにキャッシュ
    this.memoryCache.set(key, value);
    
    // Redisにキャッシュ
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
}
```

この統合設計により、効率的で拡張性の高いCORAL統合プラットフォームを構築できます。段階的な移行計画により、リスクを最小化しながら統合を進めることができます。