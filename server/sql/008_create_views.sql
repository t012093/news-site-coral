-- Useful views for common queries

-- View for user friends (accepted friendships)
CREATE VIEW user_friends AS
SELECT 
    f.id as friendship_id,
    f.requester_id,
    f.addressee_id,
    CASE 
        WHEN f.requester_id = u1.id THEN u2.id
        ELSE u1.id
    END as friend_id,
    CASE 
        WHEN f.requester_id = u1.id THEN u2.username
        ELSE u1.username
    END as friend_username,
    CASE 
        WHEN f.requester_id = u1.id THEN u2.display_name
        ELSE u1.display_name
    END as friend_display_name,
    CASE 
        WHEN f.requester_id = u1.id THEN u2.avatar_url
        ELSE u1.avatar_url
    END as friend_avatar_url,
    CASE 
        WHEN f.requester_id = u1.id THEN u2.is_online
        ELSE u1.is_online
    END as friend_is_online,
    CASE 
        WHEN f.requester_id = u1.id THEN u2.last_seen
        ELSE u1.last_seen
    END as friend_last_seen,
    f.created_at as friendship_created_at
FROM friendships f
JOIN users u1 ON f.requester_id = u1.id
JOIN users u2 ON f.addressee_id = u2.id
WHERE f.status = 'accepted';

-- View for task summary with project and assignee info
CREATE VIEW task_summary AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.priority,
    t.status,
    t.category,
    t.due_date,
    t.estimated_hours,
    t.actual_hours,
    t.created_at,
    t.updated_at,
    p.name as project_name,
    p.color as project_color,
    p.icon as project_icon,
    creator.username as created_by_username,
    creator.display_name as created_by_display_name,
    assignee.username as assigned_to_username,
    assignee.display_name as assigned_to_display_name,
    assignee.avatar_url as assigned_to_avatar,
    (SELECT COUNT(*) FROM task_comments tc WHERE tc.task_id = t.id) as comment_count,
    (SELECT COUNT(*) FROM task_attachments ta WHERE ta.task_id = t.id) as attachment_count,
    ARRAY_AGG(DISTINCT tt.tag_name) FILTER (WHERE tt.tag_name IS NOT NULL) as tags
FROM tasks t
JOIN projects p ON t.project_id = p.id
JOIN users creator ON t.created_by = creator.id
LEFT JOIN users assignee ON t.assigned_to = assignee.id
LEFT JOIN task_tags tt ON t.id = tt.task_id
GROUP BY t.id, p.id, creator.id, assignee.id;

-- View for conversation summary with participant info
CREATE VIEW conversation_summary AS
SELECT 
    c.id,
    c.type,
    c.title,
    c.created_at,
    c.updated_at,
    lm.content as last_message_content,
    lm.created_at as last_message_at,
    sender.display_name as last_message_sender,
    sender.avatar_url as last_message_sender_avatar,
    ARRAY_AGG(
        JSON_BUILD_OBJECT(
            'user_id', cp.user_id,
            'username', u.username,
            'display_name', u.display_name,
            'avatar_url', u.avatar_url,
            'is_online', u.is_online,
            'unread_count', cp.unread_count,
            'is_muted', cp.is_muted
        )
    ) FILTER (WHERE cp.left_at IS NULL) as participants
FROM conversations c
LEFT JOIN messages lm ON c.last_message_id = lm.id
LEFT JOIN users sender ON lm.sender_id = sender.id
JOIN conversation_participants cp ON c.id = cp.conversation_id
JOIN users u ON cp.user_id = u.id
WHERE cp.left_at IS NULL
GROUP BY c.id, lm.id, sender.id;

-- View for project member summary
CREATE VIEW project_member_summary AS
SELECT 
    pm.project_id,
    pm.user_id,
    pm.role,
    pm.joined_at,
    u.username,
    u.display_name,
    u.avatar_url,
    u.email,
    u.is_online,
    p.name as project_name,
    (SELECT COUNT(*) FROM tasks t WHERE t.project_id = pm.project_id AND t.assigned_to = pm.user_id) as assigned_task_count,
    (SELECT COUNT(*) FROM tasks t WHERE t.project_id = pm.project_id AND t.created_by = pm.user_id) as created_task_count
FROM project_members pm
JOIN users u ON pm.user_id = u.id
JOIN projects p ON pm.project_id = p.id;

-- View for user activity summary
CREATE VIEW user_activity_summary AS
SELECT 
    u.id as user_id,
    u.username,
    u.display_name,
    (SELECT COUNT(*) FROM tasks t WHERE t.assigned_to = u.id AND t.status != 'completed') as active_tasks,
    (SELECT COUNT(*) FROM tasks t WHERE t.assigned_to = u.id AND t.status = 'completed') as completed_tasks,
    (SELECT COUNT(*) FROM project_members pm WHERE pm.user_id = u.id) as project_count,
    (SELECT COUNT(*) FROM friendships f WHERE (f.requester_id = u.id OR f.addressee_id = u.id) AND f.status = 'accepted') as friend_count,
    (SELECT COUNT(*) FROM notifications n WHERE n.user_id = u.id AND n.is_read = false) as unread_notifications
FROM users u
WHERE u.is_active = true;