import { describe, it, expect, vi, afterEach } from 'vitest';
import type { ChineseDate } from 'types';
import {
  calculateAsianAge,
  isDuringSummerTimeJp,
  getSolarTermBySpace,
  getSolarTermByTime,
  getRangeOfMonth,
  isEarthPeriodBySpace,
  isEarthPeriodByTime,
  getLichunFromYearBySpace,
  getLichunFromYearByTime,
  getYearRangeFromDate,
  getAdjustedChineseYear,
  isLongChineseMonth,
  fromChineseYearToBcYear
} from './calendar';

const CalendarChinese = require('date-chinese').CalendarChinese;

/** グレゴリオ暦の日付から、その日が属する旧暦(ChineseDate)を生成するヘルパー */
const toChineseDate = (date: Date): ChineseDate => {
  const cal = new CalendarChinese();
  cal.fromDate(date);
  return {
    cycle: cal.cycle,
    year: cal.year,
    month: cal.month,
    isLeapMonth: Boolean(cal.leap),
    day: cal.day
  };
};

// ---- 干支年 → 西暦 ----

describe('fromChineseYearToBcYear', () => {
  it('干支の周期と年から西暦年を計算する', () => {
    // (1 * 60 + 1) - 2697
    expect(fromChineseYearToBcYear(1, 1)).toBe(-2636);
    expect(fromChineseYearToBcYear(78, 43)).toBe(2026);
  });
});

// ---- 日本のサマータイム判定 ----

describe('isDuringSummerTimeJp', () => {
  it('1948〜1951年のサマータイム期間内は true', () => {
    expect(isDuringSummerTimeJp(new Date('1948-07-01T00:00:00+09:00'))).toBe(true);
  });

  it('サマータイム期間外は false', () => {
    expect(isDuringSummerTimeJp(new Date('2026-07-01T00:00:00+09:00'))).toBe(false);
    expect(isDuringSummerTimeJp(new Date('1948-01-01T00:00:00+09:00'))).toBe(false);
  });
});

// ---- 二十四節気（定気法・平気法） ----

describe('getSolarTermBySpace / getSolarTermByTime', () => {
  it('夏至(6/21)直後の6/25は節気「夏至」を返す', () => {
    const space = getSolarTermBySpace(new Date('2026-06-25T00:00:00Z'));
    expect(space?.name).toBe('夏至');
    expect(space?.index).toBe(7);
    expect(space?.isMidpoint).toBe(true); // 夏至は中気

    const time = getSolarTermByTime(new Date('2026-06-25T00:00:00Z'));
    expect(time?.name).toBe('夏至');
    expect(time?.index).toBe(7);
    expect(time?.isMidpoint).toBe(true); // 夏至は中気
  });
});

// ---- 節入り〜節終了の範囲 ----

describe('getRangeOfMonth', () => {
  it('中気(夏至)を含む日では、その月の節の範囲が指定日を含む', () => {
    const date = new Date('2026-06-25T00:00:00Z');
    const range = getRangeOfMonth(date, true); // 定気法
    expect(range.startTime.getTime()).toBeLessThanOrEqual(date.getTime());
    expect(range.endTime.getTime()).toBeGreaterThanOrEqual(date.getTime());
    expect(range.startTime.getTime()).toBeLessThan(range.endTime.getTime());
  });

  it('節(立夏)を含む日でも、その月の節の範囲が指定日を含む', () => {
    const date = new Date('2026-05-10T00:00:00Z');
    const range = getRangeOfMonth(date, false); // 平気法
    expect(range.startTime.getTime()).toBeLessThanOrEqual(date.getTime());
    expect(range.endTime.getTime()).toBeGreaterThanOrEqual(date.getTime());
  });
});

// ---- 土用判定 ----

describe('isEarthPeriodBySpace', () => {
  it('土用の角度範囲内(例:30度)は true', () => {
    expect(isEarthPeriodBySpace(30)).toBe(true);
  });

  it('範囲外(例:50度)は false', () => {
    expect(isEarthPeriodBySpace(50)).toBe(false);
  });

  it('undefined には false', () => {
    expect(isEarthPeriodBySpace(undefined)).toBe(false);
  });
});

describe('isEarthPeriodByTime', () => {
  it('夏の土用(7月下旬)は true', () => {
    expect(isEarthPeriodByTime(new Date('2026-07-25T00:00:00Z'))).toBe(true);
  });

  it('土用でない時期(6月初旬)は false', () => {
    expect(isEarthPeriodByTime(new Date('2026-06-01T00:00:00Z'))).toBe(false);
  });
});

// ---- 立春 ----

describe('getLichunFromYearBySpace / getLichunFromYearByTime', () => {
  it('2026年の立春は2月4日前後(定気法)', () => {
    const bySpace = getLichunFromYearBySpace(2026)!;
    expect(bySpace.getUTCMonth()).toBe(1); // 2月
    expect(bySpace.getUTCDate()).toBeGreaterThanOrEqual(3);
    expect(bySpace.getUTCDate()).toBeLessThanOrEqual(5);
  });

  it('平気法でも立春は2月になる', () => {
    expect(getLichunFromYearByTime(2026).getUTCMonth()).toBe(1);
    expect(getLichunFromYearByTime(2026).getUTCDate()).toBeGreaterThanOrEqual(3);
    expect(getLichunFromYearByTime(2026).getUTCDate()).toBeLessThanOrEqual(5);
  });
});

// ---- 立春を起点とした年の範囲 ----

describe('getYearRangeFromDate', () => {
  it('立春後の日付は、その年の立春〜翌年の立春の範囲を返す', () => {
    const range = getYearRangeFromDate(new Date('2026-06-01T00:00:00Z'));
    expect(new Date(range.startDate).getUTCFullYear()).toBe(2026);
    expect(new Date(range.endDate).getUTCFullYear()).toBe(2027);
  });

  it('立春前の日付は、前年の立春〜その年の立春の範囲を返す', () => {
    const range = getYearRangeFromDate(new Date('2026-01-15T00:00:00Z'));
    expect(new Date(range.startDate).getUTCFullYear()).toBe(2025);
    expect(new Date(range.endDate).getUTCFullYear()).toBe(2026);
  });
});

// ---- 干支計算用の年補正 ----

describe('getAdjustedChineseYear', () => {
  it('立春前(1/15)は前年に補正される', () => {
    expect(getAdjustedChineseYear(new Date('2026-01-15T00:00:00Z'), true)).toBe(2025);
  });

  it('立春後(6/1)はその年のまま', () => {
    expect(getAdjustedChineseYear(new Date('2026-06-01T00:00:00Z'), true)).toBe(2026);
  });
});

// ---- 数え年（現在日時に依存するためタイマーを固定） ----

describe('calculateAsianAge', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('現在を2026-06-23に固定したとき、1990-05-10生まれは37(数え年)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-23T00:00:00Z'));
    expect(calculateAsianAge(new Date('1990-05-10T00:00:00Z'))).toBe(37);
  });
});

// ---- 旧暦の大小月判定 ----

describe('isLongChineseMonth', () => {
  it('大の月(30日)は true / 小の月(29日)は false', () => {
    // 2026-02-20 を含む旧暦の月は30日(大の月)、2026-06-25 を含む月は29日(小の月)
    expect(isLongChineseMonth(toChineseDate(new Date('2026-02-20T00:00:00Z')))).toBe(true);
    expect(isLongChineseMonth(toChineseDate(new Date('2026-06-25T00:00:00Z')))).toBe(false);
  });
});
