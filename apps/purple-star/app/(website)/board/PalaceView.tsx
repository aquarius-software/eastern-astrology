"use client";

import React from "react";
import { Palace } from "types";
import { Tooltip } from "react-tooltip";
import { useBoardContext } from "@/context/boardContext";

export default function PalaceView({
  palace,
  mainPalacePosition,
  asianAge,
  showWithColor,
  isActiveMode,
  activeStemIndex
}: {
  palace: Palace;
  mainPalacePosition: number;
  asianAge: number;
  showWithColor: boolean;
  isActiveMode: boolean;
  activeStemIndex: number;
}) {
  const yearlyLucksNum = 4;
  const {
    currentPalace,
    showChildStar,
    showSelfChildStar,
    showDiagonalChildStar,
    showMainChildStar
  } = useBoardContext();

  const backgroundStyles = (): string => {
    const defaultColor = "bg-stone-200";
    const mainColor = "bg-blue-100";
    const diagonalColor = "bg-teal-200";
    const triangleColor = "bg-blue-100";
    const adjacentColor = "bg-orange-200";

    if (!showWithColor) {
      return defaultColor;
    }
    if (currentPalace !== -1) {
      mainPalacePosition = currentPalace;
    }
    const boardPosition = palace.boardPosition;
    const trianglePositions = [
      [0, 5, 9],
      [1, 7, 8],
      [2, 6, 11],
      [3, 4, 10],
      [4, 10, 3],
      [5, 9, 0],
      [6, 11, 2],
      [7, 8, 1],
      [8, 1, 7],
      [9, 5, 0],
      [10, 3, 4],
      [11, 2, 6]
    ];
    const firstPosition = trianglePositions[mainPalacePosition][0];
    const secondPosition = trianglePositions[mainPalacePosition][1];
    const thirdPosition = trianglePositions[mainPalacePosition][2];

    if (mainPalacePosition === boardPosition) {
      // 本宮
      return mainColor;
    } else if (boardPosition === 11 - mainPalacePosition) {
      // 対宮
      return diagonalColor;
    } else if (
      mainPalacePosition === firstPosition &&
      (boardPosition === secondPosition ||
        boardPosition === thirdPosition)
    ) {
      // 三合宮
      return triangleColor;
    }

    return defaultColor;
  };

  return (
    <>
      <div
        className={`relative flex aspect-[1/1.414] w-full place-content-center rounded border-0 border-neutral-300 sm:aspect-square ${backgroundStyles()} shadow-md transition-all dark:border-white dark:bg-gray-700 dark:text-white`}
        data-tooltip-id={"palaceTooltip"}
        data-tooltip-content={""}
        data-tooltip-variant="info"
        onMouseEnter={() => {
          // 必要なくなったのでコメントアウト
          // setCurrentPalace(palace.boardPosition);
        }}
        onMouseLeave={() => {
          // 必要なくなったのでコメントアウト
          // setCurrentPalace(mainPalacePosition);
        }}>
        <div className="absolute left-[3%] top-[3%] place-self-center text-center text-sm font-bold text-gray-600 dark:text-white sm:text-sm md:text-lg">
          <span className={isActiveMode ? "text-purple-500" : ""}>
            {isActiveMode && palace.activeName
              ? "大限" + palace.activeName
              : palace.name}
          </span>
          {!isActiveMode && palace.isBodyPalace ? "[身宮]" : ""}
        </div>
        <div className="absolute bottom-1 left-1 text-xs text-green-700 sm:text-sm">
          {palace.stem}
          {palace.branch}
        </div>
        <div className="absolute bottom-1 right-1 text-left text-xs text-indigo-700 sm:text-sm">
          <span
            className={
              asianAge >= palace.startingAge &&
                asianAge <= palace.endingAge
                ? "rounded-md border-2 border-indigo-700 px-1"
                : ""
            }>
            {palace.startingAge}〜
          </span>
        </div>
        {/* <div className="absolute right-1 bottom-[15%] text-left text-xs font-normal text-indigo-500 sm:text-sm">
          {palace.yearlyLucks
            .slice(0, yearlyLucksNum)
            .map((luck, i) => (
              <React.Fragment key={i}>
                <span
                  className={
                    asianAge === luck.age
                      ? "rounded-md border-2 border-indigo-700 px-0.5"
                      : ""
                  }>
                  {luck.age}
                </span>
                {i !== yearlyLucksNum - 1 ? "," : ""}
              </React.Fragment>
            ))}
          {"..."}
        </div> */}
        <div className="absolute left-1 top-[24%] text-left text-sm">
          <span className="text-xs font-bold sm:text-base">
            {palace.majorStars.map((star, i) => {
              return (
                <div key={i}>
                  <span className="mr-1 font-bold">
                    {star.shortName}
                  </span>
                  <span className="font-normal text-orange-600">
                    {star.luminosity?.slice(0, 1)}
                  </span>
                  {showChildStar && (
                    <span
                      className={`font-bold ${star.childStar ? "rounded-full border-2 border-indigo-500 px-1 text-indigo-500" : ""}`}>
                      {star.childStar
                        ? star.childStar.shortName.charAt(1)
                        : ""}
                    </span>
                  )}
                  {showSelfChildStar && (
                    <span
                      className={`font-bold ${star.selfChildStar ? "rounded-full border-2 border-red-600 px-1 text-red-500" : ""}`}>
                      {star.selfChildStar
                        ? star.selfChildStar.shortName.charAt(1)
                        : ""}
                    </span>
                  )}
                  {showDiagonalChildStar && (
                    <span
                      className={`font-bold ${star.triangleChildStar ? "rounded-full border-2 border-green-500 px-1 text-green-500" : ""}`}>
                      {star.triangleChildStar
                        ? star.triangleChildStar.shortName.charAt(1)
                        : ""}
                    </span>
                  )}
                  {showMainChildStar && (
                    <span
                      className={`font-bold ${star.mainChildStar ? "rounded-full border-2 border-purple-500 px-1 text-purple-500" : ""}`}>
                      {star.mainChildStar
                        ? star.mainChildStar.shortName.charAt(1)
                        : ""}
                    </span>
                  )}
                  {isActiveMode &&
                    star.childStars &&
                    activeStemIndex !== -1 && (
                      <span
                        className={`font-bold ${star.childStars![activeStemIndex]!.shortName ? "rounded-full border-2 border-purple-500 px-1 text-purple-500" : ""}`}>
                        {star.childStars![activeStemIndex]!.shortName
                          ? "大限" +
                          star.childStars![
                            activeStemIndex
                          ].shortName.charAt(1)
                          : ""}
                      </span>
                    )}
                </div>
              );
            })}
          </span>
          <span className="text-xs sm:text-base">
            {palace.minorStars.map((star, i) => {
              return (
                <span key={i} className="mr-1">
                  <span className="mr-0.5">{star.shortName}</span>
                  {/* <span className="font-normal text-orange-600">
                    {star.luminosity?.slice(0, 1)}
                  </span> */}
                  {showChildStar && (
                    <span
                      className={`font-bold ${star.childStar ? "rounded-full border-2 border-indigo-500 px-1 text-indigo-500" : ""}`}>
                      {star.childStar
                        ? star.childStar.shortName.charAt(1)
                        : ""}
                    </span>
                  )}
                  {showSelfChildStar && (
                    <span
                      className={`font-bold ${star.selfChildStar ? "rounded-full border-2 border-red-500 px-1 text-red-500" : ""}`}>
                      {star.selfChildStar
                        ? star.selfChildStar.shortName.charAt(1)
                        : ""}
                    </span>
                  )}
                  {showDiagonalChildStar && (
                    <span
                      className={`font-bold ${star.triangleChildStar ? "rounded-full border-2 border-green-500 px-1 text-green-500" : ""}`}>
                      {star.triangleChildStar
                        ? star.triangleChildStar.shortName.charAt(1)
                        : ""}
                    </span>
                  )}
                  {showMainChildStar && (
                    <span
                      className={`font-bold ${star.mainChildStar ? "rounded-full border-2 border-purple-500 px-1 text-purple-500" : ""}`}>
                      {star.mainChildStar
                        ? star.mainChildStar.shortName.charAt(1)
                        : ""}
                    </span>
                  )}
                  {isActiveMode &&
                    star.childStars &&
                    activeStemIndex !== -1 && (
                      <span
                        className={`font-bold ${star.childStars![activeStemIndex]!.shortName ? "rounded-full border-2 border-purple-500 px-1 text-purple-500" : ""}`}>
                        {star.childStars![activeStemIndex]!.shortName
                          ? "大限" +
                          star.childStars![
                            activeStemIndex
                          ].shortName.charAt(1)
                          : ""}
                      </span>
                    )}
                </span>
              );
            })}
          </span>
        </div>
      </div>
      <Tooltip id="palaceTooltip" className="whitespace-pre-line" />
    </>
  );
}
