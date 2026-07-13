// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Settings } from 'luxon';
import { render, screen, cleanup } from '@testing-library/react';
import ResultInfo from './ResultInfo';

/**
 * ResultInfo(purple-star) は命盤の基本情報を整形表示する。
 * - 数え年の表示は isFutureDate()（DateTime.now() 依存）で変わるため now を固定
 * - 西暦日時は toFormat がローカルTZ依存のため defaultZone を utc に固定
 * 基準: 2000-01-01 旧暦 己卯年11月25日 午時。
 */
beforeEach(() => {
  Settings.now = () => new Date('2026-06-23T00:00:00Z').valueOf();
  Settings.defaultZone = 'utc';
});
afterEach(() => {
  Settings.now = () => Date.now();
  Settings.defaultZone = 'system';
  cleanup();
});

const baseResult = {
  birthDateTime: '2000-01-01T03:00:00.000Z',
  latitude: '35.69',
  longitude: '139.7',
  isYang: false,
  isMale: true,
  division: '土五局',
  chineseDate: {
    yearStem: '己',
    yearBranch: '卯',
    month: 11,
    day: 25,
    hourBranch: '午',
    isLeapMonth: false
  },
  asianAge: 28,
  bodyPalace: '命宮',
  januaryBranchIndex: 0
};

const renderWith = (overrides: Partial<typeof baseResult> = {}) =>
  render(<ResultInfo result={{ ...baseResult, ...overrides } as never} />);

const valueOf = (label: string) =>
  screen
    .getByText(label)
    .closest('tr')!
    .querySelector('.table-cell-content')!
    .textContent?.trim();

describe('ResultInfo (purple-star)', () => {
  it('西暦・旧暦・生誕地・五行局などの基本情報を整形表示する', () => {
    renderWith();
    expect(valueOf('入力日時（西暦）')).toBe('2000年1月1日 3:00');
    expect(valueOf('入力日時（旧暦）')).toBe('己卯年 11月25日 午時');
    expect(valueOf('生誕地')).toBe('北緯 35.69度/東経 139.7度');
    expect(valueOf('陰陽・性別')).toBe('陰男'); // isYang=false→陰, isMale=true→男
    expect(valueOf('数え年（旧暦）')).toBe('28歳');
    expect(valueOf('五行局')).toBe('土五局');
    expect(valueOf('身宮')).toBe('命宮');
    expect(valueOf('子年斗君')).toBe('子'); // januaryBranchIndex 0
  });

  it('旧暦が閏月のときは「（閏月）」を付ける', () => {
    renderWith({ chineseDate: { ...baseResult.chineseDate, isLeapMonth: true } });
    expect(valueOf('入力日時（旧暦）')).toBe('己卯年 11月25日 午時（閏月）');
  });

  it('陰陽・性別と緯度経度の符号を出し分ける', () => {
    renderWith({ isYang: true, isMale: false, latitude: '-33.87', longitude: '-70.6' });
    expect(valueOf('陰陽・性別')).toBe('陽女');
    expect(valueOf('生誕地')).toBe('南緯 33.87度/西経 70.6度');
  });

  it('数え年は生年月日が未来なら非表示、子年斗君は範囲外indexなら空', () => {
    // 未来日付 → isFutureDate=false → 数え年の行が出ない
    renderWith({ birthDateTime: '2030-01-01T03:00:00.000Z', januaryBranchIndex: 13 });
    expect(screen.queryByText('数え年（旧暦）')).toBeNull();
    expect(valueOf('子年斗君')).toBe(''); // index 13 は範囲外 → 空
  });
});
