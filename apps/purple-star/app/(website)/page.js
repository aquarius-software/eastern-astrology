import HomePage from "./home";
import { getAllPosts } from "@/lib/sanity/client";

export const metadata = {
  description: "紫微斗数ネクストのトップページです。",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "https://purplestar.app/feed.xml"
    }
  }
};

export default async function IndexPage() {
  const posts = await getAllPosts();
  return <HomePage posts={posts} />;
}
