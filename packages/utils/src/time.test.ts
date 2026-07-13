import { describe, it, expect } from 'vitest';
import {
  isValidYearMonthDay,
  isValidDate,
  isInvalidDate,
  adjustDate,
  minutesToMilliSeconds,
  addDays,
  subtractDays,
  dmsToDecimalMinutes,
  utcToJulianDay,
  numberOfDaysBetween2Days,
  currentTimeIsInRange,
  getDaysInMonth,
  getMaxDaysInMonth,
  formatTime
} from './time';

// ---- 入力検証系 ----

describe('isValidYearMonthDay', () => {
  it('正しい年月日には true を返す', () => {
    expect(isValidYearMonthDay(2026, 1, 1)).toBe(true);
    expect(isValidYearMonthDay(2024, 2, 29)).toBe(true); // うるう年の2/29
  });

  it('0 や falsy な値には false を返す', () => {
    expect(isValidYearMonthDay(0, 1, 1)).toBe(false);
    expect(isValidYearMonthDay(2026, 0, 1)).toBe(false);
    expect(isValidYearMonthDay(2026, 1, 0)).toBe(false);
  });

  it('範囲外の年(1未満・3000超)には false を返す', () => {
    expect(isValidYearMonthDay(-1, 1, -1)).toBe(false);
    expect(isValidYearMonthDay(3001, 1, 1)).toBe(false);
  });

  it('存在しない日付(繰り上がる日付)には false を返す', () => {
    expect(isValidYearMonthDay(2026, 2, 30)).toBe(false); // 2月30日 → 3月へ繰り上がる
    expect(isValidYearMonthDay(2026, 13, 1)).toBe(false); // 13月
  });
});

describe('isValidDate', () => {
  it('有効な Date には true を返す', () => {
    expect(isValidDate(new Date('2026-01-01'))).toBe(true);
  });

  it('不正な Date には false を返す', () => {
    expect(isValidDate(new Date('invalid'))).toBe(false);
  });
});

describe('isInvalidDate', () => {
  it('不正な Date には true を返す', () => {
    expect(isInvalidDate(new Date('invalid'))).toBe(true);
  });

  it('有効な Date には false を返す', () => {
    expect(isInvalidDate(new Date('2026-01-01'))).toBe(false);
  });
});

// ---- 時刻計算系 ----

describe('minutesToMilliSeconds', () => {
  it('小数の分の「秒未満の端数」をミリ秒に変換する', () => {
    // 0.51分 = 30.6秒 → 端数0.6秒 = 600ミリ秒
    expect(minutesToMilliSeconds(0.51)).toBe(600);
  });

  it('端数のない値では 0 を返す', () => {
    // 0.5分 = ちょうど30秒 → 端数なし
    expect(minutesToMilliSeconds(0.5)).toBe(0);
  });
});

describe('dmsToDecimalMinutes', () => {
  it('DMS を10進法の分に変換する', () => {
    // 0度14分30秒 = 14.5分
    expect(dmsToDecimalMinutes({ neg: false, d: 0, m: 14, s: 30 })).toBe(14.5);
  });

  it('neg が true の場合は負の値を返す', () => {
    expect(dmsToDecimalMinutes({ neg: true, d: 0, m: 14, s: 30 })).toBe(-14.5);
  });
});

describe('adjustDate', () => {
  it('均時差と地方時差(分)の合計を加算した日時を返す', () => {
    const base = new Date('2026-01-01T00:00:00.000Z');
    // eot 5.5分 + offset 10分 = 15.5分(=15分30秒) を加算
    const adjusted = adjustDate(base, 5.5, 10);
    expect(adjusted.getTime() - base.getTime()).toBe(15.5 * 60 * 1000);
  });

  it('元の Date を変更しない(新しい Date を返す)', () => {
    const base = new Date('2026-01-01T00:00:00.000Z');
    adjustDate(base, 5.5, 10);
    expect(base.toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });
});

describe('addDays / subtractDays', () => {
  it('addDays は指定日数を加算する', () => {
    expect(addDays(new Date('2026-01-01T00:00:00Z'), 5).toISOString()).toBe(
      '2026-01-06T00:00:00.000Z'
    );
  });

  it('subtractDays は指定日数を減算する(月またぎ)', () => {
    expect(subtractDays(new Date('2026-01-01T00:00:00Z'), 5).toISOString()).toBe(
      '2025-12-27T00:00:00.000Z'
    );
  });
});

describe('utcToJulianDay', () => {
  it('J2000(2000-01-01 12:00 UTC)はユリウス日 2451545', () => {
    // 天文学で広く使われる基準値。
    expect(utcToJulianDay(new Date('2000-01-01T12:00:00Z'))).toBe(2451545);
  });
});

describe('numberOfDaysBetween2Days', () => {
  it('2つの日付の差を days / hours で返す', () => {
    const result = numberOfDaysBetween2Days(
      new Date('2026-01-10T00:00:00Z'),
      new Date('2026-01-01T00:00:00Z')
    );
    expect(result).toEqual({ days: 9, hours: 0 });
  });
});

describe('currentTimeIsInRange', () => {
  const start = new Date('2026-01-01T00:00:00Z');

  it('範囲内(start+offset 〜 +duration)なら true', () => {
    // 1/6 〜 1/16 の窓に対して 1/10 は範囲内
    expect(currentTimeIsInRange(new Date('2026-01-10T00:00:00Z'), start, 5, 10)).toBe(true);
  });

  it('範囲外なら false', () => {
    expect(currentTimeIsInRange(new Date('2026-01-20T00:00:00Z'), start, 5, 10)).toBe(false);
  });

  it('不正な日付や負のオフセットには false', () => {
    expect(currentTimeIsInRange(new Date('invalid'), start, 5, 10)).toBe(false);
    expect(currentTimeIsInRange(new Date('2026-01-10T00:00:00Z'), start, -1, 10)).toBe(false);
  });
});

// ---- 月の日数 ----

describe('getDaysInMonth', () => {
  it('うるう年の2月は29日', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29); // month は0始まり
  });

  it('平年の2月は28日', () => {
    expect(getDaysInMonth(2026, 1)).toBe(28);
  });

  it('NaN が渡された場合は 31 を返す', () => {
    expect(getDaysInMonth(NaN, 1)).toBe(31);
  });
});

describe('getMaxDaysInMonth', () => {
  it('各月の最大日数を返す(2月は29)', () => {
    expect(getMaxDaysInMonth(0)).toBe(31); // 1月
    expect(getMaxDaysInMonth(1)).toBe(29); // 2月
    expect(getMaxDaysInMonth(3)).toBe(30); // 4月
  });

  it('範囲外の月には 0 を返す', () => {
    expect(getMaxDaysInMonth(-1)).toBe(0);
    expect(getMaxDaysInMonth(12)).toBe(0);
  });
});

describe('formatTime', () => {
  it('秒数を「分:秒」形式に変換し、秒は2桁0埋め', () => {
    expect(formatTime(90)).toBe('1:30');
    expect(formatTime(5)).toBe('0:05');
    expect(formatTime(0)).toBe('0:00');
  });
});
