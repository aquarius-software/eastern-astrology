import { describe, it, expect } from 'vitest';
import type { Star, PalaceName, Stem, Branch, BranchIndex } from 'types';
import { Palace } from './Palace';

/** strength だけを持つ最小の Star を生成するヘルパー */
const star = (strength: number): Star =>
  ({ name: '紫微星', shortName: '紫', strength } as Star);

/** テスト用の Palace を生成（命宮・甲・子） */
const makePalace = () =>
  new Palace(
    '命宮' as PalaceName,
    '甲' as Stem,
    0,
    '子' as Branch,
    true, // isMainPalace
    false, // isBodyPalace
    0 as BranchIndex
  );

describe('Palace', () => {
  describe('constructor', () => {
    it('コンストラクタ引数を各プロパティに設定する', () => {
      const palace = makePalace();
      expect(palace.name).toBe('命宮');
      expect(palace.stem).toBe('甲');
      expect(palace.stemIndex).toBe(0);
      expect(palace.branch).toBe('子');
      expect(palace.isMainPalace).toBe(true);
      expect(palace.isBodyPalace).toBe(false);
      expect(palace.boardPosition).toBe(0);
    });

    it('星・年運の配列は空で初期化される', () => {
      const palace = makePalace();
      expect(palace.majorStars).toEqual([]);
      expect(palace.minorStars).toEqual([]);
      expect(palace.yearlyLucks).toEqual([]);
    });
  });

  describe('calculateStarPower', () => {
    it('星が無い場合は 0 になる', () => {
      const palace = makePalace();
      palace.calculateStarPower();
      expect(palace.starPower).toBe(0);
    });

    it('主星の強さの合計を算出する', () => {
      const palace = makePalace();
      palace.majorStars = [star(10), star(5)];
      palace.calculateStarPower();
      expect(palace.starPower).toBe(15);
    });

    it('輔星の強さの合計を算出する', () => {
      const palace = makePalace();
      palace.minorStars = [star(3), star(2)];
      palace.calculateStarPower();
      expect(palace.starPower).toBe(5);
    });

    it('主星と輔星の強さを合算する', () => {
      const palace = makePalace();
      palace.majorStars = [star(10), star(5)];
      palace.minorStars = [star(3), star(2)];
      palace.calculateStarPower();
      expect(palace.starPower).toBe(20);
    });

    it('負の強さ(弱化)も合算できる', () => {
      const palace = makePalace();
      palace.majorStars = [star(10)];
      palace.minorStars = [star(-4)];
      palace.calculateStarPower();
      expect(palace.starPower).toBe(6);
    });
  });
});
