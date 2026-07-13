import { useFormContext, Controller } from "react-hook-form";
import { ChevronDownIcon } from "ui";
import { isValidYearMonthDay, range } from "utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { DateTime as Luxon } from "luxon";
import { Button, Switch } from "@heroui/react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useChartContext } from "@/context/chartContext";
import { parseISO } from "date-fns";

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
    control,
    trigger,
    formState: { errors }
  } = useFormContext();

  const { setIsJapanese } = useChartContext();

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
    setIsJapanese(true);
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
    const regex = /^([1-9]|[1-9][0-9]{1,2}|1[0-9]{3}|20[0-9]{2}|2100)$/;
    if (!regex.test(yearValue)) {
      return "西暦年は1〜2100の半角数字を入力してください";
    } else if (
      !isValidYearMonthDay(parseInt(yearValue), monthValue, dayValue)
    ) {
      return "存在しない年月日が入力されています";
    } else {
      clearErrors(["year", "month", "day"]);
      return true;
    }
  };

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
    const regex = /^(0[1-9]|1[0-2]|[1-9])$/;
    if (!regex.test(monthValue.toString())) {
      return "正しい月を入力してください";
    } else if (
      !isValidYearMonthDay(yearValue, monthValue, dayValue)
    ) {
      return "存在しない年月日が入力されています";
    } else {
      clearErrors(["year", "month", "day"]);
      return true;
    }
  };

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
    const regex = /^([1-9]|[12][0-9]|3[01])$/;
    if (!regex.test(dayValue.toString())) {
      return "正しい日を入力してください";
    } else if (
      !isValidYearMonthDay(yearValue, monthValue, dayValue)
    ) {
      return "存在しない年月日が入力されています";
    } else {
      clearErrors(["year", "month", "day"]);
      return true;
    }
  };

  /**
   * 「現在の年月日と時刻を入力」ボタンのonClickイベントハンドラ
   *
   * @param {React.MouseEvent<HTMLElement>} e
   */
  const handleAutoInputButton = (
    e: React.MouseEvent<HTMLElement>
  ): void => {
    e.preventDefault();
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
    clearErrors(["year", "month", "day", "hour", "minute"]);
  };

  return (
    <>
      <div className="chart-form-row">
        <div className="chart-form-box md:w-3/3">
          <h3 className="input-label-header">生年月日・時刻</h3>
          <p className="text-base text-gray-500 dark:text-gray-300">
            西暦年は
            <span className="font-bold">1〜2100</span>
            （グレゴリオ暦）の範囲で入力可能です。
          </p>
        </div>
      </div>
      <div className="chart-form-row">
        <div className="chart-form-box md:w-1/3">
          <label className="input-label-text" htmlFor="year">
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
              validate: isValidYear
            })}
          />
          {errors.year && (
            <p className="chart-form-error">
              <ExclamationCircleIcon className="error-message-icon" />
              {errors.year.message?.toString()}
            </p>
          )}
        </div>
        <div className="chart-form-box md:w-1/3">
          <label className="input-label-text" htmlFor="grid-state">
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
                validate: isValidMonth
              })}>
              {monthOptions}
            </select>
            <div className="chevron-icon-container">
              <ChevronDownIcon></ChevronDownIcon>
            </div>
          </div>
          {errors.month && (
            <p className="chart-form-error">
              <ExclamationCircleIcon className="error-message-icon" />
              {errors.month.message!.toString()}
            </p>
          )}
        </div>
        <div className="chart-form-box md:w-1/3">
          <label className="input-label-text" htmlFor="grid-zip">
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
              })}>
              {dayOptions}
            </select>
            <div className="chevron-icon-container">
              <ChevronDownIcon></ChevronDownIcon>
            </div>
          </div>
          {errors.day && (
            <p className="chart-form-error">
              <ExclamationCircleIcon className="error-message-icon" />
              {errors.day.message!.toString()}
            </p>
          )}
        </div>
      </div>
      <div className="chart-form-row">
        <div className="chart-form-box md:w-1/3">
          <label
            className="input-label-text"
            htmlFor="grid-first-name">
            時
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
            <p className="chart-form-error">
              {errors.hour.message!.toString()}
            </p>
          )}
        </div>
        <div className="chart-form-box md:w-1/3">
          <label
            className="input-label-text"
            htmlFor="grid-last-name">
            分
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
            <p className="chart-form-error">
              {errors.minute.message!.toString()}
            </p>
          )}
        </div>
        <div className="chart-form-box md:w-1/3">
          <>
            <label className="input-label-text">日時一括入力</label>
            <div className="relative">
              <div className="chart-form-row">
                <div className="chart-form-box">
                  {/* <Button
                    className="h-[2.88rem]"
                    radius="sm"
                    fullWidth={true}
                    onClick={handleAutoInputButton}>
                    現在日時を入力
                  </Button> */}
                  <DateTimePicker
                    ampm={false}
                    ampmInClock={false}
                    minDate={parseISO('0001-01-01')}
                    maxDate={parseISO('2100-12-31')}
                    orientation="landscape"
                    slotProps={{
                      toolbar: { hidden: true },
                      tabs: { hidden: true },
                      textField: {
                        fullWidth: true,
                        InputProps: {
                          className: "h-12 text-sm"
                        }
                      },
                      shortcuts: {
                        items: [
                          {
                            label: '現在の日時を入力',
                            getValue: () => {
                              return new Date();
                            },
                          },
                        ],
                      },
                    }}
                    onAccept={(newValue: Date) => {
                      if (newValue) {
                        const selectedYear = newValue!.getFullYear();
                        const selectedMonth = newValue!.getMonth();
                        const selectedDay = newValue!.getDate();
                        const selectedHour = newValue!.getHours();
                        const selectedMinute = newValue!.getMinutes();
                        rhfSetValue("year", selectedYear.toString());
                        rhfSetValue("month", selectedMonth + 1);
                        rhfSetValue("day", selectedDay);
                        rhfSetValue("hour", selectedHour);
                        rhfSetValue("minute", selectedMinute);
                        trigger(["year", "month", "day", "hour", "minute"]);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
      <p className="mb-6 text-base text-gray-500 dark:text-gray-300">
        <strong>出生時刻が不明</strong>の場合は、以下のスイッチをオンにします。命式を三柱で簡易表示します。<strong>スイッチがオンの場合、出生地の入力は不要</strong>です。
      </p>
      <div className="md:w-3/3 w-full px-0">
        <div className="flex-column mb-2 mt-6 flex items-end">
          <Controller
            control={control}
            name="isHourUnknown"
            render={({ field }) => (
              <Switch
                {...field}
                isSelected={field.value}
                onChange={e => {
                  field.onChange(e);
                  handleIsHourUnknownToggleButton(e);
                }}>
                出生時刻が不明
              </Switch>
            )}
          />
        </div>
      </div>
    </>
  );
}