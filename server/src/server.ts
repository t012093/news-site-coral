import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { testDatabaseConnection, testRedisConnection, initializeRedis, closeDatabaseConnections } from '@/config/database';
import { initializeSocketIO } from '@/socket/socketHandler';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';

// Routes
import authRoutes from '@/routes/authRoutes';
import userRoutes from '@/routes/userRoutes';
import taskRoutes from '@/routes/taskRoutes';
import projectRoutes from '@/routes/projectRoutes';
import messageRoutes from '@/routes/messageRoutes';
import newsRoutes from '@/routes/newsRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for GitHub Codespaces/cloud environments
app.set('trust proxy', true);

const server = createServer(app);

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Dynamic CORS origins based on environment
const getAllowedOrigins = () => {
  const origins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
  ];
  
  // Add development URLs if in development mode
  if (NODE_ENV === 'development') {
    origins.push(
      'http://localhost:5174',
      'https://crispy-rotary-phone-vj6xq69w45v3p4xq-5174.app.github.dev'
    );
  }
  
  return origins;
};

const io = new SocketIOServer(server, {
  cors: {
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // trustProxy setting removed - handled by app.set('trust proxy', true)
});

// Middleware
app.use(limiter);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/news', newsRoutes);

// Initialize Socket.IO
initializeSocketIO(io);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database connections
const initializeDatabases = async () => {
  try {
    // Initialize Redis connection (non-blocking)
    await initializeRedis().catch(err => {
      console.warn('⚠️ Redis initialization failed, continuing with mock client:', err.message);
    });
    
    // Test database connections (non-blocking)
    const dbConnected = await testDatabaseConnection().catch(() => false);
    const redisConnected = await testRedisConnection().catch(() => false);
    
    if (dbConnected && redisConnected) {
      console.log('✅ All database connections successful');
    } else if (!dbConnected && !redisConnected) {
      console.log('⚠️  Running without database connections (mock mode)');
    } else {
      console.log('⚠️  Some database connections failed, continuing with available connections');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error instanceof Error ? error.message : 'Unknown error');
    // Don't throw error - continue with mock connections
  }
};

// Start server
const startServer = async () => {
  try {
    await initializeDatabases();
    
    server.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Server is running on 0.0.0.0:${PORT} in ${NODE_ENV} mode`);
      console.log(`📡 Socket.IO server is ready`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down gracefully...`);
  
  server.close(async () => {
    console.log('🔌 HTTP server closed');
    
    // Close database connections
    await closeDatabaseConnections();
    
    console.log('✅ Process terminated gracefully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('❌ Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;