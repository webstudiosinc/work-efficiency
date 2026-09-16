// ダミー記事データ
// 実際は RSS 自動収集の結果に置き換える想定（3-2. 自動化の構成案 参照）
export type Post = {
  id: string;
  title: string;
  excerpt: string;
  sourceName: string;
  sourceUrl: string;
  category: string;
  publishedAt: string; // ISO 8601
};

export const categories = ['会計', '勤怠', '請求書', 'AIツール'] as const;

export const posts: Post[] = [
  {
    id: '1',
    title: 'クラウド会計ソフトに新しい自動仕訳機能が追加',
    excerpt:
      '銀行明細の取り込み時に、勘定科目をAIが推測して自動で仕訳を作成する機能が公開された。',
    sourceName: '会計SaaS公式ブログ',
    sourceUrl: 'https://example.com/accounting-update-1',
    category: '会計',
    publishedAt: '2026-09-14',
  },
  {
    id: '2',
    title: '勤怠管理アプリがスマホ打刻のGPS精度を改善',
    excerpt:
      '直行直帰の多い働き方でも、打刻位置のズレが起きにくくなるアップデートが実施された。',
    sourceName: '勤怠SaaS公式ブログ',
    sourceUrl: 'https://example.com/attendance-update-1',
    category: '勤怠',
    publishedAt: '2026-09-13',
  },
  {
    id: '3',
    title: 'インボイス制度に関するQ&Aページが更新',
    excerpt:
      '適格請求書の記載事項について、実務でよくある質問への回答が追加されている。',
    sourceName: '行政制度改正ページ',
    sourceUrl: 'https://example.com/invoice-faq',
    category: '請求書',
    publishedAt: '2026-09-12',
  },
  {
    id: '4',
    title: '議事録を自動要約するAIツールが新プランを発表',
    excerpt:
      '無料プランでも月10件まで要約できるようになり、個人事業主でも試しやすくなった。',
    sourceName: 'AIツール公式ブログ',
    sourceUrl: 'https://example.com/ai-tool-update-1',
    category: 'AIツール',
    publishedAt: '2026-09-11',
  },
  {
    id: '5',
    title: '請求書発行サービスがCSV一括発行に対応',
    excerpt:
      '複数件の請求書をまとめてCSVから生成できるようになり、月末の作業時間が短縮できる。',
    sourceName: '請求書SaaS公式ブログ',
    sourceUrl: 'https://example.com/invoice-update-1',
    category: '請求書',
    publishedAt: '2026-09-10',
  },
];
