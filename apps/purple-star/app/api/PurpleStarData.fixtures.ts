import type { Gender } from 'types';

/**
 * PurpleStarData.test.ts 用のテストデータ。
 *
 * 命盤構築の入力（生年月日・地点・性別・流派など）と、その期待値（旧暦・五行局・主星配置など）を
 * まとめて定義する。テスト本体から分離することで、ケースを増やしても可読性を保つ。
 *
 * - 旧暦・干支・主星名は離散値なので安定。
 * - starPower 等の数値は実装由来の回帰検出用ゴールデン値。
 * - 期待値は信頼できる紫微斗数の計算結果を「正解」として固定する。
 */

/** 命盤構築の入力設定。 */
export type BoardConfig = {
  birth: string;
  longitude: number;
  latitude: number;
  utcOffset: number;
  dstOffset: number;
  timezoneOffset: number;
  gender: Gender;
  useSpaceMethod?: boolean;
  school?: string;
};

/** 1ケース分の入力と期待値。 */
export type BoardCase = {
  name: string;
  config: BoardConfig;
  expected: {
    chineseDate: { year: number; month: number; day: number };
    asianAge: number;
    division: string;
    isYang: boolean;
    bodyPalace: string;
    /** 命宮の検証 */
    mainPalace: {
      branch: string;
      stem: string;
      majorStars: string[];
      startingAge: number;
      starPower: number;
    };
    /** 指定した宮の主星配置 */
    palaceStars: { palace: string; majorStars: string[] }[];
    /** 大限の起運年（性別で順逆が変わるので、その差を検証したいケースで指定） */
    decadeOrder?: { palace: string; startingAge: number }[];
  };
};

/**
 * 基準サンプル: 2000-01-01 12:00 JST(=2000-01-01T03:00:00Z) 生まれ、東京、男性。
 * 多くのケースはこの BASE を使い回し、必要なフィールドだけ上書きする。
 */
export const BASE = {
  birth: '2000-01-01T03:00:00Z',
  longitude: 139.7, // 東京
  latitude: 35.69, // 東京
  utcOffset: 9,
  dstOffset: 0,
  timezoneOffset: -540, // JST
  gender: '1' as Gender,
  useSpaceMethod: true,
  school: 's'
} satisfies BoardConfig;

/**
 * 命盤まるごとの検証ケース。
 * ここに行を足せばテストケースが増える（境界例: 女性・閏月生まれ・各タイムゾーン等）。
 */
export const boardCases: BoardCase[] = [
  {
    name: '2000-01-01 12:00 JST 男性・東京（紫微在午・土五局）',
    config: { ...BASE },
    expected: {
      chineseDate: { year: 16, month: 11, day: 25 }, // 旧暦 己卯年11月25日
      asianAge: 28,
      division: '土五局',
      isYang: false, // 己は陰干
      bodyPalace: '命宮',
      mainPalace: {
        branch: '午',
        stem: '庚',
        majorStars: ['紫微星'],
        startingAge: 5, // 土五局のため命宮の起運は5歳から
        starPower: 9
      },
      palaceStars: [
        { palace: '子女宮', majorStars: ['太陽星', '天梁星'] },
        { palace: '財帛宮', majorStars: ['武曲星', '天相星'] }
      ],
      // 男命＋陰干 → 大限は逆行配置（命宮の次が兄弟宮）
      decadeOrder: [
        { palace: '兄弟宮', startingAge: 15 },
        { palace: '父母宮', startingAge: 115 }
      ]
    }
  },
  {
    // 女性ケース: 星配置は男性と同一だが、大限の順逆が反転する
    name: '2000-01-01 12:00 JST 女性・東京（大限が逆方向）',
    config: { ...BASE, gender: '0' },
    expected: {
      chineseDate: { year: 16, month: 11, day: 25 },
      asianAge: 28,
      division: '土五局',
      isYang: false,
      bodyPalace: '命宮',
      mainPalace: {
        branch: '午',
        stem: '庚',
        majorStars: ['紫微星'],
        startingAge: 5,
        starPower: 9
      },
      palaceStars: [
        { palace: '子女宮', majorStars: ['太陽星', '天梁星'] },
        { palace: '財帛宮', majorStars: ['武曲星', '天相星'] }
      ],
      // 女命＋陰干 → 大限は順行配置（命宮の次が父母宮）。男性と逆順になる。
      decadeOrder: [
        { palace: '父母宮', startingAge: 15 },
        { palace: '兄弟宮', startingAge: 115 }
      ]
    }
  },
  {
    // 閏月ケース: 閏四月27日(day>=16)生まれは翌月扱いに繰り上がる（cDate.month が 4→5）
    name: '閏月(閏四月27日) 2001-06-18 12:00 JST（翌月へ繰り上げ）',
    config: { ...BASE, birth: '2001-06-18T03:00:00Z' },
    expected: {
      // init() で翌月へ繰り上げられるため month は 5（元は閏四月=4）
      chineseDate: { year: 18, month: 5, day: 27 },
      asianAge: 26,
      division: '土五局',
      isYang: false,
      bodyPalace: '命宮',
      mainPalace: {
        branch: '子',
        stem: '庚',
        majorStars: ['武曲星', '天府星'],
        startingAge: 5,
        starPower: 10
      },
      palaceStars: [{ palace: '兄弟宮', majorStars: ['天同星'] }]
    }
  },
  {
    // 南半球＋JST以外のタイムゾーン（シドニー, UTC+10, 緯度マイナス）
    name: '南半球シドニー 2000-06-15 12:00 AEST（火六局）',
    config: {
      birth: '2000-06-15T02:00:00Z',
      longitude: 151.21,
      latitude: -33.87,
      utcOffset: 10,
      dstOffset: 0,
      timezoneOffset: -600,
      gender: '1',
      useSpaceMethod: true,
      school: 's'
    },
    expected: {
      chineseDate: { year: 17, month: 5, day: 14 }, // 旧暦 庚辰年5月14日
      asianAge: 27,
      division: '火六局',
      isYang: true, // 庚は陽干
      bodyPalace: '命宮',
      mainPalace: {
        branch: '子',
        stem: '戊',
        majorStars: ['廉貞星', '天相星'],
        startingAge: 6, // 火六局のため2+4=6歳から
        starPower: 4
      },
      palaceStars: [
        { palace: '父母宮', majorStars: ['天梁星'] },
        { palace: '福徳宮', majorStars: ['七殺星'] }
      ]
    }
  }
];
