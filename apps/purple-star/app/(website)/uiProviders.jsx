"use client";

import { HeroUIProvider } from "@heroui/system";
import { BoardContextProvider } from "@/context/boardContext";

export default function uiProviders({ children }) {
  return (
    <HeroUIProvider>
      <BoardContextProvider>{children}</BoardContextProvider>
    </HeroUIProvider>
  );
}
