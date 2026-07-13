import { DateTime } from "luxon";
import { PurpleStarProps } from "@/app/types";
import { ClockIcon } from "@heroicons/react/24/outline";

export default function ResultTime({
  result
}: PurpleStarProps): JSX.Element {
  const {
    adjustedDate,
    latitude,
    longitude,
    timeZoneName,
    timeZoneId,
    utcOffset,
    dstOffset,
    localOffsetMinutes,
  } = result;

  const localAdjustedDate = DateTime.fromISO(adjustedDate);
  const adjustedDateTimeStr = localAdjustedDate.toFormat("y年M月d日 H:mm");

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
                時間・位置
              </div>
            </th>
          </tr>
          {/* <tr className="table-row">
            <td className="table-left-header">
              位置
            </td>
            <td className="table-cell-content">
              {latitudeValue >= 0 ? "北緯 " : "南緯 "}
              {Math.abs(latitudeValue)}度<br />
              {longitudeValue >= 0 ? "東経 " : "西経 "}
              {Math.abs(longitudeValue)}度
            </td>
          </tr> */}
          <tr className="table-row">
            <td className="table-left-header">
              タイムゾーン
            </td>
            <td className="table-cell-content">
              {timeZoneName}
            </td>
          </tr>
          {/* <tr className="table-row">
            <td className="table-left-header">
              協定世界時との時差
            </td>
            <td className="table-cell-content">
              {utcOffset > 0 && "+"}
              {utcOffset.toFixed(1)}時間
            </td>
          </tr> */}
          <tr className="table-row">
            <td className="table-left-header">
              サマータイム
            </td>
            <td className="table-cell-content">
              {dstOffset > 0 ? `-${(dstOffset / 60).toFixed(1)}分` : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              地方時差
            </td>
            <td className="table-cell-content">
              {localOffsetMinutes > 0 && "+"}
              {localOffsetMinutes.toFixed(1)}分
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              調整後日時（西暦）
            </td>
            <td className="table-cell-content">
              {`${adjustedDateTimeStr}`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
