import { describe, it, expect } from 'vitest';
import { getItemsFromArrayCycle, makePairs } from './array';

describe('getItemsFromArrayCycle', () => {
  it('正順で指定位置から指定個数を取得する', () => {
    expect(getItemsFromArrayCycle([10, 20, 30, 40, 50], 1, 2, true)).toEqual([20, 30]);
  });

  it('正順で末尾を超えたら先頭から循環する', () => {
    // index3(=4)から4個 → [4,5] のあと先頭へ循環して [1,2]
    expect(getItemsFromArrayCycle([1, 2, 3, 4, 5], 3, 4, true)).toEqual([4, 5, 1, 2]);
  });

  it('逆順で指定位置から逆向きに取得する', () => {
    // index3(=4)から逆順に3個 → [4,3,2]
    expect(getItemsFromArrayCycle([1, 2, 3, 4, 5], 3, 3, false)).toEqual([4, 3, 2]);
  });

  it('逆順でも先頭(末尾)を超えたら循環する', () => {
    // index0(=1)から逆順に3個 → [1] のあと循環して [5,4]
    expect(getItemsFromArrayCycle([1, 2, 3, 4, 5], 0, 3, false)).toEqual([1, 5, 4]);
  });

  it('個数が0以下の場合は空配列を返す', () => {
    expect(getItemsFromArrayCycle([1, 2, 3], 0, 0, true)).toEqual([]);
    expect(getItemsFromArrayCycle([1, 2, 3], 0, -1, true)).toEqual([]);
  });

  it('元の配列を変更しない', () => {
    const original = [1, 2, 3, 4, 5];
    getItemsFromArrayCycle(original, 1, 2, false);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('makePairs', () => {
  it('隣同士をペアにした二次元配列を作成する', () => {
    expect(makePairs([1, 2, 3, 4])).toEqual([
      [1, 2],
      [2, 3],
      [3, 4]
    ]);
  });

  it('要素が1つの場合はペアができず空配列を返す', () => {
    expect(makePairs([1])).toEqual([]);
  });

  it('空配列を渡すと空配列を返す', () => {
    expect(makePairs([])).toEqual([]);
  });
});
