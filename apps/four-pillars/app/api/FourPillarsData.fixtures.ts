import type { Gender } from 'types';

/**
 * FourPillarsData.test.ts 用のテストデータ。
 *
 * 命式構築の入力（生年月日・地点・性別など）と、その期待値（四柱・節気・行運・五行）を
 * まとめて定義する。テスト本体から分離することで、ケースを増やしてもテストの可読性を保つ。
 *
 * - 干支は離散値なので安定。
 * - 五行構成・寒暖・燥湿は実装由来の回帰検出用ゴールデン値（小数2桁で比較）。
 * - 期待値は信頼できる四柱推命の計算結果を「正解」として固定する。
 */

/** 命式構築の入力設定。生年月日(UTC ISO)・地点・性別などを表す。 */
export type ChartConfig = {
  birth: string;
  longitude: number;
  latitude: number;
  timezoneOffset: number;
  utcOffset: number;
  gender: Gender;
  useSpaceMethod?: boolean;
  isHourUnknown?: boolean;
  changeDayStem?: boolean;
};

/** 1ケース分の入力と期待値。 */
export type ChartCase = {
  name: string;
  config: ChartConfig;
  expected: {
    year: string;
    month: string;
    day: string;
    hour: string;
    solarTerm: string;
    luckOrder: boolean;
    elementComposition: number[];
    temperature: number;
    humidity: number;
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
  timezoneOffset: -540, // JST
  utcOffset: 9,
  gender: '1' as Gender
} satisfies ChartConfig;

/**
 * 命式まるごとの検証ケース。
 * ここに行を足せばテストケースが増える（境界例を中心に拡充していく）。
 */
export const chartCases: ChartCase[] = [
  {
    name: '2000-01-01 12:00 JST 男性・東京（定気法）',
    config: { ...BASE },
    expected: {
      year: '己卯', // 立春前のため前年(1999)に補正
      month: '丙子',
      day: '戊午',
      hour: '戊午',
      solarTerm: '冬至',
      luckOrder: false, // 男命＋陰干(己) → 逆運
      elementComposition: [1, 2.2, 3.8, 0, 3], // [木,火,土,金,水]（月支は3倍）
      temperature: 0.48,
      humidity: 0.45
    }
  },
  {
    // 立春直前: 太陽黄経315度未満のため年柱は前年(己卯)のまま
    name: '立春直前 2000-02-03 12:00 JST',
    config: { ...BASE, birth: '2000-02-03T03:00:00Z' },
    expected: {
      year: '己卯',
      month: '丁丑',
      day: '辛卯',
      hour: '甲午',
      solarTerm: '大寒',
      luckOrder: false,
      elementComposition: [3, 1.6, 2.3, 1.3, 1.8],
      temperature: 0.42,
      humidity: 0.59
    }
  },
  {
    // 立春直後: 年柱が翌年(庚辰)に切り替わる境界
    name: '立春直後 2000-02-05 12:00 JST',
    config: { ...BASE, birth: '2000-02-05T03:00:00Z' },
    expected: {
      year: '庚辰',
      month: '戊寅',
      day: '癸巳',
      hour: '戊午',
      solarTerm: '立春',
      luckOrder: true,
      elementComposition: [2.1, 2, 3.5, 1.2, 1.2],
      temperature: 0.42,
      humidity: 0.44
    }
  },
  {
    // 節入り付近（雨水〜啓蟄の境目あたり）
    name: '節入りの境目 2000-03-05 12:00 JST',
    config: { ...BASE, birth: '2000-03-05T03:00:00Z' },
    expected: {
      year: '庚辰',
      month: '戊寅',
      day: '壬戌',
      hour: '丙午',
      solarTerm: '雨水',
      luckOrder: true,
      elementComposition: [2.1, 2.6, 2.9, 1.2, 1.2],
      temperature: 0.41,
      humidity: 0.45
    }
  },
  {
    // 23時台（子の刻）: 時柱は甲子、日柱は当日のまま（changeDayStem=false）
    name: '23時台 2000-01-01 23:30 JST（日付据え置き）',
    config: { ...BASE, birth: '2000-01-01T14:30:00Z' },
    expected: {
      year: '己卯',
      month: '丙子',
      day: '戊午',
      hour: '甲子',
      solarTerm: '冬至',
      luckOrder: false,
      elementComposition: [2, 1.6, 2.4, 0, 6],
      temperature: 0.44,
      humidity: 0.7
    }
  },
  {
    // 23時台＋changeDayStem=true: 日柱が翌日(己未)に切り替わる
    name: '23時台 2000-01-01 23:30 JST（日付繰り上げ）',
    config: { ...BASE, birth: '2000-01-01T14:30:00Z', changeDayStem: true },
    expected: {
      year: '己卯',
      month: '丙子',
      day: '己未',
      hour: '甲子',
      solarTerm: '冬至',
      luckOrder: false,
      elementComposition: [2.1, 1.4, 2.5, 0, 6],
      temperature: 0.44,
      humidity: 0.76
    }
  },
  {
    // 旧暦のうるう月（2001年は閏四月）を含む時期
    name: 'うるう月(閏四月)を含む 2001-05-20 12:00 JST',
    config: { ...BASE, birth: '2001-05-20T03:00:00Z' },
    expected: {
      year: '辛巳',
      month: '癸巳',
      day: '癸未',
      hour: '戊午',
      solarTerm: '立夏',
      luckOrder: false,
      elementComposition: [0.1, 2, 2.5, 1.4, 2],
      temperature: 0.44,
      humidity: 0.32
    }
  },
  {
    // 明治改暦(1873年)以前の生年月日
    name: '明治以前 1850-06-15 12:00 JST',
    config: { ...BASE, birth: '1850-06-15T03:00:00Z' },
    expected: {
      year: '庚戌',
      month: '壬午',
      day: '丁酉',
      hour: '丙午',
      solarTerm: '芒種',
      luckOrder: true,
      elementComposition: [0, 5.7, 3.1, 2.2, 1],
      temperature: 0.83,
      humidity: 0.34
    }
  },
  {
    // 南半球＋JST以外のタイムゾーン（シドニー, UTC+10, 緯度マイナス）
    name: '南半球シドニー 2000-06-15 12:00 AEST',
    config: {
      birth: '2000-06-15T02:00:00Z',
      longitude: 151.21,
      latitude: -33.87,
      timezoneOffset: -600,
      utcOffset: 10,
      gender: '1'
    },
    expected: {
      year: '庚辰',
      month: '壬午',
      day: '甲辰',
      hour: '庚午',
      solarTerm: '芒種',
      luckOrder: true,
      elementComposition: [1.6, 3.6, 3.4, 2, 1.4],
      temperature: 0.78,
      humidity: 0.45
    }
  }
];
