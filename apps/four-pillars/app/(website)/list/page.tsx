import type { Metadata } from "next";
import BreadCrumb from "ui/Breadcrumbs";
import Container from "@/components/container";
import LocalStorageTable from "./LocalStorageTableClient";

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
        <div className="mx-auto mt-8 mb-4 max-w-(--breakpoint-md)">
          <h1 className="text-brand-primary mt-2 mb-3 text-center text-3xl font-semibold tracking-tight lg:text-4xl lg:leading-snug dark:text-white">
            命式リスト
          </h1>
          <h2 className="mb-2 text-center text-sm sm:text-base dark:text-white">
            Webブラウザに保存した命式データの一覧です。
          </h2>
          <p className="mb-2 text-center text-sm sm:text-base dark:text-white">
            命式データは命式作成後の画面から保存できます。
          </p>
        </div>
      </Container>
      <div className="mx-auto flex w-11/12 flex-col justify-center sm:w-9/12 md:w-1/2 lg:w-1/3">
        <LocalStorageTable></LocalStorageTable>
      </div>
    </>
  );
}
