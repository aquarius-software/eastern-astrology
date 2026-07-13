import type { Stem, Branch, StemIndex, BranchIndex } from 'types';

/**
 * 十干
 *
 * @export
 * @interface PalaceStem
 * @typedef {PalaceStem}
 */
export interface PalaceStem {
  value: Stem;
  index: StemIndex;
  isYang: boolean;
}

/**
 * 十二支
 *
 * @export
 * @interface PalaceBranch
 * @typedef {PalaceBranch}
 */
export interface PalaceBranch {
  value: Branch;
  index: BranchIndex;
  month: number;
  group: number;
  selfBranchIndex: BranchIndex;
  bodyBranchIndex: BranchIndex;
  boardPosition: BranchIndex;
}

// 宮名称
export type PalaceName =
  | '命宮'
  | '父母宮'
  | '福徳宮'
  | '田宅宮'
  | '官禄宮'
  | '奴僕宮'
  | '遷移宮'
  | '疾厄宮'
  | '財帛宮'
  | '子女宮'
  | '夫妻宮'
  | '兄弟宮';

// 宮
export interface Palace {
  name: PalaceName;
  stem: Stem;
  stemIndex: number;
  branch: Branch;
  isMainPalace: boolean;
  isBodyPalace: boolean;
  boardPosition: number;
  yearlyLucks: YearlyFortune[];
  majorStars: Star[];
  minorStars: Star[];
  starPower?: number;
  startingAge: number;
  endingAge: number;
  destinyIndex?: number;
  activeName?: PalaceName;
}

// 主星名称
export type MajorStarName =
  | '紫微星'
  | '天機星'
  | '太陽星'
  | '武曲星'
  | '天同星'
  | '廉貞星'
  | '天府星'
  | '太陰星'
  | '貪狼星'
  | '巨門星'
  | '天相星'
  | '天梁星'
  | '七殺星'
  | '破軍星';

// 諸星名称
export type MinorStarName =
  | '文昌星'
  | '文曲星'
  | '天空星'
  | '地劫星'
  | '火星'
  | '鈴星'
  | '左輔星'
  | '右弼星'
  | '天姚星'
  | '天馬星'
  | '禄存星'
  | '擎羊星'
  | '陀羅星'
  | '天魁星'
  | '天鉞星'
  | '化禄星'
  | '化権星'
  | '化科星'
  | '化忌星'
  | '紅鸞星'
  | '天刑星'
  | '陰煞星'
  | '天喜星'
  | '龍池星'
  | '鳳閣星';

// 星
export interface Star {
  name: MajorStarName | MinorStarName;
  shortName: string;
  category?: string;
  strength?: number;
  luminosity?: LuminosityName;
  childStar?: Star;
  selfChildStar?: Star;
  triangleChildStar?: Star;
  mainChildStar?: Star;
  childStars?: Star[];
}

// 輝度名称
export type LuminosityName =
  | '廟'
  | '旺'
  | '得地'
  | '利益'
  | '平和'
  | '不得地'
  | '陥'
  | '';

// 輝度インデックス
export type LuminosityIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// 輝度
export type Luminosity = {
  name: LuminosityName;
  intensity: number;
};

// 局名称
export type DivisionName = '木三局' | '火六局' | '土五局' | '金四局' | '水二局';

// 五号局
export interface Division {
  index: number;
  value: DivisionName;
}

// 旧暦
export interface ChineseDate {
  cycle: number;
  year: number;
  month: number;
  isLeapMonth: boolean;
  day: number;
  yearStem?: Stem;
  yearBranch?: Branch;
  hourBranch?: Branch;
}

// 流年
export interface YearlyFortune {
  age: number;
  destinyIndex?: number;
}

// 旧暦月
export interface LunarMonth {
  monthIndex: number,
  branch: Branch,
  startDate: string,
  endDate: string,
  isLeap: boolean,
  isCurrentMonth: boolean
}

// 流派
export interface School {
  name: string,
  value: string
}

/**
 * 四柱推命APIリクエスト
 *
 * @export
 * @interface BoardRequest
 * @typedef {BoardRequest}
 */
export interface BoardRequest {
  isoDate: string,
  latitude: number,
  longitude: number,
  gender: string,
  languageCode: string,
  utcOffset: number,
  dstOffset: number,
  useSpaceMethod: boolean,
  school: string
}