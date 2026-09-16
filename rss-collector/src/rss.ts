import { XMLParser } from 'fast-xml-parser';

export type NewsItem = {
  title: string;
  excerpt: string;
  sourceName: string;
  sourceUrl: string;
  category: string;
  publishedAt: string;
};

type FeedSource = {
  url: string;
  sourceName: string;
  category: string;
  maxItems: number;
};

// ブリーフ 3-2 の情報源。RSSの有無・実在を確認した上で選定している。
export const FEED_SOURCES: FeedSource[] = [
  {
    url: 'https://biz.moneyforward.com/support/account/news/new-feature/?feed=rss2',
    sourceName: 'マネーフォワード クラウド会計',
    category: '会計',
    maxItems: 3,
  },
  {
    url: 'https://biz.moneyforward.com/support/attendance/news/new-feature/?feed=rss2',
    sourceName: 'マネーフォワード クラウド勤怠',
    category: '勤怠',
    maxItems: 3,
  },
  {
    url: 'https://biz.moneyforward.com/support/invoice/news/new-feature/?feed=rss2',
    sourceName: 'マネーフォワード クラウド請求書',
    category: '請求書',
    maxItems: 3,
  },
  {
    url: 'https://openai.com/blog/rss.xml',
    sourceName: 'OpenAI Blog',
    category: 'AIツール',
    maxItems: 3,
  },
];

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max)}…`;
}

function toIsoDate(pubDate: unknown): string {
  if (typeof pubDate !== 'string') return new Date().toISOString();
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();
  return parsed.toISOString();
}

const parser = new XMLParser({ ignoreAttributes: false });

export async function fetchFeed(source: FeedSource): Promise<NewsItem[]> {
  const res = await fetch(source.url, {
    headers: { 'User-Agent': 'work-efficiency-bot/1.0 (+https://work-efficiency.webstudiosinc.workers.dev)' },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${source.url}: ${res.status}`);
  }
  const xml = await res.text();
  const parsed = parser.parse(xml);
  const rawItems = parsed?.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  return items.slice(0, source.maxItems).map((item): NewsItem => {
    const title = stripHtml(String(item.title ?? ''));
    const description = stripHtml(String(item.description ?? ''));
    const link = String(item.link ?? source.url);
    return {
      title,
      excerpt: truncate(description, 120),
      sourceName: source.sourceName,
      sourceUrl: link,
      category: source.category,
      publishedAt: toIsoDate(item.pubDate),
    };
  });
}

export async function collectAllNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(FEED_SOURCES.map((source) => fetchFeed(source)));
  const items: NewsItem[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
    } else {
      console.error('RSS収集に失敗:', result.reason);
    }
  }
  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return items;
}
