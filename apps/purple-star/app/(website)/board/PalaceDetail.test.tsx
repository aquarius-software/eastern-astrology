// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import PalaceDetail from './PalaceDetail';

afterEach(cleanup);

/**
 * PalaceDetail は palaces(十二宮) を props で受け取り、内部 state で選択中の宮を
 * 「前の宮 / 次の宮」ボタンで切り替えて詳細表示する。
 * 先頭(命宮)は主星に四化(childStar)を持つ例、残り11宮はナビゲーション確認用。
 */
const richPalace = {
  name: '命宮',
  stem: '庚',
  branch: '午',
  startingAge: 5,
  endingAge: 14,
  yearlyLucks: [{ age: 3 }, { age: 15 }, { age: 27 }],
  majorStars: [{ shortName: '紫微', luminosity: '廟', childStar: { shortName: '化科' } }],
  minorStars: [{ shortName: '左輔', luminosity: '平' }] // childStar なし
};

const buildPalaces = () =>
  [
    richPalace,
    ...Array.from({ length: 11 }, (_, i) => ({
      name: `宮${i + 1}`,
      stem: '甲',
      branch: '子',
      startingAge: (i + 1) * 10 + 5,
      endingAge: (i + 1) * 10 + 14,
      yearlyLucks: [{ age: i + 2 }],
      majorStars: [],
      minorStars: []
    }))
  ] as never;

/** 行ラベルから値セルのテキストを取得 */
const valueOf = (label: string) =>
  screen.getByText(label).closest('tr')!.querySelector('.table-cell-content')!.textContent?.trim();

describe('PalaceDetail', () => {
  it('初期表示として先頭の宮(命宮)の詳細を整形して表示する', () => {
    render(<PalaceDetail palaces={buildPalaces()} />);
    expect(screen.getByText('命宮詳細')).toBeInTheDocument();
    expect(valueOf('宮名称')).toBe('命宮');
    expect(valueOf('干支')).toBe('庚午'); // stem + branch
    expect(valueOf('大限')).toBe('5〜14歳'); // startingAge〜endingAge
    expect(valueOf('小限')).toBe('3, 15, 27歳'); // 年齢を ", " 連結、末尾に「歳」
  });

  it('主星・副星を「短名+輝度(+四化)」で表示する', () => {
    render(<PalaceDetail palaces={buildPalaces()} />);
    expect(valueOf('主星')).toBe('紫微廟化科'); // 四化(childStar) 付き
    expect(valueOf('副星')).toBe('左輔平'); // 四化なし
  });

  it('「次の宮」で次の宮へ切り替わる', () => {
    render(<PalaceDetail palaces={buildPalaces()} />);
    fireEvent.click(screen.getByRole('button', { name: '次の宮' }));
    expect(valueOf('宮名称')).toBe('宮1');
  });

  it('先頭の宮で「前の宮」を押すと末尾の宮へ循環する', () => {
    render(<PalaceDetail palaces={buildPalaces()} />);
    // index 0 から「前の宮」→ 11 へラップ
    fireEvent.click(screen.getByRole('button', { name: '前の宮' }));
    expect(valueOf('宮名称')).toBe('宮11');
  });
});
