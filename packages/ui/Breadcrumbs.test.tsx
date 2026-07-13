// @vitest-environment jsdom
// ↑ このファイルだけ仮想DOM(jsdom)で実行する
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import BreadCrumb from './Breadcrumbs';

afterEach(cleanup);

describe('BreadCrumb', () => {
  it('先頭に「ホーム」、続けて渡した項目のラベルを表示する', () => {
    render(
      <BreadCrumb
        items={[
          { label: '四柱推命', path: '/chart' },
          { label: '結果', path: '/chart/result' }
        ]}
      />
    );
    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('四柱推命')).toBeInTheDocument();
    expect(screen.getByText('結果')).toBeInTheDocument();
  });

  it('各項目の path がリンクの href になる', () => {
    render(
      <BreadCrumb
        items={[
          { label: '四柱推命', path: '/chart' },
          { label: '結果', path: '/chart/result' }
        ]}
      />
    );
    // 「ホーム」は常にルート(/)へのリンク
    expect(screen.getByRole('link', { name: 'ホーム' })).toHaveAttribute('href', '/');
    // 中間項目は path がそのまま href になる
    expect(screen.getByRole('link', { name: '四柱推命' })).toHaveAttribute('href', '/chart');
  });

  it('最終項目(現在ページ)は実リンク(a要素)にはならない', () => {
    const { container } = render(
      <BreadCrumb
        items={[
          { label: '四柱推命', path: '/chart' },
          { label: '結果', path: '/chart/result' }
        ]}
      />
    );
    // 実際にナビゲーション可能な <a href> は「ホーム」と「四柱推命」だけ
    const anchorTexts = Array.from(container.querySelectorAll('a[href]')).map(a => a.textContent);
    expect(anchorTexts).toEqual(['ホーム', '四柱推命']);
    // 「結果」はテキストとして存在するが <a> ではない（現在ページ表示）
    expect(screen.getByText('結果')).toBeInTheDocument();
    expect(screen.getByText('結果').closest('a')).toBeNull();
  });

  it('items が空でも「ホーム」を表示する', () => {
    render(<BreadCrumb items={[]} />);
    expect(screen.getByText('ホーム')).toBeInTheDocument();
  });
});
