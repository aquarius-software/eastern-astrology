import {
  getLichunFromYearBySpace,
  getLichunFromYearByTime
} from 'utils';
import { getItemsFromArrayCycle } from 'utils';
import {
  getYearPillar,
  getChangingStar,
  getTwelveLuck,
  getTwoHarmonyBranchesWithDecadeLuck,
  getTwoSeasonalBranchesWithDecadeLuck
} from './pillars';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, SEXAGENARY_CYCLE } from 'types';
import { getThreeHarmonyBranches, getThreeSeasonalBranches } from './pillars';
import type {
  BranchPair,
  BranchPairName,
  DecadeLuck,
  FourPillars,
  PillarPosition,
  StemPair,
  StemPairName,
  YearlyLuck,
  Gender,
  SexagenaryCycleName,
  Term
} from 'types';
import { HeavenlyStem, EarthlyBranch } from 'types';
import { DateTime } from 'luxon';
import { FourPillarsData } from './FourPillarsData';

/**
 * 行運判定（性別と年干により順運か逆運かを決定）
 *
 * @param {Gender} gender 性別（男性:M・女性:F）
 * @param {string} yearStem 年干
 * @returns {boolean} 順運はtrue、逆運はfalse
 */
export const isLuckOrderForward = (
  gender: Gender,
  yearStem: string
): boolean => {
  const isMale = gender === '1' ? true : false;
  const heavenlyStem = HEAVENLY_STEMS.find(stem => stem.value === yearStem);
  return (isMale && heavenlyStem!.isYang) || (!isMale && !heavenlyStem!.isYang);
};

/**
 * 立運を取得
 *
 * @param {Term} currentTerm 現在の節が含まれている期間
 * @param {Date} date 取得する日時
 * @param {boolean} isLuckOrderForward 順運はtrue、逆運はfalse
 * @returns {number} 立運年（小数点付き）
 */
export const getStartingAge = (
  currentTerm: Term,
  date: Date,
  isLuckOrderForward: boolean
): number => {
  const dateTime = date.getTime();
  const startTime = currentTerm.startTime.getTime();
  const endTime = currentTerm.endTime.getTime();

  let timeDiff: number;
  if (isLuckOrderForward) {
    timeDiff = endTime - dateTime;
  } else {
    timeDiff = dateTime - startTime;
  }
  let startingAge = timeDiff / 86400000;
  startingAge = startingAge / 3;

  return startingAge;
};

/**
 * 大運を取得
 *
 * @param {FourPillars} fourPillars 四柱
 * @param {number} cycleNum 取得する大運の数
 * @param {FourPillarsData} fourPillarsData 四柱オブジェクト
 * @returns {DecadeLuck[]} 大運の配列
 */
export const getDecadeLucks = (
  fourPillars: FourPillars,
  cycleNum: number,
  fourPillarsData: FourPillarsData
): DecadeLuck[] => {
  const index = SEXAGENARY_CYCLE.findIndex(
    cycle =>
      cycle.stem === fourPillars.month.stem &&
      cycle.branch === fourPillars.month.branch
  );

  const decadeLucks = getItemsFromArrayCycle(
    SEXAGENARY_CYCLE,
    index,
    cycleNum,
    fourPillarsData.luckOrder
  );
  const birthDateTime = DateTime.fromJSDate(
    fourPillarsData.personalInfo.adjustedDate
  );

  return decadeLucks.map((decadeLuck, index) => {
    const luckStartingAge =
      index === 0 ? 0 : fourPillarsData.startingAge + (index - 1) * 10;
    const startingDateTime =
      index === 0
        ? birthDateTime
        : birthDateTime.plus({ year: luckStartingAge });
    const endingDateTime =
      index === 0
        ? birthDateTime.plus({ year: fourPillarsData.startingAge })
        : birthDateTime.plus({ year: luckStartingAge + 10 });
    const currentDateTime = DateTime.now();
    let inCurrentPeriod: boolean = false;
    let passedYears: number | undefined = undefined;
    if (
      currentDateTime >= startingDateTime &&
      currentDateTime < endingDateTime
    ) {
      passedYears = currentDateTime.diff(startingDateTime, ['years']).toObject().years;
      inCurrentPeriod = true;
    }

    const changingStar = getChangingStar(fourPillars.day.stem, decadeLuck.stem);
    const twelveLuck = getTwelveLuck(fourPillars.day.stem, decadeLuck.branch);
    const stemCombinations: StemPair[] = [];
    const branchCombinations: BranchPair[] = [];
    const branchClashes: BranchPair[] = [];
    const branches: EarthlyBranch[] = [];
    const decadeStemObj = HEAVENLY_STEMS.find(
      stem => stem.value === decadeLuck.stem
    );
    const decadeBranchObj = EARTHLY_BRANCHES.find(
      branch => branch.value === decadeLuck.branch
    );

    const pillarPositionKeys = Object.keys(fourPillars) as PillarPosition[];
    pillarPositionKeys.forEach(pillarPositionKey => {
      // 干を取り出す
      const stemObj = HEAVENLY_STEMS.find(
        stem =>
          stem.value ===
          fourPillars[pillarPositionKey as keyof FourPillars]!.stem
      );
      const stemPair = [stemObj, decadeStemObj] as HeavenlyStem[];
      const sortedStemPair = HeavenlyStem.sort(stemPair);
      const stemPairStr = sortedStemPair
        .map(p => p.value)
        .join('') as StemPairName;

      // 干合チェック
      if (stemObj!.combination === decadeLuck.stem) {
        stemCombinations.push({
          name: stemPairStr,
          pair: [
            {
              position: pillarPositionKey,
              value: stemObj!.value
            },
            {
              position: 'decade',
              value: decadeLuck.stem
            }
          ]
        });
      }

      // 支を取り出す
      const branchObj = EARTHLY_BRANCHES.find(
        branch =>
          branch.value ===
          fourPillars[pillarPositionKey as keyof FourPillars]!.branch
      ) as EarthlyBranch;
      branches.push(branchObj);
      const branchPair = [branchObj, decadeBranchObj] as EarthlyBranch[];
      const sortedBranchPair = EarthlyBranch.sort(branchPair);
      const branchPairStr = sortedBranchPair
        .map(p => p.value)
        .join('') as BranchPairName;

      // 支合チェック
      if (branchObj!.combination === decadeLuck.branch) {
        branchCombinations.push({
          name: branchPairStr,
          pair: [
            {
              position: pillarPositionKey,
              value: branchObj!.value
            },
            {
              position: 'decade',
              value: decadeLuck.branch
            }
          ]
        });
      }

      // 冲チェック
      if (branchObj!.clash === decadeLuck.branch) {
        branchClashes.push({
          name: branchPairStr,
          pair: [
            {
              position: pillarPositionKey,
              value: branchObj!.value
            },
            {
              position: 'decade',
              value: decadeLuck.branch
            }
          ]
        });
      }
    });

    // 大運の地支を追加
    const decadeLuckBranch = EARTHLY_BRANCHES.find(
      branch => branch.value === decadeLuck.branch
    ) as EarthlyBranch;
    const branchesWithDecadeLuck = [...branches, decadeLuckBranch];

    // 三合会局チェック
    let threeHarmonyBranches = getThreeHarmonyBranches(branchesWithDecadeLuck);
    if (
      threeHarmonyBranches &&
      fourPillarsData.threeHarmonyBranches &&
      threeHarmonyBranches.name === fourPillarsData.threeHarmonyBranches.name
    ) {
      const branchStr = JSON.stringify(threeHarmonyBranches.branches);
      const originalBranchStr = JSON.stringify(
        fourPillarsData.threeHarmonyBranches.branches
      );
      if (branchStr === originalBranchStr) {
        // 命式との重複を除外
        threeHarmonyBranches = undefined;
      }
    }

    // 三合会局半会チェック
    let twoHarmonyBranches;
    if (!threeHarmonyBranches) {
      twoHarmonyBranches = getTwoHarmonyBranchesWithDecadeLuck(
        branches,
        decadeLuckBranch
      );
      if (fourPillarsData.threeHarmonyBranches) {
        // 三合会局が存在する場合は重複を削除
        twoHarmonyBranches = twoHarmonyBranches!.filter(harmonyBranches => {
          harmonyBranches.elementId !==
            fourPillarsData.threeHarmonyBranches!.elementId;
        });
      }
    }

    // 方合チェック
    let threeSeasonalBranches = getThreeSeasonalBranches(
      branchesWithDecadeLuck
    );
    if (
      threeSeasonalBranches &&
      fourPillarsData.threeSeasonalBranches &&
      threeSeasonalBranches.name === fourPillarsData.threeSeasonalBranches.name
    ) {
      const branchStr = JSON.stringify(threeSeasonalBranches.branches);
      const originalBranchStr = JSON.stringify(
        fourPillarsData.threeSeasonalBranches.branches
      );
      if (branchStr === originalBranchStr) {
        // 命式との重複を除外
        threeSeasonalBranches = undefined;
      }
    }

    // 方合半会チェック
    let twoSeasonalBranches = getTwoSeasonalBranchesWithDecadeLuck(
      branches,
      decadeLuckBranch
    );

    // 三方合かつ方合半会が同一五行で重複している場合は、方合半会を削除
    if (twoSeasonalBranches && threeSeasonalBranches) {
      twoSeasonalBranches = twoSeasonalBranches!.filter(seasonalBranches => {
        seasonalBranches.elementId !== threeSeasonalBranches!.elementId;
      });
    }

    // 空亡
    const inEmptyPeriod = fourPillars.day.emptyElements!.some(element => {
      return element === decadeLuck.branch;
    });

    const stemBranch = (decadeLuck.stem +
      decadeLuck.branch) as SexagenaryCycleName;

    return {
      value: stemBranch,
      age: luckStartingAge,
      startingDate: startingDateTime.toUTC().toString(),
      endingDate: endingDateTime.toUTC().toString(),
      inCurrentPeriod,
      passedYears,
      seasonId: decadeLuckBranch?.seasonId,
      changingStar,
      twelveLuck,
      stemCombinations,
      branchCombinations,
      branchClashes,
      threeHarmonyBranches,
      threeSeasonalBranches,
      twoHarmonyBranches,
      twoSeasonalBranches,
      inEmptyPeriod
    };
  });
};

/**
 * 年運を取得
 *
 * @param {number} startYear 開始年
 * @param {number} endYear 終了年
 * @param {FourPillarsData} fourPillarsData 四柱
 * @returns {YearlyLuck[]} 年運の配列
 */
export const getYearlyLucks = (
  startYear: number,
  endYear: number,
  fourPillarsData: FourPillarsData
): YearlyLuck[] => {
  // 満年齢の基準となる生年は出生地の標準時（UTC + utcOffset）で読む。
  // getFullYear() は実行マシンのタイムゾーン依存のため、UTC サーバーだと
  // 1/1 未明（JST）生まれの生年が前年になり満年齢が1歳ズレる。
  const { adjustedDate, utcOffset } = fourPillarsData.personalInfo;
  const birthYear = new Date(
    adjustedDate.getTime() + utcOffset * 3_600_000
  ).getUTCFullYear();
  const fourPillars = fourPillarsData.getFourPillars();
  const yearPillar = getYearPillar(startYear);
  const index = SEXAGENARY_CYCLE.findIndex(
    cycle =>
      cycle.stem === yearPillar.stem && cycle.branch === yearPillar.branch
  );
  const yearlyLucks = getItemsFromArrayCycle(
    SEXAGENARY_CYCLE,
    index,
    endYear - startYear + 1,
    true
  );

  return yearlyLucks.map((yearlyLuck, index) => {
    const year = startYear + index;
    const yearlyStemObj = HEAVENLY_STEMS.find(
      stem => stem.value === yearlyLuck.stem
    );
    const yearlyBranchObj = EARTHLY_BRANCHES.find(
      branch => branch.value === yearlyLuck.branch
    );
    const changingStar = getChangingStar(fourPillars.day.stem, yearlyLuck.stem);
    const twelveLuck = getTwelveLuck(fourPillars.day.stem, yearlyLuck.branch);
    const stemCombinations: StemPair[] = [];
    const branchCombinations: BranchPair[] = [];
    const branchClashes: BranchPair[] = [];

    // 大運取得
    const decadeLucks = fourPillarsData.decadeLucks;
    const decadeLuckArray: SexagenaryCycleName[] = [];
    const useSpaceMethod = fourPillarsData.personalInfo.useSpaceMethod;
    const lichun = useSpaceMethod
      ? getLichunFromYearBySpace(year)
      : getLichunFromYearByTime(year);
    if (lichun) {
      for (let i = 0; i < decadeLucks.length; i++) {
        const decadeLuck = decadeLucks[i];
        const nextDecadeLuck =
          i + 1 < decadeLucks.length ? decadeLucks[i + 1] : null;
        const startingDate = DateTime.fromISO(decadeLuck.startingDate);
        const endingDate = DateTime.fromISO(decadeLuck.endingDate);
        const lichunDate = DateTime.fromJSDate(lichun);
        const nextLichunDate = lichunDate.plus({ year: 1 });
        if (lichunDate < startingDate && i === 0) {
          // 立春が誕生日より前の場合
          decadeLuckArray.push(decadeLuck.value);
          break;
        }
        if (lichunDate >= startingDate && lichunDate <= endingDate) {
          decadeLuckArray.push(decadeLuck.value);
          if (nextDecadeLuck !== null && nextLichunDate > endingDate) {
            // 大運が切り替わる年の場合
            decadeLuckArray.push(nextDecadeLuck.value);
          }
          break;
        }
      }
    }

    let pillarPositionKeys = Object.keys(fourPillars) as PillarPosition[];

    // 生時不明の場合は時柱キーを削除（2025.3.15バグ修正）
    if (fourPillarsData.personalInfo.isHourUnknown) {
      pillarPositionKeys = pillarPositionKeys.filter(key => key !== "hour")
    }

    pillarPositionKeys.forEach(pillarPositionKey => {
      // 干を取り出す
      const stemObj = HEAVENLY_STEMS.find(
        stem =>
          stem.value ===
          fourPillars[pillarPositionKey as keyof FourPillars]!.stem
      );
      const stemPair = [stemObj, yearlyStemObj] as HeavenlyStem[];
      const sortedStemPair = HeavenlyStem.sort(stemPair);
      const stemPairStr = sortedStemPair
        .map(p => p.value)
        .join('') as StemPairName;

      // 干合チェック
      if (stemObj!.combination === yearlyLuck.stem) {
        stemCombinations.push({
          name: stemPairStr,
          pair: [
            {
              position: pillarPositionKey,
              value: stemObj!.value
            },
            {
              position: 'yearly',
              value: yearlyLuck.stem
            }
          ]
        });
      }

      // 支を取り出す
      const branchObj = EARTHLY_BRANCHES.find(
        branch =>
          branch.value ===
          fourPillars[pillarPositionKey as keyof FourPillars]!.branch
      );
      const branchPair = [branchObj, yearlyBranchObj] as EarthlyBranch[];
      const sortedBranchPair = EarthlyBranch.sort(branchPair);
      const branchPairStr = sortedBranchPair
        .map(p => p.value)
        .join('') as BranchPairName;

      // 支合チェック
      if (branchObj!.combination === yearlyLuck.branch) {
        branchCombinations.push({
          name: branchPairStr,
          pair: [
            {
              position: pillarPositionKey,
              value: branchObj!.value
            },
            {
              position: 'yearly',
              value: yearlyLuck.branch
            }
          ]
        });
      }

      // 冲チェック
      if (branchObj!.clash === yearlyLuck.branch) {
        branchClashes.push({
          name: branchPairStr,
          pair: [
            {
              position: pillarPositionKey,
              value: branchObj!.value
            },
            {
              position: 'yearly',
              value: yearlyLuck.branch
            }
          ]
        });
      }
    });

    // 空亡チェック
    const inEmptyPeriod = fourPillars.day.emptyElements!.some(element => {
      return element === yearlyLuck.branch;
    });

    const stemBranch = (yearlyLuck.stem +
      yearlyLuck.branch) as SexagenaryCycleName;

    return {
      value: stemBranch,
      year: year,
      age: year - birthYear,
      decadeLucks: decadeLuckArray,
      changingStar,
      twelveLuck,
      stemCombinations,
      branchCombinations,
      branchClashes,
      inEmptyPeriod
    };
  });
};
