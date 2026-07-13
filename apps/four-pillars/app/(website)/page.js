import LifeStyleHomePage from "./home/page";
import { getAllPosts } from "@/lib/sanity/client";

export const metadata = {
  description: "四柱推命ネクストのトップページです。",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "https://fourpillars.app/feed.xml"
    }
  }
};

export default async function IndexPage() {
  const posts = await getAllPosts();
  return <LifeStyleHomePage posts={posts} />;
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
