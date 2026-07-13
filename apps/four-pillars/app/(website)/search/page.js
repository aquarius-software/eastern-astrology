import Search from "./search";
import { Suspense } from "react";

export const metadata = {
  title: "ブログ検索",
  description: "四柱推命ネクストのブログ記事を検索するページです。",
  alternates: {
    canonical: "/search"
  },
  robots: {
    index: false
  }
};

export default async function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
