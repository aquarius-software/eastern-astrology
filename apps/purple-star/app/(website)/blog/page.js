import Archive from "./blog";
import { Suspense } from "react";
import {
  getPaginatedPosts,
  getNumberOfPosts
} from "@/lib/sanity/client";

const POSTS_PER_PAGE = 6;

export const metadata = {
  title: "アーカイブ",
  description: "紫微斗数ネクストのブログ記事一覧です。",
  alternates: {
    canonical: "/blog"
  },
  robots: {
    index: false
  }
};

export default async function ArchivePage() {
  const posts = await getPaginatedPosts(POSTS_PER_PAGE);
  const numberOfPosts = await getNumberOfPosts();
  let numberOfPages = Math.floor(numberOfPosts / POSTS_PER_PAGE);
  if (numberOfPosts % POSTS_PER_PAGE > 0) {
    numberOfPages++;
  }

  return (
    <Suspense>
      <Archive
        posts={posts}
        numberOfPages={numberOfPages}
        postPerPage={POSTS_PER_PAGE}
      />
    </Suspense>
  );
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
