import { useFormContext } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function Gender(): JSX.Element {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <div className="board-form-row">
      <div className="board-form-box">
        <h3 className="input-label-header">性別<span className="required-field">必須</span></h3>
        <ul
          className={`form-ul sm:flex ${errors.gender
            ? "mb-3 border-red-500"
            : "border-gray-200 focus:border-gray-200"
            }`}>
          <li className="form-li">
            <div className="flex items-center pl-3">
              <input
                id="genderMale"
                type="radio"
                value="1"
                className="input-radio"
                {...register("gender", { required: true })}
              />
              <label
                htmlFor="genderMale"
                className="input-label-radio">
                男性{" "}
              </label>
            </div>
          </li>
          <li className="form-li">
            <div className="flex items-center pl-3">
              <input
                id="genderFemale"
                type="radio"
                value="0"
                className="input-radio"
                {...register("gender", { required: "true" })}
              />
              <label
                htmlFor="genderFemale"
                className="input-label-radio">
                女性
              </label>
            </div>
          </li>
        </ul>
        {errors.gender?.type === "required" && (
          <p className="mt-3 board-form-error">
            <ExclamationCircleIcon className="error-message-icon" />性別を選択してください
          </p>
        )}
      </div>
    </div>
  );
}
