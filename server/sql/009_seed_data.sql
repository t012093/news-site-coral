-- Seed data for development and testing
-- Insert demo users
INSERT INTO users (id, email, password_hash, username, display_name, avatar_url, bio, role, email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@coral.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdPu7/K1Gv3KXGG', 'admin', 'システム管理者', '/images/admin.png', 'CORALシステムの管理者です', 'admin', true),
('550e8400-e29b-41d4-a716-446655440001', 'manager@coral.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdPu7/K1Gv3KXGG', 'manager', 'プロジェクトマネージャー', '/images/manager.png', 'プロジェクト管理を担当しています', 'manager', true),
('550e8400-e29b-41d4-a716-446655440002', 'demo@coral.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdPu7/K1Gv3KXGG', 'demo_user', 'デモユーザー', '/images/man.png', 'CORALコミュニティのデモユーザーです', 'member', true),
('550e8400-e29b-41d4-a716-446655440003', 'alice@coral.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdPu7/K1Gv3KXGG', 'alice', 'Alice Johnson', '/images/she.png', 'デザイナーです', 'member', true),
('550e8400-e29b-41d4-a716-446655440004', 'bob@coral.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdPu7/K1Gv3KXGG', 'bob', 'Bob Smith', '/images/man4.png', 'フロントエンド開発者', 'member', true),
('550e8400-e29b-41d4-a716-446655440005', 'carol@coral.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdPu7/K1Gv3KXGG', 'carol', 'Carol White', '/images/she2.png', 'バックエンド開発者', 'member', true);

-- Insert demo projects
INSERT INTO projects (id, name, description, color, icon, status, owner_id) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'CORALウェブサイト', 'メインのウェブサイト開発プロジェクト', '#3b82f6', '🌐', 'active', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440001', 'モバイルアプリ', 'CORALモバイルアプリケーション', '#10b981', '📱', 'active', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'AIチャットボット', '顧客サポート用AIチャットボット', '#f59e0b', '🤖', 'active', '550e8400-e29b-41d4-a716-446655440001');

-- Insert project members
INSERT INTO project_members (project_id, user_id, role) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'owner'),
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'member'),
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'member'),
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', 'member'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'owner'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'admin'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'member'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'owner'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'admin');

-- Insert demo tasks
INSERT INTO tasks (id, title, description, priority, status, category, project_id, assigned_to, created_by, due_date, estimated_hours) VALUES
('770e8400-e29b-41d4-a716-446655440000', 'ホームページのデザイン更新', '新しいブランドガイドラインに基づいてホームページのデザインを更新する', 'high', 'in_progress', 'design', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2024-08-20 17:00:00+00', 16),
('770e8400-e29b-41d4-a716-446655440001', 'ユーザー認証システムの実装', 'JWT認証システムを実装する', 'urgent', 'todo', 'development', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2024-08-18 17:00:00+00', 24),
('770e8400-e29b-41d4-a716-446655440002', 'データベースマイグレーション', '新しいテーブル構造に対応するマイグレーションを作成', 'medium', 'completed', 'development', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '2024-08-15 17:00:00+00', 8),
('770e8400-e29b-41d4-a716-446655440003', 'モバイルアプリUI設計', 'iOS/Android向けのUI設計を完成させる', 'high', 'in_progress', 'design', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2024-08-22 17:00:00+00', 32),
('770e8400-e29b-41d4-a716-446655440004', 'API仕様書の作成', 'REST API仕様書をOpenAPIで作成', 'medium', 'todo', 'content', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '2024-08-25 17:00:00+00', 12);

-- Update completed task
UPDATE tasks SET completed_at = '2024-08-14 16:30:00+00', actual_hours = 6 WHERE id = '770e8400-e29b-41d4-a716-446655440002';

-- Insert task tags
INSERT INTO task_tags (task_id, tag_name) VALUES
('770e8400-e29b-41d4-a716-446655440000', 'urgent'),
('770e8400-e29b-41d4-a716-446655440000', 'frontend'),
('770e8400-e29b-41d4-a716-446655440001', 'backend'),
('770e8400-e29b-41d4-a716-446655440001', 'security'),
('770e8400-e29b-41d4-a716-446655440002', 'database'),
('770e8400-e29b-41d4-a716-446655440003', 'mobile'),
('770e8400-e29b-41d4-a716-446655440003', 'ui/ux'),
('770e8400-e29b-41d4-a716-446655440004', 'documentation');

-- Insert task comments
INSERT INTO task_comments (task_id, author_id, content) VALUES
('770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', '新しいカラーパレットでモックアップを作成中です'),
('770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'ありがとうございます！期待しています'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'JWT実装のための調査を開始しました'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Figmaでプロトタイプを作成しました');

-- Insert some friendships
INSERT INTO friendships (requester_id, addressee_id, status, message) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'accepted', 'よろしくお願いします！'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'accepted', 'プロジェクトでお世話になります'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'accepted', null),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'pending', 'よろしくお願いします！');

-- Insert conversations
INSERT INTO conversations (id, type) VALUES
('880e8400-e29b-41d4-a716-446655440000', 'direct'),
('880e8400-e29b-41d4-a716-446655440001', 'direct'),
('880e8400-e29b-41d4-a716-446655440002', 'group');

-- Insert conversation participants
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005');

-- Update group conversation title
UPDATE conversations SET title = 'フロントエンド開発チーム' WHERE id = '880e8400-e29b-41d4-a716-446655440002';

-- Insert sample messages
INSERT INTO messages (id, conversation_id, sender_id, content, message_type) VALUES
('990e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'こんにちは！デザインの件でお聞きしたいことがあります', 'text'),
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'はい、何でしょうか？', 'text'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'コードレビューをお願いできますか？', 'text'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'みなさん、今日の進捗を共有しましょう！', 'text'),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'ホームページのコンポーネント実装が完了しました', 'text');

-- Insert notifications
INSERT INTO notifications (user_id, task_id, type, title, message) VALUES
('550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440000', 'assigned', 'タスクが割り当てられました', 'ホームページのデザイン更新タスクが割り当てられました'),
('550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'assigned', 'タスクが割り当てられました', 'ユーザー認証システムの実装タスクが割り当てられました'),
('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 'completed', 'タスクが完了しました', 'データベースマイグレーションが完了しました');