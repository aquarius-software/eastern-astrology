import { useFormContext } from "react-hook-form";

export default function DivisionMethod(): JSX.Element {
  const {
    register,
    setValue: rhfSetValue,
    formState: { errors }
  } = useFormContext();

  return (
    <div className="chart-form-row">
      <div className="chart-form-box">
        <label
          className="input-label-text"
          htmlFor="grid-first-name">
          二十四節気分割法
        </label>
        <p className="mb-3 text-base text-gray-500 dark:text-gray-300">
          <strong>二十四節気</strong>を分割する方法を指定します。<strong>定気法</strong>は1年間を<strong>太陽の角度</strong>（太陽黄経）、<strong>平気法（恒気法）</strong>は1年間を<strong>時間</strong>で24分割します。<strong>節入り日前後</strong>にお生まれの方は、この設定で命式が変わることがあります。
        </p>
        <ul
          className={`form-ul sm:flex ${errors.divisionMethod
            ? "mb-3 border-red-500"
            : "border-gray-200 focus:border-gray-200"
            }`}>
          <li className="form-li">
            <div className="flex items-center pl-3">
              <input
                id="divisionMethodS"
                type="radio"
                value="S"
                className="input-radio"
                {...register("divisionMethod", { required: true })}
              />
              <label
                htmlFor="divisionMethodS"
                className="input-label-radio">
                定気法{" "}
              </label>
            </div>
          </li>
          <li className="form-li">
            <div className="flex items-center pl-3">
              <input
                id="divisionMethodT"
                type="radio"
                value="T"
                className="input-radio"
                {...register("divisionMethod", { required: "true" })}
              />
              <label
                htmlFor="divisionMethodT"
                className="input-label-radio">
                平気法（恒気法）
              </label>
            </div>
          </li>
        </ul>
        {errors.divisionMethod?.type === "required" && (
          <p className="mt-3 chart-form-error">
            節気分割法を選択してください
          </p>
        )}
      </div>
    </div>
  );
}
