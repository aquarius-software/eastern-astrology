import HomeLifeStyle from "./lifestyle";

import { getAllPosts } from "@/lib/sanity/client";

export const metadata = {
  description: "四柱推命ネクストのトップページです。",
  alternates: {
    canonical: "/"
  }
};

export default async function LifeStyleHomePage() {
  const posts = await getAllPosts();
  return <HomeLifeStyle posts={posts} />;
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
