# 🏗️ MCPサーバー作成ガイド

Model Context Protocol (MCP) サーバーを一から作成するための完全ガイドです。このドキュメントを使って、任意のAPIやサービス用のMCPサーバーを作成できます。

## 📖 目次

1. [MCPサーバーとは](#mcpサーバーとは)
2. [基本構造](#基本構造)
3. [ステップバイステップ作成ガイド](#ステップバイステップ作成ガイド)
4. [実装パターン](#実装パターン)
5. [テンプレートとサンプル](#テンプレートとサンプル)
6. [ベストプラクティス](#ベストプラクティス)
7. [パッケージング・公開](#パッケージング公開)
8. [トラブルシューティング](#トラブルシューティング)

---

## MCPサーバーとは

### 🎯 概要
MCPサーバーは、AI（Claude Codeなど）がWeb API、データベース、ファイルシステムなどの外部リソースにアクセスするためのブリッジです。

### 🔧 主な機能
- **Resources**: データへの読み取りアクセス（GET的）
- **Tools**: アクション実行（POST的）
- **Prompts**: 再利用可能なプロンプトテンプレート

### 🚀 トランスポート
- **STDIO**: ローカル実行用
- **SSE**: リモートアクセス用
- **HTTP**: REST API風アクセス用

---

## 基本構造

### 📁 プロジェクト構造
```
my-mcp-server/
├── package.json          # パッケージ設定
├── tsconfig.json         # TypeScript設定
├── src/
│   ├── index.ts          # メインサーバー
│   ├── cli.ts            # CLI管理
│   ├── api.ts            # API クライアント
│   └── types.ts          # 型定義
├── build/                # ビルド出力
├── README.md             # ドキュメント
└── LICENSE               # ライセンス
```

### 🧩 コア要素

#### 1. サーバー初期化
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "my-service-mcp",
  version: "1.0.0"
}, {
  capabilities: {
    resources: {},
    tools: {},
    prompts: {}
  }
});
```

#### 2. リソース（読み取り専用データ）
```typescript
// リソース一覧
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "data://items",
      name: "Items List", 
      description: "All available items"
    }
  ]
}));

// リソース読み取り
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  if (uri === "data://items") {
    const items = await api.getItems();
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(items, null, 2)
      }]
    };
  }
});
```

#### 3. ツール（アクション実行）
```typescript
// ツール一覧
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "create_item",
      description: "Create a new item",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" }
        },
        required: ["name"]
      }
    }
  ]
}));

// ツール実行
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "create_item":
      const item = await api.createItem(args);
      return {
        content: [{
          type: "text",
          text: `Item created: ${item.name}`
        }]
      };
  }
});
```

---

## ステップバイステップ作成ガイド

### Step 1: プロジェクトセットアップ

#### 1.1 プロジェクト初期化
```bash
mkdir my-api-mcp-server
cd my-api-mcp-server
npm init -y
```

#### 1.2 依存関係インストール
```bash
npm install @modelcontextprotocol/sdk axios dotenv
npm install -D typescript @types/node
```

#### 1.3 TypeScript設定
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
```

### Step 2: 基本サーバー作成

#### 2.1 型定義 (src/types.ts)
```typescript
// あなたのAPIのデータ型を定義
export interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
}
```

#### 2.2 APIクライアント (src/api.ts)
```typescript
import axios, { AxiosInstance } from 'axios';

export class MyAPIClient {
  private client: AxiosInstance;
  
  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
  }
  
  async getItems(): Promise<Item[]> {
    const response = await this.client.get('/items');
    return response.data;
  }
  
  async createItem(data: CreateItemRequest): Promise<Item> {
    const response = await this.client.post('/items', data);
    return response.data;
  }
}
```

#### 2.3 メインサーバー (src/index.ts)
```typescript
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";
import { MyAPIClient } from "./api.js";
import * as dotenv from "dotenv";

dotenv.config();

// API クライアント初期化
const api = new MyAPIClient(
  process.env.API_BASE_URL!,
  process.env.API_KEY!
);

// サーバー作成
const server = new Server({
  name: "my-api-mcp-server",
  version: "1.0.0"
}, {
  capabilities: {
    resources: {},
    tools: {}
  }
});

// リソース定義
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "items://all",
      name: "All Items",
      description: "List of all items"
    }
  ]
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  switch (uri) {
    case "items://all":
      const items = await api.getItems();
      return {
        contents: [{
          uri,
          mimeType: "application/json",
          text: JSON.stringify(items, null, 2)
        }]
      };
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// ツール定義
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "create_item",
      description: "Create a new item",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Item name" },
          description: { type: "string", description: "Item description" }
        },
        required: ["name"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "create_item":
      const item = await api.createItem(args as CreateItemRequest);
      return {
        content: [{
          type: "text",
          text: `✅ Item created successfully!\nName: ${item.name}\nID: ${item.id}`
        }]
      };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// サーバー起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("My API MCP Server running on stdio");
}

main().catch(console.error);
```

### Step 3: 設定管理

#### 3.1 環境変数設定
```bash
# .env
API_BASE_URL=https://api.example.com
API_KEY=your_api_key_here
```

#### 3.2 CLIツール (src/cli.ts)
```typescript
#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const CONFIG_FILE = join(homedir(), '.my-mcp-config.json');

interface Config {
  apiBaseUrl: string;
  apiKey: string;
}

async function setup() {
  console.log('🔧 Setup My API MCP Server');
  
  // 設定入力プロンプト
  const config: Config = {
    apiBaseUrl: await ask('API Base URL: '),
    apiKey: await ask('API Key: ')
  };
  
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  console.log('✅ Configuration saved!');
}

function ask(question: string): Promise<string> {
  // readline実装 (前回のcli.tsを参考)
}

if (process.argv[2] === 'setup') {
  setup();
}
```

### Step 4: ビルドとテスト

#### 4.1 package.json設定
```json
{
  "name": "@your-org/my-api-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "my-api-mcp": "./build/index.js"
  },
  "scripts": {
    "build": "tsc && chmod +x build/index.js",
    "dev": "npm run build && node build/index.js",
    "test": "npm run build"
  }
}
```

#### 4.2 ビルドとテスト
```bash
npm run build
npm run dev  # テスト実行
```

---

## 実装パターン

### 🔐 認証パターン

#### API Key認証
```typescript
class APIClient {
  constructor(apiKey: string) {
    this.client = axios.create({
      headers: { 'X-API-Key': apiKey }
    });
  }
}
```

#### OAuth認証
```typescript
class APIClient {
  private token: string | null = null;
  
  async authenticate(clientId: string, clientSecret: string) {
    const response = await axios.post('/oauth/token', {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    });
    this.token = response.data.access_token;
  }
}
```

### 📊 データフォーマットパターン

#### JSON形式
```typescript
return {
  contents: [{
    uri,
    mimeType: "application/json",
    text: JSON.stringify(data, null, 2)
  }]
};
```

#### テーブル形式
```typescript
const tableText = data.map(item => 
  `${item.id}\t${item.name}\t${item.status}`
).join('\n');

return {
  contents: [{
    uri,
    mimeType: "text/plain",
    text: `ID\tName\tStatus\n${tableText}`
  }]
};
```

### 🔄 エラーハンドリングパターン

```typescript
try {
  const result = await api.getData();
  return { content: [{ type: "text", text: result }] };
} catch (error) {
  if (error.response?.status === 401) {
    throw new Error('API authentication failed. Check your credentials.');
  } else if (error.response?.status === 404) {
    throw new Error('Resource not found.');
  } else {
    throw new Error(`API error: ${error.message}`);
  }
}
```

---

## テンプレートとサンプル

### 🚀 スターターテンプレート

#### 最小構成テンプレート
```bash
# テンプレートプロジェクトの作成
npx create-mcp-server my-new-server
cd my-new-server
npm install
```

#### GitHub APIサーバー例
```typescript
// GitHub Issues MCPサーバー
export class GitHubAPIClient {
  constructor(private token: string) {}
  
  async getIssues(repo: string): Promise<Issue[]> {
    const response = await axios.get(
      `https://api.github.com/repos/${repo}/issues`,
      { headers: { Authorization: `token ${this.token}` } }
    );
    return response.data;
  }
  
  async createIssue(repo: string, data: CreateIssueRequest): Promise<Issue> {
    const response = await axios.post(
      `https://api.github.com/repos/${repo}/issues`,
      data,
      { headers: { Authorization: `token ${this.token}` } }
    );
    return response.data;
  }
}

// リソース設定
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "github://issues/{repo}",
      name: "GitHub Issues",
      description: "Repository issues"
    }
  ]
}));

// ツール設定
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "create_github_issue",
      description: "Create a new GitHub issue",
      inputSchema: {
        type: "object",
        properties: {
          repo: { type: "string", description: "Repository (owner/name)" },
          title: { type: "string", description: "Issue title" },
          body: { type: "string", description: "Issue body" }
        },
        required: ["repo", "title"]
      }
    }
  ]
}));
```

#### Slack APIサーバー例
```typescript
export class SlackAPIClient {
  constructor(private token: string) {}
  
  async getChannels(): Promise<Channel[]> {
    const response = await axios.get(
      'https://slack.com/api/conversations.list',
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
    return response.data.channels;
  }
  
  async sendMessage(channel: string, text: string): Promise<any> {
    const response = await axios.post(
      'https://slack.com/api/chat.postMessage',
      { channel, text },
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
    return response.data;
  }
}
```

#### データベースサーバー例
```typescript
export class DatabaseClient {
  constructor(private connectionString: string) {}
  
  async query(sql: string): Promise<any[]> {
    // データベース接続・クエリ実行
    const client = new Client({ connectionString: this.connectionString });
    await client.connect();
    const result = await client.query(sql);
    await client.end();
    return result.rows;
  }
}

// SQLクエリツール
{
  name: "execute_sql",
  description: "Execute SQL query",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "SQL query to execute" },
      limit: { type: "number", description: "Result limit", default: 100 }
    },
    required: ["query"]
  }
}
```

---

## ベストプラクティス

### 🔒 セキュリティ

#### 認証情報の管理
```typescript
// ❌ 悪い例：ハードコーディング
const apiKey = "sk-1234567890abcdef";

// ✅ 良い例：環境変数
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable is required');
}
```

#### 入力検証
```typescript
function validateInput(args: any, schema: any): boolean {
  // Joi, Yup, Zodなどを使用した検証
  const { error } = schema.validate(args);
  if (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
  return true;
}

// ツール実行時の検証
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  validateInput(request.params.arguments, createItemSchema);
  // 処理続行...
});
```

#### レート制限
```typescript
class RateLimitedClient {
  private lastRequest = 0;
  private minInterval = 1000; // 1秒間隔
  
  async makeRequest(url: string) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequest = Date.now();
    return axios.get(url);
  }
}
```

### 📊 パフォーマンス

#### レスポンスキャッシュ
```typescript
class CachedAPIClient {
  private cache = new Map<string, { data: any; expiry: number }>();
  
  async getData(key: string): Promise<any> {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    
    const data = await this.fetchFromAPI(key);
    this.cache.set(key, {
      data,
      expiry: Date.now() + 5 * 60 * 1000 // 5分間キャッシュ
    });
    
    return data;
  }
}
```

#### ページネーション
```typescript
{
  name: "get_items",
  description: "Get items with pagination",
  inputSchema: {
    type: "object",
    properties: {
      page: { type: "number", default: 1 },
      limit: { type: "number", default: 50, maximum: 100 },
      filter: { type: "string" }
    }
  }
}

// 実装
const items = await api.getItems({
  offset: (page - 1) * limit,
  limit,
  filter
});

return {
  content: [{
    type: "text",
    text: `Found ${items.total} items (showing ${items.data.length})\n\n` +
          items.data.map(item => `• ${item.name}`).join('\n')
  }]
};
```

### 🧪 テスト可能性

#### モック可能な設計
```typescript
interface APIClientInterface {
  getItems(): Promise<Item[]>;
  createItem(data: CreateItemRequest): Promise<Item>;
}

export class MockAPIClient implements APIClientInterface {
  async getItems(): Promise<Item[]> {
    return [
      { id: "1", name: "Test Item", description: "Test" }
    ];
  }
  
  async createItem(data: CreateItemRequest): Promise<Item> {
    return {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    };
  }
}

// テスト時
const server = createServer(new MockAPIClient());
```

### 📝 ドキュメント

#### JSDocコメント
```typescript
/**
 * GitHub Issues MCPサーバー
 * GitHubリポジトリのIssue管理を提供
 * 
 * @example
 * // Claudeでの使用例
 * "Create a new issue in myuser/myrepo about bug fix"
 * "Show all open issues in myuser/myrepo"
 */
export class GitHubMCPServer {
  /**
   * 新しいIssueを作成
   * @param repo - リポジトリ名 (owner/name形式)
   * @param title - Issue タイトル
   * @param body - Issue 本文（オプション）
   * @returns 作成されたIssue情報
   */
  async createIssue(repo: string, title: string, body?: string): Promise<Issue> {
    // 実装...
  }
}
```

---

## パッケージング・公開

### 📦 NPMパッケージ作成

#### package.json設定例
```json
{
  "name": "@your-org/service-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for Service API integration",
  "main": "build/index.js",
  "type": "module",
  "bin": {
    "service-mcp": "./build/index.js",
    "service-mcp-setup": "./build/cli.js"
  },
  "files": [
    "build",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc && chmod +x build/index.js build/cli.js",
    "prepare": "npm run build",
    "test": "npm run build && npm run test:unit",
    "test:unit": "node --test build/**/*.test.js"
  },
  "keywords": ["mcp", "claude", "api", "integration", "your-service"],
  "author": "Your Name <your-email@domain.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-org/service-mcp-server.git"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.6.0",
    "axios": "^1.6.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.24"
  }
}
```

#### 公開用README例
```markdown
# Service MCP Server

Claude Code integration for Service API.

## Quick Start

```bash
npm install -g @your-org/service-mcp-server
service-mcp setup
claude mcp add service -- npx @your-org/service-mcp-server
```

## Features
- ✅ List items from Service API  
- ✅ Create new items
- ✅ Search and filter
- ✅ Real-time sync

## Configuration
Set up your API credentials:
```bash
service-mcp setup
```
```

### 🚀 公開手順

#### 1. パッケージ準備
```bash
# バージョン更新
npm version patch  # または minor, major

# ビルドテスト
npm run build
npm pack
npm install -g ./your-package-*.tgz

# 動作確認
your-mcp-command --version
```

#### 2. npm公開
```bash
npm login
npm publish --access public

# 公開確認
npm view @your-org/service-mcp-server
```

#### 3. 多プラットフォーム対応

##### Docker対応
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY build ./build
EXPOSE 3000
CMD ["node", "build/http-server.js"]
```

##### GitHub Actions自動公開
```yaml
# .github/workflows/publish.yml
name: Publish Package
on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## トラブルシューティング

### 🐛 よくある問題

#### 1. モジュールが見つからない
```bash
# 症状
Error: Cannot find module '@modelcontextprotocol/sdk'

# 解決
npm install @modelcontextprotocol/sdk
# またはpackage.jsonのtype: "module"を確認
```

#### 2. 認証エラー
```typescript
// 症状: 401 Unauthorized

// デバッグ方法
console.error('API Key:', process.env.API_KEY ? 'Set' : 'Missing');
console.error('Headers:', axios.defaults.headers);

// 解決
export API_KEY=your_actual_key
# または設定ファイルを確認
```

#### 3. Claude Code接続エラー
```bash
# 症状: MCP server connection failed

# 確認事項
1. サーバーがビルドされているか
   npm run build
   
2. 実行権限があるか
   chmod +x build/index.js
   
3. パスが正しいか
   which npx
   npx @your-org/mcp-server --version

# Claudeコマンド確認
claude mcp list
claude mcp remove server-name
claude mcp add server-name -- npx @your-org/mcp-server
```

#### 4. TypeScriptコンパイルエラー
```bash
# モジュール解決エラー
# tsconfig.json確認
{
  "compilerOptions": {
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}

# Import/Export構文統一
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
```

### 📊 デバッグ方法

#### ログ出力
```typescript
// 開発時のデバッグログ
const DEBUG = process.env.DEBUG === 'true';

function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.error(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

// 使用例
debugLog('API Request', { url, headers });
debugLog('API Response', response.data);
```

#### MCP Inspectorの使用
```bash
# MCPサーバーのテスト
npx @modelcontextprotocol/inspector npx @your-org/mcp-server

# 特定の環境でのテスト
DEBUG=true npx @modelcontextprotocol/inspector npx @your-org/mcp-server
```

### 🔧 パフォーマンス問題

#### メモリリーク対策
```typescript
// 定期的なキャッシュクリア
setInterval(() => {
  cache.clear();
  console.error('Cache cleared');
}, 30 * 60 * 1000); // 30分間隔

// リクエスト後のクリーンアップ
process.on('SIGTERM', () => {
  console.error('Shutting down gracefully');
  client.destroy();
  process.exit(0);
});
```

---

## 🎯 まとめ

このガイドを使用して、任意のAPIやサービス用のMCPサーバーを作成できます。

### 📋 チェックリスト
- [ ] プロジェクト構造を作成
- [ ] API クライアント実装
- [ ] Resources と Tools の定義
- [ ] 認証・設定管理
- [ ] エラーハンドリング
- [ ] テストとデバッグ
- [ ] ドキュメント作成
- [ ] パッケージング・公開

### 🔗 参考リンク
- [MCP公式ドキュメント](https://modelcontextprotocol.io/)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [サンプルサーバー集](https://github.com/modelcontextprotocol/servers)
- [Claude Code MCP設定](https://docs.anthropic.com/en/docs/claude-code/mcp)

ご質問やサポートが必要な場合は、プロジェクトのIssueページまでお気軽にお問い合わせください！
