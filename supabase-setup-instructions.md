# Supabase データベーススキーマ適用手順

## 🗄️ Supabaseでのスキーマ適用

### 1. Supabase Console にアクセス
- URL: https://supabase.com/dashboard
- プロジェクト: `ykywpylhxedsamsfcnov`

### 2. SQL Editor でスキーマ実行
1. 左メニュー > "SQL Editor" をクリック
2. "New query" をクリック
3. `/workspaces/news-site-coral/database/supabase_schema.sql` の内容を全てコピー&ペースト
4. "Run" ボタンでスキーマを実行

### 3. 作成されるテーブル確認
実行後、以下のテーブルが作成されます：
- ✅ `users` - ユーザー管理
- ✅ `projects` - プロジェクト管理  
- ✅ `project_members` - プロジェクトメンバー
- ✅ `tasks` - タスク管理
- ✅ `conversations` - 会話管理
- ✅ `conversation_participants` - 会話参加者
- ✅ `messages` - メッセージ
- ✅ `message_read_status` - 既読状態

### 4. RLS (Row Level Security) 確認
- 各テーブルでRLSが有効化
- 基本的なセキュリティポリシー適用済み
- 認証ユーザーのみアクセス可能

### 5. 接続テスト
スキーマ適用後、以下のクエリで接続確認：
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

期待される結果：8つのテーブルが表示されること

## ⚠️ 注意事項
- スキーマは一度だけ実行してください
- エラーが出た場合は、既存テーブルとの競合を確認
- 本番環境なので慎重に実行してください