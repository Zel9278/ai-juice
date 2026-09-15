import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import log from '@/utils/log.js';

// ローカル専用のced-mcp-server(loopbackのみ)に接続する
const MCP_SERVER_URL = 'http://127.0.0.1:10205/mcp';

export type OpenAiFunctionTool = {
	type: 'function';
	function: {
		name: string;
		description?: string;
		parameters: unknown;
	};
};

let client: Client | null = null;
let connecting: Promise<Client> | null = null;

// 接続は初回利用時に1回だけ行い、以降は使い回す(切断されていたら再接続する)
async function getClient(): Promise<Client> {
	if (client != null) return client;
	if (connecting != null) return connecting;

	connecting = (async () => {
		const c = new Client({ name: 'ai-juice', version: '1.0.0' });
		const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL));
		await c.connect(transport);
		client = c;
		connecting = null;
		return c;
	})();

	return connecting;
}

// 接続エラー時は次回また接続し直せるように状態をリセットする
function resetClient() {
	client = null;
	connecting = null;
}

// MCPサーバーのツール一覧を、OpenAI互換APIのfunction calling形式に変換して返す
export async function listOpenAiTools(): Promise<OpenAiFunctionTool[]> {
	try {
		const c = await getClient();
		const { tools } = await c.listTools();
		return tools.map(tool => ({
			type: 'function' as const,
			function: {
				name: tool.name,
				description: tool.description,
				parameters: tool.inputSchema,
			},
		}));
	} catch (err: unknown) {
		log('Error listing MCP tools');
		if (err instanceof Error) {
			log(`${err.name}\n${err.message}`);
		}
		resetClient();
		return [];
	}
}

// MCPツールを1件呼び出し、結果をテキストにまとめて返す
export async function callMcpTool(name: string, args: Record<string, unknown>): Promise<string> {
	try {
		const c = await getClient();
		const result = await c.callTool({ name, arguments: args });
		const content = Array.isArray(result.content) ? result.content : [];
		const text = content
			.filter((item: any) => item?.type === 'text' && typeof item.text === 'string')
			.map((item: any) => item.text)
			.join('\n');
		if (text.length === 0) {
			return result.isError ? `ツール実行エラー: ${name}` : `(${name}から結果が返りませんでした)`;
		}
		return text;
	} catch (err: unknown) {
		log('Error calling MCP tool: ' + name);
		if (err instanceof Error) {
			log(`${err.name}\n${err.message}`);
		}
		resetClient();
		return `ツール呼び出しに失敗しました: ${name}`;
	}
}
