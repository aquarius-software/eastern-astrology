import type { PalaceStem, PalaceBranch, PalaceName } from 'types';

/**
 * 宮（簡易バージョン）
 *
 * @type {Branch[]}
 */
export const PALACES_MINI: PalaceName[] = [
  '命宮',
  '父母宮',
  '福徳宮',
  '田宅宮',
  '官禄宮',
  '奴僕宮',
  '遷移宮',
  '疾厄宮',
  '財帛宮',
  '子女宮',
  '夫妻宮',
  '兄弟宮'
];

/**
 * 十干
 *
 * @type {PalaceStem[]}
 */
export const PALACE_STEMS: PalaceStem[] = [
  {
    value: '甲',
    index: 0,
    isYang: true
  },
  {
    value: '乙',
    index: 1,
    isYang: false
  },
  {
    value: '丙',
    index: 2,
    isYang: true
  },
  {
    value: '丁',
    index: 3,
    isYang: false
  },
  {
    value: '戊',
    index: 4,
    isYang: true
  },
  {
    value: '己',
    index: 5,
    isYang: false
  },
  {
    value: '庚',
    index: 6,
    isYang: true
  },
  {
    value: '辛',
    index: 7,
    isYang: false
  },
  {
    value: '壬',
    index: 8,
    isYang: true
  },
  {
    value: '癸',
    index: 9,
    isYang: false
  }
];

/**
 * 十二支
 *
 * @type {PalaceBranch[]}
 */
export const PALACE_BRANCHES: PalaceBranch[] = [
  {
    value: '子',
    index: 0,
    month: 11,
    group: 1,
    selfBranchIndex: 2, // 寅
    bodyBranchIndex: 2, // 寅
    boardPosition: 10
  },
  {
    value: '丑',
    index: 1,
    month: 12,
    group: 2,
    selfBranchIndex: 1, // 丑
    bodyBranchIndex: 3, // 卯
    boardPosition: 9
  },
  {
    value: '寅',
    index: 2,
    month: 1,
    group: 0,
    selfBranchIndex: 0, // 子
    bodyBranchIndex: 4, // 辰
    boardPosition: 8
  },
  {
    value: '卯',
    index: 3,
    month: 2,
    group: 3,
    selfBranchIndex: 11, // 亥
    bodyBranchIndex: 5, // 巳
    boardPosition: 6
  },
  {
    value: '辰',
    index: 4,
    month: 3,
    group: 1,
    selfBranchIndex: 10, // 戌
    bodyBranchIndex: 6, // 午
    boardPosition: 4
  },
  {
    value: '巳',
    index: 5,
    month: 4,
    group: 2,
    selfBranchIndex: 9, // 酉
    bodyBranchIndex: 7, // 未
    boardPosition: 0
  },
  {
    value: '午',
    index: 6,
    month: 5,
    group: 0,
    selfBranchIndex: 8, // 申
    bodyBranchIndex: 8, // 申
    boardPosition: 1
  },
  {
    value: '未',
    index: 7,
    month: 6,
    group: 3,
    selfBranchIndex: 7, // 未
    bodyBranchIndex: 9, // 酉
    boardPosition: 2
  },
  {
    value: '申',
    index: 8,
    month: 7,
    group: 1,
    selfBranchIndex: 6, // 午
    bodyBranchIndex: 10, // 戌
    boardPosition: 3
  },
  {
    value: '酉',
    index: 9,
    month: 8,
    group: 2,
    selfBranchIndex: 5, // 巳
    bodyBranchIndex: 11, // 亥
    boardPosition: 5
  },
  {
    value: '戌',
    index: 10,
    month: 9,
    group: 0,
    selfBranchIndex: 4, // 辰
    bodyBranchIndex: 0, // 子
    boardPosition: 7
  },
  {
    value: '亥',
    index: 11,
    month: 10,
    group: 3,
    selfBranchIndex: 3, // 卯
    bodyBranchIndex: 1, // 丑
    boardPosition: 11
  }
];
