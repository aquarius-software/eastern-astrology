// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Settings } from 'luxon';
import { render, screen, cleanup } from '@testing-library/react';
import ResultTime from './ResultTime';

/**
 * ResultTime(purple-star) は時間・位置情報を整形表示する。
 * 調整後日時の toFormat はローカルTZ依存のため defaultZone を utc に固定する。
 */
beforeEach(() => {
  Settings.defaultZone = 'utc';
});
afterEach(() => {
  Settings.defaultZone = 'system';
  cleanup();
});

const baseResult = {
  adjustedDate: '2000-01-01T03:00:00.000Z',
  latitude: '35.69',
  longitude: '139.7',
  timeZoneName: 'Asia/Tokyo',
  timeZoneId: 'Asia/Tokyo',
  utcOffset: 9,
  dstOffset: 0,
  localOffsetMinutes: 18.8
};

const renderWith = (overrides: Partial<typeof baseResult> = {}) =>
  render(<ResultTime result={{ ...baseResult, ...overrides } as never} />);

const valueOf = (label: string) =>
  screen
    .getByText(label)
    .closest('tr')!
    .querySelector('.table-cell-content')!
    .textContent?.trim();

describe('ResultTime (purple-star)', () => {
  it('タイムゾーン・地方時差・調整後日時を整形表示する', () => {
    renderWith();
    expect(valueOf('タイムゾーン')).toBe('Asia/Tokyo');
    expect(valueOf('サマータイム')).toBe('なし'); // dstOffset = 0
    expect(valueOf('地方時差')).toBe('+18.8分'); // 正の値には + が付く
    expect(valueOf('調整後日時（西暦）')).toBe('2000年1月1日 3:00');
  });

  it('サマータイムと地方時差の符号を出し分ける', () => {
    renderWith({ dstOffset: 60, localOffsetMinutes: -5 });
    expect(valueOf('サマータイム')).toBe('-1.0分'); // dstOffset 60 → 1.0分
    expect(valueOf('地方時差')).toBe('-5.0分'); // 負の値には + が付かない
  });
});
