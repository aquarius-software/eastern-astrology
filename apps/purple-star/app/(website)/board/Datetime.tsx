import { useFormContext } from "react-hook-form";
import { ChevronDownIcon } from "ui";
import { isValidYearMonthDay, range } from "utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { DateTime as Luxon } from "luxon";
import { Button } from "@heroui/react";

/**
 * 月のoptionオブジェクトを生成
 *
 * @type {React.ReactNode}
 */
const monthOptions: React.ReactNode = range(1, 12, 1).map(month => {
  return (
    <option key={month} value={month}>
      {month}
    </option>
  );
});

/**
 * 日のoptionオブジェクトを生成
 *
 * @type {React.ReactNode}
 */
const dayOptions: React.ReactNode = range(1, 31, 1).map(day => {
  return (
    <option key={day} value={day}>
      {day}
    </option>
  );
});

/**
 * 時のoptionオブジェクトを生成
 *
 * @type {React.ReactNode}
 */
const hourOptions: React.ReactNode = range(0, 23, 1).map(hour => {
  return (
    <option key={hour} value={hour}>
      {hour}
    </option>
  );
});

/**
 * 分のoptionオブジェクトを生成
 *
 * @type {React.ReactNode}
 */
const minuteOptions: React.ReactNode = range(0, 59, 1).map(minute => {
  return (
    <option key={minute} value={minute}>
      {minute}
    </option>
  );
});

export default function DateTime(): JSX.Element {
  const {
    register,
    watch,
    setValue: rhfSetValue,
    getValues,
    clearErrors,
    formState: { errors }
  } = useFormContext();

  /**
   * 「生時不明」トグルボタンのハンドラ
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleIsHourUnknownToggleButton = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    rhfSetValue("hour", 12);
    rhfSetValue("minute", 0);
  };

  /**
   * 入力された年が正しいかどうか判定
   * 正規表現および月と日とも照らし合わせて判定
   *
   * @param {number} yearValue
   * @returns {(true | "正しい年月日を入力してください")}
   */
  const isValidYear = (yearValue: string) => {
    if (!yearValue) {
      return "西暦年を入力してください";
    }
    const monthValue = getValues("month");
    const dayValue = getValues("day");
    const regex = /^([1-9]|[1-9][0-9]{1,2}|[12][0-9]{3}|3000)$/
    if (!regex.test(yearValue)) {
      return "西暦年は1〜3000の半角数字を入力してください";
    } else if (!isValidYearMonthDay(parseInt(yearValue), monthValue, dayValue)) {
      return "存在しない年月日が入力されています";
    } else {
      clearErrors(["year", "month", "day"])
      return true;
    }
  }

  /**
   * 入力された月が正しいかどうか判定
   * 正規表現および年と日とも照らし合わせて判定
   *
   * @param {number} monthValue
   * @returns {(true | "正しい年月日を入力してください")}
   */
  const isValidMonth = (monthValue: number) => {
    const yearValue = getValues("year");
    if (!yearValue) {
      clearErrors(["month", "day"]);
      return true;
    }
    const dayValue = getValues("day");
    const regex = /^(0[1-9]|1[0-2]|[1-9])$/
    if (!regex.test(monthValue.toString())) {
      return "正しい月を入力してください";
    } else if (!isValidYearMonthDay(yearValue, monthValue, dayValue)) {
      return "存在しない年月日が入力されています";
    } else {
      clearErrors(["year", "month", "day"]);
      return true;
    }
  }

  /**
   * 入力された日が正しいかどうか判定
   * 正規表現および年と月とも照らし合わせて判定
   *
   * @param {number} dayValue
   * @returns {(true | "正しい年月日を入力してください")}
   */
  const isValidDay = (dayValue: number) => {
    const yearValue = getValues("year");
    if (!yearValue) {
      clearErrors(["month", "day"]);
      return true;
    }
    const monthValue = getValues("month");
    const regex = /^([1-9]|[12][0-9]|3[01])$/
    if (!regex.test(dayValue.toString())) {
      return "正しい日を入力してください";
    } else if (!isValidYearMonthDay(yearValue, monthValue, dayValue)) {
      return "存在しない年月日が入力されています";
    } else {
      clearErrors(["year", "month", "day"]);
      return true;
    }
  }

  /**
   * 「現在の年月日と時刻を入力」ボタンのonClickイベントハンドラ
   *
   * @param {React.MouseEvent<HTMLElement>} e
   */
  const handleAutoInputButton = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault()
    // 現在時刻を入力
    rhfSetValue("year", Luxon.now().year.toString(), {
      shouldValidate: false
    });
    rhfSetValue("month", Luxon.now().month.toString());
    rhfSetValue("day", Luxon.now().day.toString());
    rhfSetValue("hour", Luxon.now().hour.toString());
    rhfSetValue("minute", Luxon.now().minute.toString());
    rhfSetValue("gender", "1");
    rhfSetValue("isHourUnknown", false);
    clearErrors(["year", "month", "day", "hour", "minute"])
  };

  return (
    <>
      <div className="board-form-row">
        <div className="board-form-box md:w-3/3">
          <h3 className="input-label-header">生年月日・時刻</h3>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">
            西暦年（グレゴリオ暦）は<span className="font-bold">1〜3000</span>まで入力可能です。
          </p>
        </div>
        <div className="board-form-box md:w-1/3">
          <label
            className="input-label-text"
            htmlFor="year">
            西暦年<span className="required-field">必須</span>
          </label>
          <input
            className={`input-text ${errors.year
              ? "mb-3 border-red-500 focus:border-red-500"
              : "border-gray-200"
              }`}
            id="year"
            type="number"
            maxLength={4}
            autoComplete="false"
            autoFocus={true}
            {...register("year", {
              required: "西暦年を入力してください",
              valueAsNumber: false,
              validate: isValidYear,
            })}
          />
          {errors.year && (
            <p className="board-form-error">
              <ExclamationCircleIcon className="error-message-icon" />{errors.year.message?.toString()}
            </p>
          )}
        </div>
        <div className="board-form-box md:w-1/3">
          <label
            className="input-label-text"
            htmlFor="grid-state">
            月<span className="required-field">必須</span>
          </label>
          <div className="relative">
            <select
              className={`input-text ${errors.month
                ? "mb-3 border-red-500 focus:border-red-500"
                : "border-gray-200"
                }`}
              id="month"
              {...register("month", {
                required: "月を入力してください",
                valueAsNumber: true,
                validate: isValidMonth,
              })}
            >
              {monthOptions}
            </select>
            <div className="chevron-icon-container">
              <ChevronDownIcon></ChevronDownIcon>
            </div>
          </div>
          {errors.month && (
            <p className="board-form-error">
              <ExclamationCircleIcon className="error-message-icon" />{errors.month.message!.toString()}
            </p>
          )}
        </div>
        <div className="board-form-box md:w-1/3">
          <label
            className="input-label-text"
            htmlFor="grid-zip">
            日<span className="required-field">必須</span>
          </label>
          <div className="relative">
            <select
              className={`input-text ${errors.day
                ? "mb-3 border-red-500 focus:border-red-500"
                : "border-gray-200"
                }`}
              id="day"
              {...register("day", {
                required: "日を入力してください",
                valueAsNumber: true,
                validate: isValidDay
              })}
            >
              {dayOptions}
            </select>
            <div className="chevron-icon-container">
              <ChevronDownIcon></ChevronDownIcon>
            </div>
          </div>
          {errors.day && (
            <p className="board-form-error">
              <ExclamationCircleIcon className="error-message-icon" />{errors.day.message!.toString()}
            </p>
          )}
        </div>
      </div>
      <div className="board-form-row">
        <div className="board-form-box md:w-1/3">
          <label
            className="input-label-text"
            htmlFor="grid-first-name">
            時<span className="required-field">必須</span>
          </label>
          <div className="relative">
            <select
              className="input-select"
              id="hour"
              disabled={watch("isHourUnknown")}
              {...register("hour")}>
              {hourOptions}
            </select>
            <div className="chevron-icon-container">
              <ChevronDownIcon></ChevronDownIcon>
            </div>
          </div>
          {errors.hour && (
            <p className="board-form-error">
              {errors.hour.message!.toString()}
            </p>
          )}
        </div>
        <div className="board-form-box md:w-1/3">
          <label
            className="input-label-text"
            htmlFor="grid-last-name">
            分<span className="required-field">必須</span>
          </label>
          <div className="relative">
            <select
              className="input-select"
              id="minute"
              disabled={watch("isHourUnknown")}
              {...register("minute")}>
              {minuteOptions}
            </select>
            <div className="chevron-icon-container">
              <ChevronDownIcon></ChevronDownIcon>
            </div>
          </div>
          {errors.minute && (
            <p className="board-form-error">
              {errors.minute.message!.toString()}
            </p>
          )}
        </div>
        <div className="w-full px-3 md:w-1/3">
          {process.env.NODE_ENV === "development" ?
            <>
              <label className="input-label-text">
                自動入力
              </label>
              <div className="relative">
                <div className="board-form-row">
                  <div className="board-form-box">
                    <Button
                      className="h-[2.88rem]"
                      radius="sm"
                      fullWidth={true}
                      onClick={handleAutoInputButton}>
                      現在日時を入力
                    </Button>
                  </div>
                </div>
              </div>
            </>
            : null}
        </div>
      </div>
    </>
  );
}
