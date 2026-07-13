// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { StemIcon } from './StemIcon';

afterEach(cleanup);

describe('StemIcon', () => {
  it('index に対応する天干を aria-label に持つ SVG を描画する', () => {
    // 1番目の天干は甲
    render(<StemIcon index={1} />);
    expect(screen.getByRole('img', { name: '甲' })).toBeInTheDocument();
  });

  it('index が変われば描画される天干も変わる', () => {
    // 7番目の天干は庚
    render(<StemIcon index={7} />);
    expect(screen.getByRole('img', { name: '庚' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: '甲' })).toBeNull();
  });

  it('index が undefined の場合は何も描画しない', () => {
    const { container } = render(<StemIcon index={undefined} />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('svg')).toBeNull();
  });
});
