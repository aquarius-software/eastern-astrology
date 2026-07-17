import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  HARMONY_COMBINATIONS,
  SEASONAL_COMBINATIONS,
  HARMONY_COMBINATIONS_HALF,
  SEASONAL_COMBINATIONS_HALF,
  PUNISHMENTS,
  SEXAGENARY_CYCLE
} from 'types';
import { makePairs } from 'utils';
import type {
  SeasonalBranchCombination,
  HarmonyBranchCombination,
  StemPair,
  StemPairName,
  BranchPair,
  BranchPairName,
  BranchClash,
  BranchClashName,
  BranchBreak,
  BranchBreakName,
  BranchHarm,
  BranchHarmName,
  BranchPunishment,
  TwelveLuckName,
  Stem,
  Branch,
  SexagenaryCycle,
  BranchPunishmentName
} from 'types';
import { HeavenlyStem, EarthlyBranch } from 'types';

/**
 * 年干支を取得
 *
 * @param {number} year 西暦年（立春前期間調節済み）
 * @returns {SexagenaryCycle} 年干支
 */
export const getYearPillar = (year: number): SexagenaryCycle => {
  // ※indexの境界に注意
  // ※マイナスの値による除算に注意
  let index = (year - 3) % 60;
  if (index === 0) {
    index = 60; // 割り切れた場合
  } else if (index < 0) {
    index = 60 + index; // マイナスの場合
  }
  return SEXAGENARY_CYCLE[index - 1];
};

/**
 * 月干支を取得
 *
 * @param {number} year 西暦年（立春前期間調節なし）
 * @param {number} month 月の数値（1-12）（節入り後調節済み）
 * @returns {SexagenaryCycle} 月干支
 */
export const getMonthPillar = (
  year: number,
  month: number
): SexagenaryCycle => {
  // 引数に異常値が来たときのエラー処理（未対応）

  // 西暦年の下一桁により1から5にグループ分け
  let yearGroup: number = year % 10; // 西暦の下一桁を取得
  yearGroup %= 5;
  if (yearGroup === 0) yearGroup = 5; // 割り切れた場合

  // 月干支を決定
  // 例えば西暦年（グレゴリオ暦）の下一桁が1か6の場合は、
  // 年干が丙・辛なので2月の庚寅（27番）から開始、以下5年で60干支を循環
  let index: number = 25 + (yearGroup - 1) * 12 + month;
  index %= 60;
  if (index === 0) index = 60; // 割り切れた場合

  // indexの境界に注意
  return SEXAGENARY_CYCLE[index - 1];
};

/**
 * 日干支を取得
 *
 * @param {number} hour 時間（0-23）
 * @param {number} jd ユリウス日
 * @returns {SexagenaryCycle} 日干支
 */
export const getDayPillar = (
  hour: number,
  jd: number,
  changeDayStem: boolean
): SexagenaryCycle => {
  // 引数に異常値が来たときのエラー処理（未対応）

  jd += 0.5; // ユリウス日は正午が0なので調整
  jd = Math.floor(jd);
  let index = ((jd + 49) % 60) + 1;
  if (hour === 23) {
    if (changeDayStem) {
      index++; // 子の刻（23時以降）は翌日
    }
  }

  // if (index > 60) index %= 60 // 60以上になることがないので多分いらない

  // ※indexの境界に注意
  return SEXAGENARY_CYCLE[index - 1];
};

/**
 * 時干支を取得
 *
 * @param {number} hour 時間（0-23）
 * @param {String} dayStem 日干支
 * @returns {(SexagenaryCycle | null)} 時干支
 */
export const getHourPillar = (
  hour: number,
  dayStem: String,
  changeDayStem: boolean
): SexagenaryCycle | null => {
  // 引数に異常値が来たときのエラー処理（未対応）

  // 時間帯決定
  let hourZone: number = 0;
  if (hour === 23) {
    // 子の刻（23時以降）
    hourZone = 1;
  } else if (hour >= 0 && hour < 23) {
    hour = hour % 2 ? hour + 1 : hour; // 奇数はプラス1、偶数はそのまま
    hourZone = hour / 2 + 1;
  } else {
    // error
    return null;
  }

  let heavenlyStem = HEAVENLY_STEMS.find(hs => hs.value === dayStem);
  if (!heavenlyStem) return null;
  let group = heavenlyStem.group! - 1;
  if (hour === 23) {
    // 夜子時の場合
    group = changeDayStem ? heavenlyStem.group! - 1 : heavenlyStem.group! % 5;
  }

  // 時干支を決定
  // 例えば日の天干が甲・己の場合は甲子から開始、以下2時間ごとに60干支を循環
  const index: number = group * 12 + hourZone;

  // ※indexの境界に注意
  return SEXAGENARY_CYCLE[index - 1];
};

/**
 * 三合会局判定
 *
 * @param {EarthlyBranch[]} branches 地支の配列
 * @returns {(HarmonyBranchCombination | undefined)} 三合会局、存在しなければundefined
 */
export const getThreeHarmonyBranches = (
  branches: EarthlyBranch[]
): HarmonyBranchCombination | undefined => {
  const branchStr = branches.reduce(
    (prev: string, curr) => prev + curr.value,
    ''
  );

  return HARMONY_COMBINATIONS.find(combination => {
    return combination.branches.every(branch => branchStr.includes(branch));
  });
};

/**
 * 三合会局半会判定
 *
 * @param {EarthlyBranch[]} branches 地支の配列
 * @returns {HarmonyBranchCombination[]} 三合会局半会の配列、存在しなければ空配列
 */
export const getTwoHarmonyBranches = (
  branches: EarthlyBranch[]
): HarmonyBranchCombination[] => {
  const branchStr = branches.reduce(
    (prev: string, curr) => prev + curr.value,
    ''
  );

  const twoHarmonyBranches = HARMONY_COMBINATIONS_HALF.filter(combination => {
    return combination.branches.every(branch => branchStr.includes(branch));
  });
  return twoHarmonyBranches;
};

/**
 * 大運との三合会局半会判定
 *
 * @param {EarthlyBranch[]} branches
 * @param {EarthlyBranch} decadeLuckBranch
 * @returns {HarmonyBranchCombination[]}
 */
export const getTwoHarmonyBranchesWithDecadeLuck = (
  branches: EarthlyBranch[],
  decadeLuckBranch: EarthlyBranch
): HarmonyBranchCombination[] => {
  // 命式の各地支と大運の地支とのペア文字列から成る配列を生成
  const branchPairs = branches.map(branch => {
    return branch.value.concat(decadeLuckBranch.value);
  });
  // 命式の地支を連結した文字列を生成
  const branchStr = branches.reduce(
    (prev: string, curr) => prev + curr.value,
    ''
  );

  return HARMONY_COMBINATIONS_HALF.filter(combination => {
    let isIdentical = false;
    for (let i = 0; i < branchPairs.length; i++) {
      const branchPair = branchPairs[i];
      isIdentical = combination.branches.every(branch =>
        branchPair.includes(branch)
      );
      const isDuplicated = combination.branches.every(branch =>
        branchStr.includes(branch)
      );
      if (isIdentical && !isDuplicated) {
        break;
      }
    }
    return isIdentical;
  });
};

/**
 * 方合判定
 *
 * @param {EarthlyBranch[]} branches 地支の配列
 * @returns {(SeasonalBranchCombination | undefined)} 方合、存在しなければundefined
 */
export const getThreeSeasonalBranches = (
  branches: EarthlyBranch[]
): SeasonalBranchCombination | undefined => {
  const branchStr = branches.reduce(
    (prev: string, curr) => prev + curr.value,
    ''
  );

  return SEASONAL_COMBINATIONS.find(combination => {
    return combination.branches.every(branch => branchStr.includes(branch));
  });
};

/**
 * 方合半会判定
 *
 * @param {EarthlyBranch[]} branches 地支の配列
 * @returns {SeasonalBranchCombination[]} 方合半会の配列、存在しなければ空配列
 */
export const getTwoSeasonalBranches = (
  branches: EarthlyBranch[]
): SeasonalBranchCombination[] => {
  const branchStr = branches.reduce(
    (prev: string, curr) => prev + curr.value,
    ''
  );

  return SEASONAL_COMBINATIONS_HALF.filter(combination => {
    return combination.branches.every(branch => branchStr.includes(branch));
  });
};

/**
 * 大運との三合会局半会判定
 *
 * @param {EarthlyBranch[]} branches
 * @param {EarthlyBranch} decadeLuckBranch
 * @returns {SeasonalBranchCombination[]}
 */
export const getTwoSeasonalBranchesWithDecadeLuck = (
  branches: EarthlyBranch[],
  decadeLuckBranch: EarthlyBranch
): SeasonalBranchCombination[] => {
  // 命式の各地支と大運の地支とのペア文字列から成る配列を生成
  const branchPairs = branches.map(branch => {
    return branch.value.concat(decadeLuckBranch.value);
  });
  // 命式の地支を連結した文字列を生成
  const branchStr = branches.reduce(
    (prev: string, curr) => prev + curr.value,
    ''
  );

  return SEASONAL_COMBINATIONS_HALF.filter(combination => {
    let isIdentical = false;
    for (let i = 0; i < branchPairs.length; i++) {
      const branchPair = branchPairs[i];
      isIdentical = combination.branches.every(branch =>
        branchPair.includes(branch)
      );
      // 命式と重複していないかチェック
      const isDuplicated = combination.branches.every(branch =>
        branchStr.includes(branch)
      );
      if (isIdentical && !isDuplicated) {
        break;
      }
    }
    return isIdentical;
  });
};

/**
 * 支合取得
 * 地支の配列を隣同士のペアごとに支合となるかどうか判定し、
 * 支合となるオブジェクトの配列を返却する
 * @param {EarthlyBranch[]} branches
 * @returns {BranchPair[]}
 */
export const getBranchPairs = (branches: EarthlyBranch[]): BranchPair[] => {
  branches = branches.map(branch => {
    return {
      index: branch.index,
      position: branch.position,
      value: branch.value
    };
  });
  const branchPairs = makePairs(branches);

  const pairs = branchPairs.filter(pair => {
    return EARTHLY_BRANCHES.some(
      branchObj =>
        branchObj.value === pair[0].value &&
        branchObj.combination === pair[1].value
    );
  });

  return pairs.map(pair => {
    // 支のペアを昇順でソート
    const sortedBranchPair = EarthlyBranch.sort(pair);
    const pairStr = sortedBranchPair
      .map(p => p.value)
      .join('') as BranchPairName;
    return {
      name: pairStr,
      pair
    };
  });
};

/**
 * 冲取得
 * 地支の配列を隣同士のペアごとに冲となるかどうか判定し、
 * 冲となるオブジェクトの配列を返却する
 *
 * @param {EarthlyBranch[]} branches
 * @returns {BranchClash[]}
 */
export const getBranchClashes = (branches: EarthlyBranch[]): BranchClash[] => {
  branches = branches.map(branch => {
    return {
      index: branch.index,
      position: branch.position,
      value: branch.value
    };
  });
  const branchPairs = makePairs(branches);

  const pairs = branchPairs.filter(pair => {
    return EARTHLY_BRANCHES.some(
      branchObj =>
        branchObj.value === pair[0].value && branchObj.clash === pair[1].value
    );
  });

  return pairs.map(pair => {
    // 支のペアを昇順でソート
    const sortedBranchPair = EarthlyBranch.sort(pair);
    const pairStr = sortedBranchPair
      .map(p => p.value)
      .join('') as BranchClashName;
    return {
      name: pairStr,
      pair
    };
  });
};

/**
 * 破取得
 * 地支の配列を隣同士のペアごとに破となるかどうか判定し、
 * 破となるオブジェクトの配列を返却する
 *
 * @param {EarthlyBranch[]} branches
 * @returns {BranchBreak[]}
 */
export const getBranchBreaks = (branches: EarthlyBranch[]): BranchBreak[] => {
  branches = branches.map(branch => {
    return {
      index: branch.index,
      position: branch.position,
      value: branch.value
    };
  });
  const branchPairs = makePairs(branches);

  const pairs = branchPairs.filter(pair => {
    return EARTHLY_BRANCHES.some(
      branchObj =>
        branchObj.value === pair[0].value && branchObj.break === pair[1].value
    );
  });

  return pairs.map(pair => {
    // 支のペアを昇順でソート
    const sortedBranchPair = EarthlyBranch.sort(pair);
    const pairStr = sortedBranchPair
      .map(p => p.value)
      .join('') as BranchBreakName;
    return {
      name: pairStr,
      pair
    };
  });
};

/**
 * 害取得
 * 地支の配列を隣同士のペアごとに破となるかどうか判定し、
 * 害となるオブジェクトの配列を返却する
 *
 * @param {EarthlyBranch[]} branches
 * @returns {BranchHarm[]}
 */
export const getBranchHarms = (branches: EarthlyBranch[]): BranchHarm[] => {
  branches = branches.map(branch => {
    return {
      index: branch.index,
      position: branch.position,
      value: branch.value
    };
  });
  const branchPairs = makePairs(branches);

  const pairs = branchPairs.filter(pair => {
    return EARTHLY_BRANCHES.some(
      branchObj =>
        branchObj.value === pair[0].value && branchObj.harm === pair[1].value
    );
  });

  return pairs.map(pair => {
    // 支のペアを昇順でソート
    const sortedBranchPair = EarthlyBranch.sort(pair);
    const pairStr = sortedBranchPair
      .map(p => p.value)
      .join('') as BranchHarmName;
    return {
      name: pairStr,
      pair
    };
  });
};

/**
 * 刑取得
 * 地支の配列を隣同士のペアごとに刑となるかどうか判定し、
 * 刑となるオブジェクトの配列を返却する
 *
 * @param {EarthlyBranch[]} branches
 * @returns {BranchPunishment[]}
 */
export const getBranchPunishments = (
  branches: EarthlyBranch[]
): BranchPunishment[] => {
  branches = branches.map(branch => {
    return {
      index: branch.index,
      position: branch.position,
      value: branch.value
    };
  });
  const branchPairs = makePairs(branches);

  const punishments: BranchPunishment[] = [];
  branchPairs.forEach(pair => {
    const punishment = PUNISHMENTS.find(
      p =>
        (p.branches[0] === pair[0].value && p.branches[1] === pair[1].value) ||
        (p.branches[0] === pair[1].value && p.branches[1] === pair[0].value)
    );
    if (punishment) {
      const punishmentName = punishment.branches.join(
        ''
      ) as BranchPunishmentName;
      punishments.push({
        name: punishmentName,
        type: punishment.type,
        pair
      });
    }
  });

  return punishments;
};

/**
 * 干合取得
 * 天干の配列を隣同士のペアごとに干合となるかどうか判定し、
 * 干合となるオブジェクトの配列を返却する
 *
 * @param {HeavenlyStem[]} stems 天干の配列
 * @returns {StemPair[]} 干合となる天干ペアの配列
 */
export const getStemPairs = (stems: HeavenlyStem[]): StemPair[] => {
  stems = stems.map(stem => {
    return {
      index: stem.index,
      position: stem.position,
      value: stem.value
    };
  });
  const stemPairs = makePairs(stems);

  const pairs = stemPairs.filter(pair => {
    return HEAVENLY_STEMS.some(
      stemObj =>
        stemObj.value === pair[0].value && stemObj.combination === pair[1].value
    );
  });

  return pairs.map(pair => {
    // 干のペアを陽干・陰干の順でソート
    const sortedStemPair = HeavenlyStem.sort(pair);
    const pairStr = sortedStemPair.map(p => p.value).join('') as StemPairName;
    return {
      name: pairStr,
      pair
    };
  });
};

/**
 * 通変星取得
 *
 * @param {Stem} dayStem 日干
 * @param {Stem} partnerStem 日干と比較対象となる干
 * @returns {string}
 */
export const getChangingStar = (dayStem: Stem, partnerStem: Stem): string => {
  if (!dayStem || !partnerStem) return '';
  const stemObj = HEAVENLY_STEMS.find(stem => stem.value === dayStem);
  const changingStar = stemObj!.changingStars!.find(
    cs => cs.partner === partnerStem
  );
  return changingStar!.name;
};

/**
 * 十二運取得
 *
 * @param {Stem} dayStem 日干
 * @param {Branch} partnerBranch 日干と比較対象となる地支
 * @returns {string}
 */
export const getTwelveLuck = (
  dayStem: Stem,
  partnerBranch: Branch
): TwelveLuckName | '' => {
  if (!dayStem || !partnerBranch) {
    return '';
  }
  const stemObj = HEAVENLY_STEMS.find(stem => stem.value === dayStem);
  const twelveLuck = stemObj!.twelveLucks!.find(
    luck => luck.branch === partnerBranch
  );
  return twelveLuck!.name;
};

/**
 * 通根する地支を取得
 *
 * @param {Branch[]} stemRoots
 * @param {Branch} hourBranch
 * @param {Branch} dayBranch
 * @param {Branch} monthBranch
 * @param {Branch} yearBranch
 * @returns {Branch[]}
 */
export const getRoots = (
  stemRoots: Branch[] | undefined,
  hourBranch: Branch | undefined,
  dayBranch: Branch | undefined,
  monthBranch: Branch | undefined,
  yearBranch: Branch | undefined
): Branch[] => {
  if (!stemRoots || stemRoots.length < 1) return [];

  return [
    ...stemRoots.filter(root => root === hourBranch),
    ...stemRoots.filter(root => root === dayBranch),
    ...stemRoots.filter(root => root === monthBranch),
    ...stemRoots.filter(root => root === yearBranch)
  ];
};
