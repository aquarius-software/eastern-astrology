import HomePage from "./home";
import TwoColumnHomePage from "./home/2-col/page";
import AltHomePage from "./home/alt/page";
import LifeStyleHomePage from "./home/lifestyle/page";
import MinimalHomePage from "./home/minimal/page";
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

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
