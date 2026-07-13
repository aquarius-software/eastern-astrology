'use client';

import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { PurpleStarData } from "@/app/types";
import { LunarMonth, SEXAGENARY_CYCLE } from "types";
import { useBoardContext } from "@/context/boardContext";
import { DateTime } from 'luxon';

export default function PeriodicLucks({
  result
}: {
  result: PurpleStarData;
}) {
  const {
    palaces,
    currentDecadePalaceName,
    currentYearlyPalaceName,
    currentDecadePalaceBranch,
    currentYearlyPalaceBranch
  } = result;

  let yearlyBranch;
  let currentYearlyPalace;
  let currentMonthlyPalace;
  const { currentMonth } = useBoardContext();
  const currentDateStr = DateTime.now().toFormat("y年L月d日");

  try {
    // 大歳取得
    const CalendarChinese = require("date-chinese").CalendarChinese;
    const cal = new CalendarChinese();
    cal.fromDate(new Date());
    const cycle: number = cal.get()![1] - 1;
    yearlyBranch = SEXAGENARY_CYCLE[cycle].branch;
    currentYearlyPalace = palaces.find(
      palace => palace.branch === yearlyBranch
    );

    // 月運取得
    currentMonthlyPalace = palaces.find(
      palace => palace.branch === currentMonth?.branch
    );
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="section-container">
      <table className="section-table">
        <tbody className="section-table-body">
          <tr className="table-row">
            <th colSpan={2} className="section-header">
              <div className="flex items-center">
                <CalendarDaysIcon className="section-icon" />
                行限（{currentDateStr}）
              </div>
            </th>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">大限（10年運）</td>
            <td className="table-cell-content">
              {currentDecadePalaceName && currentDecadePalaceBranch
                ? `${currentDecadePalaceBranch}（${currentDecadePalaceName}）`
                : ""}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">小限（年運）</td>
            <td className="table-cell-content">
              {currentYearlyPalaceName && currentYearlyPalaceBranch
                ? `${currentYearlyPalaceBranch}（${currentYearlyPalaceName}）`
                : ""}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">大歳（年運）</td>
            <td className="table-cell-content">
              {yearlyBranch}（{currentYearlyPalace?.name}）
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">斗君（月運）</td>
            <td className="table-cell-content">
              {currentMonthlyPalace && currentMonth
                ? `${currentMonth.branch}（${currentMonthlyPalace.name}）`
                : ""}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}