-- Friendships table for user connections
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status friendship_status_enum NOT NULL DEFAULT 'pending',
    message TEXT, -- optional message with friend request
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(requester_id, addressee_id),
    CHECK (requester_id != addressee_id)
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type conversation_type_enum NOT NULL DEFAULT 'direct',
    title VARCHAR(255), -- for group conversations
    last_message_id UUID, -- will be set later with foreign key
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversation participants table
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    last_read_message_id UUID,
    unread_count INTEGER DEFAULT 0,
    is_muted BOOLEAN DEFAULT false,
    
    UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type message_type_enum NOT NULL DEFAULT 'text',
    reply_to_id UUID REFERENCES messages(id),
    metadata JSONB, -- for file info, image dimensions, etc.
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Message receipts table
CREATE TABLE message_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status message_receipt_status_enum NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(message_id, user_id, status)
);

-- Add foreign key for last_message_id after messages table is created
ALTER TABLE conversations 
ADD CONSTRAINT fk_conversations_last_message 
FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL;

-- Add foreign key for last_read_message_id after messages table is created
ALTER TABLE conversation_participants 
ADD CONSTRAINT fk_participants_last_read_message 
FOREIGN KEY (last_read_message_id) REFERENCES messages(id) ON DELETE SET NULL;

-- Indexes for friendships
CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);
CREATE INDEX idx_friendships_created_at ON friendships(created_at);

-- Indexes for conversations
CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_id);

-- Indexes for conversation_participants
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_unread ON conversation_participants(unread_count) WHERE unread_count > 0;

-- Indexes for messages
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_reply_to ON messages(reply_to_id);
CREATE INDEX idx_messages_type ON messages(message_type);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- GIN index for message metadata
CREATE INDEX idx_messages_metadata ON messages USING GIN(metadata);

-- Indexes for message_receipts
CREATE INDEX idx_message_receipts_message ON message_receipts(message_id);
CREATE INDEX idx_message_receipts_user ON message_receipts(user_id);
CREATE INDEX idx_message_receipts_status ON message_receipts(status);

-- Triggers for updated_at
CREATE TRIGGER update_friendships_updated_at 
    BEFORE UPDATE ON friendships 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update conversation updated_at when new message is added
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET updated_at = NEW.created_at, last_message_id = NEW.id 
    WHERE id = NEW.conversation_id;
    
    -- Update unread counts for all participants except sender
    UPDATE conversation_participants 
    SET unread_count = unread_count + 1 
    WHERE conversation_id = NEW.conversation_id 
    AND user_id != NEW.sender_id
    AND left_at IS NULL;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update conversation when message is added
CREATE TRIGGER update_conversation_on_new_message 
    AFTER INSERT ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_conversation_on_message();

-- Function to update unread count when message is read
CREATE OR REPLACE FUNCTION update_unread_count_on_read()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'read' THEN
        UPDATE conversation_participants 
        SET unread_count = GREATEST(0, unread_count - 1),
            last_read_message_id = (
                SELECT m.id FROM messages m 
                WHERE m.conversation_id = (
                    SELECT conversation_id FROM messages WHERE id = NEW.message_id
                ) 
                ORDER BY m.created_at DESC LIMIT 1
            )
        WHERE conversation_id = (
            SELECT conversation_id FROM messages WHERE id = NEW.message_id
        ) 
        AND user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update unread count on message read receipt
CREATE TRIGGER update_unread_on_read_receipt 
    AFTER INSERT ON message_receipts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_unread_count_on_read();