"use client";

// HeroUI v3 は Provider を必要としない（v2 の HeroUIProvider は廃止）。
// このファイルはアプリ独自の Context だけを提供する。
import { BoardContextProvider } from "@/context/boardContext";

export default function uiProviders({ children }) {
  return <BoardContextProvider>{children}</BoardContextProvider>;
}
