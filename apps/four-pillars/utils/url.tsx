import { FourPillarsData, SubmitData, FourPillarsUrlData } from "@/app/types";
import { generateDateFromSubmitData } from "@/utils/utils";
import { DateTime } from "luxon";

/**
 * 命式データからURLを生成するプライベートメソッド
 * 
 * @param {FourPillarsUrlData} data 
 * @returns {string}
 */
const generateUrl = async (data: FourPillarsUrlData): Promise<string> => {
  const {
    birthDateTime,
    latitude,
    longitude,
    timezoneOffset,
    nickname,
    isHourUnknown,
    gender,
    useSpaceMethod,
    changeDayStem,
    createImage,
    isJapanese,
    timeZoneId,
    rawOffset,
    dstOffset
  } = data;

  // 順番に注意！（後ろ二つは空き番号）
  const flagStr = `${isHourUnknown}${gender}${useSpaceMethod}${changeDayStem}${createImage}${isJapanese}00`;
  const hexFlagStr = parseInt(flagStr, 2).toString(16);
  let urlStr = `?t=${birthDateTime}&b=${latitude}&l=${longitude}&o=${timezoneOffset}${nickname ? `&n=${nickname}` : ""}&f=${hexFlagStr}`;
  if (isJapanese === "0") {
    urlStr = urlStr.concat(`${timeZoneId ? `&z=${timeZoneId}` : ""}${rawOffset ? `&r=${rawOffset}` : ""}${dstOffset ? `&d=${dstOffset}` : ""}`);
  }
  urlStr = encodeURI(urlStr);
  let url = `${location.protocol}//${location.host}/c${urlStr}`;

  return url;
};

/**
 * 命式パラメータからURLを生成
 * 処理はgenerateUrlメソッドに移譲
 * 
 * @param {FourPillarsData} result 
 * @returns {string}
 */
export const generateUrlFromResult = async (result: FourPillarsData): Promise<string> => {
  const {
    birthDateTime,
    latitude,
    longitude,
    timezoneOffset,
    nickname,
    isHourUnknown,
    gender,
    useSpaceMethod,
    changeDayStem,
    createImage,
    isJapanese,
    timeZoneId,
    rawOffset,
    dstOffset
  } = result;

  const birthDateTimeObj = DateTime.fromISO(birthDateTime.toString());
  const birthDateTimeJs = birthDateTimeObj.toJSDate();
  const timestamp = birthDateTimeJs.getTime();

  const data: FourPillarsUrlData = {
    birthDateTime: timestamp.toString(),
    latitude,
    longitude,
    timezoneOffset: timezoneOffset.toString(),
    nickname,
    isHourUnknown: isHourUnknown ? "1" : "0",
    gender: gender === '1' ? "1" : "0",
    useSpaceMethod: useSpaceMethod ? "1" : "0",
    changeDayStem: changeDayStem ? "1" : "0",
    createImage: createImage ? "1" : "0",
    isJapanese: isJapanese ? "1" : "0",
    timeZoneId,
    rawOffset: (!isNaN(rawOffset)) ? rawOffset.toString() : "",
    dstOffset: (!isNaN(dstOffset)) ? dstOffset.toString() : ""
  }

  const url = await generateUrl(data);

  return url;
};

/**
 * 入力された命式データからURLを生成
 * 処理はgenerateUrlメソッドに移譲
 * 
 * @param {SubmitData} submitData 
 * @returns {string}
 */
export const generateUrlFromData = async (submitData: SubmitData): Promise<string> => {
  const isoDate = generateDateFromSubmitData(submitData);
  const timestamp = isoDate.getTime();
  const data: FourPillarsUrlData = {
    birthDateTime: timestamp.toString(),
    latitude: submitData.latitude.toString(),
    longitude: submitData.longitude.toString(),
    timezoneOffset: submitData.timezoneOffset.toString(),
    nickname: submitData.nickname,
    isHourUnknown: submitData.isHourUnknown ? "1" : "0",
    gender: submitData.gender,
    useSpaceMethod: submitData.divisionMethod === "S" ? "1" : "0",
    changeDayStem: submitData.changeDayStem === "T" ? "1" : "0",
    isJapanese: submitData.isJapanese ? "1" : "0",
    createImage: submitData.createImage ? "1" : "0",
    timeZoneId: submitData.timeZoneId,
    rawOffset: (!isNaN(submitData.rawOffset)) ? submitData.rawOffset.toString() : "",
    dstOffset: (!isNaN(submitData.dstOffset)) ? submitData.dstOffset.toString() : ""
  }

  const url = await generateUrl(data);

  return url;
};