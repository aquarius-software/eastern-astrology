import { useFormContext } from "react-hook-form";

export default function DayStemMethod(): JSX.Element {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <div className="chart-form-row">
      <div className="chart-form-box">
        <label
          className="input-label-text"
          htmlFor="change-day-stem">
          日柱切り替え時刻
        </label>
        <p className="mb-3 text-base text-gray-500 dark:text-gray-300">
          日柱の干支を切り替えるタイミングを、<strong>0時</strong>にするか、<strong>23時</strong>にするかどうかを指定します。<strong>日付が変わる前後の時刻</strong>にお生まれの方は、この設定で命式が変わることがあります。
        </p>
        <ul
          className={`form-ul sm:flex ${errors.dayStemMethod
            ? "mb-3 border-red-500"
            : "border-gray-200 focus:border-gray-200"
            }`}>
          <li className="form-li">
            <div className="flex items-center pl-3">
              <input
                id="change-day-stem-f"
                type="radio"
                value="F"
                className="input-radio"
                {...register("changeDayStem", { required: true })}
              />
              <label
                htmlFor="change-day-stem-f"
                className="input-label-radio">
                0時
              </label>
            </div>
          </li>
          <li className="form-li">
            <div className="flex items-center pl-3">
              <input
                id="change-day-stem-t"
                type="radio"
                value="T"
                className="input-radio"
                {...register("changeDayStem", { required: true })}
              />
              <label
                htmlFor="change-day-stem-t"
                className="input-label-radio">
                23時
              </label>
            </div>
          </li>
        </ul>
        {errors.dayStemMethod?.type === "required" && (
          <p className="mt-3 chart-form-error">
            日柱切り替え設定を選択してください
          </p>
        )}
      </div>
    </div>
  );
}
