import { DateTime } from "luxon";
import {
  Gender,
  Palace,
  ChineseDate,
  PalaceName,
  Branch
} from "types";

/**
 *
 * @export
 * @interface PurpleStarProps
 * @typedef {PurpleStarProps}
 */
export interface PurpleStarProps {
  result: PurpleStarData;
}

/**
 *
 * @export
 * @interface PurpleStarData
 * @typedef {PurpleStarData}
 */
export interface PurpleStarData {
  birthDateTime: string;
  timeZoneName: string;
  timeZoneId: string;
  isYang: boolean;
  isMale: boolean;
  adjustedDate: string;
  eclipticLongitude: number;
  utcOffset: number;
  rawOffset: number;
  dstOffset: number;
  localOffsetMinutes: number;
  latitude: string;
  longitude: string;
  timezoneOffset: string;
  gender: Gender;
  isJapanese: boolean;
  nickname: string;
  school: string;
  division: string;
  palaces: Palace[];
  chineseDate: ChineseDate;
  asianAge: number;
  selfPalacePosition: number;
  bodyPalace: PalaceName;
  januaryBranchIndex: number;
  currentDecadePalaceName: PalaceName;
  currentYearlyPalaceName: PalaceName;
  currentDecadePalaceBranch: Branch;
  currentYearlyPalaceBranch: Branch;
  currentJanuaryBranchIndex: number;
}

/**
 * https://stackoverflow.com/questions/71275687/type-of-handlesubmit-parameter-in-react-hook-form
 *
 * @export
 * @typedef {SubmitData}
 */
export type PurpleStarSubmitData = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  autoFill: boolean;
  cityCode: number;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  gender: Gender;
  isJapanese: boolean;
  timeZoneName: string;
  timeZoneId: string;
  rawOffset: number;
  dstOffset: number;
  botcheck: boolean;
  nickname: string;
  school: string;
};

/**
 * 
 * @export
 * @typedef {FourPillarsUrlData}
 */
export type PurpleStarUrlData = {
  birthDateTime: string,
  latitude: string,
  longitude: string,
  timezoneOffset: string,
  nickname: string
  gender: string,
  school: string,
  isJapanese: string,
  timeZoneId: string,
  rawOffset: string,
  dstOffset: string
}