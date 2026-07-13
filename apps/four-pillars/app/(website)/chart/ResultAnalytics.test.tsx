// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ResultAnalytics from './ResultAnalytics';

afterEach(cleanup);

/** 何も成立していない命式（全項目「なし」になる基準） */
const emptyResult = {
  stemPairs: [],
  branchPairs: [],
  threeSeasonalBranches: undefined,
  threeHarmonyBranches: undefined,
  twoSeasonalBranches: [],
  twoHarmonyBranches: [],
  branchClashes: [],
  branchBreaks: [],
  branchHarms: [],
  branchPunishments: [],
  emptyPeriods: []
};

const renderWith = (overrides: Partial<typeof emptyResult> = {}) =>
  render(<ResultAnalytics result={{ ...emptyResult, ...overrides } as never} />);

/** 行ラベルから値セルのテキストを取得 */
const valueOf = (label: string) =>
  screen
    .getByText(label)
    .closest('tr')!
    .querySelector('.table-cell-content-without-border')!
    .textContent?.trim();

describe('ResultAnalytics', () => {
  it('何も成立していない場合は各項目「なし」を表示する', () => {
    renderWith();
    for (const label of ['干合', '方合', '三合', '四墓', '支合', '冲', '刑', '破', '害']) {
      expect(valueOf(label)).toBe('なし');
    }
    expect(valueOf('空亡')).toBe(''); // 空亡は該当なしだと空表示
  });

  it('成立している関係を「・」連結や「名称（地支）」形式で表示する', () => {
    renderWith({
      stemPairs: [{ name: '甲己' }, { name: '乙庚' }] as never,
      branchPairs: [{ name: '子丑' }] as never,
      threeSeasonalBranches: { name: '東方合', branches: ['寅', '卯', '辰'] } as never,
      threeHarmonyBranches: { name: '三合水局', branches: ['申', '子', '辰'], elementId: 4 } as never,
      branchClashes: [{ name: '子午' }] as never,
      branchPunishments: [{ name: '寅巳' }] as never,
      branchBreaks: [{ name: '子酉' }] as never,
      branchHarms: [{ name: '子未' }] as never,
      emptyPeriods: ['戌', '亥'] as never
    });
    expect(valueOf('干合')).toBe('甲己・乙庚'); // 複数は「・」連結
    expect(valueOf('支合')).toBe('子丑');
    expect(valueOf('方合')).toBe('東方合（寅卯辰）');
    expect(valueOf('三合')).toBe('三合水局（申子辰）');
    expect(valueOf('四墓')).toBe('なし'); // elementId !== 2 なので三合扱い
    expect(valueOf('冲')).toBe('子午');
    expect(valueOf('刑')).toBe('寅巳');
    expect(valueOf('破')).toBe('子酉');
    expect(valueOf('害')).toBe('子未');
    expect(valueOf('空亡')).toBe('戌亥'); // 地支を連結
  });

  it('三合・方合が無く半会のみの場合は半会を表示する', () => {
    renderWith({
      twoSeasonalBranches: [{ name: '東方合半会', branches: ['寅', '卯'] }] as never,
      twoHarmonyBranches: [{ name: '三合水局半会', branches: ['申', '子'] }] as never
    });
    expect(valueOf('方合')).toBe('東方合半会（寅卯）');
    expect(valueOf('三合')).toBe('三合水局半会（申子）');
  });

  it('三合の elementId が 2 のときは「四墓」として表示し、三合は「なし」', () => {
    renderWith({
      threeHarmonyBranches: { name: '三合土局', branches: ['辰', '戌', '丑', '未'], elementId: 2 } as never
    });
    expect(valueOf('四墓')).toBe('三合土局（辰戌丑未）');
    expect(valueOf('三合')).toBe('なし');
  });
});
