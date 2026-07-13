import { describe, it, expect } from 'vitest';
import { getEclipticLongitude, getEquationOfTime } from './astro';

describe('getEclipticLongitude', () => {
  it('不正な日付には undefined を返す', () => {
    expect(getEclipticLongitude(new Date('invalid'))).toBeUndefined();
  });

  it('春分の瞬時では太陽黄経が約0度になる', () => {
    // 黄経は春分点を起点(0度)とするため、2026年の春分の瞬時(UTC)で約0度。
    const lon = getEclipticLongitude(new Date('2026-03-20T14:46:00Z'));
    expect(lon).toBeCloseTo(0, 1);
  });

  it('夏至の瞬時では太陽黄経が約90度になる', () => {
    const lon = getEclipticLongitude(new Date('2026-06-21T08:25:00Z'));
    expect(lon).toBeCloseTo(90, 1);
  });

  it('0以上360未満の範囲を返す', () => {
    const lon = getEclipticLongitude(new Date('2026-01-01T12:00:00Z'))!;
    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });

  it('既知の日時で安定した値を返す(回帰検出用ゴールデン値)', () => {
    // 計算ロジックや依存ライブラリが意図せず変化した場合に気付けるよう固定。
    expect(getEclipticLongitude(new Date('2026-01-01T12:00:00Z'))).toBeCloseTo(281.084, 2);
  });
});

describe('getEquationOfTime', () => {
  it('不正な日付には undefined を返す', () => {
    expect(getEquationOfTime(new Date('invalid'))).toBeUndefined();
  });

  it('DMS 形式(neg/d/m/s)のオブジェクトを返す', () => {
    const eot = getEquationOfTime(new Date('2026-06-21T12:00:00Z'));
    expect(eot).toMatchObject({
      neg: expect.any(Boolean),
      d: expect.any(Number),
      m: expect.any(Number),
      s: expect.any(Number),
    });
  });

  it('2月中旬は均時差が負(約-14分)になる', () => {
    // 1年のうち均時差が最小(約-14分)に達する時期。
    const eot = getEquationOfTime(new Date('2026-02-11T12:00:00Z'))!;
    expect(eot.neg).toBe(true);
    expect(eot.d).toBe(0);
    expect(eot.m).toBe(14);
  });

  it('11月初旬は均時差が正(約+16分)になる', () => {
    // 1年のうち均時差が最大(約+16分)に達する時期。
    const eot = getEquationOfTime(new Date('2026-11-03T12:00:00Z'))!;
    expect(eot.neg).toBe(false);
    expect(eot.d).toBe(0);
    expect(eot.m).toBe(16);
  });
});
