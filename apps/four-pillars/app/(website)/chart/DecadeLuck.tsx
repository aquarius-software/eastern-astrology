"use client";

import React from "react";
import {
  stemCombinationStr,
  branchCombinationStr,
  branchClashesStr,
  threeHarmonyCombinationsStr,
  threeSeasonalCombinationsStr,
  twoHarmonyCombinationsStr,
  twoSeasonalCombinationsStr
} from "@/utils/utils";
import { DateTime } from "luxon";
import { useForm, Controller } from "react-hook-form";
import { FourPillarsProps } from "@/app/types";
import { DecadeLuck } from "types";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Tooltip } from 'react-tooltip'
import { Checkbox } from "@heroui/react";

export default function DecadeLucks({
  result
}: FourPillarsProps): JSX.Element {
  const decadeLucks = result.decadeLucks;
  const colors = [
    "bg-emerald-300",
    "bg-red-300",
    "bg-slate-300",
    "bg-indigo-300"
  ];
  const { register, watch, control, getValues, setValue } = useForm();
  const showRelationships = watch("showRelationships");
  const showChangingStars = watch("showChangingStars");
  const showTwelveLucks = watch("showTwelveLucks");

  return (
    <div className="section-container">
      <div className="section-header flex items-center">
        <CalendarIcon className="section-icon" />
        大運
      </div>
      <table className="luck-table border-collapse shadow">
        <thead className="font-medium text-gray-600 dark:divide-gray-600 dark:text-white">
          <tr className="dark:text-gray-300">
            <th className="table-top-header">
              干支
            </th>
            <th className="table-top-header">開始年月</th>
            <th className="table-top-header">満年齢</th>
            {showRelationships && (
              <th className="table-top-header">命式との関係</th>
            )}
            {showChangingStars && (
              <th className="table-top-header">通変星</th>
            )}
            {showTwelveLucks && <th className="table-top-header">十二運</th>}
          </tr>
        </thead>
        <tbody className="text-gray-600 dark:divide-gray-600 dark:text-white">
          {decadeLucks.map((item: DecadeLuck, i: number) => (
            <React.Fragment key={i}>
              <tr
                data-tooltip-id={item.inCurrentPeriod ? "showCurrentDecadeLuckTooltip" : undefined}
                data-tooltip-content={item.inCurrentPeriod ? "現在進行中の大運" : undefined}
                data-tooltip-variant="success"
                className={`dark:text-gray-300 ${item.inCurrentPeriod && "bg-gray-200 dark:bg-gray-700"
                  }`}>
                <td className="table-cell-content border border-slate-300 font-bold dark:bg-gray-600">
                  <button
                    className={`mr-1 h-7 w-7 cursor-default rounded-full font-bold text-black ${item.seasonId !== undefined
                      ? colors[item.seasonId]
                      : ""
                      }`}>
                    {i}
                  </button>
                  <span className="font-bold">{item.value}</span>
                </td>
                <td className="table-cell-content">
                  {DateTime.fromISO(item.startingDate)
                    .setLocale("ja")
                    .toFormat("yyyy年M月")}
                </td>
                <td className="table-cell-content">
                  {item.age.toFixed(0)}歳
                </td>
                {showRelationships && (<td className="table-cell-content">
                  <span className="block">{stemCombinationStr(item)}</span>
                  <span className="block">{branchCombinationStr(item)}</span>
                  <span className="block">{branchClashesStr(item)}</span>
                  <span className="block">{threeHarmonyCombinationsStr(item)}</span>
                  {twoHarmonyCombinationsStr(item) &&
                    twoHarmonyCombinationsStr(item)!.map(
                      (combinationStr: string, i: number) => {
                        return <span className="block" key={i}>{combinationStr}</span>;
                      }
                    )}
                  <span>{threeSeasonalCombinationsStr(item)}</span>
                  {twoSeasonalCombinationsStr(item) &&
                    twoSeasonalCombinationsStr(item)!.map(
                      (combinationStr: string, i: number) => {
                        return <span className="block" key={i}>{combinationStr}</span>;
                      }
                    )}
                  <span className="block">{item.inEmptyPeriod ? "空亡" : ""}</span>
                </td>)}
                {showChangingStars && (
                  <td className="table-cell-content">
                    {item.changingStar}
                  </td>
                )}
                {showTwelveLucks && (
                  <td className="table-cell-content">
                    {item.twelveLuck}
                  </td>
                )}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <Tooltip style={{ fontSize: "0.875rem" }} id="showCurrentDecadeLuckTooltip" place="top" />
      <div className="mb-4">
        <h3 className="mx-6 my-3 font-bold text-base">表示設定</h3>
        <div className="mx-6 my-2 grid grid-cols-2 gap-x-8 gap-y-4 text-base font-normal text-neutral-800 md:grid-cols-3">
          <Controller
            control={control}
            name="showRelationships"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                onChange={e => {
                  onChange(e);
                  setValue("showRelationships", getValues("showRelationships"));
                }}
                isSelected={value}
              >
                命式との関係
              </Checkbox>
            )}
          />
          <Controller
            control={control}
            name="showChangingStars"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                onChange={e => {
                  onChange(e);
                  setValue("showChangingStars", getValues("showChangingStars"));
                }}
                isSelected={value}
              >
                通変星
              </Checkbox>
            )}
          />
          <Controller
            control={control}
            name="showTwelveLucks"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                onChange={e => {
                  onChange(e);
                  setValue("showTwelveLucks", getValues("showTwelveLucks"));
                }}
                isSelected={value}
              >
                十二運
              </Checkbox>
            )}
          />
        </div>
      </div>
    </div >
  );
}
