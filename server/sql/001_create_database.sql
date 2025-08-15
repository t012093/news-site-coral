-- Create database and user (run as postgres superuser)
-- This script should be run manually by database administrator

CREATE DATABASE coral_db;
CREATE USER coral_user WITH PASSWORD 'coral_password_dev_2024';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE coral_db TO coral_user;

-- Connect to coral_db and grant schema privileges
\c coral_db;
GRANT ALL ON SCHEMA public TO coral_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO coral_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO coral_user;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";