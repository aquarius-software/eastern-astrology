"use client";

import Link from "next/link";
import Container from "@/components/container";
import PostList from "@/components/postlist";
import SearchInput from "@/components/ui/search";
import { searchquery } from "@/lib/sanity/groq";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/sanity/client";
import BreadCrumb from "ui/Breadcrumbs";

export default function Search(props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || null;

  const [timer, setTimer] = useState(null);
  const { data, error } = useSWR(
    [searchquery, { query: query }],
    fetcher
  );

  const handleChange = e => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      router.push(`/search?q=${e.target.value}`);
    }, 500);
    setTimer(newTimer);
  };

  return (
    <>
      <BreadCrumb
        items={[
          {
            label: "検索結果",
            path: `/search?q=${query}`
          }
        ]}></BreadCrumb>
      <div>
        <div className="mt-14 flex items-center justify-center ">
          <h1 className="text-brand-primary text-xl font-semibold tracking-tight dark:text-white lg:text-3xl lg:leading-tight">
            {query ? `「${query}」の検索結果` : "ブログを検索"}
          </h1>
        </div>

        <div className="mx-auto mt-5 max-w-md">
          <SearchInput
            q={query}
            handleChange={handleChange}
            placeholder="キーワードを入力してください"
          />
        </div>
      </div>

      <Container>
        {!query && (
          <div className="flex h-40 items-center justify-center">
            <Link
              prefetch={false}
              href="/"
              className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600 dark:text-blue-500 ">
              ← ホームに戻る
            </Link>
          </div>
        )}
        {query && data?.length === 0 && (
          <div className="flex h-40 items-center justify-center">
            <span className="text-lg text-gray-500">
              「{query}」の検索結果は見つかりませんでした。
            </span>
          </div>
        )}
        {query && !data && (
          <div className="flex h-40 items-center justify-center">
            <svg
              className="h-6 w-6 animate-spin text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>{" "}
          </div>
        )}
        <div className="mx-2 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data &&
            data.map((post, index) => (
              <PostList key={post._id} post={post} aspect="square" />
            ))}
        </div>
      </Container>
    </>
  );
}
