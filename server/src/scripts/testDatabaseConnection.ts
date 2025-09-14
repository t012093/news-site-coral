#!/usr/bin/env tsx
import { testDatabaseConnection, testRedisConnection, closeDatabaseConnections } from '@/config/database';
import { emailService } from '@/services/emailService';

async function testConnections() {
  console.log('🔍 Testing database and service connections...\n');

  // Test PostgreSQL connection
  console.log('📊 Testing PostgreSQL connection...');
  const dbConnected = await testDatabaseConnection();
  if (dbConnected) {
    console.log('✅ PostgreSQL connection successful');
  } else {
    console.log('❌ PostgreSQL connection failed');
  }

  // Test Redis connection
  console.log('\n🔄 Testing Redis connection...');
  const redisConnected = await testRedisConnection();
  if (redisConnected) {
    console.log('✅ Redis connection successful');
  } else {
    console.log('❌ Redis connection failed (using mock client)');
  }

  // Test Email service
  console.log('\n📧 Testing Email service...');
  try {
    const emailConnected = await emailService.testConnection();
    if (emailConnected) {
      console.log('✅ Email service connection successful');
    } else {
      console.log('❌ Email service connection failed (using mock service)');
    }
  } catch (error) {
    console.log('❌ Email service test failed:', error instanceof Error ? error.message : 'Unknown error');
  }

  // Test database queries
  if (dbConnected) {
    console.log('\n🔍 Testing database queries...');
    try {
      const { pool } = await import('@/config/database');

      // Test basic query
      const result = await pool.query('SELECT NOW() as current_time, VERSION() as version');
      console.log('✅ Database query successful');
      console.log(`   Current time: ${result.rows[0].current_time}`);
      console.log(`   PostgreSQL version: ${result.rows[0].version.split(' ')[0]}`);

      // Test users table
      const userTableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'users'
        );
      `);

      if (userTableCheck.rows[0].exists) {
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        console.log(`✅ Users table exists with ${userCount.rows[0].count} records`);
      } else {
        console.log('⚠️  Users table does not exist - run migrations first');
      }

    } catch (error) {
      console.log('❌ Database query failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Environment check
  console.log('\n🔧 Environment configuration:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   USE_REAL_DATABASES: ${process.env.USE_REAL_DATABASES}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  console.log(`   REDIS_URL: ${process.env.REDIS_URL ? 'Set' : 'Not set (using mock)'}`);
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? 'Set' : 'Not set (using mock)'}`);
  console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL}`);

  // Close connections
  await closeDatabaseConnections();
  console.log('\n✅ Connection test completed');
}

// Run the test
testConnections().catch((error) => {
  console.error('❌ Connection test failed:', error);
  process.exit(1);
});