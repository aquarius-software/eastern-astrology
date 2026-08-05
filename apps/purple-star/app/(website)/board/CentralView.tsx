"use client";

import DiagonalLine from "./DiagonalLine";
import TriangleLine from "./TriangleLine";
import { useBoardContext } from "@/context/boardContext";

export default function CentralView() {
  const { currentPalace } = useBoardContext();

  return (
    <div className="relative col-start-2 col-end-4 row-start-2 row-end-4 overflow-hidden dark:bg-gray-600">
      <div className="absolute top-0 left-0 w-full text-sm font-normal text-gray-600 sm:text-sm md:text-base dark:text-gray-200"></div>
      <svg viewBox="0 0 10 10" preserveAspectRatio="none">
        <DiagonalLine palacePosition={currentPalace}></DiagonalLine>
        <TriangleLine palacePosition={currentPalace}></TriangleLine>
      </svg>
    </div>
  );
}
