-- Create email_verification_codes table
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('login', 'register', 'password_reset')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE NULL,
  is_used BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  ip_address INET NULL,
  user_agent TEXT NULL
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_email_verification_codes_email_purpose 
  ON email_verification_codes (email, purpose);

CREATE INDEX IF NOT EXISTS idx_email_verification_codes_expires_at 
  ON email_verification_codes (expires_at);

CREATE INDEX IF NOT EXISTS idx_email_verification_codes_is_active 
  ON email_verification_codes (is_active);