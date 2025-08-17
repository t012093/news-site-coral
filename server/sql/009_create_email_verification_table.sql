-- Email verification codes for Gmail authentication
CREATE TABLE email_verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    purpose VARCHAR(50) NOT NULL DEFAULT 'login', -- 'login', 'register', 'password_reset'
    
    -- Security and tracking
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    ip_address INET,
    user_agent TEXT,
    
    -- Timing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_used BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true
);

-- Indexes for performance
CREATE INDEX idx_email_verification_email ON email_verification_codes(email);
CREATE INDEX idx_email_verification_code ON email_verification_codes(code);
CREATE INDEX idx_email_verification_expires_at ON email_verification_codes(expires_at);
CREATE INDEX idx_email_verification_purpose ON email_verification_codes(purpose);
CREATE INDEX idx_email_verification_active ON email_verification_codes(is_active, expires_at);

-- Composite index for fast lookups
CREATE INDEX idx_email_verification_lookup ON email_verification_codes(email, code, purpose, is_active);

-- Function to clean up expired verification codes
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE email_verification_codes 
    SET is_active = false
    WHERE expires_at < CURRENT_TIMESTAMP 
    AND is_active = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to generate a 6-digit verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS VARCHAR(6) AS $$
BEGIN
    RETURN LPAD((FLOOR(RANDOM() * 1000000))::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE email_verification_codes IS 'Stores 6-digit verification codes for email authentication';
COMMENT ON COLUMN email_verification_codes.code IS '6-digit numeric verification code';
COMMENT ON COLUMN email_verification_codes.purpose IS 'Purpose of verification: login, register, password_reset';
COMMENT ON COLUMN email_verification_codes.attempts IS 'Number of verification attempts made';
COMMENT ON COLUMN email_verification_codes.max_attempts IS 'Maximum allowed attempts before code becomes invalid';