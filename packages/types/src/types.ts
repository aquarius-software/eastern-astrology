/**
 * 五行ID（木0・火1・土2・金3・水4）
 *
 * @export
 * @typedef {FiveElementsId}
 */
export type FiveElementsId = 0 | 1 | 2 | 3 | 4;

/**
 * 十干
 *
 * @export
 * @typedef {Stem}
 */
export type Stem =
  | '甲'
  | '乙'
  | '丙'
  | '丁'
  | '戊'
  | '己'
  | '庚'
  | '辛'
  | '壬'
  | '癸';

/**
 * 十干インデックス
 *
 * @export
 * @typedef {StemIndex}
 */
export type StemIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * 十二支
 *
 * @export
 * @typedef {Branch}
 */
export type Branch =
  | '子'
  | '丑'
  | '寅'
  | '卯'
  | '辰'
  | '巳'
  | '午'
  | '未'
  | '申'
  | '酉'
  | '戌'
  | '亥';

/**
 * 十二支インデックス
 *
 * @export
 * @typedef {BranchIndex}
 */
export type BranchIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * 六十干支
 *
 * @export
 * @typedef {SexagenaryCycleName}
 */
export type SexagenaryCycleName =
  | '甲子'
  | '乙丑'
  | '丙寅'
  | '丁卯'
  | '戊辰'
  | '己巳'
  | '庚午'
  | '辛未'
  | '壬申'
  | '癸酉'
  | '甲戌'
  | '乙亥'
  | '丙子'
  | '丁丑'
  | '戊寅'
  | '己卯'
  | '庚辰'
  | '辛巳'
  | '壬午'
  | '癸未'
  | '甲申'
  | '乙酉'
  | '丙戌'
  | '丁亥'
  | '戊子'
  | '己丑'
  | '庚寅'
  | '辛卯'
  | '壬辰'
  | '癸巳'
  | '甲午'
  | '乙未'
  | '丙申'
  | '丁酉'
  | '戊戌'
  | '己亥'
  | '庚子'
  | '辛丑'
  | '壬寅'
  | '癸卯'
  | '甲辰'
  | '乙巳'
  | '丙午'
  | '丁未'
  | '戊申'
  | '己酉'
  | '庚戌'
  | '辛亥'
  | '壬子'
  | '癸丑'
  | '甲寅'
  | '乙卯'
  | '丙辰'
  | '丁巳'
  | '戊午'
  | '己未'
  | '庚申'
  | '辛酉'
  | '壬戌'
  | '癸亥';

/**
 * 干支
 *
 * @export
 * @interface SexagenaryCycle
 * @typedef {SexagenaryCycle}
 */
export interface SexagenaryCycle {
  index: number;
  stem: Stem;
  branch: Branch;
  emptyElements?: Branch[];
}

/**
 * 二十四節気
 *
 * @export
 * @interface SolarTerm
 * @typedef {SolarTerm}
 */
export interface SolarTerm {
  index: number;
  name: string;
  month: number;
  isMidpoint: boolean;
  startTime?: Date;
  endTime?: Date;
}

/**
 * 期間（Date）
 *
 * @export
 * @interface Term
 * @typedef {Term}
 */
export interface Term {
  startTime: Date;
  endTime: Date;
}

/**
 * 期間中の日数と時間
 *
 * @export
 * @interface DayHourDuration
 * @typedef {DayHourDuration}
 */
export interface DayHourDuration {
  days: number;
  hours: number;
}

/**
 * 期間（ユリウス日）
 *
 * @export
 * @interface JulianTerm
 * @typedef {JulianTerm}
 */
export interface JulianTerm {
  startJulianDay: number;
  endJulianDay: number;
}

/**
 * Gender
 * 性別
 *
 * @export
 * @typedef {Gender}
 */
export type Gender = '1' | '0';

/**
 * Language code
 * 言語コード
 * https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 *
 * @export
 * @typedef {LanguageCode}
 */
export type LanguageCode = 'en' | 'ja';

/**
 * 都道府県
 *
 * @export
 * @interface Prefecture
 * @typedef {Prefecture}
 */
export interface Prefecture {
  name: string;
  city: string;
  code: number;
  latitude: number;
  longitude: number;
}

/**
 * タイムゾーン
 * 
 * @export
 * @interface TimeZone
 * @typedef {TimeZone}
 */
export interface TimeZone {
  dstOffset: number,
  rawOffset: number,
  status: string,
  timeZoneId: string,
  timeZoneName: string,
  errorMessage?: string
}

/**
 * DMS（度・分・秒）
 * 
 * @export
 * @typedef {DMS}
 */
export type DMS = {
  neg: boolean;
  d: number;
  m: number;
  s: number;
}

/**
 * IndexedDBに保存するエントリ
 *
 * @export
 * @interface LocalStorageItem
 * @typedef {LocalStorageItem}
 */
export interface LocalStorageItem {
  createdAt: string;
  key: string;
  title: string;
  url: string;
}

/**
 * Mapboxから取得したGeoCodingデータ
 *
 * @export
 * @interface MapboxGeoCode
 * @typedef {MapboxGeoCode}
 */
export interface MapboxGeoCode {
  latitude: number;
  longitude: number;
  isJapan: boolean;
}