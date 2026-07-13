import ResultInfo from "./ResultInfo";
import ResultBoard from "./ResultBoard";
import Sharing from "./Sharing";
import { PurpleStarProps } from "@/app/types";
import ResultTime from "./ResultTime";
import PalaceDetail from "./PalaceDetail";
import MonthlyLucks from "./MonthlyLucks";
import PeriodicLucks from "./PeriodicLucks";
import { DateTime } from "luxon";

export default function ResultView({ result }: PurpleStarProps) {
  const { palaces, birthDateTime } = result;

  // 未来の日付が入力されたかどうか判定
  const birthDate = DateTime.fromISO(birthDateTime.toString());
  const isFutureDate = () => {
    const diff = DateTime.now().diff(birthDate).milliseconds;
    return diff > 0 ? true : false;
  };

  return (
    <div className="text-black-500 mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-2 text-sm sm:w-10/12 lg:w-full lg:grid-cols-[1.618fr_1fr]">
      <div className="flex flex-col gap-6">
        <ResultBoard result={result}></ResultBoard>
        <PalaceDetail palaces={palaces}></PalaceDetail>
        <MonthlyLucks
          result={result}></MonthlyLucks>
      </div>
      <div className="flex flex-col gap-6">
        <ResultInfo
          result={result}></ResultInfo>
        {isFutureDate() ? (
          <PeriodicLucks
            result={result}></PeriodicLucks>
        ) : (
          ""
        )}
        <Sharing result={result}></Sharing>
        <ResultTime result={result}></ResultTime>
      </div>
    </div>
  );
}
