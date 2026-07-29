"use client";

import dynamic from "next/dynamic";

// localStorage を参照するため、サーバー側では描画しない
// https://nextjs.org/docs/messages/react-hydration-error
// Next.js 15 以降、`ssr: false` はサーバーコンポーネントで使えないため、
// このクライアントコンポーネント側に dynamic import を置いている
const LocalStorageTable = dynamic(() => import("./LocalStorageTable"), {
  ssr: false
});

export default function LocalStorageTableClient() {
  return <LocalStorageTable />;
}
