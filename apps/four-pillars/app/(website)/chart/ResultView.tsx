import ResultInfo from "./ResultInfo";
import ResultAnalytics from "./ResultAnalytics";
import DecadeLucks from "./DecadeLuck";
import YearlyLucks from "./YearlyLucks";
import ResultTime from "./ResultTime";
import ChartView from "./ChartView";
import ChartImage from "./ChartImage";
import FiveElements from "./FiveElements";
import TemperatureHumidity from "./TemperatureHumidity";
import Sharing from "./Sharing";
import { FourPillarsProps } from "@/app/types";

export default function ResultView({ result }: FourPillarsProps) {
  return (
    <div className="text-black-500 mx-auto grid max-w-5xl px-2 grid-cols-1 gap-6 text-sm lg:grid-cols-[1.618fr_1fr] w-full sm:w-10/12 lg:w-full">
      <div className="flex flex-col gap-6">
        <ChartView result={result}></ChartView>
        <DecadeLucks result={result}></DecadeLucks>
        <YearlyLucks result={result}></YearlyLucks>
        {result.createImage && (
          <ChartImage
            result={result}
            width={parseInt(
              process.env.NEXT_PUBLIC_CHART_IMAGE_WIDTH
                ? process.env.NEXT_PUBLIC_CHART_IMAGE_WIDTH
                : "776"
            )}
            height={parseInt(
              process.env.NEXT_PUBLIC_CHART_IMAGE_HEIGHT
                ? process.env.NEXT_PUBLIC_CHART_IMAGE_HEIGHT
                : "480"
            )}></ChartImage>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <ResultInfo result={result}></ResultInfo>
        <Sharing result={result}></Sharing>
        <ResultAnalytics result={result}></ResultAnalytics>
        <div className="dark:hidden">
          <FiveElements result={result} isDarkMode={false}></FiveElements>
        </div>
        <div className="hidden dark:block">
          <FiveElements result={result} isDarkMode={true}></FiveElements>
        </div>
        <div className="dark:hidden">
          <TemperatureHumidity result={result} isDarkMode={false}></TemperatureHumidity>
        </div>
        <div className="hidden dark:block">
          <TemperatureHumidity result={result} isDarkMode={true}></TemperatureHumidity>
        </div>
        {!result.isHourUnknown && (
          <ResultTime result={result}></ResultTime>
        )}
      </div>
    </div>
  );
}
