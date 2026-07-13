import { DateTime } from "luxon";
import { PurpleStarData } from "@/app/types";
import { PALACE_BRANCHES, LunarMonth } from "types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function ResultInfo({
  result
}: {
  result: PurpleStarData;
}): JSX.Element {
  const {
    birthDateTime,
    latitude,
    longitude,
    isYang,
    isMale,
    division,
    chineseDate,
    asianAge,
    bodyPalace,
    januaryBranchIndex,
  } = result;

  const birthDate = DateTime.fromISO(birthDateTime.toString());
  const birthTimeStr = birthDate.toFormat("y年M月d日 H:mm");

  const chineseDateStr = `${chineseDate.yearStem}${chineseDate.yearBranch
    }年 ${chineseDate.month}月${chineseDate.day}日 ${chineseDate.hourBranch
    }時${chineseDate.isLeapMonth ? "（閏月）" : ""}`;

  let januaryBranch = "";
  if (januaryBranchIndex >= 0 && januaryBranchIndex <= 11) {
    januaryBranch = PALACE_BRANCHES[januaryBranchIndex].value;
  }

  const latitudeValue = parseFloat(latitude);
  const longitudeValue = parseFloat(longitude);

  // 未来の日付が入力されたかどうか判定
  const isFutureDate = () => {
    const diff = DateTime.now().diff(birthDate).milliseconds;
    return diff > 0 ? true : false;
  }

  return (
    <div className="section-container">
      <table className="section-table">
        <tbody className="section-table-body">
          <tr className="table-row">
            <th colSpan={2} className="section-header">
              <div className="flex items-center">
                <PencilSquareIcon className="section-icon" />
                基本情報
              </div>
            </th>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">入力日時（西暦）</td>
            <td className="table-cell-content">{birthTimeStr}</td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">入力日時（旧暦）</td>
            <td className="table-cell-content">{chineseDateStr}</td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              生誕地
            </td>
            <td className="table-cell-content">
              {latitudeValue >= 0 ? "北緯 " : "南緯 "}
              {Math.abs(latitudeValue)}度/
              {longitudeValue >= 0 ? "東経 " : "西経 "}
              {Math.abs(longitudeValue)}度
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">陰陽・性別</td>
            <td className="table-cell-content">
              {isYang ? "陽" : "陰"}
              {isMale ? "男" : "女"}
            </td>
          </tr>
          {isFutureDate() ? (
            <tr className="table-row">
              <td className="table-left-header">数え年（旧暦）</td>
              <td className="table-cell-content">{asianAge}歳</td>
            </tr>
          ) : (
            ""
          )}
          <tr className="table-row">
            <td className="table-left-header">五行局</td>
            <td className="table-cell-content">{division}</td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">身宮</td>
            <td className="table-cell-content">{bodyPalace}</td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">子年斗君</td>
            <td className="table-cell-content">{januaryBranch}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
