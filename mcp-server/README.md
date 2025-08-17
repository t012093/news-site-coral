# News Site Task Management MCP Server

A Model Context Protocol (MCP) server that provides Claude Code with seamless access to the News Site Coral task management system. Create, manage, and track tasks directly from your AI conversations.

## ✨ Features

- **🎯 Task Management**: Create, update, and track tasks
- **📊 Project Integration**: Access project information and statistics  
- **🔍 Smart Filtering**: Search and filter tasks by status, priority, project
- **🔐 Secure Authentication**: Automatic login with credential management
- **📈 Analytics**: Task statistics and progress tracking

## 🚀 Quick Start

### Installation

```bash
npm install -g @news-site-coral/mcp-task-server
```

### Configuration

Set up your API credentials:

```bash
news-site-mcp setup
```

This will prompt you for:
- API Base URL (e.g., `https://your-api.com/api`)
- Username/Email
- Password
- Optional: Existing API token

### Claude Code Integration

Add to Claude Code:

```bash
claude mcp add news-task -- npx @news-site-coral/mcp-task-server
```

### That's it! 🎉

You can now ask Claude to:
- "Create a new development task for the login feature"
- "Show me all high-priority tasks"  
- "Update task XYZ to completed status"
- "Get project statistics"

## 📋 Available Resources

| Resource | Description |
|----------|-------------|
| `tasks://active` | Active tasks (todo, in_progress, review) |
| `tasks://projects` | All available projects |
| `tasks://stats` | Task statistics and metrics |

## 🛠️ Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `create_task` | Create a new task | `title`, `priority`, `category`, `projectId`, optional: `description`, `assignedTo`, `dueDate`, `tags` |
| `update_task_status` | Update task status | `taskId`, `status` |
| `get_tasks` | Get filtered tasks | optional: `projectId`, `status[]`, `limit`, `offset` |
| `get_projects` | Get all projects | none |

## ⚙️ Configuration Options

### Using CLI Setup (Recommended)
```bash
news-site-mcp setup
```

### Using API Token (Recommended)
```bash
export NEWS_SITE_API_BASE_URL="https://your-api.com/api"
export NEWS_SITE_API_TOKEN="nst_your_generated_api_token_here"
```

**How to get your API token:**
1. Login to your News Site Coral account
2. Go to the login page (even if already logged in)
3. Click "新規作成" (Create New) in the API Token section
4. Enter a name like "Claude MCP Server" 
5. Copy the generated token and set it as the `NEWS_SITE_API_TOKEN` environment variable

### Using Username/Password (Legacy)
```bash
export NEWS_SITE_API_BASE_URL="https://your-api.com/api"
export NEWS_SITE_API_USERNAME="your-email@domain.com"  
export NEWS_SITE_API_PASSWORD="your-password"
```

### Using Legacy Environment Variables
```bash
export API_BASE_URL="https://your-api.com/api"
export API_TOKEN="nst_your_generated_api_token_here"  # New API token format
# OR legacy username/password:
export API_USERNAME="your-email@domain.com"
export API_PASSWORD="your-password"
```

## 🔧 CLI Commands

| Command | Description |
|---------|-------------|
| `news-site-mcp setup` | Interactive setup wizard |
| `news-site-mcp config` | Show current configuration |
| `news-site-mcp version` | Show version information |
| `news-site-mcp help` | Show help information |

## 🧪 Testing & Development

Test the server using the MCP inspector:
```bash
npx @modelcontextprotocol/inspector npx @news-site-coral/mcp-task-server
```

For local development:
```bash
git clone https://github.com/your-username/news-site-coral.git
cd news-site-coral/mcp-server
npm install
npm run dev
```

## 🐛 Troubleshooting

### Authentication Issues
```bash
# Check your configuration
news-site-mcp config

# Reconfigure credentials
news-site-mcp setup
```

### Connection Issues
- Verify your API base URL is correct and accessible
- Check if your API server is running
- Ensure firewall allows connections to the API port

### Claude Code Integration Issues
```bash
# Remove and re-add the server
claude mcp remove news-task
claude mcp add news-task -- npx @news-site-coral/mcp-task-server
```

## 📖 Usage Examples

### Basic Task Creation
*"Claude, create a new high-priority development task called 'Implement user authentication' for project ABC123"*

### Status Updates  
*"Update task DEF456 to completed status"*

### Project Overview
*"Show me all active tasks for the mobile app project"*

### Statistics
*"What are the current task statistics?"*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/news-site-coral/issues)
- **Documentation**: [Project Wiki](https://github.com/your-username/news-site-coral/wiki)
- **Email**: support@news-site-coral.com