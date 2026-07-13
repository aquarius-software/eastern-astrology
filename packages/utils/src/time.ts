import type { DMS, DayHourDuration } from 'types';
import { DateTime } from 'luxon';
const julian = require('astronomia/julian');

/**
 * 年と月と日が正しく、範囲内（1〜3000）にあるかどうかを判定する
 *
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {boolean}
 */
export const isValidYearMonthDay = (
  year: number,
  month: number,
  day: number
) => {
  if (!year || !month || !day) {
    return false;
  }
  if (year < 1 || year > 3000) {
    return false;
  }
  const date = new Date(year, month - 1, day);
  return date && date.getMonth() + 1 === month;
};

/**
 * Dateオブジェクトが有効であるかどうか判定
 * https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
 *
 * @param {Date} day
 * @returns {boolean}
 */
export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getDate());
};

/**
 * Dateオブジェクトの無効判定
 *
 * @param {Date} date
 * @returns {boolean}
 */
export const isInvalidDate = (date: Date): boolean =>
  Number.isNaN(date.getTime());

/**
 * 調整後日時を取得
 *
 * @param {Date} date 調整前日時
 * @param {number} eot 均時差（分）
 * @param {number} offsetMinutes 地方時差
 * @returns {Date} 調整後日時
 */
export const adjustDate = (
  date: Date,
  eot: number,
  offsetMinutes: number
): Date => {
  // コピー作成
  const adjustedDate = new Date(date.getTime());
  const timeToAdd = eot + offsetMinutes;

  // 分の調整
  const minutesToAdd = Math.floor(timeToAdd);
  // console.log("調整分数:", minutesToAdd, "分");
  adjustedDate.setMinutes(date.getMinutes() + minutesToAdd);

  // 秒の調整
  const secondsToAdd = Math.floor((timeToAdd - Math.floor(timeToAdd)) * 60);
  // console.log("調整秒数:", secondsToAdd, "秒");
  adjustedDate.setSeconds(date.getSeconds() + secondsToAdd);

  // ミリ秒の調整（必要かどうかは微妙）
  const millisecondsToAdd = minutesToMilliSeconds(timeToAdd);
  // console.log("調整ミリ秒数:", millisecondsToAdd, "ミリ秒");
  adjustedDate.setMilliseconds(date.getMilliseconds() + millisecondsToAdd);

  return adjustedDate;
};

/**
 * 「秒未満の端数」をミリ秒に変換
 * https://stackoverflow.com/questions/16786665/javascript-get-milliseconds-from-float-seconds
 *
 * @param {number} minutes 分（小数点付き）
 * @returns {number} ミリ秒
 */
export const minutesToMilliSeconds = (minutes: number): number => {
  const seconds = minutes * 60;
  return Math.floor((seconds % 1) * 1000);
};

/**
 * This function adds a certain number of days to the date.
 *
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export const addDays = (date: Date, days: number): Date => {
  let luxonDate = DateTime.fromJSDate(date);
  luxonDate = luxonDate.plus({ days: days });
  return luxonDate.toJSDate();
};

/**
 * This function subtracts a certain number of days from the date.
 *
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export const subtractDays = (date: Date, days: number): Date => {
  let luxonDate = DateTime.fromJSDate(date);
  luxonDate = luxonDate.minus({ days: days });
  return luxonDate.toJSDate();
};

/**
 * DMSを10進法の分に変換
 *
 * @param {DMS} dms 均時差のDMS（度・分・秒）
 * @returns {number} 分（10進法）
 */
export const dmsToDecimalMinutes = (dms: DMS): number => {
  const deg = dms.d * 60 + dms.m + dms.s / 60;
  return dms.neg ? -deg : deg;
};

/**
 * ユリウス日取得
 *
 * @param {Date} utcDate
 * @returns {JulianDay} ユリウス日
 */
export const utcToJulianDay = (utcDate: Date): number => {
  return julian.DateToJD(utcDate);
};

/**
 * 二つの日付の間の日数を取得
 *
 * @param {Date} date1
 * @param {Date} date2
 * @returns {Duration}
 */
export const numberOfDaysBetween2Days = (
  date1: Date,
  date2: Date
): DayHourDuration => {
  const lDate1 = DateTime.fromISO(date1.toISOString());
  const lDate2 = DateTime.fromISO(date2.toISOString());
  const diff = lDate1.diff(lDate2, ['days', 'hours']);

  return { days: diff.days, hours: diff.hours };
};

/**
 * 日時が指定した範囲内にあるかどうか判定
 *
 * @param {Date} currentDate
 * @param {Date} startDate
 * @param {number} offsetDays
 * @param {number} durationDays
 * @returns {boolean}
 */
export const currentTimeIsInRange = (
  currentDate: Date,
  startDate: Date,
  offsetDays: number,
  durationDays: number
): boolean => {
  if (
    !isValidDate(currentDate) ||
    !isValidDate(startDate) ||
    offsetDays < 0 ||
    durationDays < 0
  ) {
    return false;
  }

  const currentTime = DateTime.fromJSDate(currentDate);
  const startTime = DateTime.fromJSDate(startDate).plus({ days: offsetDays });
  const endTime = startTime.plus({ days: durationDays });

  return currentTime > startTime && currentTime < endTime ? true : false;
};

/**
 * 与えられた年と月から、その月の日数を取得する関数
 * @param {number} year - 年
 * @param {number} month - 月 (0から始まるインデックス)
 * @returns {number} - その月の日数
 */
export function getDaysInMonth(year: number, month: number): number {
  if (isNaN(year) || isNaN(month)) {
    return 31;
  }

  // 新しい Date オブジェクトを作成して、次の月の最初の日を表す
  const nextMonthFirstDay: Date = new Date(year, month + 1, 1);
  if (!isValidDate(nextMonthFirstDay)) {
    return 31;
  }

  // 1日引いて、現在の月の最後の日を表す
  const lastDayOfMonth: Date = new Date(nextMonthFirstDay.getTime() - 1);

  // 現在の月の最後の日から、その月の日数を取得して返す
  return lastDayOfMonth.getDate();
}

/**
 * 与えられた月の数字から、その月の最大日数を取得する関数
 * @param {number} month - 月 (0から始まるインデックス)
 * @returns {number} - その月の最大日数
 */
export function getMaxDaysInMonth(month: number): number {
  if (month < 0 || month > 11) {
    return 0;
  }
  const daysOfMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return daysOfMonths[month];
}

/**
 * 指定された秒数を分と秒の形式に変換する関数
 *
 * @param {number} time - 変換する時間を秒単位で指定。
 * @returns {string} 変換された時間を「分:秒」形式の文字列で返す。秒数は常に2桁で表示。
 */
export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60); // 分を計算
  const seconds = time % 60; // 残りの秒を計算
  return `${minutes}:${seconds.toString().padStart(2, '0')}`; // 文字列形式で返す
}
