import { ChartRequest, BoardRequest } from "types";
import { isValidDate, isValidYearMonthDay } from "utils";

/**
 * 四柱推命リクエスト内のパラメータに対してバリデーションを行う
 *
 * @param {ChartRequest} request
 * @returns {string}
 */
export const validateFourPillarsRequest = (request: ChartRequest): string => {
  const {
    isoDate,
    longitude,
    latitude,
    gender,
    languageCode,
    utcOffset,
    dstOffset,
    useSpaceMethod,
    createImage,
    isHourUnknown,
    changeDayStem,
    yearlyLucks
  } = request;

  const utcDate = new Date(isoDate);
  if (!isValidDate(utcDate)) {
    return `Invalid isoDate parameter: ${isoDate}`;
  }
  // 変数名のとおり UTC で読む（getFullYear 等はマシンのタイムゾーン依存）
  if (!isValidYearMonthDay(utcDate.getUTCFullYear(), utcDate.getUTCMonth() + 1, utcDate.getUTCDate())) {
    return `isoDate parameter out of range: ${utcDate.toISOString()}`;
  }
  if (longitude < -180 || longitude > 180) {
    return `Invalid longitude parameter: ${longitude}`;
  }
  if (latitude < -90 || latitude > 90) {
    return `Invalid latitude parameter: ${latitude}`;
  }
  if (gender !== '1' && gender !== '0') {
    return `Invalid gender parameter: ${gender}`;
  }
  if (languageCode && languageCode !== 'ja') {
    return `Invalid languageCode parameter: ${languageCode}`;
  }
  if (utcOffset < -12 || utcOffset > 14) {
    return `Invalid utcOffset parameter: ${utcOffset}`;
  }
  if (dstOffset < 0 || dstOffset > 1) {
    return `Invalid dstOffset parameter: ${dstOffset}`;
  }
  if (typeof useSpaceMethod !== "boolean") {
    return `Invalid useSpaceMethod parameter: ${useSpaceMethod}`;
  }
  if (createImage && (typeof createImage !== "boolean")) {
    return `Invalid createImage parameter: ${createImage}`;
  }
  if (typeof isHourUnknown !== "boolean") {
    return `Invalid isHourUnknown parameter: ${isHourUnknown}`;
  }
  if (typeof changeDayStem !== "boolean") {
    return `Invalid changeDayStem parameter: ${changeDayStem}`;
  }
  if (typeof yearlyLucks !== "boolean") {
    return `Invalid yearlyLucks parameter: ${yearlyLucks}`;
  }

  return "";
};

/**
 * 紫微斗数リクエスト内のパラメータに対してバリデーションを行う
 *
 * @param {BoardRequest} request
 * @returns {string}
 */
export const validatePurpleStarRequest = (request: BoardRequest): string => {
  const {
    isoDate,
    longitude,
    latitude,
    gender,
    languageCode,
    utcOffset,
    dstOffset,
    useSpaceMethod,
    school
  } = request;

  const utcDate = new Date(isoDate);
  if (!isValidDate(utcDate)) {
    return `Invalid isoDate parameter: ${isoDate}`;
  }
  // 変数名のとおり UTC で読む（getFullYear 等はマシンのタイムゾーン依存）
  if (!isValidYearMonthDay(utcDate.getUTCFullYear(), utcDate.getUTCMonth() + 1, utcDate.getUTCDate())) {
    return `isoDate parameter out of range: ${utcDate.toISOString()}`;
  }
  if (longitude < -180 || longitude > 180) {
    return `Invalid longitude parameter: ${longitude}`;
  }
  if (latitude < -90 || latitude > 90) {
    return `Invalid latitude parameter: ${latitude}`;
  }
  if (gender !== '1' && gender !== '0') {
    return `Invalid gender parameter: ${gender}`;
  }
  if (languageCode && languageCode !== 'ja') {
    return `Invalid languageCode parameter: ${languageCode}`;
  }
  if (utcOffset < -12 || utcOffset > 14) {
    return `Invalid utcOffset parameter: ${utcOffset}`;
  }
  if (dstOffset < 0 || dstOffset > 1) {
    return `Invalid dstOffset parameter: ${dstOffset}`;
  }
  if (school !== "s" && school !== "h") {
    return `Invalid school parameter: ${school}`;
  }

  return "";
};
