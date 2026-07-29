import HomePage from "./minimal";

import { getAllPosts } from "@/lib/sanity/client";

export const metadata = {
  description: "紫微斗数ネクストのトップページです。",
  alternates: {
    canonical: "/"
  }
};

export default async function MinimalHomePage() {
  const posts = await getAllPosts();
  return <HomePage posts={posts} />;
}
