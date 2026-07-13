// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Settings } from 'luxon';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import YearlyLucks from './YearlyLucks';

/**
 * YearlyLucks は /api/chart から歳運データを fetch して表示し、
 * 「前の10年 / 次の10年」で期間を切り替えて再取得する。
 * - fetch をモックして取得結果を固定
 * - DateTime.now() は luxon の Settings.now で固定（JSタイマーに触れず findBy と両立）
 */
const yearlyLucks = [
  {
    value: '甲辰', decadeLucks: ['甲戌'], year: 2024, age: 24, inEmptyPeriod: false,
    changingStar: '偏官', stemCombinations: [], branchCombinations: [], branchClashes: []
  },
  {
    value: '乙巳', decadeLucks: ['甲戌', '乙亥'], year: 2025, age: 25, inEmptyPeriod: true,
    changingStar: '正官', stemCombinations: [], branchCombinations: [], branchClashes: []
  }
];

const result = {
  birthDateTime: '2000-01-01T03:00:00.000Z', isHourUnknown: false, gender: '1',
  latitude: 35.69, longitude: 139.7, timezoneOffset: -540, utcOffset: 9, dstOffset: 0,
  useSpaceMethod: true, changeDayStem: false, currentYear: 2025, decadeLucks: []
} as never;

const mockFetchOk = () =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ yearlyLucks }) })
  );

beforeEach(() => {
  Settings.now = () => new Date('2026-06-29T00:00:00Z').valueOf(); // 生2000→満26歳, count=2
});
afterEach(() => {
  Settings.now = () => Date.now();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  cleanup();
});

const row = (value: string) => screen.getByText(value).closest('tr')!;

describe('YearlyLucks', () => {
  it('取得前は「歳運を取得中です。」を表示する', () => {
    // 解決しない fetch でローディング状態を維持
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
    render(<YearlyLucks result={result} />);
    expect(screen.getByText('歳運を取得中です。')).toBeInTheDocument();
  });

  it('取得後、各歳運の干支・大運・西暦年・満年齢を整形表示する', async () => {
    mockFetchOk();
    render(<YearlyLucks result={result} />);
    await screen.findByText('甲辰'); // 非同期取得を待つ

    expect(within(row('甲辰')).getByText('甲戌')).toBeInTheDocument(); // 大運（1つ）
    expect(within(row('甲辰')).getByText('2024〜25')).toBeInTheDocument(); // 西暦年
    expect(within(row('甲辰')).getByText('24〜25歳')).toBeInTheDocument(); // 満年齢

    expect(within(row('乙巳')).getByText('甲戌-乙亥')).toBeInTheDocument(); // 大運（複数を - 連結）
    expect(within(row('乙巳')).getByText('2025〜26')).toBeInTheDocument();
  });

  it('現在年の歳運の行はハイライトされる', async () => {
    mockFetchOk();
    render(<YearlyLucks result={result} />);
    await screen.findByText('乙巳');
    expect(row('乙巳')).toHaveClass('bg-gray-200'); // currentYear=2025
    expect(row('甲辰')).not.toHaveClass('bg-gray-200');
  });

  it('「通変星」をオンにすると通変星の列が表示される', async () => {
    mockFetchOk();
    render(<YearlyLucks result={result} />);
    await screen.findByText('甲辰');
    fireEvent.click(screen.getByRole('checkbox', { name: '通変星' }));
    expect(screen.getByRole('columnheader', { name: '通変星' })).toBeInTheDocument();
    expect(within(row('甲辰')).getByText('偏官')).toBeInTheDocument();
    expect(within(row('乙巳')).getByText('正官')).toBeInTheDocument();
  });

  it('「命式との関係」をオンにすると関係列が表示され、空亡が示される', async () => {
    mockFetchOk();
    render(<YearlyLucks result={result} />);
    await screen.findByText('甲辰');
    expect(screen.queryByText('空亡')).toBeNull();
    fireEvent.click(screen.getByRole('checkbox', { name: '命式との関係' }));
    expect(screen.getByRole('columnheader', { name: '命式との関係' })).toBeInTheDocument();
    expect(within(row('乙巳')).getByText('空亡')).toBeInTheDocument(); // inEmptyPeriod
  });

  it('「次の10年」を押すと歳運を再取得する', async () => {
    mockFetchOk();
    render(<YearlyLucks result={result} />);
    await screen.findByText('甲辰');
    expect(fetch).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: '次の10年' }));
    expect(fetch).toHaveBeenCalledTimes(2); // count 変更で再フェッチ
  });
});
