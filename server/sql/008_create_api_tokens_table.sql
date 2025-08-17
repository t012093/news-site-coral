-- API Tokens table for MCP server authentication
-- Allows users to generate API tokens for external access
CREATE TABLE api_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Token permissions and scope
    scope TEXT[] DEFAULT ARRAY['read', 'write'],
    is_active BOOLEAN DEFAULT true,
    
    -- Token expiration
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    last_used_ip INET,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_api_tokens_user_id ON api_tokens(user_id);
CREATE INDEX idx_api_tokens_token_hash ON api_tokens(token_hash);
CREATE INDEX idx_api_tokens_is_active ON api_tokens(is_active);
CREATE INDEX idx_api_tokens_expires_at ON api_tokens(expires_at);
CREATE INDEX idx_api_tokens_last_used_at ON api_tokens(last_used_at);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_api_tokens_updated_at 
    BEFORE UPDATE ON api_tokens 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM api_tokens 
    WHERE expires_at IS NOT NULL 
    AND expires_at < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON TABLE api_tokens IS 'API tokens for external service authentication, including MCP servers';
COMMENT ON COLUMN api_tokens.token_hash IS 'SHA-256 hash of the actual token for security';
COMMENT ON COLUMN api_tokens.scope IS 'Array of permissions: read, write, admin';
COMMENT ON COLUMN api_tokens.name IS 'User-friendly name for the token (e.g., "Claude MCP Server")';