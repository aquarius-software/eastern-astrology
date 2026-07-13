import { useFormContext } from "react-hook-form";
import { prefectures } from "types";
import { roundDecimal } from "utils";
import { ChevronDownIcon } from "ui";
import { useChartContext } from "@/context/chartContext";

const cityOptions = prefectures.map(pref => {
  return (
    <option key={pref.code} value={pref.code}>
      {pref.name}
      {pref.city}
    </option>
  );
});

export default function CitySelection({
  digits
}: {
  digits: number;
}): JSX.Element {
  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext();
  const { onBlur, name, ref } = register("cityCode");
  const { setIsJapanese } = useChartContext();

  /**
   * 地域が選択された場合に呼び出されるハンドラ
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prefId: number = parseInt(e.target.value);
    const latitude = prefectures[prefId - 1].latitude;
    const longitude = prefectures[prefId - 1].longitude;
    setValue("location", "");
    setValue("latitude", roundDecimal(latitude, digits));
    setValue("longitude", roundDecimal(longitude, digits));
    setIsJapanese(true);
  };

  return (
    <div className="chart-form-row">
      <div className="chart-form-box md:w-3/3">
        <label
          className="input-label-text"
          htmlFor="grid-first-name">
          地域名を選択
        </label>
        <p className="mb-3 text-base text-gray-500 dark:text-gray-300">
          プルダウンメニューから、<strong>出生地に一番近い地域名</strong>を選択します。緯度・経度が自動で入力されます。
        </p>
        <div className="relative md:w-1/2">
          <select
            className="input-select"
            id="cityCode"
            disabled={watch("isHourUnknown")}
            onChange={handleChange}
            onBlur={onBlur}
            name={name}
            ref={ref}>
            {cityOptions}
          </select>
          <div className="chevron-icon-container">
            <ChevronDownIcon></ChevronDownIcon>
          </div>
        </div>
        {errors.city && (
          <p className="chart-form-error">
            {errors.city.message!.toString()}
          </p>
        )}
      </div>
    </div >
  );
}
