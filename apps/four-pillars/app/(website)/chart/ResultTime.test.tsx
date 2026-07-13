// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ResultTime from './ResultTime';

afterEach(cleanup);

/**
 * ResultTime は計算済みの result を props で受け取り、時間情報テーブルに整形表示する。
 * currentTerm.startTime/endTime は API でシリアライズされた後の「ISO文字列」で渡る点に注意。
 * 基準サンプル: 2000-01-01 12:18 JST 相当。
 */
const baseResult = {
  adjustedDate: '2000-01-01T03:18:48.000Z',
  timeZoneName: 'Asia/Tokyo',
  inEarthPeriod: false,
  utcOffset: 9,
  dstOffset: 0,
  localOffsetMinutes: 18.8,
  equationOfTime: { neg: true, d: 0, m: 3, s: 30 }, // -3.5分
  solarTerm: '冬至',
  eclipticLongitude: 280.38,
  useSpaceMethod: true,
  changeDayStem: false,
  timezoneOffset: -540, // JST
  currentTerm: {
    startTime: '2025-12-21T15:00:00.000Z',
    endTime: '2026-01-20T03:00:00.000Z'
  },
  elapsedDays: { days: 11, hours: 12 }
};

const renderWith = (overrides: Partial<typeof baseResult> = {}) =>
  render(<ResultTime result={{ ...baseResult, ...overrides } as never} />);

/** 行ラベルから、その行の値セルのテキストを取得する */
const valueOf = (label: string) =>
  screen
    .getByText(label)
    .closest('tr')!
    .querySelector('.table-cell-content-without-border')!
    .textContent?.trim();

describe('ResultTime', () => {
  it('数値・日時を整形して表示する', () => {
    renderWith();
    expect(valueOf('タイムゾーン')).toBe('Asia/Tokyo');
    expect(valueOf('地方時差')).toBe('+18.8分'); // 正の値には + が付く
    expect(valueOf('均時差')).toBe('-3.5分'); // DMS を10進分に整形
    expect(valueOf('調整後日時')).toBe('2000年1月1日 12:18'); // JST(+9)へ変換して整形
    expect(valueOf('節入り日時')).toBe('2025年12月22日 0:00');
    expect(valueOf('翌月節入り日時')).toBe('2026年1月20日 12:00');
    expect(valueOf('節入り後日数')).toBe('11.5日'); // days + hours/24
    expect(valueOf('太陽黄経')).toBe('280.38度');
  });

  it('土用・分割法・日柱切替などの条件表示（基準ケース）', () => {
    renderWith();
    expect(valueOf('サマータイム')).toBe('なし'); // dstOffset = 0
    expect(valueOf('二十四節気')).toBe('冬至'); // inEarthPeriod = false → 土用表記なし
    expect(valueOf('二十四節気分割法')).toBe('定気法'); // useSpaceMethod = true
    expect(valueOf('日柱切り替え時刻')).toBe('0時'); // changeDayStem = false
  });

  it('フラグが変われば条件表示も切り替わる', () => {
    renderWith({
      inEarthPeriod: true,
      useSpaceMethod: false,
      changeDayStem: true,
      dstOffset: 60,
      localOffsetMinutes: -5,
      equationOfTime: { neg: false, d: 0, m: 3, s: 30 } // +3.5分
    });
    expect(valueOf('二十四節気')).toBe('冬至（土用）'); // 土用表記が付く
    expect(valueOf('二十四節気分割法')).toBe('平気法（恒気法）');
    expect(valueOf('日柱切り替え時刻')).toBe('23時');
    expect(valueOf('サマータイム')).toBe('-1.0分'); // dstOffset 60 → 1.0分
    expect(valueOf('地方時差')).toBe('-5.0分'); // 負の値には + が付かない
    expect(valueOf('均時差')).toBe('+3.5分'); // neg=false → + が付く
  });
});
