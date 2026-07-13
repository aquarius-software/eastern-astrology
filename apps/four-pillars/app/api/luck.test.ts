import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Gender, Term } from 'types';
import { isLuckOrderForward, getStartingAge, getYearlyLucks } from './luck';
import { FourPillarsPersonalInfo } from './FourPillarsPersonalInfo';
import { FourPillarsData } from './FourPillarsData';

// ---- 順運 / 逆運の判定 ----
//
// 順運(true)になるのは「男命かつ年干が陽干」または「女命かつ年干が陰干」のとき。
// 陽干: 甲丙戊庚壬 / 陰干: 乙丁己辛癸
describe('isLuckOrderForward', () => {
  it('男命(1)＋陽干(甲)は順運(true)', () => {
    expect(isLuckOrderForward('1' as Gender, '甲')).toBe(true);
  });

  it('男命(1)＋陰干(乙)は逆運(false)', () => {
    expect(isLuckOrderForward('1' as Gender, '乙')).toBe(false);
  });

  it('女命(0)＋陽干(甲)は逆運(false)', () => {
    expect(isLuckOrderForward('0' as Gender, '甲')).toBe(false);
  });

  it('女命(0)＋陰干(乙)は順運(true)', () => {
    expect(isLuckOrderForward('0' as Gender, '乙')).toBe(true);
  });
});

// ---- 立運（大運の起算年齢）の計算 ----
//
// 節の期間内における生日の位置から、節までの日数(または節からの日数)を3で割って算出する。
describe('getStartingAge', () => {
  const term: Term = {
    startTime: new Date('2026-01-01T00:00:00Z'),
    endTime: new Date('2026-01-31T00:00:00Z')
  };
  const date = new Date('2026-01-22T00:00:00Z');

  it('順運では「次の節入りまでの日数 ÷ 3」になる', () => {
    // endTime まで 9日 → 9 / 3 = 3
    expect(getStartingAge(term, date, true)).toBe(3);
  });

  it('逆運では「直前の節入りからの日数 ÷ 3」になる', () => {
    // startTime から 21日 → 21 / 3 = 7
    expect(getStartingAge(term, date, false)).toBe(7);
  });

  it('生日が節の境界にある場合は0になる', () => {
    // 順運で生日が endTime と同一 → 差0
    expect(getStartingAge(term, term.endTime, true)).toBe(0);
    // 逆運で生日が startTime と同一 → 差0
    expect(getStartingAge(term, term.startTime, false)).toBe(0);
  });
});

// ---- 年運（構築済みの四柱が必要なため統合テスト） ----
//
// getYearlyLucks は decadeLucks 等を持つ FourPillarsData を必要とし、内部で
// 現在時刻にも依存するため、命式を構築したうえでシステム時刻を固定して検証する。
describe('getYearlyLucks (統合テスト)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-23T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** 基準サンプル: 2000-01-01 12:00 JST 生まれ、東京、男性（日干=戊） */
  const buildChart = () => {
    const personalInfo = new FourPillarsPersonalInfo(
      new Date('2000-01-01T03:00:00Z'),
      139.7, 35.69, -540, 9, 0,
      '1' as Gender, 'ja' as never,
      true, false, false, false, true
    );
    personalInfo.init();
    const data = new FourPillarsData(personalInfo);
    data.init();
    return data;
  };

  it('指定した年範囲の年運(年干支・年・年齢)を算出する', () => {
    const lucks = getYearlyLucks(2024, 2026, buildChart());
    expect(lucks).toHaveLength(3);
    expect(lucks.map(l => l.value)).toEqual(['甲辰', '乙巳', '丙午']);
    expect(lucks.map(l => l.year)).toEqual([2024, 2025, 2026]);
    // 2000年生まれなので 2024年は満24歳
    expect(lucks[0].age).toBe(24);
  });

  it('日干(戊)に対する通変星・十二運を各年に付与する', () => {
    const lucks = getYearlyLucks(2024, 2026, buildChart());
    expect(lucks[0]).toMatchObject({ changingStar: '偏官', twelveLuck: '冠帯' }); // 戊×甲辰
    expect(lucks[2]).toMatchObject({ changingStar: '偏印', twelveLuck: '帝旺' }); // 戊×丙午
  });

  it('各年に該当する大運(甲戌)を紐づける', () => {
    const lucks = getYearlyLucks(2024, 2026, buildChart());
    expect(lucks[0].decadeLucks).toContain('甲戌');
  });
});
