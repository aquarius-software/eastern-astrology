"use client";

import { useForm } from "react-hook-form";
import OptionCheckboxes from "./OptionCheckboxes";
import OptionStorage from "./OptionStorage";
import { FourPillarsData, FourPillarsProps } from "@/app/types";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { Shippori_Mincho_B1 } from "next/font/google";
import { StemIcon, BranchIcon } from "ui";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { Branch } from "types";
import { DateTime } from "luxon";

const useFont = false; // フォントを使用する場合はtrue、SVGを使用する場合はfalse

const ship = Shippori_Mincho_B1({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-ship"
});

export default function ChartView({
  result
}: FourPillarsProps): JSX.Element {
  const {
    heavenlyStems,
    earthlyBranches,
    isHourUnknown,
    nickname,
    birthDateTime,
    timeZoneId
  }: FourPillarsData = result;

  const [currentRoots, setCurrentRoots] = useState<
    Branch[] | undefined
  >([]);
  const [currentBranch, setCurrentBranch] = useState<
    Branch | undefined
  >(undefined);

  const { watch, setValue } = useForm({
    defaultValues: {
      showRoots: true,
      showChangingStars: true,
      showTwelveLucks: true,
      showHiddenStems: true,
      showWithColor: true
    }
  });

  const hourStem = heavenlyStems.find(
    stem => stem.position === "hour"
  );
  const dayStem = heavenlyStems.find(stem => stem.position === "day");
  const monthStem = heavenlyStems.find(
    stem => stem.position === "month"
  );
  const yearStem = heavenlyStems.find(
    stem => stem.position === "year"
  );
  const hourBranch = earthlyBranches.find(
    branch => branch.position === "hour"
  );
  const dayBranch = earthlyBranches.find(
    branch => branch.position === "day"
  );
  const monthBranch = earthlyBranches.find(
    branch => branch.position === "month"
  );
  const yearBranch = earthlyBranches.find(
    branch => branch.position === "year"
  );

  const colors = [
    "bg-emerald-200",
    "bg-red-100",
    "bg-amber-100",
    "bg-slate-200",
    "bg-indigo-200"
  ];
  const plainColor = "bg-gray-50";

  const showRoots = watch("showRoots");
  const showChangingStars = watch("showChangingStars");
  const showTwelveLucks = watch("showTwelveLucks");
  const showHiddenStems = watch("showHiddenStems");
  const showWithColor = watch("showWithColor");

  let birthDate = DateTime.fromISO(birthDateTime.toString());
  birthDate = birthDate.setZone(timeZoneId);
  const birthTimeStr = isHourUnknown
    ? `${birthDate.toFormat("y年M月d日")}`
    : birthDate.toFormat("y年M月d日 H時mm分");

  return (
    <>
      <div className="section-container">
        <div className="section-header flex items-center border-b dark:border-b-0">
          <TableCellsIcon className="section-icon" />
          {nickname ? `${nickname}さんの命式` : "命式"}
        </div>
        {/* <h2 className="px-2 py-1 md:text-base">
          <span className="mr-5">{birthTimeStr}生まれ</span>
          <span className="mr-5">{gender === "1" ? "男命" : "女命"}</span>
          <span className="mr-5">立運 {startingAge.toFixed(2)}年</span>
          <span className="mr-5">{luckOrder ? "順運" : "逆運"}</span>
          <span>{currentDecadeLuck ? `大運 ${currentDecadeLuck}` : ""}</span>
        </h2> */}
        <table
          className={`w-full border-collapse border border-slate-400 text-sm shadow md:text-base ${ship.variable}`}>
          <thead>
            <tr>
              <th className="w-[16%] border border-slate-300 bg-gray-100 dark:bg-gray-600 md:w-[12%]"></th>
              <th className="w-[21%] border border-slate-300 bg-gray-100 dark:bg-gray-600 md:w-[22%]">
                時柱
              </th>
              <th className="w-[21%] border border-slate-300 bg-gray-100 dark:bg-gray-600 md:w-[22%]">
                日柱
              </th>
              <th className="w-[21%] border border-slate-300 bg-gray-100 dark:bg-gray-600 md:w-[22%]">
                月柱
              </th>
              <th className="w-[21%] border border-slate-300 bg-gray-100 dark:bg-gray-600 md:w-[22%]">
                年柱
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 bg-gray-100 text-center font-bold dark:bg-gray-600">
                天干
              </td>
              {!isHourUnknown ? (
                <td
                  className={`border border-slate-300 hover:shadow-[inset_0_0_0_4px_#d1d5db] ${showWithColor && hourStem!.elementId !== undefined
                    ? colors[hourStem!.elementId]
                    : plainColor
                    }${hourStem!.roots!.some(
                      root => root === currentBranch
                    )
                      ? " shadow-[inset_0_0_0_4px_#d1d5db]"
                      : ""
                    }`}
                  onMouseEnter={() =>
                    setCurrentRoots(hourStem?.roots)
                  }
                  onMouseLeave={() => setCurrentRoots([])}
                  data-tooltip-id={"hourStemTooltip"}
                  data-tooltip-content={""}
                  data-tooltip-variant="info">
                  {useFont ? (
                    <div className="pillar-text">
                      {hourStem && hourStem.value}
                    </div>
                  ) : (
                    <div className="pillar-icon">
                      <StemIcon index={hourStem?.index}></StemIcon>
                    </div>
                  )}
                  <Tooltip
                    id="hourStemTooltip"
                    className="whitespace-pre-line"
                  />
                </td>
              ) : (
                <td
                  className="border border-slate-300 bg-gray-100"
                  onMouseEnter={() =>
                    setCurrentRoots(hourStem?.roots)
                  }
                  onMouseLeave={() => setCurrentRoots([])}
                  data-tooltip-id={"hourStemTooltip"}
                  data-tooltip-content={"生時不明"}
                  data-tooltip-variant="info">
                  <Tooltip
                    id="hourStemTooltip"
                    className="whitespace-pre-line"
                  />
                </td>
              )}
              <td
                className={`border border-slate-300 hover:shadow-[inset_0_0_0_4px_#d1d5db] ${showWithColor && dayStem!.elementId !== undefined
                  ? colors[dayStem!.elementId]
                  : plainColor
                  }${dayStem!.roots!.some(root => root === currentBranch)
                    ? " shadow-[inset_0_0_0_4px_#d1d5db]"
                    : ""
                  }`}
                onMouseEnter={() => setCurrentRoots(dayStem?.roots)}
                onMouseLeave={() => setCurrentRoots([])}
                data-tooltip-id={"dayStemTooltip"}
                data-tooltip-content={""}
                data-tooltip-variant="info">
                {useFont ? (
                  <div className="pillar-text">{dayStem!.value}</div>
                ) : (
                  <div className="pillar-icon">
                    <StemIcon index={dayStem?.index}></StemIcon>
                  </div>
                )}
                <Tooltip
                  id="dayStemTooltip"
                  className="whitespace-pre-line"
                />
              </td>
              <td
                className={`border border-slate-300 hover:shadow-[inset_0_0_0_4px_#d1d5db] ${showWithColor && monthStem!.elementId !== undefined
                  ? colors[monthStem!.elementId]
                  : plainColor
                  }${monthStem!.roots!.some(
                    root => root === currentBranch
                  )
                    ? " shadow-[inset_0_0_0_4px_#d1d5db]"
                    : ""
                  }`}
                onMouseEnter={() => setCurrentRoots(monthStem?.roots)}
                onMouseLeave={() => setCurrentRoots([])}
                data-tooltip-id={"monthStemTooltip"}
                data-tooltip-content={""}
                data-tooltip-variant="info">
                {useFont ? (
                  <div className="pillar-text">
                    {monthStem!.value}
                  </div>
                ) : (
                  <div className="pillar-icon">
                    <StemIcon index={monthStem?.index}></StemIcon>
                  </div>
                )}
                <Tooltip
                  id="monthStemTooltip"
                  className="whitespace-pre-line"
                />
              </td>
              <td
                className={`border border-slate-300 hover:shadow-[inset_0_0_0_4px_#d1d5db] ${showWithColor && yearStem!.elementId !== undefined
                  ? colors[yearStem!.elementId]
                  : plainColor
                  }${yearStem!.roots!.some(
                    root => root === currentBranch
                  )
                    ? " shadow-[inset_0_0_0_4px_#d1d5db]"
                    : ""
                  }`}
                onMouseEnter={() => setCurrentRoots(yearStem?.roots)}
                onMouseLeave={() => setCurrentRoots([])}
                data-tooltip-id={"yearStemTooltip"}
                data-tooltip-content={""}
                data-tooltip-variant="info">
                {useFont ? (
                  <div className="pillar-text">{yearStem!.value}</div>
                ) : (
                  <div className="pillar-icon">
                    <StemIcon index={yearStem?.index}></StemIcon>
                  </div>
                )}
                <Tooltip
                  id="yearStemTooltip"
                  className="whitespace-pre-line"
                />
              </td>
            </tr>
            {false && (
              <tr>
                <td className="w-[12%] border border-slate-300 bg-gray-100 text-center font-bold dark:bg-gray-600">
                  通根
                </td>
                {!isHourUnknown ? (
                  <td className="border border-slate-300 text-center">
                    {hourStem?.roots?.join(" ")}
                  </td>
                ) : (
                  <td className="border border-slate-300"></td>
                )}
                <td className="border border-slate-300 text-center">
                  {dayStem?.roots?.join(" ")}
                </td>
                <td className="border border-slate-300 text-center">
                  {monthStem?.roots?.join(" ")}
                </td>
                <td className="border border-slate-300 text-center">
                  {yearStem?.roots?.join(" ")}
                </td>
              </tr>
            )}
            {showChangingStars && (
              <tr>
                <td className="w-[12%] border border-slate-300 bg-gray-100 text-center font-bold dark:bg-gray-600">
                  通変星
                </td>
                {!isHourUnknown ? (
                  <td className="border border-slate-300 text-center">
                    {hourStem!.changingStar}
                  </td>
                ) : (
                  <td className="border border-slate-300"></td>
                )}
                <td className="border border-slate-300 text-center">
                  {dayStem!.changingStar}
                </td>
                <td className="border border-slate-300 text-center">
                  {monthStem!.changingStar}
                </td>
                <td className="border border-slate-300 text-center">
                  {yearStem!.changingStar}
                </td>
              </tr>
            )}
            {showTwelveLucks && (
              <tr>
                <td className="w-[12%] border border-slate-300 bg-gray-100 text-center font-bold dark:bg-gray-600">
                  十二運
                </td>
                {!isHourUnknown ? (
                  <td className="border border-slate-300 text-center">
                    {hourStem!.twelveLuck}
                  </td>
                ) : (
                  <td className="border border-slate-300"></td>
                )}
                <td className="border border-slate-300 text-center">
                  {dayStem!.twelveLuck}
                </td>
                <td className="border border-slate-300 text-center">
                  {monthStem!.twelveLuck}
                </td>
                <td className="border border-slate-300 text-center">
                  {yearStem!.twelveLuck}
                </td>
              </tr>
            )}
            <tr>
              <td className="w-[12%] border border-slate-300 bg-gray-100 text-center font-bold dark:bg-gray-600">
                地支
              </td>
              {!isHourUnknown ? (
                <td
                  className={`border border-slate-300 hover:shadow-[inset_0_0_0_4px_#d1d5db] ${showWithColor &&
                    hourBranch!.elementId !== undefined
                    ? colors[hourBranch!.elementId]
                    : plainColor
                    }${currentRoots?.some(
                      root => root === hourBranch?.value
                    )
                      ? " shadow-[inset_0_0_0_4px_#d1d5db]"
                      : ""
                    }`}
                  onMouseEnter={() =>
                    setCurrentBranch(hourBranch?.value)
                  }
                  onMouseLeave={() => setCurrentBranch(undefined)}
                  data-tooltip-id={"hourBranchTooltip"}
                  data-tooltip-content={""}
                  data-tooltip-variant="info">
                  {useFont ? (
                    <div className="pillar-text">
                      {hourBranch && hourBranch.value}
                    </div>
                  ) : (
                    <div className="pillar-icon">
                      <BranchIcon
                        index={hourBranch?.index}></BranchIcon>
                    </div>
                  )}
                  <Tooltip
                    id="hourBranchTooltip"
                    className="whitespace-pre-line"
                  />
                </td>
              ) : (
                <td
                  className="border border-slate-300 bg-gray-100"
                  data-tooltip-id={"hourBranchTooltip"}
                  data-tooltip-content={"生時不明"}
                  data-tooltip-variant="info">
                  <Tooltip
                    id="hourBranchTooltip"
                    className="whitespace-pre-line"
                  />
                </td>
              )}
              <td
                className={`border border-slate-300 hover:shadow-[inset_0_0_0_4px_#d1d5db] ${showWithColor && dayBranch!.elementId !== undefined
                  ? colors[dayBranch!.elementId]
                  : plainColor
                  }${currentRoots?.some(
                    root => root === dayBranch?.value
                  )
                    ? " shadow-[inset_0_0_0_4px_#d1d5db]"
                    : ""
                  }`}
                onMouseEnter={() =>
                  setCurrentBranch(dayBranch?.value)
                }
                onMouseLeave={() => setCurrentBranch(undefined)}
                data-tooltip-id={"dayBranchTooltip"}
                data-tooltip-content={""}
                data-tooltip-variant="info">
                {useFont ? (
                  <div className="pillar-text">
                    {dayBranch!.value}
                  </div>
                ) : (
                  <div className="pillar-icon">
                    <BranchIcon index={dayBranch?.index}></BranchIcon>
                  </div>
                )}
                <Tooltip
                  id="dayBranchTooltip"
                  className="whitespace-pre-line"
                />
              </td>
              <td
                className={`border border-slate-300 hover:shadow-[inset_0_0_0_4px_#9ca3af] ${showWithColor &&
                  monthBranch!.elementId !== undefined
                  ? colors[monthBranch!.elementId]
                  : plainColor
                  }${currentRoots?.some(
                    root => root === monthBranch?.value
                  )
                    ? " shadow-[inset_0_0_0_4px_#9ca3af]"
                    : ""
                  }`}
                onMouseEnter={() =>
                  setCurrentBranch(monthBranch?.value)
                }
                onMouseLeave={() => setCurrentBranch(undefined)}
                data-tooltip-id={"monthBranchTooltip"}
                data-tooltip-content={""}
                data-tooltip-variant="info">
                {useFont ? (
                  <div className="pillar-text">
                    {monthBranch!.value}
                  </div>
                ) : (
                  <div className="pillar-icon">
                    <BranchIcon
                      index={monthBranch?.index}></BranchIcon>
                  </div>
                )}
                <Tooltip
                  id="monthBranchTooltip"
                  className="whitespace-pre-line"
                />
              </td>
              <td
                className={`border border-slate-300 hover:shadow-[inset_0_0_0_4px_#d1d5db] ${showWithColor && yearBranch!.elementId !== undefined
                  ? colors[yearBranch!.elementId]
                  : plainColor
                  }${currentRoots?.some(
                    root => root === yearBranch?.value
                  )
                    ? " shadow-[inset_0_0_0_4px_#d1d5db]"
                    : ""
                  }`}
                onMouseEnter={() =>
                  setCurrentBranch(yearBranch?.value)
                }
                onMouseLeave={() => setCurrentBranch(undefined)}
                data-tooltip-id={"yearBranchTooltip"}
                data-tooltip-content={""}
                data-tooltip-variant="info">
                {useFont ? (
                  <div className="pillar-text">
                    {yearBranch!.value}
                  </div>
                ) : (
                  <div className="pillar-icon">
                    <BranchIcon
                      index={yearBranch?.index}></BranchIcon>
                  </div>
                )}
                <Tooltip
                  id="yearBranchTooltip"
                  className="whitespace-pre-line"
                />
              </td>
            </tr>
            {showHiddenStems && (
              <tr>
                <td className="w-[12%] border border-slate-300 bg-gray-100 text-center font-bold dark:bg-gray-600">
                  蔵干
                </td>
                <td className="border border-slate-300 text-center">
                  {hourBranch &&
                    hourBranch!.hiddenStems!.map(
                      (stem, i: number) => (
                        <span
                          key={i}
                          className={
                            stem.inProgress
                              ? "font-bold"
                              : "font-normal"
                          }>
                          {stem.value}&nbsp;
                        </span>
                      )
                    )}
                </td>
                <td className="border border-slate-300 text-center">
                  {dayBranch &&
                    dayBranch!.hiddenStems!.map((stem, i: number) => (
                      <span
                        key={i}
                        className={
                          stem.inProgress
                            ? "font-bold"
                            : "font-normal"
                        }>
                        {stem.value}&nbsp;
                      </span>
                    ))}
                </td>
                <td className="border border-slate-300 text-center">
                  {monthBranch &&
                    monthBranch!.hiddenStems!.map(
                      (stem, i: number) => (
                        <span
                          key={i}
                          className={
                            stem.inProgress
                              ? "font-bold"
                              : "font-normal"
                          }>
                          {stem.value}&nbsp;
                        </span>
                      )
                    )}
                </td>
                <td className="border border-slate-300 text-center">
                  {yearBranch &&
                    yearBranch!.hiddenStems!.map(
                      (stem, i: number) => (
                        <span
                          key={i}
                          className={
                            stem.inProgress
                              ? "font-bold"
                              : "font-normal"
                          }>
                          {stem.value}&nbsp;
                        </span>
                      )
                    )}
                </td>
              </tr>
            )}
            {showChangingStars && (
              <tr>
                <td className="w-[12%] border border-slate-300 bg-gray-100 text-center font-bold dark:bg-gray-600">
                  通変星
                </td>
                <td className="border border-slate-300 text-center">
                  {hourBranch &&
                    hourBranch!.hiddenStems!.map(
                      (stem, i: number) => (
                        <span
                          className={`inline-block ${stem.inProgress
                            ? "font-bold"
                            : "font-normal"
                            }`}
                          key={i}>
                          {stem.changingStar}&nbsp;
                        </span>
                      )
                    )}
                </td>
                <td className="border border-slate-300 text-center">
                  {dayBranch &&
                    dayBranch!.hiddenStems!.map((stem, i: number) => (
                      <span
                        className={`inline-block ${stem.inProgress
                          ? "font-bold"
                          : "font-normal"
                          }`}
                        key={i}>
                        {stem.changingStar}&nbsp;
                      </span>
                    ))}
                </td>
                <td className="border border-slate-300 text-center">
                  {monthBranch &&
                    monthBranch!.hiddenStems!.map(
                      (stem, i: number) => (
                        <span
                          className={`inline-block ${stem.inProgress
                            ? "font-bold"
                            : "font-normal"
                            }`}
                          key={i}>
                          {stem.changingStar}&nbsp;
                        </span>
                      )
                    )}
                </td>
                <td className="border border-slate-300 text-center">
                  {yearBranch &&
                    yearBranch!.hiddenStems!.map(
                      (stem, i: number) => (
                        <span
                          className={`inline-block ${stem.inProgress
                            ? "font-bold"
                            : "font-normal"
                            }`}
                          key={i}>
                          {stem.changingStar}&nbsp;
                        </span>
                      )
                    )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mb-4">
          <OptionCheckboxes
            result={result}
            setValue={setValue}></OptionCheckboxes>
          <OptionStorage result={result}></OptionStorage>
        </div>
      </div>
    </>
  );
}
