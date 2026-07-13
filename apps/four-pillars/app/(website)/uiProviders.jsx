"use client";

import { HeroUIProvider } from "@heroui/system";
import { ChartContextProvider } from "@/context/chartContext";

export default function uiProviders({ children }) {
  return (
    <HeroUIProvider>
      <ChartContextProvider>{children}</ChartContextProvider>
    </HeroUIProvider>
  );
}
