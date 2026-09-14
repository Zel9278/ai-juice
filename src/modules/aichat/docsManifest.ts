// docs.mk-juice.dev のページ一覧。ユーザーの質問文とkeywordsを突き合わせて、
// 関連しそうなページがあればaichatのシステムプロンプトに本文を差し込む。
export type DocsPage = {
	title: string;
	url: string;
	keywords: string[];
};

const DOCS_BASE = 'https://docs.mk-juice.dev';

const docsManifest: DocsPage[] = [
	{ title: 'このインスタンスの運用方針について', url: `${DOCS_BASE}/about-juice-server`, keywords: ['運用方針', 'テストインスタンス', 'Juice Serverとは'] },
	{ title: '支援について', url: `${DOCS_BASE}/support`, keywords: ['支援', '寄付', 'カンパ', 'FanBox', 'ファンボックス'] },
	{ title: 'ルール', url: `${DOCS_BASE}/service/rules`, keywords: ['ルール', '規則', 'NSFW', '禁止事項', '凍結', 'サイレンス', '下ネタ'] },
	{ title: 'カスタム絵文字・アバターデコレーションのガイドライン', url: `${DOCS_BASE}/service/emoji-avatar-decoration-guidelines`, keywords: ['絵文字ガイドライン', 'アバターデコレーションガイドライン', 'ライセンス', 'フォント'] },
	{ title: '利用規約', url: `${DOCS_BASE}/service/tos`, keywords: ['利用規約', 'TOS', '規約'] },
	{ title: 'プライバシーポリシー', url: `${DOCS_BASE}/service/privacy_policy`, keywords: ['プライバシーポリシー', '個人情報'] },
	{ title: '0から構築する', url: `${DOCS_BASE}/self-hosting/install`, keywords: ['セルフホスト', '構築', 'インストール', '自分のサーバー'] },
	{ title: '本家Misskey/他フォークからの移行', url: `${DOCS_BASE}/self-hosting/migration-from-misskey`, keywords: ['移行', 'マイグレーション', '本家Misskeyから'] },
	{ title: '機能一覧', url: `${DOCS_BASE}/juice/`, keywords: ['JUICE独自機能', '機能一覧', 'JUICEとは'] },
	{ title: 'JUICE独自機能の設定', url: `${DOCS_BASE}/juice/settings`, keywords: ['JUICE設定', 'コントロールパネル設定'] },
	{ title: '連携ログイン', url: `${DOCS_BASE}/juice/social-login`, keywords: ['連携ログイン', 'Discordログイン', 'Googleログイン', 'GitHubログイン', 'GitLabログイン', 'Microsoftログイン', 'ソーシャルログイン'] },
	{ title: '承認式新規登録', url: `${DOCS_BASE}/juice/approval-signup`, keywords: ['承認式', '新規登録', '登録審査', '確認コード'] },
	{ title: 'AI生成物フラグ', url: `${DOCS_BASE}/juice/ai-generated-flag`, keywords: ['AI生成物フラグ', 'AI生成'] },
	{ title: '絵文字申請', url: `${DOCS_BASE}/juice/emoji-request`, keywords: ['絵文字申請'] },
	{ title: 'アバターデコレーション申請', url: `${DOCS_BASE}/juice/avatar-decoration-request`, keywords: ['アバターデコレーション申請'] },
	{ title: 'ユーザーランキング', url: `${DOCS_BASE}/juice/user-ranking`, keywords: ['ユーザーランキング'] },
	{ title: 'リレータイムライン', url: `${DOCS_BASE}/juice/relay-timeline`, keywords: ['リレータイムライン', 'リレー'] },
	{ title: 'MIDIプレイヤー', url: `${DOCS_BASE}/juice/midi-player`, keywords: ['MIDIプレイヤー', 'MIDI再生', 'MIDI'] },
	{ title: 'メディアタイムライン', url: `${DOCS_BASE}/juice/media-timeline`, keywords: ['メディアタイムライン'] },
	{ title: 'About JUICEページ', url: `${DOCS_BASE}/juice/about-page`, keywords: ['About JUICE'] },
	{ title: 'ウィジェット表示位置設定', url: `${DOCS_BASE}/juice/widget-position`, keywords: ['ウィジェット表示位置'] },
	{ title: 'お知らせの投票機能', url: `${DOCS_BASE}/juice/announcement-poll`, keywords: ['お知らせ投票'] },
	{ title: 'お知らせのリアクション機能', url: `${DOCS_BASE}/juice/announcement-reaction`, keywords: ['お知らせリアクション'] },
	{ title: 'LaTeX(数式)表示', url: `${DOCS_BASE}/juice/latex`, keywords: ['LaTeX', '数式'] },
	{ title: 'リアクション機能の拡張', url: `${DOCS_BASE}/juice/reaction-enhancements`, keywords: ['相乗りリアクション', 'リアクション機能', '絵文字の情報メニュー'] },
	{ title: '投稿言語', url: `${DOCS_BASE}/juice/post-language`, keywords: ['投稿言語', '言語フィルター'] },
	{ title: 'ノート検索の強化', url: `${DOCS_BASE}/juice/note-search-enhancements`, keywords: ['ノート検索'] },
	{ title: 'お問い合わせフォーム', url: `${DOCS_BASE}/juice/contact-form`, keywords: ['お問い合わせフォーム', '問い合わせ'] },
	{ title: '通報', url: `${DOCS_BASE}/juice/abuse-report`, keywords: ['通報'] },
	{ title: '更新履歴', url: `${DOCS_BASE}/juice/changelog`, keywords: ['更新履歴', 'アップデート内容', '変更履歴', 'チェンジログ'] },
];

export default docsManifest;
