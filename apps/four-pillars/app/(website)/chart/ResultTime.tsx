import { DateTime } from "luxon";
import { FourPillarsProps } from "@/app/types";
import { ClockIcon } from "@heroicons/react/24/outline";
import { dmsToDecimalMinutes } from "utils";

export default function ResultTime({
  result
}: FourPillarsProps): JSX.Element {
  const {
    adjustedDate,
    timeZoneName,
    inEarthPeriod,
    utcOffset,
    dstOffset,
    localOffsetMinutes,
    equationOfTime,
    solarTerm,
    eclipticLongitude,
    useSpaceMethod,
    changeDayStem,
    timezoneOffset,
    currentTerm,
    elapsedDays
  } = result;

  // 調整後日時
  const adjustedDateTime = DateTime.fromISO(adjustedDate);
  const localAdjustedDateTime = adjustedDateTime.toUTC(Number(-timezoneOffset));
  const localAdjustedDateTimeStr =
    localAdjustedDateTime.toFormat("y年M月d日 H:mm");

  // 均時差
  const eqTime = dmsToDecimalMinutes(equationOfTime).toFixed(1);

  // 節入り日時
  const currentTermStart = DateTime.fromISO(currentTerm.startTime.toString());
  const localCurrentTermStart = currentTermStart.toUTC(Number(-timezoneOffset));
  const localCurrentTermStartStr = localCurrentTermStart.toFormat("y年M月d日 H:mm");

  // 翌月節入り日時
  const currentTermEnd = DateTime.fromISO(currentTerm.endTime.toString());
  const localCurrentTermEnd = currentTermEnd.toUTC(Number(-timezoneOffset));
  const localCurrentTermEndStr = localCurrentTermEnd.toFormat("y年M月d日 H:mm");

  // 節入り後日数
  const elapsedDaysNum = elapsedDays.days + (elapsedDays.hours / 24);

  // 土用
  const earthPeriodStr = inEarthPeriod ? "（土用）" : "";

  return (
    <div className="section-container">
      <table className="section-table">
        <tbody className="section-table-body">
          <tr className="table-row">
            <th
              colSpan={2}
              className="section-header">
              <div className="flex items-center">
                <ClockIcon className="section-icon" />
                時間情報
              </div>
            </th>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              タイムゾーン
            </td>
            <td className="table-cell-content-without-border">
              {timeZoneName}
            </td>
          </tr>
          {/* <tr className="table-row">
            <td className="table-left-header">
              協定世界時との時差
            </td>
            <td className="table-cell-content-without-border">
              {utcOffset > 0 && "+"}
              {utcOffset.toFixed(1)}時間
            </td>
          </tr> */}
          <tr className="table-row">
            <td className="table-left-header">
              サマータイム
            </td>
            <td className="table-cell-content-without-border">
              {dstOffset > 0 ? `-${(dstOffset / 60).toFixed(1)}分` : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              地方時差
            </td>
            <td className="table-cell-content-without-border">
              {localOffsetMinutes > 0 && "+"}
              {localOffsetMinutes.toFixed(1)}分
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              均時差
            </td>
            <td className="table-cell-content-without-border">
              {/* {equationOfTime.neg ? "-" : "+"}
              {equationOfTime.m}分
              {equationOfTime.s.toFixed(0)}秒 */}
              {equationOfTime.neg ? eqTime : `+${eqTime}`}分
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              調整後日時
            </td>
            <td className="table-cell-content-without-border">
              {`${localAdjustedDateTimeStr}`}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              節入り日時
            </td>
            <td className="table-cell-content-without-border">
              {localCurrentTermStartStr}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              翌月節入り日時
            </td>
            <td className="table-cell-content-without-border">
              {localCurrentTermEndStr}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              節入り後日数
            </td>
            <td className="table-cell-content-without-border">
              {elapsedDaysNum.toFixed(1)}日
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              太陽黄経
            </td>
            <td className="table-cell-content-without-border">
              {eclipticLongitude.toFixed(2)}度
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              二十四節気
            </td>
            <td className="table-cell-content-without-border">
              {`${solarTerm}${earthPeriodStr}`}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              二十四節気分割法
            </td>
            <td className="table-cell-content-without-border">
              {useSpaceMethod ? "定気法" : "平気法（恒気法）"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              日柱切り替え時刻
            </td>
            <td className="table-cell-content-without-border">
              {changeDayStem ? "23時" : "0時"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
