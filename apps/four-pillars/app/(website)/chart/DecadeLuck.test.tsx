// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import DecadeLucks from './DecadeLuck';

afterEach(cleanup);

/**
 * DecadeLucks は result.decadeLucks を表に整形表示し、内部 useForm のチェックボックスで
 * 「命式との関係 / 通変星 / 十二運」列の表示を切り替える。
 * 開始年月はローカルTZの月で整形されるため、月の中頃・正午UTC を使ってTZ非依存にする。
 */
const mkLuck = (over: Record<string, unknown> = {}) => ({
  value: '甲戌',
  startingDate: '2000-01-15T12:00:00.000Z',
  age: 0,
  inCurrentPeriod: false,
  seasonId: 0,
  changingStar: '比肩',
  twelveLuck: '長生',
  inEmptyPeriod: false,
  stemCombinations: [],
  branchCombinations: [],
  branchClashes: [],
  threeHarmonyBranches: undefined,
  twoHarmonyBranches: [],
  threeSeasonalBranches: undefined,
  twoSeasonalBranches: [],
  ...over
});

const result = {
  decadeLucks: [
    mkLuck(),
    mkLuck({
      value: '乙亥',
      startingDate: '2005-03-15T12:00:00.000Z',
      age: 5,
      inCurrentPeriod: true,
      changingStar: '劫財',
      twelveLuck: '沐浴',
      inEmptyPeriod: true
    })
  ]
} as never;

const headerNames = () => screen.getAllByRole('columnheader').map(h => h.textContent?.trim());
const row = (value: string) => screen.getByText(value).closest('tr')!;

describe('DecadeLucks', () => {
  it('既定では干支・開始年月・満年齢の3列を表示する', () => {
    render(<DecadeLucks result={result} />);
    expect(headerNames()).toEqual(['干支', '開始年月', '満年齢']);
    // 切り替え列は既定で非表示
    expect(screen.queryByRole('columnheader', { name: '通変星' })).toBeNull();
    expect(screen.queryByRole('columnheader', { name: '十二運' })).toBeNull();
    expect(screen.queryByRole('columnheader', { name: '命式との関係' })).toBeNull();
  });

  it('各大運の干支・開始年月・満年齢を整形表示する', () => {
    render(<DecadeLucks result={result} />);
    expect(within(row('甲戌')).getByText('2000年1月')).toBeInTheDocument();
    expect(within(row('甲戌')).getByText('0歳')).toBeInTheDocument();
    expect(within(row('乙亥')).getByText('2005年3月')).toBeInTheDocument();
    expect(within(row('乙亥')).getByText('5歳')).toBeInTheDocument();
  });

  it('進行中の大運の行はハイライトされる', () => {
    render(<DecadeLucks result={result} />);
    expect(row('乙亥')).toHaveClass('bg-gray-200'); // inCurrentPeriod
    expect(row('甲戌')).not.toHaveClass('bg-gray-200');
  });

  it('「通変星」をオンにすると通変星の列が表示される', () => {
    render(<DecadeLucks result={result} />);
    fireEvent.click(screen.getByRole('checkbox', { name: '通変星' }));
    expect(screen.getByRole('columnheader', { name: '通変星' })).toBeInTheDocument();
    expect(within(row('甲戌')).getByText('比肩')).toBeInTheDocument();
    expect(within(row('乙亥')).getByText('劫財')).toBeInTheDocument();
  });

  it('「十二運」をオンにすると十二運の列が表示される', () => {
    render(<DecadeLucks result={result} />);
    fireEvent.click(screen.getByRole('checkbox', { name: '十二運' }));
    expect(screen.getByRole('columnheader', { name: '十二運' })).toBeInTheDocument();
    expect(within(row('甲戌')).getByText('長生')).toBeInTheDocument();
    expect(within(row('乙亥')).getByText('沐浴')).toBeInTheDocument();
  });

  it('「命式との関係」をオンにすると関係列が表示され、空亡が示される', () => {
    render(<DecadeLucks result={result} />);
    expect(screen.queryByText('空亡')).toBeNull(); // 列が出るまでは非表示
    fireEvent.click(screen.getByRole('checkbox', { name: '命式との関係' }));
    expect(screen.getByRole('columnheader', { name: '命式との関係' })).toBeInTheDocument();
    // inEmptyPeriod の行に「空亡」が表示される
    expect(within(row('乙亥')).getByText('空亡')).toBeInTheDocument();
  });
});
