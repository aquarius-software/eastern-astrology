import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Gender } from 'types';
import { FourPillarsPersonalInfo } from './FourPillarsPersonalInfo';
import { FourPillarsData } from './FourPillarsData';
import { BASE, chartCases, type ChartConfig } from './FourPillarsData.fixtures';

/**
 * 命式の構築は内部で getDecadeLucks / getAdjustedChineseYear / currentAge() を呼び、
 * これらが現在時刻に依存するため、システム時刻を固定して決定論的にする。
 *
 * テストデータ（BASE / chartCases）は ./FourPillarsData.fixtures.ts に分離している。
 * 新しい命式ケースを増やす場合はそちらの chartCases に行を追加する。
 */
describe('FourPillarsData (統合テスト)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-23T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** 入力設定から init 済みの命式を生成する。 */
  const buildChart = (cfg: ChartConfig): FourPillarsData => {
    const personalInfo = new FourPillarsPersonalInfo(
      new Date(cfg.birth),
      cfg.longitude,
      cfg.latitude,
      cfg.timezoneOffset,
      cfg.utcOffset,
      0, // dstOffset
      cfg.gender,
      'ja' as never,
      cfg.useSpaceMethod ?? true,
      false, // createImage
      cfg.isHourUnknown ?? false,
      cfg.changeDayStem ?? false,
      false // yearlyLucks
    );
    personalInfo.init();
    const data = new FourPillarsData(personalInfo);
    data.init();
    return data;
  };

  // ---- 命式まるごとの検証（ケースは fixtures の chartCases で管理） ----

  it.each(chartCases)('$name の四柱・節気・行運・五行を算出する', ({ config, expected }) => {
    const data = buildChart(config);
    const fp = data.getFourPillars();

    expect(`${fp.year.stem}${fp.year.branch}`).toBe(expected.year);
    expect(`${fp.month.stem}${fp.month.branch}`).toBe(expected.month);
    expect(`${fp.day.stem}${fp.day.branch}`).toBe(expected.day);
    expect(`${fp.hour!.stem}${fp.hour!.branch}`).toBe(expected.hour);

    expect(data.personalInfo.solarTerm?.name).toBe(expected.solarTerm);
    expect(data.luckOrder).toBe(expected.luckOrder);
    // 浮動小数の誤差を避けるため小数2桁に丸めて比較
    expect(data.elementComposition.map(n => Number(n.toFixed(2)))).toEqual(
      expected.elementComposition
    );
    expect(data.temperature).toBeCloseTo(expected.temperature, 2);
    expect(data.humidity).toBeCloseTo(expected.humidity, 2);
  });

  // ---- パラメータや条件によるバリエーション ----

  it.each([
    { gender: '1' as Gender, expected: false, label: '男命＋陰干(己)は逆運' },
    { gender: '0' as Gender, expected: true, label: '女命＋陰干(己)は順運' }
  ])('行運判定: $label', ({ gender, expected }) => {
    expect(buildChart({ ...BASE, gender }).luckOrder).toBe(expected);
  });

  it('時柱を含む場合は天干・地支が4本ずつ生成される', () => {
    const data = buildChart({ ...BASE });
    expect(data.stems).toHaveLength(4);
    expect(data.branches).toHaveLength(4);
  });

  it('生時不明の場合は時柱を除いて3本ずつになり、五行構成も変わる', () => {
    const data = buildChart({ ...BASE, isHourUnknown: true });
    expect(data.stems).toHaveLength(3);
    expect(data.branches).toHaveLength(3);
    expect(data.elementComposition).toEqual([1, 1.6, 2.4, 0, 3]);
  });

  it('平気法でも年柱は同じ(己卯)になる', () => {
    const fp = buildChart({ ...BASE, useSpaceMethod: false }).getFourPillars();
    expect(`${fp.year.stem}${fp.year.branch}`).toBe('己卯');
  });

  it('getObject() は主要な命式情報を含むオブジェクトを返す', () => {
    const obj = buildChart({ ...BASE }).getObject() as Record<string, unknown>;
    expect(obj).toHaveProperty('heavenlyStems');
    expect(obj).toHaveProperty('earthlyBranches');
    expect(obj).toHaveProperty('elementComposition');
    expect(obj).toHaveProperty('decadeLucks');
    expect(obj).toHaveProperty('luckOrder');
  });
});
