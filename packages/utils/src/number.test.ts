import { describe, it, expect } from 'vitest';
import { range, roundDecimal, convertToSexagesimal } from './number';

describe('range', () => {
  it('start から stop まで step 刻みの連番を生成する(両端を含む)', () => {
    expect(range(0, 4, 1)).toEqual([0, 1, 2, 3, 4]);
  });

  it('step が2の場合は1つ飛ばしで生成する', () => {
    expect(range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
  });

  it('step で割り切れる場合は stop も含む', () => {
    expect(range(0, 10, 5)).toEqual([0, 5, 10]);
  });
});

describe('roundDecimal', () => {
  it('指定した小数桁で四捨五入する', () => {
    expect(roundDecimal(3.14159, 2)).toBe(3.14);
  });

  it('境界値は切り上げる(0.5は繰り上げ)', () => {
    expect(roundDecimal(3.145, 2)).toBe(3.15);
    expect(roundDecimal(2.5, 0)).toBe(3);
  });

  it('負の桁数を指定すると整数部の位で丸める', () => {
    // n=-2 → 100の位で丸める
    expect(roundDecimal(1234, -2)).toBe(1200);
  });
});

describe('convertToSexagesimal', () => {
  it('10進数を「度°分\'」形式に変換する', () => {
    // 0.5度 = 30分
    expect(convertToSexagesimal(35.5)).toBe("35°30'");
  });

  it('分が一桁の場合はゼロ埋めする', () => {
    // 0.125度 = 7.5分 → 切り捨てて7分 → "07"
    expect(convertToSexagesimal(20.125)).toBe("20°07'");
  });

  it('分が0の場合は"00"になる', () => {
    expect(convertToSexagesimal(10)).toBe("10°00'");
  });

  it('小数部の分は切り捨てる', () => {
    // 0.69度 = 41.4分 → 切り捨てて41分
    expect(convertToSexagesimal(139.69)).toBe("139°41'");
  });
});
