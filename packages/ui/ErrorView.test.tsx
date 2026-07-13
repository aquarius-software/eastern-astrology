// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ErrorView from './ErrorView';

afterEach(cleanup);

describe('ErrorView', () => {
  it('見出し「エラー」を表示する', () => {
    render(<ErrorView message="エラーが発生しました" />);
    expect(screen.getByRole('heading', { name: 'エラー' })).toBeInTheDocument();
  });

  it('渡した message をそのまま表示する', () => {
    render(<ErrorView message="不正な日付です" />);
    expect(screen.getByText('不正な日付です')).toBeInTheDocument();
  });

  it('message プロップが変われば表示も変わる', () => {
    render(<ErrorView message="緯度が範囲外です" />);
    expect(screen.getByText('緯度が範囲外です')).toBeInTheDocument();
    expect(screen.queryByText('不正な日付です')).toBeNull();
  });

  it('「ホームに戻る」リンクがルート(/)を指す', () => {
    render(<ErrorView message="エラー" />);
    expect(screen.getByRole('link', { name: 'ホームに戻る' })).toHaveAttribute('href', '/');
  });
});
