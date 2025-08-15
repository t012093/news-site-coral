#!/bin/bash
# Database setup script for CORAL backend

set -e

echo "🗄️  Setting up CORAL database..."

# Load environment variables
if [ -f .env ]; then
    source .env
fi

# Default database connection parameters
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-coral_db}
DB_USER=${DB_USER:-postgres}
POSTGRES_DB=${POSTGRES_DB:-postgres}

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT; then
    echo "❌ PostgreSQL is not running on $DB_HOST:$DB_PORT"
    echo "Please start PostgreSQL service first"
    exit 1
fi

# Function to run SQL file
run_sql() {
    local file=$1
    echo "📄 Running $file..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -f "sql/$file"
    echo "✅ $file completed"
}

# Check if database exists, create if not
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -d $POSTGRES_DB -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "🔨 Creating database $DB_NAME..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -d $POSTGRES_DB -U $DB_USER -c "CREATE DATABASE $DB_NAME;"
fi

# Install uuid-ossp extension
echo "📦 Installing required extensions..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Run SQL files in order
echo "🏗️  Creating database schema..."

run_sql "002_create_enums.sql"
run_sql "003_create_users_table.sql"
run_sql "004_create_projects_tables.sql"
run_sql "005_create_tasks_tables.sql"
run_sql "006_create_messaging_tables.sql"
run_sql "007_create_notifications_table.sql"
run_sql "008_create_views.sql"

# Ask if user wants to seed with sample data
read -p "🌱 Do you want to seed the database with sample data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_sql "009_seed_data.sql"
    echo "✅ Sample data inserted"
else
    echo "⏭️  Skipping sample data insertion"
fi

echo "🎉 Database setup completed successfully!"
echo ""
echo "📊 Database summary:"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -c "
SELECT 
    schemaname,
    tablename,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = schemaname AND table_name = tablename) as table_exists
FROM (
    VALUES 
        ('public', 'users'),
        ('public', 'projects'),
        ('public', 'tasks'),
        ('public', 'conversations'),
        ('public', 'messages'),
        ('public', 'notifications')
) AS t(schemaname, tablename);
"