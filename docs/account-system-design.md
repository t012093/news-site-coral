# アカウントシステム設計書

## 概要
NPO OpenCoralNetwork のWebサイトにおけるユーザーアカウント管理システムの設計書です。

## 機能要件

### 1. 会員情報管理
- **会員ステータス管理**
  - 会員種別（一般会員、賛助会員、正会員、理事）
  - 会員ID、加入日、有効期限
  - 会員特典・ベネフィット一覧
  - 年会費・更新情報

- **プロフィール情報**
  - 基本情報（氏名、メールアドレス、電話番号）
  - 住所情報（郵便番号、都道府県、市区町村、番地）
  - プロフィール画像
  - 自己紹介・経歴
  - 専門分野・スキル
  - 興味のある活動分野

### 2. 支払い・請求管理
- **支払い方法管理**
  - クレジットカード情報（暗号化）
  - 銀行振込情報
  - PayPal、Stripe連携
  - 定期支払い設定

- **請求・支払い履歴**
  - 年会費支払い履歴
  - 寄付履歴
  - イベント参加費
  - 領収書・証明書ダウンロード
  - 税額控除証明書発行

### 3. セキュリティ設定
- **認証設定**
  - パスワード変更
  - 2要素認証（TOTP、SMS）
  - ログインセッション管理
  - デバイス管理・信頼できるデバイス登録

- **プライバシー設定**
  - 個人情報公開範囲設定
  - データ削除リクエスト
  - データエクスポート機能

### 4. 通知・コミュニケーション設定
- **通知設定**
  - メール通知（イベント、ニュース、活動報告）
  - プッシュ通知設定
  - SMS通知設定
  - 通知頻度・タイミング設定

- **表示設定**
  - 言語設定（日本語、英語）
  - タイムゾーン設定
  - テーマ設定（ダーク/ライトモード）

### 5. 活動履歴・参加記録
- **プロジェクト活動**
  - 参加中プロジェクト一覧
  - 過去の参加プロジェクト履歴
  - 貢献度・参加時間記録
  - スキル・経験値記録

- **イベント履歴**
  - 参加予定イベント
  - 過去の参加イベント
  - イベント評価・フィードバック
  - 参加証明書ダウンロード

- **ボランティア活動**
  - ボランティア時間記録
  - 活動証明書発行
  - 社会貢献度スコア

### 6. お気に入り・ブックマーク
- **コンテンツ管理**
  - 保存した記事・ニュース
  - ブックマークしたプロジェクト
  - フォロー中のイベント
  - 関心カテゴリ設定

## UI/UX設計

### ページ構成
- **メインナビゲーション**: タブ形式で各セクションを切り替え
- **サイドバー**: ユーザー基本情報とクイックアクション
- **メインコンテンツ**: 選択されたタブのコンテンツ表示

### タブ構成
1. **概要** - ダッシュボード形式で重要情報をサマリー表示
2. **プロフィール** - 個人情報・自己紹介編集
3. **会員情報** - 会員ステータス・特典・更新情報
4. **支払い・請求** - 支払い方法・履歴・領収書
5. **活動履歴** - プロジェクト・イベント・ボランティア記録
6. **お気に入り** - 保存コンテンツ・ブックマーク
7. **通知設定** - メール・プッシュ通知・表示設定
8. **セキュリティ** - パスワード・2FA・デバイス管理

## データ構造

### User型の拡張
```typescript
interface User {
  // 基本情報
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  
  // 会員情報
  membershipInfo: {
    type: 'general' | 'supporting' | 'regular' | 'director';
    id: string;
    joinDate: string;
    expiryDate: string;
    status: 'active' | 'inactive' | 'suspended';
    benefits: string[];
  };
  
  // 個人情報
  personalInfo: {
    firstName: string;
    lastName: string;
    phone?: string;
    address?: {
      postalCode: string;
      prefecture: string;
      city: string;
      street: string;
    };
    skills: string[];
    interests: string[];
  };
  
  // 設定
  preferences: {
    language: 'ja' | 'en';
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      frequency: 'immediate' | 'daily' | 'weekly';
    };
  };
  
  // セキュリティ
  security: {
    twoFactorEnabled: boolean;
    trustedDevices: string[];
    lastPasswordChange: string;
  };
}
```

### 支払い履歴型
```typescript
interface PaymentHistory {
  id: string;
  userId: string;
  type: 'membership' | 'donation' | 'event' | 'other';
  amount: number;
  currency: 'JPY';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  description: string;
  receiptUrl?: string;
  taxDeductible: boolean;
}
```

### 活動履歴型
```typescript
interface ActivityHistory {
  id: string;
  userId: string;
  type: 'project' | 'event' | 'volunteer';
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  hoursContributed?: number;
  certificateUrl?: string;
  skills: string[];
}
```

## セキュリティ要件
- パスワードは bcrypt でハッシュ化
- 支払い情報は PCI DSS 準拠で暗号化
- 2要素認証は TOTP (RFC 6238) 準拠
- セッション管理は JWT + Refresh Token
- GDPR対応のデータ削除・エクスポート機能

## API設計
- RESTful API設計
- GraphQL検討（複雑なクエリ対応）
- 支払い処理は Stripe API 連携
- メール送信は SendGrid 連携
- ファイルアップロードは AWS S3 連携

## 実装優先度
1. **Phase 1**: 基本プロフィール編集・会員情報表示
2. **Phase 2**: 活動履歴・イベント管理
3. **Phase 3**: 支払い・請求管理
4. **Phase 4**: セキュリティ強化・2FA
5. **Phase 5**: 高度な通知・設定機能