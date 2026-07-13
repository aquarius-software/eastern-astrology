// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BranchIcon } from './BranchIcon';

afterEach(cleanup);

describe('BranchIcon', () => {
  it('index に対応する地支を aria-label に持つ SVG を描画する', () => {
    // 1番目の地支は子
    render(<BranchIcon index={1} />);
    expect(screen.getByRole('img', { name: '子' })).toBeInTheDocument();
  });

  it('index が変われば描画される地支も変わる', () => {
    // 7番目の地支は午
    render(<BranchIcon index={7} />);
    expect(screen.getByRole('img', { name: '午' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: '子' })).toBeNull();
  });

  it('index が undefined の場合は何も描画しない', () => {
    const { container } = render(<BranchIcon index={undefined} />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('svg')).toBeNull();
  });
});
