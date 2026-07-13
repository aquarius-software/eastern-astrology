import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ErrorView({ message }: { message: string }) {
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="mb-5 text-2xl font-semibold dark:text-white">
          エラー
        </h1>
        <p className="mb-5 text-lg text-red-600">
          <ExclamationCircleIcon className="mr-1 mb-1 inline-block h-6 w-6" />{message}
        </p>
        <Link
          prefetch={false}
          className="text-base font-medium text-gray-600 hover:text-blue-500 focus-visible:text-blue-500 focus-visible:ring-2 dark:text-gray-400"
          href="/">
          ホームに戻る
        </Link>
      </div>
    </>
  );
}
