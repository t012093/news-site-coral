#!/usr/bin/env node

/**
 * 基本MCPサーバーテンプレート
 * このテンプレートをコピーして、あなたのAPIサービス用MCPサーバーを作成できます。
 */

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

// 環境変数をロード
dotenv.config();

// 📝 TODO: あなたのAPIサービスの型定義を追加
interface YourDataType {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  // 必要に応じて追加...
}

interface CreateYourDataRequest {
  name: string;
  description?: string;
  // 必要に応じて追加...
}

/**
 * APIクライアントクラス
 * あなたのAPIサービスとの通信を担当
 */
class YourAPIClient {
  private client: AxiosInstance;

  constructor() {
    // 📝 TODO: あなたのAPI設定に変更
    const baseURL = process.env.YOUR_API_BASE_URL || 'https://api.yourservice.com';
    const apiKey = process.env.YOUR_API_KEY;

    if (!apiKey) {
      throw new Error('YOUR_API_KEY environment variable is required');
    }

    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        // 📝 TODO: あなたのAPI認証方法に変更
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // 📝 TODO: あなたのAPI操作メソッドを実装
  async getAllData(): Promise<YourDataType[]> {
    try {
      const response = await this.client.get('/data');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createData(data: CreateYourDataRequest): Promise<YourDataType> {
    try {
      const response = await this.client.post('/data', data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchData(query: string): Promise<YourDataType[]> {
    try {
      const response = await this.client.get(`/data/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// APIクライアントインスタンスを作成
const api = new YourAPIClient();

// MCPサーバーを作成
const server = new Server(
  {
    // 📝 TODO: あなたのサーバー名に変更
    name: "your-service-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// リソース一覧の定義
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        // 📝 TODO: あなたのリソースURIに変更
        uri: "yourservice://data/all",
        mimeType: "application/json",
        name: "All Data",
        description: "Complete list of all data from your service",
      },
      {
        uri: "yourservice://data/summary",
        mimeType: "application/json",
        name: "Data Summary",
        description: "Summary statistics of your data",
      },
    ],
  };
});

// リソースの読み取り処理
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "yourservice://data/all": {
      const data = await api.getAllData();
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }

    case "yourservice://data/summary": {
      const data = await api.getAllData();
      const summary = {
        total: data.length,
        latest: data[0]?.createdAt || null,
        // 📝 TODO: あなたのサマリー情報に変更
      };
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(summary, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// ツール一覧の定義
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        // 📝 TODO: あなたのツール名に変更
        name: "create_data",
        description: "Create new data entry in your service",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the data entry",
            },
            description: {
              type: "string",
              description: "Description of the data entry (optional)",
            },
            // 📝 TODO: 必要なプロパティを追加
          },
          required: ["name"],
        },
      },
      {
        name: "search_data",
        description: "Search for data entries",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query string",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_all_data",
        description: "Get all data entries",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// ツール実行の処理
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "create_data": {
      const data = await api.createData(args as unknown as CreateYourDataRequest);
      return {
        content: [
          {
            type: "text",
            text: `✅ Data created successfully!\n\nID: ${data.id}\nName: ${data.name}\nCreated: ${data.createdAt}`,
          },
        ],
      };
    }

    case "search_data": {
      const { query } = args as unknown as { query: string };
      const results = await api.searchData(query);
      return {
        content: [
          {
            type: "text",
            text: `🔍 Found ${results.length} results for "${query}":\n\n${results
              .map((item) => `• ${item.name} (${item.id})`)
              .join('\n')}`,
          },
        ],
      };
    }

    case "get_all_data": {
      const data = await api.getAllData();
      return {
        content: [
          {
            type: "text",
            text: `📊 Total data entries: ${data.length}\n\n${data
              .slice(0, 10) // 最初の10件のみ表示
              .map((item) => `• ${item.name} (${item.id})`)
              .join('\n')}${data.length > 10 ? '\n\n... and more' : ''}`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// サーバーを起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Your Service MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

/* 
📝 カスタマイズチェックリスト:

1. [ ] 型定義を変更 (YourDataType, CreateYourDataRequest)
2. [ ] APIクライアントのメソッドを実装
3. [ ] 認証方法を変更 (Bearer token, API key, etc.)
4. [ ] リソースURIを変更
5. [ ] ツール名と説明を変更
6. [ ] エラーメッセージを適切に設定
7. [ ] 環境変数名を変更 (YOUR_API_BASE_URL, YOUR_API_KEY)
8. [ ] package.jsonのbinコマンドを設定
9. [ ] README.mdを作成
10. [ ] テストを追加

🚀 使用開始:
1. このファイルをコピーして新しいプロジェクトに配置
2. TODOコメントに従ってカスタマイズ
3. npm run build
4. claude mcp add your-server -- npx your-package
*/