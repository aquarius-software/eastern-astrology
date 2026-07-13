import { getSettings } from "@/lib/sanity/client";
import Board from "./Board";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '命盤作成',
  description: '無料で紫微斗数の命盤を作成できるページです。',
  alternates: {
    canonical: "/board",
  },
}

export default async function BoardPage() {
  const settings = await getSettings();
  // return <Board settings={settings} />;
  return (
    <>
      <Board />
    </>
  );
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
