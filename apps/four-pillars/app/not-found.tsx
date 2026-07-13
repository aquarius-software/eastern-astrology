import Link from "next/link";
import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import GetNavbar from "@/components/getnavbar";
import BreadCrumb from "ui/Breadcrumbs";

export default async function NotFound() {
  const settings = await getSettings();

  return (
    <>
      <GetNavbar {...settings} />
      <div className="mt-20">
        <BreadCrumb
          items={[
            {
              label: "404 Not Found",
              path: "/"
            }
          ]}></BreadCrumb>
        <div className="flex flex-col items-center">
          <h1 className="mb-5 text-2xl font-semibold dark:text-white">
            404 Not Found
          </h1>
          <p className="mb-5 text-lg">
            ご指定のページが見つかりませんでした。
          </p>
          <Link
            className="text-base font-medium text-gray-600 hover:text-blue-500 focus-visible:text-blue-500 focus-visible:ring-2 dark:text-gray-400"
            href="/"
            prefetch={false}>
            ホームに戻る
          </Link>
        </div>
      </div>
      <Footer {...settings} />
    </>
  );
}
