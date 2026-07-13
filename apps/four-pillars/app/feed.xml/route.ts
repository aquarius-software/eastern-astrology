import RSS from 'rss';
import { getAllPosts } from "@/lib/sanity/client";

const URL = "https://fourpillars.app";

export async function GET() {

  const feed = new RSS({
    title: '四柱推命ネクスト',
    description: '四柱推命ネクストは、四柱推命を生業としているプロの占い師の方や、趣味で四柱推命を親しんでおられる方向けのWebサイトです。命式の作成・管理ツールなど、四柱推命にまつわる様々なコンテンツを提供しています。',
    site_url: URL,
    feed_url: `${URL}/feed.xml`,
    copyright: `${new Date().getFullYear()} 四柱推命ネクスト`,
    language: 'ja',
    pubDate: new Date(),
  });

  const allPosts = await getAllPosts();
  allPosts.map(({ title, slug, publishedAt, excerpt, author, categories }) => {
    feed.item({
      title: title,
      guid: `${URL}/post/${slug.current}`,
      url: `${URL}/post/${slug.current}`,
      date: publishedAt,
      description: excerpt,
      author: author.name,
      categories: categories.map(category => category.title),
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}