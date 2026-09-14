import got from 'got';
import log from '@/utils/log.js';
import docsManifest, { DocsPage } from '@/modules/aichat/docsManifest.js';

const MAX_PAGES = 2;
const MAX_BODY_LENGTH = 2500;

// 質問文にdocsManifestのkeywordsが含まれていれば、該当ページを関連ページとして返す(最大MAX_PAGES件)
function findRelevantPages(question: string): DocsPage[] {
	const matched: DocsPage[] = [];
	for (const page of docsManifest) {
		if (page.keywords.some(keyword => question.includes(keyword))) {
			matched.push(page);
			if (matched.length >= MAX_PAGES) break;
		}
	}
	return matched;
}

// VitePressが生成したHTMLから本文(<h1>〜<footer>の間)を抜き出し、タグを除去したプレーンテキストにする
function extractBodyText(html: string): string | null {
	const start = html.indexOf('<h1');
	const end = html.indexOf('<footer');
	if (start === -1 || end === -1 || end <= start) return null;
	const body = html.slice(start, end);
	const text = body
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, '\'')
		.replace(/\s+/g, ' ')
		.trim();
	return text.length > 0 ? text : null;
}

async function fetchPageText(page: DocsPage): Promise<string | null> {
	try {
		const html = await got(page.url, {
			timeout: { lookup: 500, send: 500, response: 8000 },
		}).text();
		const text = extractBodyText(html);
		if (text == null) return null;
		return text.length > MAX_BODY_LENGTH ? text.slice(0, MAX_BODY_LENGTH) + '…(以下省略)' : text;
	} catch (err: unknown) {
		log('Error fetching docs page: ' + page.url);
		if (err instanceof Error) {
			log(`${err.name}\n${err.message}`);
		}
		return null;
	}
}

// 質問文に関連しそうなdocs.mk-juice.devのページがあれば、システムプロンプトに追記する文字列を返す(無ければ空文字列)
export default async function buildDocsContext(question: string): Promise<string> {
	const pages = findRelevantPages(question);
	if (pages.length === 0) return '';

	const sections: string[] = [];
	for (const page of pages) {
		const text = await fetchPageText(page);
		if (text != null) {
			sections.push(`【${page.title}】(${page.url})\n${text}`);
		}
	}
	if (sections.length === 0) return '';

	return '補足として、Juice Server公式ドキュメント(docs.mk-juice.dev)の関連ページの内容を提供します。回答する際は、これらの内容を優先して参考にし、正確な情報を答えてください(内容に無いことは推測せず、分からない場合は公式ドキュメントを確認するよう案内すること)。必要に応じて出典としてURLを示してください。\n\n'
		+ sections.join('\n\n');
}
