# ユーザー認証・管理システム設計書
## CORALニュースサイト イベント参加機能対応

### 1. 概要

CORALニュースサイトにイベント参加機能が追加されたことに伴い、ユーザー認証・管理システムの実装が必要となります。本書は、ログイン機能、マイページ、イベント参加管理などの関連機能の設計について定義します。

### 2. 現在の技術スタック分析

**フロントエンド:**
- React 19 + TypeScript
- React Router DOM 7.2.0
- Emotion (styled-components)
- Framer Motion (アニメーション)
- React Query (データフェッチング)

**既存ページ構成:**
- ホーム (`/`)
- カテゴリ別ページ (`/tech`, `/music`, `/spiritual`, `/health`, `/arts`, `/politics`)
- イベント一覧 (`/events`)
- イベント詳細 (`/events/:slug`)
- 記事詳細 (`/article/:slug`)

### 3. 認証システム設計

#### 3.1 認証方式の選択

**推奨認証方式: JWT (JSON Web Token)**
- ステートレス認証
- フロントエンドでの認証状態管理が容易
- API通信との親和性が高い

**代替案:**
- OAuth 2.0 (Google, GitHub, Twitter連携)
- Magic Link認証 (メール送信方式)

#### 3.2 必要なページ・機能

| ページ/機能 | ルート | 説明 | 認証要否 |
|------------|--------|------|----------|
| ログインページ | `/login` | メール・パスワードでのログイン | × |
| 新規登録ページ | `/register` | アカウント作成 | × |
| パスワードリセット | `/forgot-password` | パスワード忘れ対応 | × |
| マイページ | `/profile` | ユーザー情報表示・編集 | ○ |
| イベント参加履歴 | `/profile/events` | 参加予定・過去のイベント一覧 | ○ |
| アカウント設定 | `/profile/settings` | パスワード変更、通知設定等 | ○ |
| ログアウト | `/logout` | セッション終了 | ○ |

#### 3.3 ルーティング設計

```typescript
// App.tsxに追加する新しいルート
const authRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
  { path: '/profile/events', element: <ProtectedRoute><UserEventsPage /></ProtectedRoute> },
  { path: '/profile/settings', element: <ProtectedRoute><AccountSettingsPage /></ProtectedRoute> },
];
```

### 4. データモデル設計

#### 4.1 Userモデル

```typescript
interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  preferences: UserPreferences;
}

interface UserPreferences {
  notifications: {
    eventReminders: boolean;
    newsletter: boolean;
    eventRecommendations: boolean;
  };
  privacy: {
    showProfile: boolean;
    showEventHistory: boolean;
  };
}
```

#### 4.2 EventParticipationモデル

```typescript
interface EventParticipation {
  id: string;
  userId: string;
  eventId: string;
  status: 'registered' | 'attended' | 'cancelled';
  registeredAt: string;
  attendedAt?: string;
  cancelledAt?: string;
  paymentStatus?: 'pending' | 'completed' | 'refunded';
}
```

#### 4.3 既存Eventモデルの拡張

```typescript
// 既存のEventインターフェースに追加
interface Event {
  // ... 既存フィールド
  requirements?: {
    loginRequired: boolean;
    paymentRequired: boolean;
    approvalRequired: boolean;
  };
  visibility: 'public' | 'members' | 'private';
}
```

### 5. 認証状態管理

#### 5.1 認証コンテキスト設計

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}
```

#### 5.2 保護されたルート実装

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login'
}) => {
  // 認証チェックロジック
};
```

### 6. UI/UX設計

#### 6.1 ページレイアウト

**ログインページ (`/login`)**
- シンプルなフォーム（メール、パスワード）
- 「ログイン状態を保持」チェックボックス
- 「パスワードを忘れた方」リンク
- ソーシャルログインボタン（将来拡張）
- 新規登録へのリンク

**マイページ (`/profile`)**
- ユーザー情報表示
- アバター画像
- 参加予定イベントのクイックビュー
- 最近の活動履歴

**イベント詳細ページの拡張**
- 未ログイン時: 「ログインして参加」ボタン
- ログイン済み: 「参加する」「キャンセル」ボタン
- 参加済み表示

#### 6.2 ナビゲーション拡張

```typescript
// Navigation.tsxに追加する要素
const authNavItems = [
  // 未ログイン時
  { path: '/login', label: 'ログイン' },
  { path: '/register', label: '新規登録' },
  
  // ログイン時
  { path: '/profile', label: 'マイページ' },
  { action: 'logout', label: 'ログアウト' },
];
```

### 7. API設計

#### 7.1 認証API

| エンドポイント | メソッド | 説明 | 認証 |
|---------------|---------|------|------|
| `/api/auth/login` | POST | ログイン | × |
| `/api/auth/register` | POST | 新規登録 | × |
| `/api/auth/logout` | POST | ログアウト | ○ |
| `/api/auth/refresh` | POST | トークン更新 | ○ |
| `/api/auth/forgot-password` | POST | パスワードリセット | × |
| `/api/auth/reset-password` | POST | パスワード変更 | × |

#### 7.2 ユーザーAPI

| エンドポイント | メソッド | 説明 | 認証 |
|---------------|---------|------|------|
| `/api/users/profile` | GET | プロフィール取得 | ○ |
| `/api/users/profile` | PUT | プロフィール更新 | ○ |
| `/api/users/events` | GET | 参加イベント一覧 | ○ |
| `/api/users/events/:eventId` | POST | イベント参加 | ○ |
| `/api/users/events/:eventId` | DELETE | イベントキャンセル | ○ |

### 8. セキュリティ考慮事項

#### 8.1 認証セキュリティ
- パスワード: 最小8文字、大小英数字記号の組み合わせ
- JWT有効期限: 24時間（アクセストークン）、30日（リフレッシュトークン）
- CSRF対策: CSRFトークン実装
- XSS対策: HTMLサニタイゼーション

#### 8.2 データ保護
- 個人情報暗号化（メールアドレス、氏名等）
- ログイン試行回数制限（5回/15分）
- パスワードハッシュ化（bcrypt）

### 9. 実装フェーズ

#### Phase 1: 基本認証システム (2週間)
- [ ] 認証コンテキスト実装
- [ ] ログイン・新規登録ページ
- [ ] 保護されたルートコンポーネント
- [ ] ナビゲーション拡張

#### Phase 2: プロフィール管理 (1週間)
- [ ] マイページ実装
- [ ] プロフィール編集機能
- [ ] アカウント設定ページ

#### Phase 3: イベント連携 (1週間)
- [ ] イベント参加機能
- [ ] 参加履歴ページ
- [ ] イベント詳細ページ認証連携

#### Phase 4: 高度な機能 (1週間)
- [ ] パスワードリセット
- [ ] メール認証
- [ ] 通知システム

### 10. 技術的な実装メモ

#### 10.1 必要な追加パッケージ
```bash
npm install react-hook-form yup @hookform/resolvers
npm install js-cookie @types/js-cookie
npm install react-hot-toast  # 通知UI
```

#### 10.2 ディレクトリ構造
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── AuthProvider.tsx
│   └── profile/
│       ├── ProfileCard.tsx
│       ├── EventHistory.tsx
│       └── SettingsForm.tsx
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   └── profile/
│       ├── ProfilePage.tsx
│       ├── UserEventsPage.tsx
│       └── AccountSettingsPage.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useEventParticipation.ts
├── services/
│   ├── authService.ts
│   └── userService.ts
└── types/
    ├── auth.ts
    └── user.ts
```

#### 10.3 既存コードへの影響
- `App.tsx`: 新ルート追加、AuthProviderでラップ
- `Navigation.tsx`: 認証状態に応じた表示切り替え
- `EventDetailPage.tsx`: 参加ボタンの認証連携
- `mockData.ts`: User、EventParticipation型追加

### 11. 今後の拡張可能性

#### 11.1 ソーシャル認証
- Google、GitHub、Twitter OAuth連携
- ソーシャルプロフィール情報自動取得

#### 11.2 プレミアム機能
- 有料イベントの決済機能
- プレミアム会員システム
- 早期参加権限等の特典

#### 11.3 コミュニティ機能
- ユーザー同士のフォロー機能
- イベント後のレビュー・評価
- 興味関心に基づくイベント推薦

### 12. テスト戦略

#### 12.1 単体テスト
- 認証フック（useAuth）のテスト
- バリデーション関数のテスト
- API呼び出し関数のテスト

#### 12.2 統合テスト
- ログインフローのテスト
- イベント参加フローのテスト
- 保護されたルートのアクセステスト

#### 12.3 E2Eテスト
- ユーザー登録→ログイン→イベント参加の一連のフロー
- パスワードリセットフロー
- プロフィール更新フロー

---

この設計書に基づいて、段階的にユーザー認証・管理システムを実装することで、イベント参加機能を活用したコミュニティサイトとしての機能を大幅に拡張できます。