"use client";

import Image from "next/image";
import Link from "next/link";
import LogoImage from "../public/img/logo-black.svg";
import { buttonVariants } from "@heroui/react";

export default function Featured() {
  return (
    <section className="relative flex min-h-[calc(100vh-10vh)] flex-col justify-center">
      <div className="mx-auto -mt-20 flex max-w-(--breakpoint-xl) flex-col items-center gap-12 px-4 text-gray-600 sm:justify-center sm:text-center md:px-8 xl:flex-row xl:text-left">
        <div className="align-center flex max-w-4xl flex-col items-center justify-center gap-6 text-center xl:max-w-2xl">
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
          <div className="flex flex-col items-center gap-3 text-sm font-normal sm:justify-center xl:justify-start">
            {/* HeroUI v3 の Button は react-aria-components の Button を
                継承しており、v2 の `as` prop が無い。as={Link} は無視されて
                ただの <button> になり、遷移しなくなる。
                リンクとして振る舞わせたいので、Next の Link に
                buttonVariants() が返すクラスを当てる。
                こうすると prefetch / scroll と client-side 遷移も維持できる。 */}
            <Link
              href="/chart"
              prefetch={true}
              scroll={false}
              className={`${buttonVariants({
                variant: "primary",
                size: "lg"
              })} bg-sky-500`}>
              命式作成はこちら（無料）
            </Link>
            <Link
              href="/about"
              prefetch={true}
              scroll={false}
              className={buttonVariants({
                variant: "tertiary",
                size: "lg"
              })}>
              四柱推命ネクストについて
            </Link>
            <h3 className="max-w-sm">
              ソフトウェアの更新により、サポート対象のブラウザバージョンが変更されました。そのため、iPhone
              7以前の古い端末では正常にご覧いただけない可能性があります。（2026.7.30）
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
