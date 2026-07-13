import { DateTime } from "luxon";
import ResultView from "../chart/ResultView";
import ErrorView from "ui/ErrorView";
import BreadCrumb from "ui/Breadcrumbs";
import { FourPillarsData } from "@/app/types";
import { JAPANESE_TIME, JAPANESE_SUMMER_TIME, TimeZone } from "types";
import { isDuringSummerTimeJp } from "utils";
import type { Metadata } from "next";

const FLAG_LENGTH = 8;
const INVALID_URL_MESSAGE =
  "400 Bad Request（URLパラメータが無効です）";

export async function generateMetadata({
  searchParams
}): Promise<Metadata> {
  const { t, b, l, o, n, f, z, r, d }: {
    t: string;
    b: string;
    l: string;
    o: string;
    n: string;
    f: string;
    z: string;
    r: string;
    d: string;
  } = searchParams;
  let canonical = n
    ? `/c?t=${t}&b=${b}&l=${l}&o=${o}&n=${n}&f=${f}`
    : `/c?t=${t}&b=${b}&l=${l}&o=${o}&f=${f}`;
  const extraParams = z && r && d ? `&z=${z}&r=${r}&d=${d}` : "";
  canonical = canonical.concat(extraParams);

  return {
    title: n ? `${n}さんの命式` : "命式",
    description: "四柱推命の命式詳細データを表示するページです。",
    alternates: {
      canonical
    }
  };
}

export default async function Page({
  searchParams
}: {
  searchParams: {
    t: string;
    b: string;
    l: string;
    o: string;
    n: string;
    f: string;
    z: string;
    r: string;
    d: string;
  };
}) {
  let resultData: FourPillarsData | null = null;
  let message = "";
  let nickname = "";
  let timeZoneId = "";
  let rawOffset = 0;
  let dstOffset = 0;

  const {
    t: _timestamp,
    b: _latitude,
    l: _longitude,
    o: _timezoneOffset,
    n: _nickname,
    f: _flag,
    z: _timeZoneId,
    r: _rawOffset,
    d: _dstOffset
  } = searchParams;

  if (
    !_timestamp ||
    !_latitude ||
    !_longitude ||
    !_timezoneOffset ||
    !_flag
  ) {
    return <ErrorView message={INVALID_URL_MESSAGE}></ErrorView>;
  }

  const readURLParams = async () => {
    try {
      // 生誕日時
      const timestamp = Number(_timestamp);
      if (Number.isNaN(timestamp)) {
        console.error("Invalid birthDateTime:", timestamp);
        message = INVALID_URL_MESSAGE;
        return;
      }
      const birthDateTimeJS = new Date(timestamp);
      const birthDateTime = DateTime.fromJSDate(birthDateTimeJS);
      if (!birthDateTime.isValid) {
        console.error("Invalid birthDateTime:", birthDateTime);
        message = INVALID_URL_MESSAGE;
        return;
      }

      // 緯度
      const latitude = Number(_latitude);
      if (isNaN(latitude)) {
        console.error("Invalid latitude:", latitude);
        message = INVALID_URL_MESSAGE;
        return;
      }
      if (latitude < -90 || latitude > 90) {
        console.error("Invalid latitude:", latitude);
        message = INVALID_URL_MESSAGE;
        return;
      }

      // 経度
      const longitude = Number(_longitude);
      if (isNaN(longitude)) {
        console.error("Invalid longitude:", longitude);
        message = INVALID_URL_MESSAGE;
        return;
      }
      if (longitude < -180 || longitude > 180) {
        console.error("Invalid longitude:", longitude);
        message = INVALID_URL_MESSAGE;
        return;
      }

      // タイムゾーンオフセット
      const timezoneOffset = Number(_timezoneOffset);
      if (isNaN(timezoneOffset)) {
        console.error("Invalid timezone offset:", timezoneOffset);
        message = INVALID_URL_MESSAGE;
        return;
      }

      // ニックネーム
      nickname = decodeURI(_nickname ? _nickname : "");

      // timeZoneId
      timeZoneId = decodeURI(_timeZoneId ? _timeZoneId : "");

      // rawOffset
      if (_rawOffset) {
        rawOffset = Number(_rawOffset);
        if (isNaN(rawOffset)) {
          console.error("Invalid rawOffset:", rawOffset);
          message = INVALID_URL_MESSAGE;
          return;
        }
      }

      // dstOffset
      if (_dstOffset) {
        dstOffset = Number(_dstOffset);
        if (isNaN(dstOffset)) {
          console.error("Invalid dstOffset:", dstOffset);
          message = INVALID_URL_MESSAGE;
          return;
        }
      }

      // フラグ取得
      let flagStr = parseInt(_flag, 16).toString(2);
      flagStr = flagStr.padStart(FLAG_LENGTH, "0");
      if (flagStr.length !== FLAG_LENGTH) {
        console.error("Invalid flag length:", flagStr);
        message = INVALID_URL_MESSAGE;
        return;
      }

      // 生時不明フラグ
      const isTimeUnknownStr = flagStr[0];
      if (isTimeUnknownStr !== "1" && isTimeUnknownStr !== "0") {
        console.error("Invalid isTimeUnknown:", isTimeUnknownStr);
        message = INVALID_URL_MESSAGE;
        return;
      }
      const isTimeUnknown: boolean =
        isTimeUnknownStr === "1" ? true : false;

      // 性別フラグ
      const gender = flagStr[1];
      if (gender !== "1" && gender !== "0") {
        console.error("Invalid gender:", gender);
        message = INVALID_URL_MESSAGE;
        return;
      }

      // 節気分割法フラグ
      const divisionMethodStr = flagStr[2];
      if (divisionMethodStr !== "1" && divisionMethodStr !== "0") {
        console.error("Invalid divisionMethod", divisionMethodStr);
        message = INVALID_URL_MESSAGE;
        return;
      }
      const divisionMethod: boolean =
        divisionMethodStr === "1" ? true : false;

      // 日柱切り替えフラグ
      const changeDayStemStr = flagStr[3];
      if (changeDayStemStr !== "1" && changeDayStemStr !== "0") {
        console.error("Invalid changeDayStem:", changeDayStemStr);
        message = INVALID_URL_MESSAGE;
        return;
      }
      const changeDayStem: boolean =
        changeDayStemStr === "1" ? true : false;

      // 命式イメージ生成フラグ
      const createImageStr = flagStr[4];
      if (createImageStr !== "1" && createImageStr !== "0") {
        console.error("Invalid createImage:", createImageStr);
        message = INVALID_URL_MESSAGE;
        return;
      }
      const createImage: boolean =
        createImageStr === "1" ? true : false;

      // 国内フラグ
      const isJapaneseStr = flagStr[5];
      if (isJapaneseStr !== "1" && isJapaneseStr !== "0") {
        console.error("Invalid isJapanese:", isJapaneseStr);
        message = INVALID_URL_MESSAGE;
        return;
      }
      const isJapanese: boolean =
        isJapaneseStr === "1" ? true : false;

      // 海外の場合は3つの追加パラメータが必要
      if (
        !isJapanese &&
        (!_timeZoneId || !_rawOffset || !_dstOffset)
      ) {
        console.error(
          "Each of these parameters (timezoneId, rawOffset and dstOffset) are missing:",
          `_timeZoneId: ${_timeZoneId}`,
          `_rawOffset: ${_rawOffset}`,
          `_dstOffset: ${_dstOffset}`,
        );
        message = INVALID_URL_MESSAGE;
        return;
      }

      // 現在空き番号
      const emptyFlag1 = flagStr[6];
      const emptyFlag2 = flagStr[7];

      // タイムゾーン設定
      const isSummerTime = isDuringSummerTimeJp(birthDateTime.toJSDate());
      let timezoneData: TimeZone = {
        dstOffset: isSummerTime
          ? JAPANESE_SUMMER_TIME.dstOffset
          : JAPANESE_TIME.dstOffset,
        rawOffset: isSummerTime
          ? JAPANESE_SUMMER_TIME.rawOffset
          : JAPANESE_TIME.rawOffset,
        status: isSummerTime
          ? JAPANESE_SUMMER_TIME.status
          : JAPANESE_TIME.status,
        timeZoneId: isSummerTime
          ? JAPANESE_TIME.timeZoneName
          : JAPANESE_TIME.timeZoneName,
        timeZoneName: isSummerTime
          ? JAPANESE_SUMMER_TIME.timeZoneName
          : JAPANESE_TIME.timeZoneName
      };
      if (!isJapanese) {
        timezoneData.timeZoneName = timeZoneId;
        timezoneData.timeZoneId = timeZoneId;
        timezoneData.rawOffset = rawOffset;
        timezoneData.dstOffset = dstOffset;
      }
      // birthDateTime.setZone(timezoneData.timeZoneId);
      const utcOffsetHour = timezoneData.rawOffset / 60 / 60;
      const dstOffsetHour = timezoneData.dstOffset / 60 / 60;

      // 四柱推命命式API呼び出し
      const url = `${process.env.NEXT_PUBLIC_ROUTE_HANDLER_URL}/api/chart`;
      const response = await fetch(
        url,
        {
          body: JSON.stringify({
            isoDate: birthDateTime.toISO(),
            longitude,
            gender,
            utcOffset: utcOffsetHour,
            dstOffset: dstOffsetHour,
            timezoneOffset,
            useSpaceMethod: divisionMethod,
            createImage,
            isHourUnknown: isTimeUnknown,
            changeDayStem,
            yearlyLucks: false
          }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          next: { revalidate: Number(process.env.CHART_API_REVALIDATE_SECONDS) }
        }
      );
      console.log(url, "Response status: ", response.status);
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const result: FourPillarsData = await response.json();

      const birthDateTimeStr = birthDateTime.toISO();
      if (!birthDateTimeStr) {
        throw new Error("birthDateTime.toISO() is null");
      }
      result.birthDateTime = birthDateTimeStr;
      result.gender = gender;
      result.latitude = latitude.toString();
      result.longitude = longitude.toString();
      result.isHourUnknown = isTimeUnknown;
      result.createImage = createImage;
      result.changeDayStem = changeDayStem;
      result.nickname = nickname;
      result.isJapanese = isJapanese;
      result.timeZoneName = timezoneData.timeZoneName;
      result.timeZoneId = timezoneData.timeZoneId;
      result.rawOffset = timezoneData.rawOffset;
      result.dstOffset = timezoneData.dstOffset;

      // 命式画像生成
      if (createImage) {
        const imageURL = `${process.env.NEXT_PUBLIC_ROUTE_HANDLER_URL}/api/image`;
        const response = await fetch(imageURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            dayIdx: result.dayStemIndex,
            monthIdx: result.monthStemIndex,
            yearIdx: result.yearStemIndex,
            monthBranchIdx: result.monthBranchIndex
          })
        });
        if (response.status !== 200) {
          result.imageUrl = "";
        } else {
          const imageResponse = await response.json();
          result.imageUrl = imageResponse.imageUrl;
        }
      }

      resultData = result;
    } catch (error) {
      console.error(error);
      // message =
      //   "エラーが発生しました。しばらくしてから操作し直してください。";
      message = error.message;
    }
  };

  await readURLParams();

  if (message !== null && message !== "") {
    return <ErrorView message={message}></ErrorView>;
  }

  return (
    <>
      <BreadCrumb
        items={[
          {
            label: nickname ? `${nickname}さんの命式` : "命式",
            path: `/c?t=${_timestamp}&b=${_latitude}&l=${_longitude}&o=${_timezoneOffset}&n=${_nickname}&f=${_flag}`
          }
        ]}></BreadCrumb>
      <ResultView result={resultData!}></ResultView>
    </>
  );
}
