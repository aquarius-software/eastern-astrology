// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// mock の巻き上げに合わせて ctx も先頭で初期化し、factory から参照可能にする
const ctx = vi.hoisted(() => ({
  value: {
    currentPalace: -1,
    showChildStar: false,
    showSelfChildStar: false,
    showDiagonalChildStar: false,
    showMainChildStar: false
  }
}));
// useBoardContext(Context) はトグル値を制御したいのでモックする（vi.hoisted で可変に）
vi.mock('@/context/boardContext', () => ({ useBoardContext: () => ctx.value }));

import PalaceView from './PalaceView';

const basePalace = {
  name: '命宮',
  activeName: '財帛',
  isBodyPalace: true,
  stem: '庚',
  branch: '午',
  startingAge: 5,
  endingAge: 14,
  boardPosition: 0,
  majorStars: [{ shortName: '紫微', luminosity: '廟', childStar: { shortName: '化科' } }],
  minorStars: [{ shortName: '左輔' }],
  yearlyLucks: []
};

const renderView = (
  over: { palace?: Record<string, unknown>; isActiveMode?: boolean } = {}
) =>
  render(
    <PalaceView
      palace={{ ...basePalace, ...over.palace } as never}
      mainPalacePosition={0}
      asianAge={10}
      showWithColor={true}
      isActiveMode={over.isActiveMode ?? false}
      activeStemIndex={-1}
    />
  );

beforeEach(() => {
  // 既定はすべてのトグルを off に戻す
  ctx.value = {
    currentPalace: -1,
    showChildStar: false,
    showSelfChildStar: false,
    showDiagonalChildStar: false,
    showMainChildStar: false
  };
});
afterEach(cleanup);

describe('PalaceView', () => {
  it('宮名・干支・起運年・主星(短名+輝度)・輔星を表示する', () => {
    renderView();
    expect(screen.getByText('命宮')).toBeInTheDocument();
    expect(screen.getByText('庚午')).toBeInTheDocument(); // stem + branch
    expect(screen.getByText('5〜')).toBeInTheDocument(); // startingAge
    expect(screen.getByText('紫微')).toBeInTheDocument(); // 主星短名
    expect(screen.getByText('廟')).toBeInTheDocument(); // 輝度の先頭1文字
    expect(screen.getByText('左輔')).toBeInTheDocument(); // 輔星
  });

  it('身宮には[身宮]を表示し、身宮でなければ表示しない', () => {
    const { container } = renderView();
    expect(container.textContent).toContain('[身宮]');

    cleanup();
    const { container: c2 } = renderView({ palace: { isBodyPalace: false } });
    expect(c2.textContent).not.toContain('[身宮]');
  });

  it('大限モードでは「大限+大限宮名」を表示し、宮名や[身宮]は出さない', () => {
    const { container } = renderView({ isActiveMode: true });
    expect(screen.getByText('大限財帛')).toBeInTheDocument();
    expect(screen.queryByText('命宮')).toBeNull();
    expect(container.textContent).not.toContain('[身宮]');
  });

  it('showChildStar が on のときだけ四化星(化科→科)を表示する', () => {
    // off のとき
    const { unmount } = renderView();
    expect(screen.queryByText('科')).toBeNull();
    unmount();

    // on のとき
    ctx.value = { ...ctx.value, showChildStar: true };
    renderView();
    expect(screen.getByText('科')).toBeInTheDocument(); // childStar.shortName.charAt(1)
  });
});
