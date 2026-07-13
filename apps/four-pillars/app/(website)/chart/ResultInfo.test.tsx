// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ResultInfo from './ResultInfo';

afterEach(cleanup);

/**
 * ResultInfo は計算済みの result を props で受け取り、基本情報テーブルを整形表示する。
 * 基準サンプル: 2000-01-01 12:00 JST 生まれ、東京、男性（年己卯・月丙子・日戊午・時戊午）。
 */
const baseResult = {
  heavenlyStems: [
    { position: 'hour', value: '戊' },
    { position: 'day', value: '戊' },
    { position: 'month', value: '丙' },
    { position: 'year', value: '己' }
  ],
  earthlyBranches: [
    { position: 'hour', value: '午' },
    { position: 'day', value: '午' },
    { position: 'month', value: '子' },
    { position: 'year', value: '卯' }
  ],
  birthDateTime: '2000-01-01T03:00:00.000Z',
  isHourUnknown: false,
  gender: '1',
  timeZoneId: 'Asia/Tokyo',
  startingAge: 5.2,
  currentAge: 26,
  luckOrder: false,
  currentDecadeLuck: '甲戌',
  currentYearlyLuck: '丙午',
  passedYears: 2.3,
  latitude: 35.69,
  longitude: 139.7,
  timezoneOffset: -540
};

const renderWith = (overrides: Partial<typeof baseResult> = {}) =>
  render(<ResultInfo result={{ ...baseResult, ...overrides } as never} />);

/** 行ラベルから、その行の値セルのテキストを取得する */
const valueOf = (label: string) =>
  screen
    .getByText(label)
    .closest('tr')!
    .querySelector('.table-cell-content-without-border')!
    .textContent?.trim();

describe('ResultInfo', () => {
  it('基本情報を整形して表示する', () => {
    renderWith();
    expect(valueOf('入力日時')).toBe('2000年1月1日 12:00'); // JST(+9)へ変換
    expect(valueOf('生誕地')).toBe('北緯35.69度/東経139.7度');
    expect(valueOf('満年齢')).toBe('26歳');
    expect(valueOf('性別')).toBe('男性');
    expect(valueOf('立運')).toBe('5.2年');
    expect(valueOf('行運')).toBe('逆運');
  });

  it('四柱（時・日・月・年）を干支ペアで表示する', () => {
    renderWith();
    expect(valueOf('時柱')).toBe('戊午');
    expect(valueOf('日柱')).toBe('戊午');
    expect(valueOf('月柱')).toBe('丙子');
    expect(valueOf('年柱')).toBe('己卯');
  });

  it('大運は経過年を切り上げて添え、歳運を表示する', () => {
    renderWith();
    // passedYears 2.3 → 切り上げて 3年目
    expect(valueOf('大運（現在）')).toBe('甲戌（3年目）');
    expect(valueOf('歳運（現在）')).toBe('丙午');
  });

  it('生時不明の場合は入力日時に注記し、生誕地と時柱を表示しない', () => {
    // 生時不明では時柱の干支は持たない（hour 要素を除いた現実的なデータ）
    renderWith({
      isHourUnknown: true,
      heavenlyStems: baseResult.heavenlyStems.filter(s => s.position !== 'hour'),
      earthlyBranches: baseResult.earthlyBranches.filter(b => b.position !== 'hour')
    });
    expect(valueOf('入力日時')).toBe('2000年1月1日（生時不明）');
    expect(screen.queryByText('生誕地')).toBeNull();
    expect(screen.queryByText('時柱')).toBeNull();
    // 日・月・年柱は表示される
    expect(valueOf('日柱')).toBe('戊午');
  });

  it('性別・行運・満年齢範囲・大運の経過年なしを正しく出し分ける', () => {
    renderWith({
      gender: '0',
      luckOrder: true,
      currentAge: 130, // 0〜120 の範囲外 → 満年齢を表示しない
      passedYears: undefined as never // 経過年なし → 「○年目」を付けない
    });
    expect(valueOf('性別')).toBe('女性');
    expect(valueOf('行運')).toBe('順運');
    expect(screen.queryByText('満年齢')).toBeNull();
    expect(valueOf('大運（現在）')).toBe('甲戌'); // （○年目）が付かない
  });
});
