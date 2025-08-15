-- Create ENUM types for the database
-- These must be created before the tables that use them

-- User related enums
CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'member', 'viewer');

-- Project related enums
CREATE TYPE project_status_enum AS ENUM ('active', 'completed', 'on_hold', 'cancelled');
CREATE TYPE project_member_role_enum AS ENUM ('owner', 'admin', 'member', 'viewer');

-- Task related enums
CREATE TYPE task_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status_enum AS ENUM ('todo', 'in_progress', 'review', 'completed', 'blocked', 'cancelled');
CREATE TYPE task_category_enum AS ENUM ('development', 'design', 'marketing', 'content', 'research', 'meeting', 'other');

-- Activity and notification enums
CREATE TYPE activity_type_enum AS ENUM ('created', 'updated', 'assigned', 'status_changed', 'commented', 'completed', 'deleted');
CREATE TYPE notification_type_enum AS ENUM ('assigned', 'due_soon', 'overdue', 'completed', 'mentioned', 'status_changed', 'comment_added');

-- Message related enums
CREATE TYPE friendship_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'blocked');
CREATE TYPE conversation_type_enum AS ENUM ('direct', 'group');
CREATE TYPE message_type_enum AS ENUM ('text', 'image', 'file', 'system');
CREATE TYPE message_receipt_status_enum AS ENUM ('delivered', 'read');