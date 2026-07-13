import type { Metadata } from "next";
import dynamic from "next/dynamic";
// import LocalStorageTable from './LocalStorageTable';
import BreadCrumb from "ui/Breadcrumbs";

const LocalStorageTable = dynamic(
  () => import("./LocalStorageTable"),
  {
    ssr: false
  }
);
// https://nextjs.org/docs/messages/react-hydration-error

export const metadata: Metadata = {
  title: "命盤データ管理",
  description: "Webブラウザに保存した命盤データを管理するページです。",
  alternates: {
    canonical: "/list"
  },
  robots: {
    index: false
  }
};

export default function ListPage() {
  return (
    <>
      <BreadCrumb
        items={[
          {
            label: "命盤リスト",
            path: "/list"
          }
        ]}></BreadCrumb>
      <div className="mx-auto flex w-11/12 flex-col justify-center sm:w-9/12 md:w-1/2 lg:w-1/3">
        <h1 className="mb-3 mt-8 text-center text-2xl font-semibold tracking-tight dark:text-white lg:text-3xl lg:leading-snug">
          命盤リスト
        </h1>
        <div className="text-center">
          <p className="mb-8 text-base dark:text-white">
            Webブラウザに保存した命盤データの一覧です。
          </p>
        </div>
        <LocalStorageTable></LocalStorageTable>
      </div>
    </>
  );
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
