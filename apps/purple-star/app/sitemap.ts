import { getAllPosts, getAllPages } from "@/lib/sanity/client";

const URL = "https://purplestar.app";

export default async function sitemap() {
  const allPosts = await getAllPosts();
  const posts = allPosts.map(({ slug, _updatedAt }) => ({
    url: `${URL}/post/${slug.current}`,
    lastModified: _updatedAt,
  }));

  const allPages = await getAllPages();
  const pages = allPages.map(({ slug, _updatedAt }) => ({
    url: `${URL}/${slug.current}`,
    lastModified: _updatedAt,
  }));

  const routes = ["", "/blog", "/board", "/contact", "/history", "/list"].map((route) => ({
    url: `${URL}${route}`
  }));

  return [...routes, ...pages, ...posts];
}