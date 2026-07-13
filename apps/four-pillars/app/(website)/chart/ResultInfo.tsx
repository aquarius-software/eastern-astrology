import { DateTime } from "luxon";
import { FourPillarsProps } from "@/app/types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function ResultInfo({
  result
}: FourPillarsProps): JSX.Element {
  const {
    heavenlyStems,
    earthlyBranches,
    birthDateTime,
    isHourUnknown,
    gender,
    startingAge,
    currentAge,
    luckOrder,
    currentDecadeLuck,
    currentYearlyLuck,
    passedYears,
    latitude,
    longitude,
    timezoneOffset
  } = result;

  let birthDate = DateTime.fromISO(birthDateTime);
  birthDate = birthDate.toUTC(Number(-timezoneOffset));
  const birthTimeStr = isHourUnknown
    ? `${birthDate.toFormat("y年M月d日")}（生時不明）`
    : birthDate.toFormat("y年M月d日 H:mm");

  const latitudeValue = Number(latitude);
  const longitudeValue = Number(longitude);

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
            <td className="table-left-header">入力日時</td>
            <td className="table-cell-content-without-border">
              {birthTimeStr}
            </td>
          </tr>
          {!result.isHourUnknown && (
            <tr className="table-row">
              <td className="table-left-header">生誕地</td>
              <td className="table-cell-content-without-border">
                {latitudeValue >= 0 ? "北緯" : "南緯"}
                {Math.abs(latitudeValue)}度/
                {longitudeValue >= 0 ? "東経" : "西経"}
                {Math.abs(longitudeValue)}度
              </td>
            </tr>
          )}
          {(currentAge >= 0 && currentAge <= 120) &&
            <tr className="table-row">
              <td className="table-left-header">満年齢</td>
              <td className="table-cell-content-without-border">
                {currentAge}歳
              </td>
            </tr>
          }
          <tr className="table-row">
            <td className="table-left-header">性別</td>
            <td className="table-cell-content-without-border">
              {gender === "1" ? "男性" : "女性"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">立運</td>
            <td className="table-cell-content-without-border">
              {startingAge.toFixed(1)}年
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">行運</td>
            <td className="table-cell-content-without-border">
              {luckOrder ? "順運" : "逆運"}
            </td>
          </tr>
          {hourStem?.value && hourBranch?.value ? (
            <tr className="table-row">
              <td className="table-left-header">時柱</td>
              <td className="table-cell-content-without-border">
                {`${hourStem?.value}${hourBranch?.value}`}
              </td>
            </tr>
          ) : (
            ""
          )}
          <tr className="table-row">
            <td className="table-left-header">日柱</td>
            <td className="table-cell-content-without-border">
              {`${dayStem?.value}${dayBranch?.value}`}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">月柱</td>
            <td className="table-cell-content-without-border">
              {`${monthStem?.value}${monthBranch?.value}`}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">年柱</td>
            <td className="table-cell-content-without-border">
              {`${yearStem?.value}${yearBranch?.value}`}
            </td>
          </tr>
          {currentDecadeLuck && (
            <tr className="table-row">
              <td className="table-left-header">大運（現在）</td>
              <td className="table-cell-content-without-border">
                {currentDecadeLuck}
                {passedYears && `（${Math.ceil(passedYears)}年目）`}
              </td>
            </tr>
          )}
          <tr className="table-row">
            <td className="table-left-header">歳運（現在）</td>
            <td className="table-cell-content-without-border">
              {currentYearlyLuck}
            </td>
          </tr>
        </tbody>
      </table>
    </div >
  );
}
