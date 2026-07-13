import type {
  SexagenaryCycle,
  Prefecture,
  TimeZone,
  SolarTerm,
  Branch
} from 'types';

/**
 * 地支（簡易バージョン）
 *
 * @type {Branch[]}
 */
export const BRANCHES_MINI: Branch[] = [
  '子',
  '丑',
  '寅',
  '卯',
  '辰',
  '巳',
  '午',
  '未',
  '申',
  '酉',
  '戌',
  '亥'
];

/**
 * 六十干支
 *
 * @type {SexagenaryCycle[]}
 */
export const SEXAGENARY_CYCLE: SexagenaryCycle[] = [
  { index: 1, stem: '甲', branch: '子', emptyElements: ['戌', '亥'] },
  { index: 2, stem: '乙', branch: '丑', emptyElements: ['戌', '亥'] },
  { index: 3, stem: '丙', branch: '寅', emptyElements: ['戌', '亥'] },
  { index: 4, stem: '丁', branch: '卯', emptyElements: ['戌', '亥'] },
  { index: 5, stem: '戊', branch: '辰', emptyElements: ['戌', '亥'] },
  { index: 6, stem: '己', branch: '巳', emptyElements: ['戌', '亥'] },
  { index: 7, stem: '庚', branch: '午', emptyElements: ['戌', '亥'] },
  { index: 8, stem: '辛', branch: '未', emptyElements: ['戌', '亥'] },
  { index: 9, stem: '壬', branch: '申', emptyElements: ['戌', '亥'] },
  { index: 10, stem: '癸', branch: '酉', emptyElements: ['戌', '亥'] },
  { index: 11, stem: '甲', branch: '戌', emptyElements: ['申', '酉'] },
  { index: 12, stem: '乙', branch: '亥', emptyElements: ['申', '酉'] },
  { index: 13, stem: '丙', branch: '子', emptyElements: ['申', '酉'] },
  { index: 14, stem: '丁', branch: '丑', emptyElements: ['申', '酉'] },
  { index: 15, stem: '戊', branch: '寅', emptyElements: ['申', '酉'] },
  { index: 16, stem: '己', branch: '卯', emptyElements: ['申', '酉'] },
  { index: 17, stem: '庚', branch: '辰', emptyElements: ['申', '酉'] },
  { index: 18, stem: '辛', branch: '巳', emptyElements: ['申', '酉'] },
  { index: 19, stem: '壬', branch: '午', emptyElements: ['申', '酉'] },
  { index: 20, stem: '癸', branch: '未', emptyElements: ['申', '酉'] },
  { index: 21, stem: '甲', branch: '申', emptyElements: ['午', '未'] },
  { index: 22, stem: '乙', branch: '酉', emptyElements: ['午', '未'] },
  { index: 23, stem: '丙', branch: '戌', emptyElements: ['午', '未'] },
  { index: 24, stem: '丁', branch: '亥', emptyElements: ['午', '未'] },
  { index: 25, stem: '戊', branch: '子', emptyElements: ['午', '未'] },
  { index: 26, stem: '己', branch: '丑', emptyElements: ['午', '未'] },
  { index: 27, stem: '庚', branch: '寅', emptyElements: ['午', '未'] },
  { index: 28, stem: '辛', branch: '卯', emptyElements: ['午', '未'] },
  { index: 29, stem: '壬', branch: '辰', emptyElements: ['午', '未'] },
  { index: 30, stem: '癸', branch: '巳', emptyElements: ['午', '未'] },
  { index: 31, stem: '甲', branch: '午', emptyElements: ['辰', '巳'] },
  { index: 32, stem: '乙', branch: '未', emptyElements: ['辰', '巳'] },
  { index: 33, stem: '丙', branch: '申', emptyElements: ['辰', '巳'] },
  { index: 34, stem: '丁', branch: '酉', emptyElements: ['辰', '巳'] },
  { index: 35, stem: '戊', branch: '戌', emptyElements: ['辰', '巳'] },
  { index: 36, stem: '己', branch: '亥', emptyElements: ['辰', '巳'] },
  { index: 37, stem: '庚', branch: '子', emptyElements: ['辰', '巳'] },
  { index: 38, stem: '辛', branch: '丑', emptyElements: ['辰', '巳'] },
  { index: 39, stem: '壬', branch: '寅', emptyElements: ['辰', '巳'] },
  { index: 40, stem: '癸', branch: '卯', emptyElements: ['辰', '巳'] },
  { index: 41, stem: '甲', branch: '辰', emptyElements: ['寅', '卯'] },
  { index: 42, stem: '乙', branch: '巳', emptyElements: ['寅', '卯'] },
  { index: 43, stem: '丙', branch: '午', emptyElements: ['寅', '卯'] },
  { index: 44, stem: '丁', branch: '未', emptyElements: ['寅', '卯'] },
  { index: 45, stem: '戊', branch: '申', emptyElements: ['寅', '卯'] },
  { index: 46, stem: '己', branch: '酉', emptyElements: ['寅', '卯'] },
  { index: 47, stem: '庚', branch: '戌', emptyElements: ['寅', '卯'] },
  { index: 48, stem: '辛', branch: '亥', emptyElements: ['寅', '卯'] },
  { index: 49, stem: '壬', branch: '子', emptyElements: ['寅', '卯'] },
  { index: 50, stem: '癸', branch: '丑', emptyElements: ['寅', '卯'] },
  { index: 51, stem: '甲', branch: '寅', emptyElements: ['子', '丑'] },
  { index: 52, stem: '乙', branch: '卯', emptyElements: ['子', '丑'] },
  { index: 53, stem: '丙', branch: '辰', emptyElements: ['子', '丑'] },
  { index: 54, stem: '丁', branch: '巳', emptyElements: ['子', '丑'] },
  { index: 55, stem: '戊', branch: '午', emptyElements: ['子', '丑'] },
  { index: 56, stem: '己', branch: '未', emptyElements: ['子', '丑'] },
  { index: 57, stem: '庚', branch: '申', emptyElements: ['子', '丑'] },
  { index: 58, stem: '辛', branch: '酉', emptyElements: ['子', '丑'] },
  { index: 59, stem: '壬', branch: '戌', emptyElements: ['子', '丑'] },
  { index: 60, stem: '癸', branch: '亥', emptyElements: ['子', '丑'] }
];

/**
 * 都道府県データ
 *
 * @type {Prefecture[]}
 */
export const prefectures: Prefecture[] = [
  {
    name: '北海道',
    city: '札幌市',
    code: 1,
    latitude: 43.0617713,
    longitude: 141.3544506
  },
  {
    name: '青森県',
    city: '青森市',
    code: 2,
    latitude: 40.8222197,
    longitude: 140.7473524
  },
  {
    name: '岩手県',
    city: '盛岡市',
    code: 3,
    latitude: 39.7019558,
    longitude: 141.1543303
  },
  {
    name: '宮城県',
    city: '仙台市',
    code: 4,
    latitude: 38.268195,
    longitude: 140.869418
  },
  {
    name: '秋田県',
    city: '秋田市',
    code: 5,
    latitude: 39.7199668,
    longitude: 140.1034795
  },
  {
    name: '山形県',
    city: '山形市',
    code: 6,
    latitude: 0,
    longitude: 0
  },
  {
    name: '福島県',
    city: '福島市',
    code: 7,
    latitude: 38.2554153,
    longitude: 140.3396175
  },
  {
    name: '茨城県',
    city: '水戸市',
    code: 8,
    latitude: 36.3658764,
    longitude: 140.4713723
  },
  {
    name: '栃木県',
    city: '宇都宮市',
    code: 9,
    latitude: 36.5550745,
    longitude: 139.8826209
  },
  {
    name: '群馬県',
    city: '前橋市',
    code: 10,
    latitude: 36.3894669,
    longitude: 139.0634134
  },
  {
    name: '埼玉県',
    city: 'さいたま市',
    code: 11,
    latitude: 35.8616486,
    longitude: 139.6454782
  },
  {
    name: '千葉県',
    city: '千葉市',
    code: 12,
    latitude: 35.6074041,
    longitude: 140.1065366
  },
  {
    name: '東京都',
    city: '新宿区',
    code: 13,
    latitude: 35.6938253,
    longitude: 139.7033559
  },
  {
    name: '神奈川県',
    city: '横浜市',
    code: 14,
    latitude: 35.4436739,
    longitude: 139.6379639
  },
  {
    name: '新潟県',
    city: '新潟市',
    code: 15,
    latitude: 37.9161244,
    longitude: 139.0363708
  },
  {
    name: '富山県',
    city: '富山市',
    code: 16,
    latitude: 36.6958223,
    longitude: 137.2137211
  },
  {
    name: '石川県',
    city: '金沢市',
    code: 17,
    latitude: 36.5610309,
    longitude: 136.6566475
  },
  {
    name: '福井県',
    city: '福井市',
    code: 18,
    latitude: 36.0641386,
    longitude: 136.219623
  },
  {
    name: '山梨県',
    city: '甲府市',
    code: 19,
    latitude: 35.662133,
    longitude: 138.5683001
  },
  {
    name: '長野県',
    city: '長野市',
    code: 20,
    latitude: 36.6485258,
    longitude: 138.1950371
  },
  {
    name: '岐阜県',
    city: '岐阜市',
    code: 21,
    latitude: 35.42342259999999,
    longitude: 136.7606217
  },
  {
    name: '静岡県',
    city: '静岡市',
    code: 22,
    latitude: 34.9755668,
    longitude: 138.3826773
  },
  {
    name: '愛知県',
    city: '名古屋市',
    code: 23,
    latitude: 35.18145060000001,
    longitude: 136.9065571
  },
  {
    name: '三重県',
    city: '津市',
    code: 24,
    latitude: 34.7186389,
    longitude: 136.5052256
  },
  {
    name: '滋賀県',
    city: '大津市',
    code: 25,
    latitude: 35.0178371,
    longitude: 135.8552084
  },
  {
    name: '京都府',
    city: '京都市',
    code: 26,
    latitude: 35.011564,
    longitude: 135.7681489
  },
  {
    name: '大阪府',
    city: '大阪市',
    code: 27,
    latitude: 34.6937249,
    longitude: 135.5022535
  },
  {
    name: '兵庫県',
    city: '神戸市',
    code: 28,
    latitude: 34.6900806,
    longitude: 135.1956311
  },
  {
    name: '奈良県',
    city: '奈良市',
    code: 29,
    latitude: 34.685109,
    longitude: 135.8048019
  },
  {
    name: '和歌山県',
    city: '和歌山市',
    code: 30,
    latitude: 34.2303678,
    longitude: 135.1707405
  },
  {
    name: '鳥取県',
    city: '鳥取市',
    code: 31,
    latitude: 35.5011082,
    longitude: 134.2351011
  },
  {
    name: '島根県',
    city: '松江市',
    code: 32,
    latitude: 35.4681908,
    longitude: 133.0484055
  },
  {
    name: '岡山県',
    city: '岡山市',
    code: 33,
    latitude: 34.6555312,
    longitude: 133.919795
  },
  {
    name: '広島県',
    city: '広島市',
    code: 34,
    latitude: 34.3852894,
    longitude: 132.4553055
  },
  {
    name: '山口県',
    city: '山口市',
    code: 35,
    latitude: 34.1782945,
    longitude: 131.4738432
  },
  {
    name: '徳島県',
    city: '徳島市',
    code: 36,
    latitude: 34.0703652,
    longitude: 134.5549537
  },
  {
    name: '香川県',
    city: '高松市',
    code: 37,
    latitude: 34.342542,
    longitude: 134.0465405
  },
  {
    name: '愛媛県',
    city: '松山市',
    code: 38,
    latitude: 33.8393515,
    longitude: 132.7653057
  },
  {
    name: '高知県',
    city: '高知市',
    code: 39,
    latitude: 33.5588821,
    longitude: 133.5312383
  },
  {
    name: '福岡県',
    city: '福岡市',
    code: 40,
    latitude: 33.5901838,
    longitude: 130.4016888
  },
  {
    name: '佐賀県',
    city: '佐賀市',
    code: 41,
    latitude: 33.2631179,
    longitude: 130.3009057
  },
  {
    name: '長崎県',
    city: '長崎市',
    code: 42,
    latitude: 32.7503334,
    longitude: 129.8778888
  },
  {
    name: '熊本県',
    city: '熊本市',
    code: 43,
    latitude: 32.8032164,
    longitude: 130.7079369
  },
  {
    name: '大分県',
    city: '大分市',
    code: 44,
    latitude: 33.2396084,
    longitude: 131.6095148
  },
  {
    name: '宮崎県',
    city: '宮崎市',
    code: 45,
    latitude: 31.9077285,
    longitude: 131.4202196
  },
  {
    name: '鹿児島県',
    city: '鹿児島市',
    code: 46,
    latitude: 31.5968539,
    longitude: 130.5571392
  },
  {
    name: '沖縄県',
    city: '那覇市',
    code: 47,
    latitude: 26.2125758,
    longitude: 127.6790208
  }
];

/**
 * 日本標準時のタイムゾーン
 *
 * @type {Prefecture[]}
 */
export const JAPANESE_TIME: TimeZone = {
  dstOffset: 0,
  rawOffset: 32400,
  status: 'OK',
  timeZoneId: 'Asia/Tokyo',
  timeZoneName: '日本標準時'
};

/**
 * 日本サマータイム時のタイムゾーン
 *
 * @type {Prefecture[]}
 */
export const JAPANESE_SUMMER_TIME: TimeZone = {
  dstOffset: 3600,
  rawOffset: 32400,
  status: 'OK',
  timeZoneId: 'Asia/Tokyo',
  timeZoneName: 'GMT+10:00'
};

/**
 * 二十四節気
 *
 * @type {SolarTerm[]}
 */
export const SOLAR_TERMS: SolarTerm[] = [
  { index: 1, name: '春分', month: 3, isMidpoint: true },
  { index: 2, name: '清明', month: 4, isMidpoint: false },
  { index: 3, name: '穀雨', month: 4, isMidpoint: true },
  { index: 4, name: '立夏', month: 5, isMidpoint: false },
  { index: 5, name: '小満', month: 5, isMidpoint: true },
  { index: 6, name: '芒種', month: 6, isMidpoint: false },
  { index: 7, name: '夏至', month: 6, isMidpoint: true },
  { index: 8, name: '小暑', month: 7, isMidpoint: false },
  { index: 9, name: '大暑', month: 7, isMidpoint: true },
  { index: 10, name: '立秋', month: 8, isMidpoint: false },
  { index: 11, name: '処暑', month: 8, isMidpoint: true },
  { index: 12, name: '白露', month: 9, isMidpoint: false },
  { index: 13, name: '秋分', month: 9, isMidpoint: true },
  { index: 14, name: '寒露', month: 10, isMidpoint: false },
  { index: 15, name: '霜降', month: 10, isMidpoint: true },
  { index: 16, name: '立冬', month: 11, isMidpoint: false },
  { index: 17, name: '小雪', month: 11, isMidpoint: true },
  { index: 18, name: '大雪', month: 12, isMidpoint: false },
  { index: 19, name: '冬至', month: 12, isMidpoint: true },
  { index: 20, name: '小寒', month: 1, isMidpoint: false },
  { index: 21, name: '大寒', month: 1, isMidpoint: true },
  { index: 22, name: '立春', month: 2, isMidpoint: false },
  { index: 23, name: '雨水', month: 2, isMidpoint: true },
  { index: 24, name: '啓蟄', month: 3, isMidpoint: false }
];
