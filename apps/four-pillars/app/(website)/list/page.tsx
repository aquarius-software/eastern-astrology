import type { Metadata } from "next";
import dynamic from "next/dynamic";
// import LocalStorageTable from './LocalStorageTable';
import BreadCrumb from "ui/Breadcrumbs";
import Container from "@/components/container";

const LocalStorageTable = dynamic(
  () => import("./LocalStorageTable"),
  {
    ssr: false
  }
);
// https://nextjs.org/docs/messages/react-hydration-error

export const metadata: Metadata = {
  title: "命式リスト",
  description: "Webブラウザに保存した命式データの一覧ページです。",
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
            label: "命式リスト",
            path: "/list"
          }
        ]}></BreadCrumb>

      <Container className="!pt-0">
        <div className="mx-auto mb-4 mt-8 max-w-screen-md">
          <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
            命式リスト
          </h1>
          <h2 className="text-center text-sm sm:text-base mb-2 dark:text-white">
            Webブラウザに保存した命式データの一覧です。
          </h2>
          <p className="text-center text-sm sm:text-base mb-2 dark:text-white">命式データは命式作成後の画面から保存できます。</p>
        </div>
      </Container>
      <div className="mx-auto flex w-11/12 flex-col justify-center sm:w-9/12 md:w-1/2 lg:w-1/3">
        <LocalStorageTable></LocalStorageTable>
      </div>
    </>
  );
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
