import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PurpleStarPersonalInfo } from './PurpleStarPersonalInfo';
import { PurpleStarData } from './PurpleStarData';
import { BASE, boardCases, type BoardConfig } from './PurpleStarData.fixtures';

/**
 * 命盤の構築は内部で数え年(calculateAsianAge)や現在年の斗君計算に new Date() を使うため、
 * システム時刻を固定して決定論的にする。
 *
 * テストデータ（BASE / boardCases）は ./PurpleStarData.fixtures.ts に分離している。
 * 新しい命盤ケースを増やす場合はそちらの boardCases に行を追加する。
 */
describe('PurpleStarData (統合テスト)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-23T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** 入力設定から init 済みの命盤を生成する。 */
  const buildBoard = async (cfg: BoardConfig) => {
    const personalInfo = new PurpleStarPersonalInfo(
      new Date(cfg.birth),
      cfg.longitude,
      cfg.latitude,
      cfg.utcOffset,
      cfg.dstOffset,
      cfg.timezoneOffset,
      cfg.gender,
      'ja' as never,
      cfg.useSpaceMethod ?? true,
      cfg.school ?? 's'
    );
    await personalInfo.init();
    const data = new PurpleStarData(personalInfo);
    data.init();
    return { personalInfo, data, obj: data.getObject() as Record<string, any> };
  };

  /** 宮名で宮オブジェクトを引く */
  const palaceByName = (obj: Record<string, any>, name: string) =>
    obj.palaces.find((p: any) => p.name === name);

  // ---- 命盤まるごとの検証（ケースは fixtures の boardCases で管理） ----

  it.each(boardCases)(
    '$name の旧暦・五行局・主星配置・大限を算出する',
    async ({ config, expected }) => {
      const { personalInfo, obj } = await buildBoard(config);

      // 旧暦・数え年
      expect(personalInfo.chineseDate.year).toBe(expected.chineseDate.year);
      expect(personalInfo.chineseDate.month).toBe(expected.chineseDate.month);
      expect(personalInfo.chineseDate.day).toBe(expected.chineseDate.day);
      expect(personalInfo.asianAge).toBe(expected.asianAge);

      // 五行局・陰陽・身宮
      expect(obj.division).toBe(expected.division);
      expect(obj.isYang).toBe(expected.isYang);
      expect(obj.bodyPalace).toBe(expected.bodyPalace);

      // 十二宮
      expect(obj.palaces).toHaveLength(12);

      // 命宮
      const main = palaceByName(obj, '命宮');
      expect(main.branch).toBe(expected.mainPalace.branch);
      expect(main.stem).toBe(expected.mainPalace.stem);
      expect(main.isMainPalace).toBe(true);
      expect(main.majorStars.map((s: any) => s.name)).toEqual(expected.mainPalace.majorStars);
      expect(main.startingAge).toBe(expected.mainPalace.startingAge);
      expect(main.starPower).toBe(expected.mainPalace.starPower);

      // 指定した宮の主星配置
      for (const { palace, majorStars } of expected.palaceStars) {
        expect(palaceByName(obj, palace).majorStars.map((s: any) => s.name)).toEqual(majorStars);
      }

      // 大限の起運年（性別で順逆が変わるケースで検証）
      if (expected.decadeOrder) {
        for (const { palace, startingAge } of expected.decadeOrder) {
          expect(palaceByName(obj, palace).startingAge).toBe(startingAge);
        }
      }

      // 宮は大限順にソートされている
      const startingAges = obj.palaces.map((p: any) => p.startingAge);
      expect(startingAges).toEqual([...startingAges].sort((a, b) => a - b));
    }
  );

  // ---- 構造的な不変条件（ケースに依存しない） ----

  it('getObject() は命盤の主要情報を含む', async () => {
    const { obj } = await buildBoard({ ...BASE });
    expect(obj).toHaveProperty('division');
    expect(obj).toHaveProperty('palaces');
    expect(obj).toHaveProperty('bodyPalace');
    expect(obj).toHaveProperty('currentDecadePalaceName');
  });
});
