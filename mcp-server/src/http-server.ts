#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

// Import the existing server logic
import "./index.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.MCP_PORT || '3002');

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'news-task-mcp-server' });
});

// SSE endpoint for MCP
app.get('/sse', async (req, res) => {
  console.log('SSE connection request received');
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  const transport = new SSEServerTransport('/sse', res);
  
  // Create and connect the MCP server
  const server = new Server(
    {
      name: "news-site-task-manager",
      version: "1.0.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // Set up all the handlers (same as stdio version)
  // ... (handlers would be imported from the main server)

  await server.connect(transport);
  console.log('MCP server connected via SSE');
});

// Start HTTP server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MCP HTTP Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 SSE endpoint: http://0.0.0.0:${PORT}/sse`);
});