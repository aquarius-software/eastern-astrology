'use client';

import React, { useState, useEffect } from "react";
import { PurpleStarData } from "@/app/types";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { SEXAGENARY_CYCLE, Palace, LunarMonth } from "types";
import { fromChineseYearToBcYear } from "utils";
import { Button } from "@heroui/react";
import { useBoardContext } from "@/context/boardContext";

const CalendarChinese = require("date-chinese").CalendarChinese;

export default function MonthlyLucks({
  result
}: {
  result: PurpleStarData;
}): JSX.Element {
  const { januaryBranchIndex, palaces } = result;

  const cal = new CalendarChinese();
  let currentDate = new Date();
  cal.fromDate(currentDate);
  const currentBcYear = fromChineseYearToBcYear(cal.cycle, cal.year);
  const lowestBcYear = currentBcYear - 50;
  const highestBcYear = currentBcYear + 50;

  const [cycle, setCycle] = useState<number>(cal.cycle);
  const [year, setYear] = useState<number>(cal.year);
  const [months, setMonths] = useState<LunarMonth[]>([]);
  const [bcYear, setBcYear] = useState<number>(currentBcYear);
  const { setCurrentMonth } = useBoardContext();

  const localDateStr = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1
      }月${date.getDate()}日`;
  };

  const findPalace = (month: LunarMonth): Palace | undefined => {
    const palace = palaces.find(
      palace => palace.branch === month.branch
    );
    return palace;
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ROUTE_HANDLER_URL}/api/months`,
          {
            body: JSON.stringify({
              cycle,
              year,
              januaryBranchIndex
            }),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP Response Code: ${response.status} `);
        }
        const result = await response.json();
        const lunarMonths: LunarMonth[] = result.months;
        setMonths(lunarMonths);
        const currentMonth = lunarMonths.find(
          (lunarMonth: LunarMonth) => lunarMonth.isCurrentMonth
        );
        if (currentMonth) {
          setCurrentMonth(currentMonth);
        }
      } catch (error) {
        console.error(error);
        setMonths([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle, year]);

  return (
    <div className="section-container">
      <table className="section-table">
        <thead className="font-medium text-gray-600 dark:divide-gray-600 dark:text-white">
          <tr className="divide-x divide-y dark:divide-gray-600">
            <th
              colSpan={12}
              className="section-header border-b dark:border-b-0">
              <div className="flex items-center">
                <CalendarDaysIcon className="section-icon" />
                <span className="mr-4">
                  月運（{SEXAGENARY_CYCLE[year - 1].stem}
                  {SEXAGENARY_CYCLE[year - 1].branch}年・{bcYear}〜
                  {bcYear + 1}）
                </span>
                <div className="flex w-full justify-start md:justify-end gap-3">
                  {/* Previous Button */}
                  {lowestBcYear <
                    fromChineseYearToBcYear(cycle, year) ? (
                    <Button onClick={e => {
                      e.preventDefault();
                      let prevYear = year - 1;
                      if (prevYear < 1) {
                        prevYear = 60;
                        setCycle(cycle - 1);
                      }
                      setYear(prevYear);
                      setBcYear(bcYear - 1);
                    }}>前の年
                    </Button>
                  ) : (
                    ""
                  )}
                  {highestBcYear >
                    fromChineseYearToBcYear(cycle, year) ? (
                    <Button onClick={e => {
                      e.preventDefault();
                      let nextYear = year + 1;
                      if (nextYear > 60) {
                        nextYear = 1;
                        setCycle(cycle + 1);
                      }
                      setYear(nextYear);
                      setBcYear(bcYear + 1);
                    }}>次の年
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="section-table-body">
          <tr className="divide-x divide-y dark:divide-gray-700 dark:text-gray-300">
            <th className="table-cell-content text-left font-bold">
              月（旧暦）
            </th>
            <th className="table-cell-content text-left font-bold">
              期間（西暦）
            </th>
            <th className="table-cell-content text-left font-bold">
              宮
            </th>
          </tr>
          {months.map((month: LunarMonth, i: number) => (
            <tr
              key={i}
              className={`divide-x divide-y dark:divide-gray-700 dark:text-gray-300 ${month.isCurrentMonth ? "bg-gray-200" : "bg-white"
                } `}>
              <td className="table-cell-content text-left">
                {month.monthIndex}月
                {month.isLeap ? `・閏${month.monthIndex}月` : ""}
              </td>
              <td className="table-cell-content text-left">
                {localDateStr(month.startDate)}&nbsp;〜&nbsp;
                {localDateStr(month.endDate)}
              </td>
              <td className="table-cell-content text-left">
                {findPalace(month)?.name}（{month.branch}）
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
