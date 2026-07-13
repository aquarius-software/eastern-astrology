import { getSettings } from "@/lib/sanity/client";
import Chart from "./Chart";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '命式作成',
  description: '無料で四柱推命の命式を作成できます。生年月日・時刻や生まれた場所などの情報を入力すると、四柱推命の命式の詳細をわかりやすく表示します。',
  alternates: {
    canonical: "/chart",
  },
}

export default async function ChartPage() {
  const settings = await getSettings();
  // return <Chart settings={settings} />;
  return (
    <>
      <Chart />
    </>);
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
