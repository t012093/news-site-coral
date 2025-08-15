-- Supabase既存テーブル確認用クエリ
-- これをSupabase SQL Editorで実行してください

-- 既存テーブル一覧確認
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 各テーブルのカラム情報確認  
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;