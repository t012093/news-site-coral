#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import * as readline from 'readline';

const CONFIG_DIR = join(homedir(), '.news-site-mcp');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

interface Config {
  apiBaseUrl: string;
  apiUsername: string;
  apiPassword: string;
  apiToken?: string;
}

function createConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function loadConfig(): Config | null {
  try {
    if (existsSync(CONFIG_FILE)) {
      return JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('❌ Error loading config:', error);
  }
  return null;
}

function saveConfig(config: Config) {
  try {
    createConfigDir();
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('✅ Configuration saved successfully!');
  } catch (error) {
    console.error('❌ Error saving config:', error);
  }
}

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function setupConfig() {
  console.log('🔧 News Site MCP Server Setup');
  console.log('================================\n');

  const config = loadConfig() || {
    apiBaseUrl: 'http://localhost:3001/api',
    apiUsername: '',
    apiPassword: ''
  };

  console.log('Enter your News Site API configuration:\n');

  // API Base URL
  const apiBaseUrl = await askQuestion(`API Base URL (${config.apiBaseUrl}): `);
  if (apiBaseUrl) config.apiBaseUrl = apiBaseUrl;

  // Username/Email
  const apiUsername = await askQuestion(`Username/Email (${config.apiUsername || 'example@domain.com'}): `);
  if (apiUsername) config.apiUsername = apiUsername;

  // Password
  const apiPassword = await askQuestion(`Password: `);
  if (apiPassword) config.apiPassword = apiPassword;

  // Optional: API Token
  const useToken = await askQuestion('Do you have an existing API token? (y/N): ');
  if (useToken.toLowerCase() === 'y' || useToken.toLowerCase() === 'yes') {
    const apiToken = await askQuestion('API Token: ');
    if (apiToken) config.apiToken = apiToken;
  }

  saveConfig(config);

  console.log('\n🎉 Setup complete! You can now add this server to Claude Code:\n');
  console.log('claude mcp add news-task -- npx @news-site-coral/mcp-task-server\n');
}

function showConfig() {
  const config = loadConfig();
  if (!config) {
    console.log('❌ No configuration found. Run: news-site-mcp setup');
    return;
  }

  console.log('📋 Current Configuration:');
  console.log('=========================');
  console.log(`API Base URL: ${config.apiBaseUrl}`);
  console.log(`Username: ${config.apiUsername}`);
  console.log(`Password: ${'*'.repeat(config.apiPassword.length)}`);
  if (config.apiToken) {
    console.log(`API Token: ${config.apiToken.substring(0, 10)}...`);
  }
}

function showHelp() {
  console.log(`
🎯 News Site MCP Server CLI

Usage:
  news-site-mcp [command]

Commands:
  setup     Setup API configuration
  config    Show current configuration  
  help      Show this help message
  version   Show version information

Examples:
  news-site-mcp setup              # Setup API credentials
  news-site-mcp config             # View current config
  
Claude Code Integration:
  claude mcp add news-task -- npx @news-site-coral/mcp-task-server

Environment Variables (alternative to setup):
  NEWS_SITE_API_BASE_URL    API base URL
  NEWS_SITE_API_USERNAME    Username/email
  NEWS_SITE_API_PASSWORD    Password  
  NEWS_SITE_API_TOKEN       Optional API token

For more information, visit:
  https://github.com/your-username/news-site-coral/tree/main/mcp-server
`);
}

function showVersion() {
  try {
    const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));
    console.log(`News Site MCP Server v${packageJson.version}`);
  } catch {
    console.log('News Site MCP Server v1.0.0');
  }
}

// Export config loader for main server
export function getConfig(): Config {
  // First try environment variables
  const envConfig = {
    apiBaseUrl: process.env.NEWS_SITE_API_BASE_URL,
    apiUsername: process.env.NEWS_SITE_API_USERNAME,
    apiPassword: process.env.NEWS_SITE_API_PASSWORD,
    apiToken: process.env.NEWS_SITE_API_TOKEN,
  };

  if (envConfig.apiBaseUrl && envConfig.apiUsername && envConfig.apiPassword) {
    return envConfig as Config;
  }

  // Fallback to config file
  const fileConfig = loadConfig();
  if (fileConfig) {
    return fileConfig;
  }

  // Final fallback to legacy env variables
  return {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001/api',
    apiUsername: process.env.API_USERNAME || '',
    apiPassword: process.env.API_PASSWORD || '',
    apiToken: process.env.API_TOKEN,
  };
}

// CLI execution
async function main() {
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'setup':
      await setupConfig();
      break;
    case 'config':
      showConfig();
      break;
    case 'version':
      showVersion();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      console.log(`❌ Unknown command: ${command}`);
      console.log('Run "news-site-mcp help" for usage information.');
      process.exit(1);
  }
}

// Only run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}