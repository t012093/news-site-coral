# 🚀 新しいMCPサーバーの作成

このガイドに従って、任意のAPIサービス用のMCPサーバーを短時間で作成できます。

## 📁 テンプレートファイル

以下のテンプレートファイルを使用してください：

- [`basic-mcp-server-template.ts`](./templates/basic-mcp-server-template.ts) - メインサーバーコード
- [`package-template.json`](./templates/package-template.json) - package.json設定
- [`tsconfig-template.json`](./templates/tsconfig-template.json) - TypeScript設定
- [`README-template.md`](./templates/README-template.md) - ドキュメント

## ⚡ クイックスタート（5分で開始）

### 1. プロジェクト作成
```bash
mkdir my-service-mcp-server
cd my-service-mcp-server
npm init -y
```

### 2. テンプレートファイルをコピー
```bash
# ディレクトリ構造を作成
mkdir src docs

# テンプレートをコピー
cp /path/to/templates/basic-mcp-server-template.ts src/index.ts
cp /path/to/templates/package-template.json package.json
cp /path/to/templates/tsconfig-template.json tsconfig.json
cp /path/to/templates/README-template.md README.md
```

### 3. 依存関係インストール
```bash
npm install @modelcontextprotocol/sdk axios dotenv
npm install -D typescript @types/node
```

### 4. カスタマイズ（必須部分）

#### package.json
```json
{
  "name": "@your-org/github-mcp-server",     // 変更
  "description": "GitHub API MCP Server",    // 変更
  "bin": {
    "github-mcp": "./build/index.js"         // 変更
  }
}
```

#### src/index.ts
```typescript
// TODO部分を検索して置換
// 1. 型定義
interface Issue {           // YourDataType → Issue
  id: string;
  title: string;
  body: string;
  state: 'open' | 'closed';
  created_at: string;
}

// 2. API設定
const baseURL = process.env.GITHUB_API_BASE_URL || 'https://api.github.com';
const apiKey = process.env.GITHUB_TOKEN;    // YOUR_API_KEY → GITHUB_TOKEN

// 3. APIメソッド
async getIssues(repo: string): Promise<Issue[]> {  // getAllData → getIssues
  const response = await this.client.get(`/repos/${repo}/issues`);
  return response.data;
}
```

### 5. ビルド・テスト
```bash
npm run build
npm run dev  # テスト実行
```

### 6. 完成！
```bash
# Claude Code に追加
claude mcp add github -- npx @your-org/github-mcp-server
```

## 📝 詳細カスタマイズガイド

### API認証パターン

#### Bearer Token
```typescript
headers: {
  'Authorization': `Bearer ${apiKey}`
}
```

#### API Key (Header)
```typescript
headers: {
  'X-API-Key': apiKey
}
```

#### Basic認証
```typescript
headers: {
  'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
}
```

### よくあるAPI操作パターン

#### CRUD操作
```typescript
// Create
async createItem(data: CreateRequest): Promise<Item> {
  const response = await this.client.post('/items', data);
  return response.data;
}

// Read
async getItem(id: string): Promise<Item> {
  const response = await this.client.get(`/items/${id}`);
  return response.data;
}

// Update
async updateItem(id: string, data: UpdateRequest): Promise<Item> {
  const response = await this.client.put(`/items/${id}`, data);
  return response.data;
}

// Delete
async deleteItem(id: string): Promise<void> {
  await this.client.delete(`/items/${id}`);
}
```

#### ページネーション
```typescript
async getItems(page = 1, limit = 50): Promise<{ items: Item[]; total: number }> {
  const response = await this.client.get(`/items?page=${page}&limit=${limit}`);
  return {
    items: response.data.items,
    total: response.data.total
  };
}
```

#### 検索・フィルタリング
```typescript
async searchItems(query: string, filters?: any): Promise<Item[]> {
  const params = new URLSearchParams({ q: query, ...filters });
  const response = await this.client.get(`/items/search?${params}`);
  return response.data;
}
```

## 🎯 具体的なサービス例

### GitHub Issues MCP Server
```typescript
// 型定義
interface Issue {
  id: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  assignee: string | null;
}

// APIクライアント
class GitHubClient {
  async getIssues(repo: string): Promise<Issue[]> {
    return this.client.get(`/repos/${repo}/issues`);
  }
  
  async createIssue(repo: string, issue: CreateIssueRequest): Promise<Issue> {
    return this.client.post(`/repos/${repo}/issues`, issue);
  }
}

// ツール定義
{
  name: "create_github_issue",
  inputSchema: {
    properties: {
      repo: { type: "string", description: "Repository (owner/name)" },
      title: { type: "string", description: "Issue title" },
      body: { type: "string", description: "Issue body" }
    }
  }
}
```

### Slack MCP Server
```typescript
// 型定義  
interface Channel {
  id: string;
  name: string;
  is_private: boolean;
}

interface Message {
  text: string;
  channel: string;
  timestamp: string;
}

// APIクライアント
class SlackClient {
  async getChannels(): Promise<Channel[]> {
    return this.client.get('/conversations.list');
  }
  
  async sendMessage(channel: string, text: string): Promise<Message> {
    return this.client.post('/chat.postMessage', { channel, text });
  }
}
```

### データベース MCP Server
```typescript
import { Client } from 'pg';

class DatabaseClient {
  private client: Client;
  
  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL
    });
  }
  
  async query(sql: string): Promise<any[]> {
    await this.client.connect();
    const result = await this.client.query(sql);
    await this.client.end();
    return result.rows;
  }
}

// SQLクエリツール
{
  name: "execute_sql",
  inputSchema: {
    properties: {
      query: { type: "string", description: "SQL query" },
      limit: { type: "number", default: 100 }
    }
  }
}
```

## 🏁 完成後のチェックリスト

### 機能確認
- [ ] ローカルでビルドが成功する
- [ ] MCP Inspectorでテストできる
- [ ] Claude Codeに接続できる
- [ ] 各ツールが正常に動作する
- [ ] エラーハンドリングが適切

### ドキュメント
- [ ] README.mdを更新
- [ ] 使用例を追加
- [ ] 設定方法を明記
- [ ] トラブルシューティングを追加

### パッケージング
- [ ] package.jsonを更新
- [ ] LICENSEファイルを追加
- [ ] .npmignoreを設定
- [ ] バージョン管理設定

### 公開準備
- [ ] npm publish用設定
- [ ] GitHub Actions設定
- [ ] テストスイート作成
- [ ] セキュリティ確認

## 🔗 次のステップ

1. **テスト**: [MCP Server Guide](./MCP_SERVER_GUIDE.md#テスト可能性) を参照
2. **公開**: [MCP Server Guide](./MCP_SERVER_GUIDE.md#パッケージング公開) を参照
3. **メンテナンス**: ドキュメントの定期更新とユーザーサポート

## 🆘 サポート

- **詳細ガイド**: [MCP_SERVER_GUIDE.md](./MCP_SERVER_GUIDE.md)
- **トラブルシューティング**: [MCP_SERVER_GUIDE.md#トラブルシューティング](./MCP_SERVER_GUIDE.md#トラブルシューティング)
- **コミュニティ**: [MCP公式Discord](https://discord.gg/mcp)

このガイドに従えば、30分以内に本格的なMCPサーバーを作成できます！