// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { TableOfContents } from './TableOfContents';

afterEach(cleanup);

// 見出しツリー（本論の下に詳細1がネストする）
const outline = [
  { id: 'intro', text: 'はじめに', subheadings: [] },
  {
    id: 'main',
    text: '本論',
    subheadings: [{ id: 'main-1', text: '詳細1', subheadings: [] }]
  }
];

describe('TableOfContents', () => {
  it('各見出しを #id へのアンカーリンクとして描画する', () => {
    render(<TableOfContents outline={outline} />);
    expect(screen.getByRole('link', { name: 'はじめに' })).toHaveAttribute('href', '#intro');
    expect(screen.getByRole('link', { name: '本論' })).toHaveAttribute('href', '#main');
  });

  it('subheadings を再帰的にネスト描画する', () => {
    render(<TableOfContents outline={outline} />);
    // ネストした子見出しもリンクとして描画される（再帰の検証）
    expect(screen.getByRole('link', { name: '詳細1' })).toHaveAttribute('href', '#main-1');
    // 「詳細1」は「本論」の <li> 配下の入れ子 <ol> の中にある
    const nested = screen.getByRole('link', { name: '詳細1' }).closest('ol');
    expect(nested?.closest('li')).toContainElement(screen.getByRole('link', { name: '本論' }));
  });

  it('outline が空なら項目を描画しない', () => {
    const { container } = render(<TableOfContents outline={[]} />);
    expect(container.querySelector('ol')).toBeInTheDocument(); // <ol> 自体は存在
    expect(screen.queryByRole('link')).toBeNull(); // リンクは無い
  });

  it('subheadings が空の見出しは入れ子の目次を持たない', () => {
    render(<TableOfContents outline={[{ id: 'only', text: '単独', subheadings: [] }]} />);
    // トップの <ol> ひとつだけ（入れ子の <ol> は生成されない）
    expect(screen.getAllByRole('list')).toHaveLength(1);
  });
});
