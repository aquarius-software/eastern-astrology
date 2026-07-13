import { DateTime } from "luxon";
import { PurpleStarSubmitData } from "@/app/types";

/**
 * フォーム入力データからDateオブジェクトを生成
 *
 * @param {PurpleStarSubmitData} data
 * @returns {Date}
 */
export const generateDateFromSubmitData = (data: PurpleStarSubmitData): Date => {
  const year = Number(data.year);
  const month = Number(data.month);
  const day = Number(data.day);
  const hour = Number(data.hour);
  const minute = Number(data.minute);
  const localTime = DateTime.local(year, month, day, hour, minute, 0);

  return new Date(localTime.toString());
};

/**
 * 入力データから日時を生成
 *
 * @param {PurpleStarSubmitData} data
 * @param {string} zone
 * @returns {Date}
 */
export const generateIsoDate = (
  data: PurpleStarSubmitData,
  zone: string
): Date => {
  const year = Number(data.year);
  const month = Number(data.month);
  const day = Number(data.day);
  const hour = Number(data.hour);
  const minute = Number(data.minute);

  const adjustedDate = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0 },
    { zone }
  );

  return new Date(adjustedDate.toString());
};

/**
 * 入力データから日時を生成
 *
 * @param {PurpleStarSubmitData} data
 * @param {string} zone
 * @returns {DateTime}
 */
export const generateBirthDateTime = (
  data: PurpleStarSubmitData,
  zone: string
): DateTime => {
  const year = Number(data.year);
  const month = Number(data.month);
  const day = Number(data.day);
  const hour = Number(data.hour);
  const minute = Number(data.minute);
  const luxonDate = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0 },
    { zone }
  );
  return luxonDate;
};