import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createClient, RedisClientType } from 'redis';

dotenv.config();

// Environment variables with defaults
const DATABASE_URL = process.env.DATABASE_URL;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');
const DB_NAME = process.env.DB_NAME || 'coral_db';
const DB_USER = process.env.DB_USER || 'coral_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'coral_password';
const REDIS_URL = process.env.REDIS_URL || '';

// Check if we should use real databases
const USE_REAL_DATABASES = process.env.USE_REAL_DATABASES === 'true';

let pool: Pool | any;
let redisClient: RedisClientType | any;

if (USE_REAL_DATABASES) {
  // Real PostgreSQL connection - prefer DATABASE_URL if available
  if (DATABASE_URL) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  } else {
    pool = new Pool({
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  // Error handling for pool
  pool.on('error', (err: any) => {
    console.error('PostgreSQL pool error:', err);
  });

  // Check if Redis URL is configured
  if (REDIS_URL) {
    // Real Redis connection
    redisClient = createClient({
      url: REDIS_URL,
    });

    // Error handling for Redis
    redisClient.on('error', (err: any) => {
      console.error('Redis client error:', err);
    });
    
    console.log('🔌 Configured for real PostgreSQL and Redis connections');
  } else {
    // Use mock Redis if URL not provided
    console.log('⚠️  Redis URL not configured, using mock Redis client');
    redisClient = {
      setEx: async () => Promise.resolve('OK'),
      get: async () => Promise.resolve(null),
      del: async () => Promise.resolve(1),
      connect: async () => Promise.resolve(),
      ping: async () => Promise.resolve('PONG'),
      on: () => {},
      isOpen: true,
    };
    console.log('🔌 Configured for real PostgreSQL with mock Redis');
  }
} else {
  // Mock implementations for development without database
  console.log('⚠️  Running in mock mode without PostgreSQL and Redis');
  console.log('💡 To use real databases, set USE_REAL_DATABASES=true in environment');

  // Mock pool for development
  pool = {
    connect: async () => {
      throw new Error('Database not available in mock mode');
    },
    query: async () => {
      throw new Error('Database not available in mock mode');
    },
    on: () => {},
  };

  // Mock Redis client for development
  redisClient = {
    setEx: async () => Promise.resolve('OK'),
    get: async () => Promise.resolve(null),
    del: async () => Promise.resolve(1),
    connect: async () => Promise.resolve(),
    ping: async () => Promise.resolve('PONG'),
    on: () => {},
    isOpen: true,
  };
}

// Database configuration object
export const config = {
  pool,
  redisClient,
};

// Test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  if (!USE_REAL_DATABASES) {
    console.log('⚠️  Mock database connection - always returns false');
    return false;
  }

  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ PostgreSQL connection successful');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    return false;
  }
};

// Test Redis connection
export const testRedisConnection = async (): Promise<boolean> => {
  if (!USE_REAL_DATABASES || !REDIS_URL) {
    console.log('⚠️  Mock Redis connection - using mock client');
    return true;
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    await redisClient.ping();
    console.log('✅ Redis connection successful');
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
};

// Initialize Redis connection
export const initializeRedis = async () => {
  if (!USE_REAL_DATABASES || !REDIS_URL) {
    console.log('⚠️  Mock Redis initialization - using mock client');
    return;
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('🔌 Redis client connected successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Redis:', error);
  }
};

// Graceful shutdown
export const closeDatabaseConnections = async () => {
  if (USE_REAL_DATABASES) {
    try {
      await pool.end();
      console.log('🔌 PostgreSQL pool closed');
      
      if (REDIS_URL && redisClient.isOpen) {
        await redisClient.quit();
        console.log('🔌 Redis client disconnected');
      }
    } catch (error) {
      console.error('Error closing database connections:', error);
    }
  }
};

export { pool, redisClient };