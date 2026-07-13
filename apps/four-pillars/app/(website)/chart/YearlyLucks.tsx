"use client";

import React, { useState, useEffect } from "react";
import {
  stemCombinationStr,
  branchCombinationStr,
  branchClashesStr
} from "@/utils/utils";
import { DateTime } from "luxon";
import { useForm, Controller } from "react-hook-form";
import { FourPillarsProps } from "@/app/types";
import { YearlyLuck } from "types";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from 'react-tooltip'
import { Button, Checkbox } from "@heroui/react";

export default function YearlyLucks({
  result
}: FourPillarsProps): JSX.Element {
  const {
    birthDateTime,
    isHourUnknown,
    gender,
    latitude,
    longitude,
    timezoneOffset,
    utcOffset,
    dstOffset,
    useSpaceMethod,
    changeDayStem,
    currentYear
  } = result;

  const birthDateTimeObj = DateTime.fromISO(birthDateTime.toString());
  const diff = DateTime.now().diff(birthDateTimeObj, "years");
  const age = Math.floor(diff.years);
  let currentCount = Math.floor(age / 10);
  if (age < 0 || age > 120) {
    // 0歳未満と120歳以上の場合は0歳から表示
    currentCount = 0;
  }
  const birthYear = birthDateTimeObj.year;

  const [count, setCount] = useState<number>(currentCount);
  const [yearlyLucks, setYearlyLucks] = useState<YearlyLuck[]>([]);
  const { watch, control, setValue, getValues } = useForm();
  const showRelationships = watch("showRelationships");
  const showChangingStars = watch("showChangingStars");

  useEffect(() => {
    (async () => {
      const startYear = birthYear + count * 10;
      const endYear = birthYear + 9 + count * 10;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ROUTE_HANDLER_URL}/api/chart`,
          {
            body: JSON.stringify({
              isoDate: birthDateTime.toString(),
              latitude,
              longitude,
              timezoneOffset,
              gender,
              utcOffset,
              dstOffset: dstOffset / 60 / 60,
              useSpaceMethod,
              isHourUnknown,
              changeDayStem,
              yearlyLuckStart: startYear,
              yearlyLuckEnd: endYear,
              yearlyLucks: true
            }),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP Response Code: ${response.status}`);
        }
        const result = await response.json();
        setYearlyLucks(result.yearlyLucks);
      } catch (error) {
        console.error(error);
        setYearlyLucks([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div className="section-container">
      <div className="section-header flex items-center">
        <CalendarDaysIcon className="section-icon" />
        歳運
        <div className="flex w-full justify-end gap-2">
          {count > 0 && (
            <Button onClick={e => {
              e.preventDefault();
              setCount(count - 1);
            }}>前の10年
            </Button>
          )}
          {count < 11 && (
            <Button onClick={e => {
              e.preventDefault();
              setCount(count + 1);
            }}>次の10年
            </Button>
          )}
        </div>
      </div>
      {
        (yearlyLucks && yearlyLucks.length > 0) ?
          <>
            <table className="luck-table border-collapse shadow">
              <thead className="font-medium text-gray-600 dark:divide-gray-600 dark:text-white">
                <tr className="dark:text-gray-300">
                  <th className="table-top-header">
                    干支
                  </th>
                  <th className="table-top-header">大運</th>
                  <th className="table-top-header">西暦年</th>
                  <th className="table-top-header">満年齢</th>
                  {showRelationships && (
                    <th className="table-top-header">命式との関係</th>
                  )}
                  {showChangingStars && (
                    <th className="table-top-header">通変星</th>
                  )}
                </tr>
              </thead>
              <tbody className="section-table-body">
                {yearlyLucks &&
                  yearlyLucks.map((item: YearlyLuck, i: number) => (
                    <React.Fragment key={i}>
                      <tr
                        data-tooltip-id={item.year === currentYear ? "showCurrentYearlyLuckTooltip" : undefined}
                        data-tooltip-content={item.year === currentYear ? "現在進行中の歳運" : undefined}
                        data-tooltip-variant="success"
                        className={`dark:text-gray-300 ${item.year === currentYear
                          ? "bg-gray-200 dark:bg-gray-700"
                          : ""
                          }`}>
                        <td className="table-cell-content">
                          <span className="font-bold">{item.value}</span>
                        </td>
                        <td className="table-cell-content">
                          {item.decadeLucks
                            .map(decadeLuck => decadeLuck)
                            .join("-")}
                        </td>
                        <td className="table-cell-content">
                          {item.year}〜
                          {String((item.year + 1) % 100).padStart(2, "0")}
                        </td>
                        <td className="table-cell-content">
                          {item.age}〜{item.age + 1}歳
                        </td>
                        {showRelationships && (
                          <td className="table-cell-content">
                            <span className="block">{stemCombinationStr(item)}</span>
                            <span className="block">{branchCombinationStr(item)}</span>
                            <span className="block">{branchClashesStr(item)}</span>
                            <span className="block">{item.inEmptyPeriod ? "空亡" : ""}</span>
                          </td>
                        )}
                        {showChangingStars && (
                          <td className="table-cell-content">
                            {item.changingStar}
                          </td>
                        )}
                      </tr>
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
            <Tooltip style={{ fontSize: "0.875rem" }} id="showCurrentYearlyLuckTooltip" place="top" />
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
              </div>
            </div>
          </>
          :
          <>
            <div className="p-4 text-base bg-white dark:bg-gray-900 rounded-b-lg border-t">
              <h3 className="flex items-center text-red-500 font-bold">
                <InformationCircleIcon className="section-icon" />
                歳運を取得中です。
              </h3>
            </div>
          </>
      }
    </div >
  );
}
