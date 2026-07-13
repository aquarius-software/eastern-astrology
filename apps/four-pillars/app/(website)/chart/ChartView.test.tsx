// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// next/font/google は Next のコンパイラ前提のため、フォント関数をスタブ化する
vi.mock('next/font/google', () => ({
  Shippori_Mincho_B1: () => ({ variable: 'mock-font', className: 'mock-font', style: {} })
}));

// ルーター外のテスト環境では usePathname() が null を返し、配下の OptionStorage が
// pathName!.split() で TypeError を出す（catch されるが stderr が汚れる）。
// 保存用 URL 表示中(3セグメント)のパスを返し、URL 生成ロジックに入らない分岐にする。
vi.mock('next/navigation', () => ({
  usePathname: () => '/c/test-chart-id'
}));

import { FourPillarsPersonalInfo } from '@/app/api/FourPillarsPersonalInfo';
import { FourPillarsData } from '@/app/api/FourPillarsData';
import ChartView from './ChartView';

afterEach(cleanup);

/**
 * ChartView は命式の表示グリッド。要点（四柱が正しく出る/生時不明で時柱が消える/
 * ニックネーム表示）だけを検証し、色・ホバー・蔵干などの細部は対象外とする。
 *
 * 多数のフィールドを参照するため、result は FourPillarsData から実データ形状を生成する。
 * 基準: 2000-01-01 12:00 JST 男性（年己卯・月丙子・日戊午・時戊午）。
 */
const buildResult = (isHourUnknown: boolean, nickname: string) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-06-23T00:00:00Z'));
  const pi = new FourPillarsPersonalInfo(
    new Date('2000-01-01T03:00:00Z'),
    139.7, 35.69, -540, 9, 0,
    '1' as never, 'ja' as never,
    true, false, isHourUnknown, false, false
  );
  pi.init();
  const data = new FourPillarsData(pi);
  data.init();
  vi.useRealTimers();
  return {
    ...(data.getObject() as Record<string, unknown>),
    nickname,
    birthDateTime: '2000-01-01T03:00:00.000Z',
    timeZoneId: 'Asia/Tokyo',
    isHourUnknown
  } as never;
};

describe('ChartView', () => {
  it('時柱・日柱・月柱・年柱の列見出しを表示する', () => {
    render(<ChartView result={buildResult(false, '太郎')} />);
    for (const col of ['時柱', '日柱', '月柱', '年柱']) {
      expect(screen.getByText(col)).toBeInTheDocument();
    }
  });

  it('四柱を正しい干支のアイコン(aria-label)で表示する', () => {
    render(<ChartView result={buildResult(false, '太郎')} />);
    // 年柱=己卯, 月柱=丙子（一意なので getByRole で特定できる）
    expect(screen.getByRole('img', { name: '己' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '卯' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '丙' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '子' })).toBeInTheDocument();
    // 日柱・時柱はどちらも戊午 → 戊・午は2つずつ出る
    expect(screen.getAllByRole('img', { name: '戊' })).toHaveLength(2);
    expect(screen.getAllByRole('img', { name: '午' })).toHaveLength(2);
  });

  it('ニックネームの有無でヘッダー表記が変わる', () => {
    const { unmount } = render(<ChartView result={buildResult(false, '太郎')} />);
    expect(screen.getByText('太郎さんの命式')).toBeInTheDocument();
    unmount();
    render(<ChartView result={buildResult(false, '')} />);
    expect(screen.getByText('命式')).toBeInTheDocument();
  });

  it('生時不明の場合は時柱を描画しない', () => {
    const { container } = render(<ChartView result={buildResult(true, '')} />);
    // 「生時不明」のツールチップ付きセルになる
    expect(container.querySelector('[data-tooltip-content="生時不明"]')).not.toBeNull();
    // 時柱が消えるため、戊(日干と時干で重複していた)は1つだけになる
    expect(screen.getAllByRole('img', { name: '戊' })).toHaveLength(1);
    // 年柱・月柱は引き続き表示される
    expect(screen.getByRole('img', { name: '己' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '丙' })).toBeInTheDocument();
  });
});
