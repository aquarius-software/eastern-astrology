const CalendarChinese = require('date-chinese').CalendarChinese;
import { Seasons, SearchSunLongitude, SunPosition } from 'astronomy-engine';
import { SOLAR_TERMS } from 'types';
import type { Term, SolarTerm, ChineseDate } from 'types';
import { DateTime } from 'luxon';

/**
 * 旧暦により現在の数え年を計算
 *
 * @param {Date} birthDate
 * @returns {number}
 */
export const calculateAsianAge = (birthDate: Date): number => {
  // 生年月日
  const cal = new CalendarChinese();
  cal.fromDate(birthDate);
  const birthCycle = cal.cycle;
  const birthYear = cal.year;

  // 現在日時
  cal.fromDate(new Date());
  const currentCycle = cal.cycle;
  const currentYear = cal.year;

  const cycleDiff = currentCycle - birthCycle;

  if (cycleDiff === 0) {
    // サイクルが同じ場合
    return currentYear - birthYear + 1;
  } else {
    // サイクルが違う場合
    if (currentYear < birthYear) {
      // 生年の方が現在年より大きい場合
      const yearDiff = currentYear + (60 - birthYear) + 1;
      return (cycleDiff - 1) * 60 + yearDiff;
    } else {
      // 生年の方が現在年より小さい場合
      const yearDiff = currentYear - birthYear + 1;
      return cycleDiff * 60 + yearDiff;
    }
  }
};

/**
 * サマータイム判定（日本）
 *
 * @param {Date} date 判定する日時
 * @returns {boolean} サマータイム内の日時であった場合はtrue
 */
export const isDuringSummerTimeJp = (date: Date): boolean => {
  // 1948年5月2日 ～ 9月11日
  // 1949年4月3日 ～ 9月10日
  // 1950年5月7日 ～ 9月9日
  // 1951年5月6日 ～ 9月8日
  const summerTimePeriods = [
    ['1948-05-02T01:00:00+09:00', '1948-09-12T01:00:00+09:00'],
    ['1949-04-03T01:00:00+09:00', '1949-09-11T01:00:00+09:00'],
    ['1950-05-07T01:00:00+09:00', '1950-09-09T01:00:00+09:00'],
    ['1951-05-06T01:00:00+09:00', '1951-09-08T01:00:00+09:00']
  ];

  return summerTimePeriods.some(period => {
    const startTime = new Date(period[0]).getTime();
    const endTime = new Date(period[1]).getTime();
    const time = date.getTime();
    return time >= startTime && time < endTime ? true : false;
  });
};

/**
 * 二十四節気を取得（定気法）
 *
 * @param {Date} date 取得する日時
 * @returns {SolarTerm} 二十四節気
 */
export const getSolarTermBySpace = (date: Date): SolarTerm | undefined => {
  const elon = SunPosition(date).elon;

  const position = Math.floor(elon / 15);

  let prevDate = new Date(date.getTime());
  prevDate.setMonth(prevDate.getMonth() - 1);

  let startSunLongitude = position * 15;
  const startTime = SearchSunLongitude(startSunLongitude, prevDate, 360);
  if (!startTime) return undefined;

  let endSunLongitude = (position + 1) * 15;
  if (endSunLongitude >= 360) endSunLongitude -= 360;
  const endTime = SearchSunLongitude(endSunLongitude, startTime.date, 360);
  if (!endTime) return undefined;

  if (
    startTime.date.getTime() > date.getTime() ||
    endTime.date.getTime() < date.getTime()
  ) {
    return undefined;
  }

  const solarTerm = SOLAR_TERMS[position];
  return {
    ...solarTerm,
    startTime: startTime.date,
    endTime: endTime.date
  };
};

/**
 * 二十四節気を取得（平気法）
 *
 * @param {Date} date 取得する日時
 * @returns {SolarTerm} 二十四節気
 */
export const getSolarTermByTime = (date: Date): SolarTerm => {
  const year: number = date.getFullYear();
  let dsStartTime = Seasons(year).dec_solstice.date.getTime();
  let dsEndTime: number;

  if (dsStartTime > date.getTime()) {
    dsStartTime = Seasons(year - 1).dec_solstice.date.getTime();
    dsEndTime = Seasons(year).dec_solstice.date.getTime();
  } else {
    dsEndTime = Seasons(year + 1).dec_solstice.date.getTime();
  }

  const dsDiff = dsEndTime - dsStartTime;
  const timeDiff = date.getTime() - dsStartTime;
  let position = Math.floor((timeDiff / dsDiff) * 24); // 相対位置
  const oneTerm = dsDiff / 24;
  const startTime = new Date(dsStartTime + oneTerm * position);
  const endTime = new Date(dsStartTime + oneTerm * (position + 1));

  position += 18; // 冬至の位置まで調整
  position %= 24;

  const solarTerm = SOLAR_TERMS[position];

  return {
    ...solarTerm,
    startTime: startTime,
    endTime: endTime
  };
};

/**
 * 節入り日時と節終了日時を取得
 *
 * @param {Date} date 取得する日時
 * @param {boolean} bySpace 定気法はtrue、平気法はfalse
 * @returns {Term} 節入り日時と節終了日時
 */
export const getRangeOfMonth = (date: Date, bySpace: boolean): Term => {
  // 指定した日時の二十四節気を取得
  const solarTerm = bySpace
    ? getSolarTermBySpace(date)
    : getSolarTermByTime(date);
  let startTime = solarTerm!.startTime as Date;
  let endTime = solarTerm!.endTime as Date;

  // 二十四節気が中気かどうか判定
  if (solarTerm!.isMidpoint) {
    // 中気の場合は前の節気を取得してstartTimeに設定する
    startTime!.setDate(startTime!.getDate() - 1);
    const prevTerm = bySpace
      ? getSolarTermBySpace(startTime)
      : getSolarTermByTime(startTime);
    startTime = prevTerm!.startTime as Date;
  } else {
    // 中気でない場合は次の節気を取得してendTimeに設定する
    endTime!.setDate(endTime!.getDate() + 1);
    const nextTerm = bySpace
      ? getSolarTermBySpace(endTime)
      : getSolarTermByTime(endTime);
    endTime = nextTerm!.endTime as Date;
  }

  return {
    startTime,
    endTime
  };
};

/**
 * 土用判定（定気法）
 *
 * @param {number} el 太陽黄経（0-360）
 * @returns {boolean} 土用の場合はtrue
 */
export const isEarthPeriodBySpace = (elon: number | undefined): boolean => {
  if (elon === undefined) {
    return false;
  }

  const earthPeriodDegrees = [
    [27, 45],
    [117, 135],
    [207, 225],
    [297, 315]
  ];

  // 指定の角度（太陽黄経）が土用の範囲内にあるかどうか判定
  return earthPeriodDegrees.some(deg => deg[0] <= elon && deg[1] > elon);
};

/**
 * 土用判定（平気法）
 *
 * @param {Date} date 判定する日時
 * @returns {boolean} 土用の場合はtrue
 */
export const isEarthPeriodByTime = (date: Date): boolean => {
  const earthPeriods = getEarthPeriodsByTime(date.getFullYear());
  const time = date.getTime();

  // 指定の日時が土用の範囲内にあるかどうか判定
  return earthPeriods.some(
    period => period[0].getTime() <= time && period[1].getTime() > time
  );
};

/**
 * 指定した年の土用期間を平気法で取得
 *
 * @param {number} year 取得する年
 * @returns {Date[][]} 土用期間（開始日時・終了知事）の配列
 */
const getEarthPeriodsByTime = (year: number): Date[][] => {
  let wSolsticePrev = Seasons(year - 1).dec_solstice.date.getTime();
  let wSolsticeNext = Seasons(year).dec_solstice.date.getTime();

  const wsDiff = wSolsticeNext - wSolsticePrev;
  const fourLiNums = [0.125, 0.375, 0.625, 0.875]; // 四立
  return fourLiNums.map(li => {
    const earthPeriodEnd = new Date(wSolsticePrev + wsDiff * li);
    const earthPeriodStart = new Date(earthPeriodEnd);
    earthPeriodStart.setUTCDate(earthPeriodEnd.getUTCDate() - 18); // 四立の18日前が土用の開始
    return [earthPeriodStart, earthPeriodEnd];
  });
};

/**
 * 指定した年の立春日時を定気法で取得
 *
 * @param {number} year 西暦年
 * @returns {Date}
 */
export const getLichunFromYearBySpace = (year: number): Date | undefined => {
  const newYearDate = DateTime.fromObject({
    year: year,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0
  });

  // 太陽黄経315度の日時を求める
  const lichunDate = SearchSunLongitude(315, newYearDate.toJSDate(), 60);
  if (!lichunDate) {
    return undefined;
  } else {
    return lichunDate.date;
  }
};

/**
 * 指定した日の立春〜立春の期間を定気法で取得
 *
 * @param {Date} date 判定する日
 * @returns {Date}
 */
export const getYearRangeFromDate = (
  date: Date
): { startDate: string, endDate: string } => {
  const year = date.getFullYear();
  const lichunDate = getLichunFromYearBySpace(year);
  let startDate;
  let endDate;

  if (date.getTime() < lichunDate!.getTime()) {
    // 判定日が立春前の場合
    startDate = getLichunFromYearBySpace(year - 1);
    endDate = lichunDate;
  } else {
    // 判定日が立春後の場合
    startDate = lichunDate;
    endDate = getLichunFromYearBySpace(year + 1);
  }

  return {
    startDate: startDate?.toISOString() as string,
    endDate: endDate?.toISOString() as string
  };
};

/**
 * 指定した年の立春日時を平気法で取得
 *
 * @param {number} year 西暦年
 * @returns {Date}
 */
export const getLichunFromYearByTime = (year: number): Date => {
  // 冬至の差分を取って24等分し、3/24を足して立春を算出
  let dsLastYear = Seasons(year - 1).dec_solstice.date.getTime();
  let dsThisYear = Seasons(year).dec_solstice.date.getTime();
  const dsDiff = ((dsThisYear - dsLastYear) / 24) * 3;
  const lichunDate = new Date(dsLastYear + dsDiff);
  return lichunDate;
};

/**
 * 干支計算用の年補正
 * 
 * @param date
 * @param bySpace
 * @returns
 */
export const getAdjustedChineseYear = (date: Date, bySpace: boolean) => {
  let year = date.getFullYear();
  const month = date.getMonth() + 1;
  const elon = SunPosition(date).elon;

  // 立春前の場合は昨年に戻し、節入り日前は前の月に戻す
  if (bySpace) {
    // 定気法
    // 1月または2月で、太陽黄経が315度以下の場合
    if (month <= 2 && elon <= 315) {
      year--;
    }
  } else {
    // 平気法
    // 1月または2月で、二十四節気が冬至か小寒か大寒の場合
    const solarTerm = getSolarTermByTime(date);
    if (month <= 2 && solarTerm.index >= 19 && solarTerm.index <= 21) {
      year--;
    }
  }

  return year;
};

/**
 * 月（旧暦）の日数が29日（小の月）であるか30日（大の月）であるか判定
 *
 * @param {ChineseDate} chineseDate
 * @returns {boolean}
 */
export const isLongChineseMonth = (chineseDate: ChineseDate): boolean => {
  // 当該月30日のオブジェクトを生成
  const thirtiethDay = new CalendarChinese(
    chineseDate.cycle,
    chineseDate.year,
    chineseDate.month,
    chineseDate.isLeapMonth,
    30
  );
  // グレゴリオ暦を取得して再度生成
  const gDate = thirtiethDay.toGregorian();
  thirtiethDay.fromGregorian(gDate.year, gDate.month, gDate.day);

  return thirtiethDay.month === chineseDate.month ? true : false;
};

/**
 * 干支の周期と年から西暦年を計算
 *
 * @param {number} cycle
 * @param {number} year
 * @returns {number}
 */
export const fromChineseYearToBcYear = (cycle: number, year: number): number => {
  return (cycle * 60 + year) - 2697;
};
