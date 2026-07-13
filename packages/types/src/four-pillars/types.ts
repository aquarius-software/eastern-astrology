import type {
  Stem,
  Branch,
  SexagenaryCycle,
  SexagenaryCycleName,
  FiveElementsId,
  EarthlyBranch,
  HeavenlyStem
} from 'types';

/**
 * 四柱
 *
 * @export
 * @interface FourPillars
 * @typedef {FourPillars}
 */
export interface FourPillars {
  year: SexagenaryCycle;
  month: SexagenaryCycle;
  day: SexagenaryCycle;
  hour?: SexagenaryCycle | null;
}

/**
 * 通変星
 *
 * @export
 * @interface ChangingStar
 * @typedef {ChangingStar}
 */
export interface ChangingStar {
  partner: Stem;
  name:
  | '比肩'
  | '劫財'
  | '傷官'
  | '食神'
  | '偏財'
  | '正財'
  | '偏官'
  | '正官'
  | '偏印'
  | '印綬';
}

/**
 * 十二運
 *
 * @export
 * @interface TwelveLuck
 * @typedef {TwelveLuck}
 */
export interface TwelveLuck {
  branch: Branch;
  name: TwelveLuckName;
}

/**
 * 十二運名称
 *
 * @export
 * @typedef {TwelveLuckName}
 */
export type TwelveLuckName =
  | '長生'
  | '沐浴'
  | '冠帯'
  | '建禄'
  | '帝旺'
  | '衰'
  | '病'
  | '死'
  | '墓'
  | '絶'
  | '胎'
  | '養';

/**
 * 蔵干
 *
 * @export
 * @interface HiddenStem
 * @typedef {HiddenStem}
 */
export interface HiddenStem {
  category: string;
  value: Stem;
  changingStar?: string;
  offsetDays?: number;
  durationDays?: number;
  inProgress?: boolean;
}

/**
 * 干合名称
 *
 * @export
 * @typedef {StemPairName}
 */
export type StemPairName = '甲己' | '庚乙' | '丙辛' | '壬丁' | '戊癸';

/**
 * 干合
 *
 * @export
 * @interface StemPair
 * @typedef {StemPair}
 */
export interface StemPair {
  name: StemPairName;
  pair: HeavenlyStem[];
}

/**
 * 支合名称
 *
 * @export
 * @typedef {BranchPairName}
 */
export type BranchPairName =
  | '子丑'
  | '寅亥'
  | '卯戌'
  | '辰酉'
  | '巳申'
  | '午未';

/**
 * 支合
 *
 * @export
 * @interface BranchPair
 * @typedef {BranchPair}
 */
export interface BranchPair {
  name: BranchPairName;
  pair: EarthlyBranch[];
}

/**
 * 冲名称
 *
 * @export
 * @typedef {BranchPairName}
 */
export type BranchClashName =
  | '子午'
  | '丑未'
  | '寅申'
  | '卯酉'
  | '辰戌'
  | '巳亥';

/**
 * 冲
 *
 * @export
 * @interface BranchClash
 * @typedef {BranchClash}
 */
export interface BranchClash {
  name: BranchClashName;
  pair: EarthlyBranch[];
}

/**
 * 破名称
 *
 * @export
 * @typedef {BranchBreakName}
 */
export type BranchBreakName =
  | '子酉'
  | '丑辰'
  | '寅亥'
  | '卯午'
  | '辰丑'
  | '巳申';

/**
 * 破
 *
 * @export
 * @interface BranchBreak
 * @typedef {BranchBreak}
 */
export interface BranchBreak {
  name: BranchBreakName;
  pair: EarthlyBranch[];
}

/**
 * 害名称
 *
 * @export
 * @typedef {BranchHarmName}
 */

/**
 * 害名称
 *
 * @export
 * @typedef {BranchHarmName}
 */
export type BranchHarmName =
  | '子未'
  | '丑午'
  | '寅巳'
  | '卯辰'
  | '辰卯'
  | '巳寅';

/**
 * 害
 *
 * @export
 * @interface BranchBreak
 * @typedef {BranchBreak}
 */
export interface BranchHarm {
  name: BranchHarmName;
  pair: EarthlyBranch[];
}

/**
 * 刑種類
 *
 * @export
 * @typedef {BranchPunishmentType}
 */
export type BranchPunishmentType =
  | '自刑'
  | '恃勢の刑'
  | '恩義無き刑'
  | '礼無き刑';

/**
 * 刑名称
 *
 * @export
 * @typedef {BranchHarmName}
 */
export type BranchPunishmentName =
  | '辰辰'
  | '午午'
  | '酉酉'
  | '亥亥'
  | '寅巳'
  | '巳申'
  | '寅申'
  | '丑戌'
  | '未戌'
  | '丑未'
  | '子卯';

/**
 * 刑
 *
 * @export
 * @interface BranchPunishment
 * @typedef {BranchPunishment}
 */
export interface BranchPunishment {
  name: BranchPunishmentName;
  type: BranchPunishmentType;
  pair: EarthlyBranch[];
}

/**
 * 刑データ
 *
 * @export
 * @interface PunishmentData
 * @typedef {PunishmentData}
 */
export interface BranchPunishmentData {
  type: BranchPunishmentType;
  branches: Branch[];
}

/**
 * 三合会局名称
 *
 * @export
 * @typedef {HarmonyBranchCombinationName}
 */
export type HarmonyBranchCombinationName =
  | '三合木局'
  | '三合火局'
  | '四墓土局'
  | '三合金局'
  | '三合水局'
  | '三合木局半会'
  | '三合火局半会'
  | '三合金局半会'
  | '三合水局半会';

/**
 * 方合名称
 *
 * @export
 * @typedef {SeasonalBranchCombinationName}
 */
export type SeasonalBranchCombinationName =
  | '東方合'
  | '南方合'
  | '西方合'
  | '北方合'
  | '東方合半会'
  | '南方合半会'
  | '西方合半会'
  | '北方合半会';

/**
 * 三合会局
 *
 * @export
 * @interface HarmonyBranchCombination
 * @typedef {HarmonyBranchCombination}
 */
export interface HarmonyBranchCombination {
  name: HarmonyBranchCombinationName;
  branches: Branch[];
  elementId: FiveElementsId;
}

/**
 * 方合
 *
 * @export
 * @interface SeasonalBranchCombination
 * @typedef {SeasonalBranchCombination}
 */
export interface SeasonalBranchCombination {
  name: SeasonalBranchCombinationName;
  branches: Branch[];
  elementId: FiveElementsId;
}

/**
 * 大運
 *
 * @export
 * @interface DecadeLuck
 * @typedef {DecadeLuck}
 */
export interface DecadeLuck {
  value: SexagenaryCycleName;
  age: number;
  startingDate: string;
  endingDate: string;
  inCurrentPeriod: boolean;
  passedYears?: number;
  seasonId?: FourSeasonsId;
  changingStar: string;
  stemCombinations: StemPair[];
  branchCombinations: BranchPair[];
  branchClashes: BranchPair[];
  inEmptyPeriod: boolean;
  threeHarmonyBranches: HarmonyBranchCombination | undefined;
  threeSeasonalBranches: SeasonalBranchCombination | undefined;
  twoHarmonyBranches: HarmonyBranchCombination[] | undefined;
  twoSeasonalBranches: SeasonalBranchCombination[] | undefined;
  twelveLuck: TwelveLuckName | '';
}

/**
 * 年運
 *
 * @export
 * @interface YearlyLuck
 * @typedef {YearlyLuck}
 */
export interface YearlyLuck {
  value: SexagenaryCycleName;
  year: number;
  age: number;
  decadeLucks: SexagenaryCycleName[];
  changingStar: string;
  stemCombinations: StemPair[];
  branchCombinations: BranchPair[];
  branchClashes: BranchPair[];
  inEmptyPeriod: boolean;
}

/**
 * 方運ID（東方運0・南方運1・西方運2・北方運3）
 *
 * @export
 * @typedef {FourSeasonsId}
 */
export type FourSeasonsId = 0 | 1 | 2 | 3;

/**
 * 干支の位置
 *
 * @export
 * @typedef {PillarPosition}
 */
export type PillarPosition =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'decade'
  | 'yearly';

/**
 * DivisionMethod
 * 節気分割法
 *
 * @export
 * @typedef {DivisionMethod}
 */
export type DivisionMethod = 'S' | 'T';

/**
 * DayStemMethod
 * 日中切り替え設定
 *
 * @export
 * @typedef {DayStemMethod}
 */
export type DayStemMethod = 'T' | 'F';

/**
 * 四柱推命APIリクエスト
 *
 * @export
 * @interface ChartRequest
 * @typedef {ChartRequest}
 */
export interface ChartRequest {
  isoDate: string,
  latitude: number,
  longitude: number,
  gender: string,
  languageCode: string,
  utcOffset: number,
  dstOffset: number,
  useSpaceMethod: boolean,
  createImage: boolean,
  isHourUnknown: boolean,
  changeDayStem: boolean,
  yearlyLuckStart?: number,
  yearlyLuckEnd?: number,
  yearlyLucks: boolean
}