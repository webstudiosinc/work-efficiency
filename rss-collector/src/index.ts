import { collectAllNews } from './rss';

export default {
  async fetch() {
    return new Response('rss-collector: このWorkerはCron専用です。fetchは扱いません。', { status: 404 });
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(
      (async () => {
        const items = await collectAllNews();
        await env.NEWS_KV.put(
          'news:latest',
          JSON.stringify({ items, updatedAt: new Date().toISOString() })
        );
        console.log(`RSS収集完了: ${items.length}件`);
      })()
    );
  },
} satisfies ExportedHandler<Env>;
