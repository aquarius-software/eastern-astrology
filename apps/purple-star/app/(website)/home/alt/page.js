import AltHome from "./alternate";

import { getAllPosts } from "@/lib/sanity/client";

export const metadata = {
  description: "紫微斗数ネクストのトップページです。",
  alternates: {
    canonical: "/"
  }
};

export default async function AltHomePage() {
  const posts = await getAllPosts();
  return <AltHome posts={posts} />;
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
