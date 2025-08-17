#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosInstance } from "axios";
import * as dotenv from "dotenv";
import { getConfig } from "./cli.js";

// Load environment variables
dotenv.config();

// Types for our API
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked' | 'cancelled';
  category: 'development' | 'design' | 'marketing' | 'content' | 'research' | 'meeting' | 'other';
  projectId: string;
  assignedTo?: string;
  createdBy: string;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  createdAt: string;
}

interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'development' | 'design' | 'marketing' | 'content' | 'research' | 'meeting' | 'other';
  projectId: string;
  assignedTo?: string;
  dueDate?: string;
  tags?: string[];
}

class NewsTaskAPI {
  private client: AxiosInstance;
  private token: string | null = null;
  private config: any;

  constructor() {
    this.config = getConfig();
    this.client = axios.create({
      baseURL: this.config.apiBaseUrl,
      timeout: 10000,
    });

    // If we have a token in config, use it
    if (this.config.apiToken) {
      this.token = this.config.apiToken;
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  async authenticate(): Promise<void> {
    if (this.token) return; // Already authenticated

    const username = this.config.apiUsername;
    const password = this.config.apiPassword;

    if (!username || !password) {
      throw new Error('API credentials not configured. Run: news-site-mcp setup');
    }

    try {
      const response = await this.client.post('/auth/login', {
        email: username,
        password: password,
      });

      if (response.data.success && response.data.data.token) {
        this.token = response.data.data.token;
        this.client.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTasks(options: {
    projectId?: string;
    status?: string[];
    limit?: number;
    offset?: number;
  } = {}): Promise<{ tasks: Task[]; total: number }> {
    await this.authenticate();
    
    const params = new URLSearchParams();
    if (options.projectId) params.append('projectId', options.projectId);
    if (options.status) params.append('status', options.status.join(','));
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());

    const response = await this.client.get(`/tasks?${params.toString()}`);
    
    if (response.data.success) {
      return {
        tasks: response.data.data,
        total: response.data.meta.total,
      };
    }
    throw new Error('Failed to fetch tasks');
  }

  async getProjects(): Promise<Project[]> {
    await this.authenticate();
    
    const response = await this.client.get('/projects');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch projects');
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    await this.authenticate();
    
    const response = await this.client.post('/tasks', taskData);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to create task');
  }

  async updateTaskStatus(taskId: string, status: Task['status']): Promise<Task> {
    await this.authenticate();
    
    const response = await this.client.patch(`/tasks/${taskId}/status`, { status });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update task status');
  }

  async getTaskStats(projectId?: string): Promise<any> {
    await this.authenticate();
    
    const params = projectId ? `?projectId=${projectId}` : '';
    const response = await this.client.get(`/tasks/stats${params}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch task statistics');
  }
}

// Create API instance
const api = new NewsTaskAPI();

// Create the MCP server
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

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "tasks://active",
        mimeType: "application/json",
        name: "Active Tasks",
        description: "List of all active tasks in the system",
      },
      {
        uri: "tasks://projects",
        mimeType: "application/json", 
        name: "Projects",
        description: "List of all projects",
      },
      {
        uri: "tasks://stats",
        mimeType: "application/json",
        name: "Task Statistics",
        description: "Task statistics and metrics",
      },
    ],
  };
});

// Read specific resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "tasks://active": {
      const result = await api.getTasks({ status: ['todo', 'in_progress', 'review'] });
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case "tasks://projects": {
      const projects = await api.getProjects();
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    }

    case "tasks://stats": {
      const stats = await api.getTaskStats();
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_task",
        description: "Create a new task in the task management system",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Task title",
            },
            description: {
              type: "string",
              description: "Task description (optional)",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              description: "Task priority level",
            },
            category: {
              type: "string",
              enum: ["development", "design", "marketing", "content", "research", "meeting", "other"],
              description: "Task category",
            },
            projectId: {
              type: "string",
              description: "Project ID where the task belongs",
            },
            assignedTo: {
              type: "string",
              description: "User ID to assign the task to (optional)",
            },
            dueDate: {
              type: "string",
              description: "Due date in ISO format (optional)",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Array of tags (optional)",
            },
          },
          required: ["title", "priority", "category", "projectId"],
        },
      },
      {
        name: "update_task_status",
        description: "Update the status of an existing task",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "ID of the task to update",
            },
            status: {
              type: "string",
              enum: ["todo", "in_progress", "review", "completed", "blocked", "cancelled"],
              description: "New status for the task",
            },
          },
          required: ["taskId", "status"],
        },
      },
      {
        name: "get_tasks",
        description: "Get tasks with optional filtering",
        inputSchema: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              description: "Filter tasks by project ID (optional)",
            },
            status: {
              type: "array",
              items: {
                type: "string",
                enum: ["todo", "in_progress", "review", "completed", "blocked", "cancelled"],
              },
              description: "Filter tasks by status (optional)",
            },
            limit: {
              type: "number",
              description: "Maximum number of tasks to return (optional, default: 50)",
            },
            offset: {
              type: "number",
              description: "Number of tasks to skip (optional, default: 0)",
            },
          },
        },
      },
      {
        name: "get_projects",
        description: "Get all available projects",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "create_task": {
      const task = await api.createTask(args as unknown as CreateTaskRequest);
      return {
        content: [
          {
            type: "text",
            text: `Task created successfully!\n\nID: ${task.id}\nTitle: ${task.title}\nPriority: ${task.priority}\nStatus: ${task.status}\nProject: ${task.projectId}\nCreated: ${task.createdAt}`,
          },
        ],
      };
    }

    case "update_task_status": {
      const { taskId, status } = args as unknown as { taskId: string; status: Task['status'] };
      const task = await api.updateTaskStatus(taskId, status);
      return {
        content: [
          {
            type: "text",
            text: `Task status updated successfully!\n\nTask: ${task.title}\nNew Status: ${task.status}\nUpdated: ${task.updatedAt}`,
          },
        ],
      };
    }

    case "get_tasks": {
      const options = args as unknown as {
        projectId?: string;
        status?: string[];
        limit?: number;
        offset?: number;
      };
      const result = await api.getTasks(options);
      return {
        content: [
          {
            type: "text",
            text: `Found ${result.total} tasks (showing ${result.tasks.length}):\n\n${result.tasks
              .map(
                (task) =>
                  `• ${task.title} [${task.status}] - ${task.priority} priority (${task.category})`
              )
              .join('\n')}`,
          },
        ],
      };
    }

    case "get_projects": {
      const projects = await api.getProjects();
      return {
        content: [
          {
            type: "text",
            text: `Available projects:\n\n${projects
              .map((project) => `• ${project.name} (${project.id}) - ${project.status}`)
              .join('\n')}`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("News Site Task MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});