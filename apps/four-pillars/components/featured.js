"use client";

import Image from "next/image";
import Link from "next/link";
import LogoImage from "../public/img/logo-black.svg";
import { Button } from "@heroui/react";

export default function Featured() {
  return (
    <section className="relative flex min-h-[calc(100vh-10vh)] flex-col justify-center">
      <div className="mx-auto -mt-20 flex max-w-screen-xl flex-col items-center gap-12 px-4 text-gray-600 sm:justify-center sm:text-center md:px-8 xl:flex-row xl:text-left">
        <div className="align-center flex max-w-4xl flex-col items-center justify-center space-y-6 text-center xl:max-w-2xl">
          <h1 className="text-4xl font-extrabold text-gray-700 sm:text-6xl">
            <Image
              src={LogoImage}
              alt={"四柱推命ネクストロゴ"}
              priority
              width={225}
            />
          </h1>
          <h2 className="max-w-xl text-lg font-bold text-gray-600 sm:mx-auto xl:mx-0">
            人生を導く羅針盤「四柱推命」
          </h2>
          <div className="flex flex-col items-center gap-x-3 space-y-3 text-sm font-normal sm:justify-center xl:justify-start">
            <Button
              as={Link}
              href="/chart"
              color="primary"
              size="lg"
              type="button"
              radius="sm"
              prefetch={true}
              scroll={false}
              className="bg-sky-500">
              命式作成はこちら（無料）
            </Button>
            <Button
              as={Link}
              href="/about"
              color="default"
              size="lg"
              type="button"
              radius="sm"
              prefetch={true}
              scroll={false}>
              四柱推命ネクストについて
            </Button>
            <h3 className="max-w-sm">
              ソフトウェアの更新により、サポート対象のブラウザバージョンが変更されました。そのため、iPhone 7以前の古い端末では正常にご覧いただけない可能性があります。（2026.7.30）
            </h3>
            {/* <Link
              href="/quiz"
              prefetch={true}
              scroll={false}
              className="pt-2 text-base font-normal text-blue-700">
              四柱推命クイズ
              <span className="ml-1 font-bold text-red-700">
                NEW!
              </span>
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}
