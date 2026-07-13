import type {
  HeavenlyStem,
  EarthlyBranch,
  HarmonyBranchCombination,
  SeasonalBranchCombination,
  BranchPunishmentData
} from 'types';

/**
 * 十干
 *
 * @type {HeavenlyStem[]}
 */
export const HEAVENLY_STEMS: HeavenlyStem[] = [
  {
    value: '甲',
    index: 1,
    isYang: true,
    elementId: 0,
    group: 1,
    combination: '己',
    roots: ['寅', '卯', '辰', '未', '亥'],
    description: '甲（きのえ）',
    explanation: '木の陽',
    temperature: 0.7,
    humidity: 0.4,
    changingStars: [
      { partner: '甲', name: '比肩' },
      { partner: '乙', name: '劫財' },
      { partner: '丙', name: '食神' },
      { partner: '丁', name: '傷官' },
      { partner: '戊', name: '偏財' },
      { partner: '己', name: '正財' },
      { partner: '庚', name: '偏官' },
      { partner: '辛', name: '正官' },
      { partner: '壬', name: '偏印' },
      { partner: '癸', name: '印綬' }
    ],
    twelveLucks: [
      { branch: '子', name: '沐浴' },
      { branch: '丑', name: '冠帯' },
      { branch: '寅', name: '建禄' },
      { branch: '卯', name: '帝旺' },
      { branch: '辰', name: '衰' },
      { branch: '巳', name: '病' },
      { branch: '午', name: '死' },
      { branch: '未', name: '墓' },
      { branch: '申', name: '絶' },
      { branch: '酉', name: '胎' },
      { branch: '戌', name: '養' },
      { branch: '亥', name: '長生' }
    ]
  },
  {
    value: '乙',
    index: 2,
    isYang: false,
    elementId: 0,
    group: 2,
    combination: '庚',
    roots: ['寅', '卯', '辰', '未', '亥'],
    description: '乙（きのと）',
    explanation: '木の陰',
    temperature: 0.7,
    humidity: 0.4,
    changingStars: [
      { partner: '甲', name: '劫財' },
      { partner: '乙', name: '比肩' },
      { partner: '丙', name: '傷官' },
      { partner: '丁', name: '食神' },
      { partner: '戊', name: '正財' },
      { partner: '己', name: '偏財' },
      { partner: '庚', name: '正官' },
      { partner: '辛', name: '偏官' },
      { partner: '壬', name: '印綬' },
      { partner: '癸', name: '偏印' }
    ],
    twelveLucks: [
      { branch: '子', name: '病' },
      { branch: '丑', name: '衰' },
      { branch: '寅', name: '帝旺' },
      { branch: '卯', name: '建禄' },
      { branch: '辰', name: '冠帯' },
      { branch: '巳', name: '沐浴' },
      { branch: '午', name: '長生' },
      { branch: '未', name: '養' },
      { branch: '申', name: '胎' },
      { branch: '酉', name: '絶' },
      { branch: '戌', name: '墓' },
      { branch: '亥', name: '死' }
    ]
  },
  {
    value: '丙',
    index: 3,
    isYang: true,
    elementId: 1,
    group: 3,
    combination: '辛',
    roots: ['寅', '巳', '午', '未', '戌'],
    description: '丙（ひのえ）',
    explanation: '火の陽',
    temperature: 0.9,
    humidity: 0.2,
    changingStars: [
      { partner: '甲', name: '偏印' },
      { partner: '乙', name: '印綬' },
      { partner: '丙', name: '比肩' },
      { partner: '丁', name: '劫財' },
      { partner: '戊', name: '食神' },
      { partner: '己', name: '傷官' },
      { partner: '庚', name: '偏財' },
      { partner: '辛', name: '正財' },
      { partner: '壬', name: '偏官' },
      { partner: '癸', name: '正官' }
    ],
    twelveLucks: [
      { branch: '子', name: '胎' },
      { branch: '丑', name: '養' },
      { branch: '寅', name: '長生' },
      { branch: '卯', name: '沐浴' },
      { branch: '辰', name: '冠帯' },
      { branch: '巳', name: '建禄' },
      { branch: '午', name: '帝旺' },
      { branch: '未', name: '衰' },
      { branch: '申', name: '病' },
      { branch: '酉', name: '死' },
      { branch: '戌', name: '墓' },
      { branch: '亥', name: '絶' }
    ]
  },
  {
    value: '丁',
    index: 4,
    isYang: false,
    elementId: 1,
    group: 4,
    combination: '壬',
    roots: ['寅', '巳', '午', '未', '戌'],
    description: '丁（ひのと）',
    explanation: '火の陰',
    temperature: 0.9,
    humidity: 0.3,
    changingStars: [
      { partner: '甲', name: '印綬' },
      { partner: '乙', name: '偏印' },
      { partner: '丙', name: '劫財' },
      { partner: '丁', name: '比肩' },
      { partner: '戊', name: '傷官' },
      { partner: '己', name: '食神' },
      { partner: '庚', name: '正財' },
      { partner: '辛', name: '偏財' },
      { partner: '壬', name: '正官' },
      { partner: '癸', name: '偏官' }
    ],
    twelveLucks: [
      { branch: '子', name: '絶' },
      { branch: '丑', name: '墓' },
      { branch: '寅', name: '死' },
      { branch: '卯', name: '病' },
      { branch: '辰', name: '衰' },
      { branch: '巳', name: '帝旺' },
      { branch: '午', name: '建禄' },
      { branch: '未', name: '冠帯' },
      { branch: '申', name: '沐浴' },
      { branch: '酉', name: '長生' },
      { branch: '戌', name: '養' },
      { branch: '亥', name: '胎' }
    ]
  },
  {
    value: '戊',
    index: 5,
    isYang: true,
    elementId: 2,
    group: 5,
    combination: '癸',
    roots: ['丑', '辰', '巳', '午', '未', '戌'],
    description: '戊（つちのえ）',
    explanation: '土の陽',
    temperature: 0.5,
    humidity: 0.2,
    changingStars: [
      { partner: '甲', name: '偏官' },
      { partner: '乙', name: '正官' },
      { partner: '丙', name: '偏印' },
      { partner: '丁', name: '印綬' },
      { partner: '戊', name: '比肩' },
      { partner: '己', name: '劫財' },
      { partner: '庚', name: '食神' },
      { partner: '辛', name: '傷官' },
      { partner: '壬', name: '偏財' },
      { partner: '癸', name: '正財' }
    ],
    twelveLucks: [
      { branch: '子', name: '胎' },
      { branch: '丑', name: '養' },
      { branch: '寅', name: '長生' },
      { branch: '卯', name: '沐浴' },
      { branch: '辰', name: '冠帯' },
      { branch: '巳', name: '建禄' },
      { branch: '午', name: '帝旺' },
      { branch: '未', name: '衰' },
      { branch: '申', name: '病' },
      { branch: '酉', name: '死' },
      { branch: '戌', name: '墓' },
      { branch: '亥', name: '絶' }
    ]
  },
  {
    value: '己',
    index: 6,
    isYang: false,
    elementId: 2,
    group: 1,
    combination: '甲',
    roots: ['丑', '辰', '巳', '午', '未', '戌'],
    description: '己（つちのと）',
    explanation: '土の陰',
    temperature: 0.5,
    humidity: 0.8,
    changingStars: [
      { partner: '甲', name: '正官' },
      { partner: '乙', name: '偏官' },
      { partner: '丙', name: '印綬' },
      { partner: '丁', name: '偏印' },
      { partner: '戊', name: '劫財' },
      { partner: '己', name: '比肩' },
      { partner: '庚', name: '傷官' },
      { partner: '辛', name: '食神' },
      { partner: '壬', name: '正財' },
      { partner: '癸', name: '偏財' }
    ],
    twelveLucks: [
      { branch: '子', name: '絶' },
      { branch: '丑', name: '墓' },
      { branch: '寅', name: '死' },
      { branch: '卯', name: '病' },
      { branch: '辰', name: '衰' },
      { branch: '巳', name: '帝旺' },
      { branch: '午', name: '建禄' },
      { branch: '未', name: '冠帯' },
      { branch: '申', name: '沐浴' },
      { branch: '酉', name: '長生' },
      { branch: '戌', name: '養' },
      { branch: '亥', name: '胎' }
    ]
  },
  {
    value: '庚',
    index: 7,
    isYang: true,
    elementId: 3,
    group: 2,
    combination: '乙',
    roots: ['丑', '巳', '申', '酉', '戌'],
    description: '庚（かのえ）',
    explanation: '金の陽',
    temperature: 0.3,
    humidity: 0.6,
    changingStars: [
      { partner: '甲', name: '偏財' },
      { partner: '乙', name: '正財' },
      { partner: '丙', name: '偏官' },
      { partner: '丁', name: '正官' },
      { partner: '戊', name: '偏印' },
      { partner: '己', name: '印綬' },
      { partner: '庚', name: '比肩' },
      { partner: '辛', name: '劫財' },
      { partner: '壬', name: '食神' },
      { partner: '癸', name: '傷官' }
    ],
    twelveLucks: [
      { branch: '子', name: '死' },
      { branch: '丑', name: '墓' },
      { branch: '寅', name: '絶' },
      { branch: '卯', name: '胎' },
      { branch: '辰', name: '養' },
      { branch: '巳', name: '長生' },
      { branch: '午', name: '沐浴' },
      { branch: '未', name: '冠帯' },
      { branch: '申', name: '建禄' },
      { branch: '酉', name: '帝旺' },
      { branch: '戌', name: '衰' },
      { branch: '亥', name: '病' }
    ]
  },
  {
    value: '辛',
    index: 8,
    isYang: false,
    elementId: 3,
    group: 3,
    combination: '丙',
    roots: ['丑', '巳', '申', '酉', '戌'],
    description: '辛（かのと）',
    explanation: '金の陰',
    temperature: 0.3,
    humidity: 0.6,
    changingStars: [
      { partner: '甲', name: '正財' },
      { partner: '乙', name: '偏財' },
      { partner: '丙', name: '正官' },
      { partner: '丁', name: '偏官' },
      { partner: '戊', name: '印綬' },
      { partner: '己', name: '偏印' },
      { partner: '庚', name: '劫財' },
      { partner: '辛', name: '比肩' },
      { partner: '壬', name: '傷官' },
      { partner: '癸', name: '食神' }
    ],
    twelveLucks: [
      { branch: '子', name: '長生' },
      { branch: '丑', name: '養' },
      { branch: '寅', name: '胎' },
      { branch: '卯', name: '絶' },
      { branch: '辰', name: '墓' },
      { branch: '巳', name: '死' },
      { branch: '午', name: '病' },
      { branch: '未', name: '衰' },
      { branch: '申', name: '帝旺' },
      { branch: '酉', name: '建禄' },
      { branch: '戌', name: '冠帯' },
      { branch: '亥', name: '沐浴' }
    ]
  },
  {
    value: '壬',
    index: 9,
    isYang: true,
    elementId: 4,
    group: 4,
    combination: '丁',
    roots: ['子', '丑', '辰', '申', '亥'],
    description: '壬（みずのえ）',
    explanation: '水の陽',
    temperature: 0.1,
    humidity: 0.9,
    changingStars: [
      { partner: '甲', name: '食神' },
      { partner: '乙', name: '傷官' },
      { partner: '丙', name: '偏財' },
      { partner: '丁', name: '正財' },
      { partner: '戊', name: '偏官' },
      { partner: '己', name: '正官' },
      { partner: '庚', name: '偏印' },
      { partner: '辛', name: '印綬' },
      { partner: '壬', name: '比肩' },
      { partner: '癸', name: '劫財' }
    ],
    twelveLucks: [
      { branch: '子', name: '帝旺' },
      { branch: '丑', name: '衰' },
      { branch: '寅', name: '病' },
      { branch: '卯', name: '死' },
      { branch: '辰', name: '墓' },
      { branch: '巳', name: '絶' },
      { branch: '午', name: '胎' },
      { branch: '未', name: '養' },
      { branch: '申', name: '長生' },
      { branch: '酉', name: '沐浴' },
      { branch: '戌', name: '冠帯' },
      { branch: '亥', name: '建禄' }
    ]
  },
  {
    value: '癸',
    index: 10,
    isYang: false,
    elementId: 4,
    group: 5,
    combination: '戊',
    roots: ['子', '丑', '辰', '申', '亥'],
    description: '癸（みずのと）',
    explanation: '水の陰',
    temperature: 0.1,
    humidity: 0.9,
    changingStars: [
      { partner: '甲', name: '傷官' },
      { partner: '乙', name: '食神' },
      { partner: '丙', name: '正財' },
      { partner: '丁', name: '偏財' },
      { partner: '戊', name: '正官' },
      { partner: '己', name: '偏官' },
      { partner: '庚', name: '印綬' },
      { partner: '辛', name: '偏印' },
      { partner: '壬', name: '劫財' },
      { partner: '癸', name: '比肩' }
    ],
    twelveLucks: [
      { branch: '子', name: '建禄' },
      { branch: '丑', name: '冠帯' },
      { branch: '寅', name: '沐浴' },
      { branch: '卯', name: '長生' },
      { branch: '辰', name: '養' },
      { branch: '巳', name: '胎' },
      { branch: '午', name: '絶' },
      { branch: '未', name: '墓' },
      { branch: '申', name: '死' },
      { branch: '酉', name: '病' },
      { branch: '戌', name: '衰' },
      { branch: '亥', name: '帝旺' }
    ]
  }
];

/**
 * 十二支
 *
 * @type {EarthlyBranch[]}
 */
export const EARTHLY_BRANCHES: EarthlyBranch[] = [
  {
    value: '子',
    index: 1,
    isYang: true,
    elementId: 4,
    seasonId: 3,
    combination: '丑',
    clash: '午',
    break: '酉',
    harm: '未',
    hiddenStems: [
      { category: '余気', value: '壬', offsetDays: 0, durationDays: 10 },
      { category: '本気', value: '癸', offsetDays: 10, durationDays: 31 }
    ],
    elementComposition: [0, 0, 0, 0, 1],
    temperature: 0.1,
    humidity: 0.8,
    description: '子（ね）',
    explanation: '水の陽'
  },
  {
    value: '丑',
    index: 2,
    isYang: false,
    elementId: 2,
    seasonId: 3,
    combination: '子',
    clash: '未',
    break: '辰',
    harm: '午',
    hiddenStems: [
      { category: '余気', value: '癸', offsetDays: 0, durationDays: 9 },
      { category: '中気', value: '辛', offsetDays: 9, durationDays: 3 },
      { category: '本気', value: '己', offsetDays: 12, durationDays: 31 }
    ],
    elementComposition: [0, 0, 0.3, 0.1, 0.6],
    temperature: 0.1,
    humidity: 0.9,
    description: '丑（うし）',
    explanation: '土の陰'
  },
  {
    value: '寅',
    index: 3,
    isYang: true,
    elementId: 0,
    seasonId: 0,
    combination: '亥',
    clash: '申',
    break: '亥',
    harm: '巳',
    hiddenStems: [
      { category: '余気', value: '戊', offsetDays: 0, durationDays: 7 },
      { category: '中気', value: '丙', offsetDays: 7, durationDays: 7 },
      { category: '本気', value: '甲', offsetDays: 14, durationDays: 31 }
    ],
    elementComposition: [0.6, 0.3, 0.1, 0, 0],
    temperature: 0.2,
    humidity: 0.5,
    description: '寅（とら）',
    explanation: '木の陽'
  },
  {
    value: '卯',
    index: 4,
    isYang: false,
    elementId: 0,
    seasonId: 0,
    combination: '戌',
    clash: '酉',
    break: '午',
    harm: '辰',
    hiddenStems: [
      { category: '余気', value: '甲', offsetDays: 0, durationDays: 10 },
      { category: '本気', value: '乙', offsetDays: 10, durationDays: 31 }
    ],
    elementComposition: [1, 0, 0, 0, 0],
    temperature: 0.3,
    humidity: 0.5,
    description: '卯（う）',
    explanation: '木の陰'
  },
  {
    value: '辰',
    index: 5,
    isYang: true,
    elementId: 2,
    seasonId: 0,
    combination: '酉',
    clash: '戌',
    break: '丑',
    harm: '卯',
    hiddenStems: [
      { category: '余気', value: '乙', offsetDays: 0, durationDays: 9 },
      { category: '中気', value: '癸', offsetDays: 9, durationDays: 3 },
      { category: '本気', value: '戊', offsetDays: 12, durationDays: 31 }
    ],
    elementComposition: [0.3, 0, 0.5, 0, 0.2],
    temperature: 0.5,
    humidity: 0.7,
    description: '辰（たつ）',
    explanation: '土の陽'
  },
  {
    value: '巳',
    index: 6,
    isYang: false,
    elementId: 1,
    seasonId: 1,
    combination: '申',
    clash: '亥',
    break: '申',
    harm: '寅',
    hiddenStems: [
      { category: '余気', value: '戊', offsetDays: 0, durationDays: 7 },
      { category: '中気', value: '庚', offsetDays: 7, durationDays: 7 },
      { category: '本気', value: '丙', offsetDays: 14, durationDays: 31 }
    ],
    elementComposition: [0, 0.5, 0.3, 0.2, 0],
    temperature: 0.8,
    humidity: 0.2,
    description: '巳（み）',
    explanation: '火の陰'
  },
  {
    value: '午',
    index: 7,
    isYang: true,
    elementId: 1,
    seasonId: 1,
    combination: '未',
    clash: '子',
    break: '卯',
    harm: '丑',
    hiddenStems: [
      { category: '余気', value: '丙', offsetDays: 0, durationDays: 10 },
      { category: '中気', value: '己', offsetDays: 10, durationDays: 10 },
      { category: '本気', value: '丁', offsetDays: 20, durationDays: 31 }
    ],
    elementComposition: [0, 0.6, 0.4, 0, 0],
    temperature: 0.9,
    humidity: 0.1,
    description: '午（うま）',
    explanation: '火の陽'
  },
  {
    value: '未',
    index: 8,
    isYang: false,
    elementId: 2,
    seasonId: 1,
    combination: '午',
    clash: '丑',
    break: '戌',
    harm: '子',
    hiddenStems: [
      { category: '余気', value: '丁', offsetDays: 0, durationDays: 9 },
      { category: '中気', value: '乙', offsetDays: 9, durationDays: 3 },
      { category: '本気', value: '己', offsetDays: 12, durationDays: 31 }
    ],
    elementComposition: [0.1, 0.4, 0.5, 0, 0],
    temperature: 0.9,
    humidity: 0.1,
    description: '未（ひつじ）',
    explanation: '土の陰'
  },
  {
    value: '申',
    index: 9,
    isYang: true,
    elementId: 3,
    seasonId: 2,
    combination: '巳',
    clash: '寅',
    break: '巳',
    harm: '亥',
    hiddenStems: [
      { category: '余気', value: '戊', offsetDays: 7, durationDays: 7 },
      { category: '中気', value: '壬', offsetDays: 14, durationDays: 7 },
      { category: '本気', value: '庚', offsetDays: 21, durationDays: 31 }
    ],
    elementComposition: [0, 0, 0.1, 0.6, 0.3],
    temperature: 0.6,
    humidity: 0.5,
    description: '申（さる）',
    explanation: '金の陽'
  },
  {
    value: '酉',
    index: 10,
    isYang: false,
    elementId: 3,
    seasonId: 2,
    combination: '辰',
    clash: '卯',
    break: '子',
    harm: '戌',
    hiddenStems: [
      { category: '余気', value: '庚', offsetDays: 0, durationDays: 10 },
      { category: '本気', value: '辛', offsetDays: 10, durationDays: 31 }
    ],
    elementComposition: [0, 0, 0, 1, 0],
    temperature: 0.4,
    humidity: 0.5,
    description: '酉（とり）',
    explanation: '金の陰'
  },
  {
    value: '戌',
    index: 11,
    isYang: true,
    elementId: 2,
    seasonId: 2,
    combination: '卯',
    clash: '辰',
    break: '未',
    harm: '酉',
    hiddenStems: [
      { category: '余気', value: '辛', offsetDays: 0, durationDays: 9 },
      { category: '中気', value: '丁', offsetDays: 9, durationDays: 3 },
      { category: '本気', value: '戊', offsetDays: 12, durationDays: 31 }
    ],
    elementComposition: [0, 0.1, 0.7, 0.2, 0],
    temperature: 0.3,
    humidity: 0.3,
    description: '戌（いぬ）',
    explanation: '土の陽'
  },
  {
    value: '亥',
    index: 12,
    isYang: false,
    elementId: 4,
    seasonId: 3,
    combination: '寅',
    clash: '巳',
    break: '寅',
    harm: '申',
    hiddenStems: [
      { category: '余気', value: '戊', offsetDays: 7, durationDays: 7 },
      { category: '中気', value: '甲', offsetDays: 14, durationDays: 7 },
      { category: '本気', value: '壬', offsetDays: 21, durationDays: 31 }
    ],
    elementComposition: [0.1, 0, 0, 0, 0.9],
    temperature: 0.2,
    humidity: 0.8,
    description: '亥（い）',
    explanation: '土の陰'
  }
];

/**
 * 三合会局
 *
 * @type {HarmonyBranchCombination[]}
 */
export const HARMONY_COMBINATIONS: HarmonyBranchCombination[] = [
  { name: '三合木局', branches: ['亥', '卯', '未'], elementId: 0 },
  { name: '三合火局', branches: ['寅', '午', '戌'], elementId: 1 },
  { name: '四墓土局', branches: ['丑', '辰', '未', '戌'], elementId: 2 },
  { name: '三合金局', branches: ['巳', '酉', '丑'], elementId: 3 },
  { name: '三合水局', branches: ['申', '子', '辰'], elementId: 4 }
];

/**
 * 三合会局半会
 *
 * @type {HarmonyBranchCombination[]}
 */
export const HARMONY_COMBINATIONS_HALF: HarmonyBranchCombination[] = [
  { name: '三合木局半会', branches: ['卯', '亥'], elementId: 0 },
  { name: '三合木局半会', branches: ['卯', '未'], elementId: 0 },
  { name: '三合火局半会', branches: ['午', '寅'], elementId: 1 },
  { name: '三合火局半会', branches: ['午', '戌'], elementId: 1 },
  { name: '三合金局半会', branches: ['酉', '巳'], elementId: 3 },
  { name: '三合金局半会', branches: ['酉', '丑'], elementId: 3 },
  { name: '三合水局半会', branches: ['子', '申'], elementId: 4 },
  { name: '三合水局半会', branches: ['子', '辰'], elementId: 4 }
];

/**
 * 方合
 *
 * @type {SeasonalBranchCombination[]}
 */
export const SEASONAL_COMBINATIONS: SeasonalBranchCombination[] = [
  { name: '東方合', branches: ['寅', '卯', '辰'], elementId: 0 },
  { name: '南方合', branches: ['巳', '午', '未'], elementId: 1 },
  { name: '西方合', branches: ['申', '酉', '戌'], elementId: 3 },
  { name: '北方合', branches: ['亥', '子', '丑'], elementId: 4 }
];

/**
 * 方合半会
 *
 * @type {SeasonalBranchCombination[]}
 */
export const SEASONAL_COMBINATIONS_HALF: SeasonalBranchCombination[] = [
  { name: '東方合半会', branches: ['卯', '寅'], elementId: 0 },
  { name: '東方合半会', branches: ['卯', '辰'], elementId: 0 },
  { name: '南方合半会', branches: ['午', '未'], elementId: 1 },
  { name: '南方合半会', branches: ['午', '巳'], elementId: 1 },
  { name: '西方合半会', branches: ['酉', '申'], elementId: 3 },
  { name: '西方合半会', branches: ['酉', '戌'], elementId: 3 },
  { name: '北方合半会', branches: ['子', '亥'], elementId: 4 },
  { name: '北方合半会', branches: ['子', '丑'], elementId: 4 }
];

/**
 * 刑
 *
 * @type {Punishment[]}
 */
export const PUNISHMENTS: BranchPunishmentData[] = [
  { type: '自刑', branches: ['辰', '辰'] },
  { type: '自刑', branches: ['午', '午'] },
  { type: '自刑', branches: ['酉', '酉'] },
  { type: '自刑', branches: ['亥', '亥'] },
  { type: '恃勢の刑', branches: ['寅', '巳'] },
  { type: '恃勢の刑', branches: ['巳', '申'] },
  { type: '恃勢の刑', branches: ['寅', '申'] },
  { type: '恩義無き刑', branches: ['丑', '戌'] },
  { type: '恩義無き刑', branches: ['未', '戌'] },
  { type: '恩義無き刑', branches: ['丑', '未'] },
  { type: '礼無き刑', branches: ['子', '卯'] }
];
