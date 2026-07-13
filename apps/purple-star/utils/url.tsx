import { PurpleStarData, PurpleStarSubmitData, PurpleStarUrlData } from "@/app/types";
import { generateDateFromSubmitData } from "@/utils/utils";
import { DateTime } from "luxon";

/**
 * 命盤データからURLを生成するプライベートメソッド
 * 
 * @param {PurpleStarUrlData} data 
 * @returns {string}
 */
const generateUrl = async (data: PurpleStarUrlData): Promise<string> => {
  const {
    birthDateTime,
    latitude,
    longitude,
    timezoneOffset,
    nickname,
    gender,
    school,
    isJapanese,
    timeZoneId,
    rawOffset,
    dstOffset
  } = data;

  // 順番に注意！（0は空き番号）
  const flagStr = `0${gender}000${isJapanese}00`;
  const hexFlagStr = parseInt(flagStr, 2).toString(16);
  let urlStr = `?t=${birthDateTime}&b=${latitude}&l=${longitude}&o=${timezoneOffset}&${nickname ? `&n=${nickname}` : ""}&s=${school}&f=${hexFlagStr}`;
  if (isJapanese === "0") {
    urlStr = urlStr.concat(`${timeZoneId ? `&z=${timeZoneId}` : ""}${rawOffset ? `&r=${rawOffset}` : ""}${dstOffset ? `&d=${dstOffset}` : ""}`);
  }
  urlStr = encodeURI(urlStr);
  let url = `${location.protocol}//${location.host}/b${urlStr}`;

  return url;
};

/**
 * 命式パラメータからURLを生成
 * 処理はgenerateUrlメソッドに移譲
 * 
 * @param {FourPillarsData} result 
 * @returns {string}
 */
export const generateUrlFromResult = async (result: PurpleStarData): Promise<string> => {
  const {
    birthDateTime,
    latitude,
    longitude,
    timezoneOffset,
    nickname,
    gender,
    school,
    isJapanese,
    timeZoneId,
    rawOffset,
    dstOffset
  } = result;

  const birthDateTimeObj = DateTime.fromISO(birthDateTime.toString());
  const birthDateTimeJs = birthDateTimeObj.toJSDate();
  const timestamp = birthDateTimeJs.getTime();

  const data = {
    birthDateTime: timestamp.toString(),
    latitude,
    longitude,
    timezoneOffset,
    nickname,
    gender,
    school,
    isJapanese: isJapanese ? "1" : "0",
    timeZoneId,
    rawOffset: (!isNaN(rawOffset)) ? rawOffset.toString() : "",
    dstOffset: (!isNaN(dstOffset)) ? dstOffset.toString() : ""
  }

  const url = await generateUrl(data);

  return url;
};

/**
 * 入力された命盤データからURLを生成
 * 処理はgenerateUrlメソッドに移譲
 * 
 * @param {PurpleStarSubmitData} submitData 
 * @returns {string}
 */
export const generateUrlFromData = async (submitData: PurpleStarSubmitData): Promise<string> => {
  const isoDate = generateDateFromSubmitData(submitData);
  const timestamp = isoDate.getTime();
  const data = {
    birthDateTime: timestamp.toString(),
    latitude: submitData.latitude.toString(),
    longitude: submitData.longitude.toString(),
    timezoneOffset: submitData.timezoneOffset.toString(),
    nickname: submitData.nickname,
    gender: submitData.gender,
    school: submitData.school,
    isJapanese: submitData.isJapanese ? "1" : "0",
    timeZoneId: submitData.timeZoneId,
    rawOffset: (!isNaN(submitData.rawOffset)) ? submitData.rawOffset.toString() : "",
    dstOffset: (!isNaN(submitData.dstOffset)) ? submitData.dstOffset.toString() : ""
  }

  const url = await generateUrl(data);

  return url;
};