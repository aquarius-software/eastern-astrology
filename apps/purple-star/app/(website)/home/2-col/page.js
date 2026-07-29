import HomeTwoCol from "./two-col";

import { getAllPosts } from "@/lib/sanity/client";

export const metadata = {
  description: "紫微斗数ネクストのトップページです。",
  alternates: {
    canonical: "/"
  }
};

export default async function TwoColumnHomePage() {
  const posts = await getAllPosts();
  return <HomeTwoCol posts={posts} />;
}
