'use client';

import DiagonalLine from "./DiagonalLine";
import TriangleLine from "./TriangleLine";
import { useBoardContext } from "@/context/boardContext";

export default function CentralView() {
  const { currentPalace } = useBoardContext();

  return (
    <div className="relative col-start-2 col-end-4 row-start-2 row-end-4 dark:bg-gray-600 overflow-hidden">
      <div className="absolute left-0 top-0 text-sm sm:text-sm font-normal text-gray-600 dark:text-gray-200 md:text-base w-full">
      </div>
      <svg viewBox="0 0 10 10" preserveAspectRatio="none">
        <DiagonalLine palacePosition={currentPalace}></DiagonalLine>
        <TriangleLine palacePosition={currentPalace}></TriangleLine>
      </svg>
    </div>
  );
}
