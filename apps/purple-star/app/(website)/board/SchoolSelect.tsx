import { useFormContext, Controller } from "react-hook-form";
import { Select, SelectItem } from "@heroui/react";
import { SCHOOLS } from "@/app/api/constants";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "ui";

export default function SchoolSelect(): JSX.Element {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext();

  return (
    <div className="board-form-row">
      <div className="board-form-box">
        <label className="input-label-text" htmlFor="grid-first-name">
          流派
        </label>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-300">
          現在、<span className="font-bold">星曜派</span>（三合派）と<span className="font-bold">飛星派</span>の二つの流派に対応しています。
        </p>
        <div className="relative  md:w-1/2">
          <select
            id="school"
            {...register("school", {
              required: "流派を選択してください",
            })}
            className={`input-text ${errors.school
              ? "mb-3 border-red-500 focus:border-red-500"
              : "border-gray-200"
              }`}>
            {SCHOOLS.map(school => (
              <option key={school.value} value={school.value}>
                {school.name}
              </option>
            ))}
          </select>
          <div className="chevron-icon-container">
            <ChevronDownIcon></ChevronDownIcon>
          </div>
        </div>
        {errors.school && (
          <p className="board-form-error mt-3">
            <ExclamationCircleIcon className="error-message-icon mb-3" />
            {errors.school.message!.toString()}
          </p>
        )}
      </div>
    </div >
  );
}
