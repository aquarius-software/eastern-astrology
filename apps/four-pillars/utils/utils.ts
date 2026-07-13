import { DateTime } from "luxon";
import { DecadeLuck, YearlyLuck } from "types";
import { SubmitData } from "@/app/types";

/**
 * 干合
 *
 * @param {*} item
 * @returns {string}
 */
export const stemCombinationStr = (item: DecadeLuck | YearlyLuck) => {
  if (item.stemCombinations.length < 1) return "";
  const finalStr = `干合（${item.stemCombinations
    .map(stem => {
      return stem.name;
    })
    .join("・")}）`;
  return finalStr;
};

/**
 * 支合
 *
 * @param {*} item
 * @returns {string}
 */
export const branchCombinationStr = (
  item: DecadeLuck | YearlyLuck
) => {
  if (item.branchCombinations.length < 1) return "";
  const finalStr = `支合（${item.branchCombinations
    .map(branch => {
      return branch.name;
    })
    .join("・")}）`;
  return finalStr;
};

/**
 * 冲
 *
 * @param {*} item
 * @returns {string}
 */
export const branchClashesStr = (item: DecadeLuck | YearlyLuck) => {
  if (item.branchClashes.length < 1) return "";
  const finalStr = `冲（${item.branchClashes
    .map(branch => {
      return branch.name;
    })
    .join("・")}）`;
  return finalStr;
};

/**
 * 三合会局
 *
 * @param {*} item
 * @returns {string}
 */
export const threeHarmonyCombinationsStr = (item: DecadeLuck) => {
  if (
    !item.threeHarmonyBranches ||
    item.threeHarmonyBranches.branches.length < 1
  ) {
    return "";
  }
  const branchStr = item.threeHarmonyBranches.branches
    .map(branch => branch)
    .join("");
  return `${item.threeHarmonyBranches.name}（${branchStr}）`;
};

/**
 * 三合会局半会
 *
 * @param {*} item
 * @returns {*}
 */
export const twoHarmonyCombinationsStr = (item: DecadeLuck) => {
  const twoHarmonyBranches = item.twoHarmonyBranches;
  if (!twoHarmonyBranches) {
    return null;
  }
  return twoHarmonyBranches.map(harmonyBranches => {
    const branchStr = harmonyBranches.branches
      .map(branch => branch)
      .join("");
    return `${harmonyBranches.name}（${branchStr}）`;
  });
};

/**
 * 方合
 *
 * @param {*} item
 * @returns {string}
 */
export const threeSeasonalCombinationsStr = (item: DecadeLuck) => {
  if (
    !item.threeSeasonalBranches ||
    item.threeSeasonalBranches.branches.length < 1
  ) {
    return "";
  }
  const branchStr = item.threeSeasonalBranches.branches
    .map(branch => branch)
    .join("");
  return `${item.threeSeasonalBranches.name}（${branchStr}）`;
};

/**
 * 方合半会
 *
 * @param {*} item
 * @returns {*}
 */
export const twoSeasonalCombinationsStr = (item: DecadeLuck) => {
  const twoSeasonalBranches = item.twoSeasonalBranches;
  if (!twoSeasonalBranches) {
    return null;
  }
  return twoSeasonalBranches.map(seasonalBranches => {
    const branchStr = seasonalBranches.branches
      .map(branch => branch)
      .join("");
    return `${seasonalBranches.name}（${branchStr}）`;
  });
};

/**
 * フォーム入力データからDateオブジェクトを生成
 *
 * @param {SubmitData} data
 * @returns {Date}
 */
export const generateDateFromSubmitData = (data: SubmitData): Date => {
  const year = Number(data.year);
  const month = Number(data.month);
  const day = Number(data.day);
  let hour;
  let minute;
  if (data.isHourUnknown) {
    hour = 12;
    minute = 0;
  } else {
    hour = Number(data.hour);
    minute = Number(data.minute);
  }
  const localTime = DateTime.local(year, month, day, hour, minute, 0);

  return new Date(localTime.toString());
};

/**
 * 入力データから日時を生成
 *
 * @param {SubmitData} data
 * @param {string} zone
 * @returns {Date}
 */
export const generateIsoDate = (
  data: SubmitData,
  zone: string
): Date => {
  const year = Number(data.year);
  const month = Number(data.month);
  const day = Number(data.day);
  const hour = Number(data.hour);
  const minute = Number(data.minute);

  const adjustedDate = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0 },
    { zone }
  );

  return new Date(adjustedDate.toString());
};

/**
 * 入力データから日時を生成
 *
 * @param {SubmitData} data
 * @param {string} zone
 * @returns {DateTime}
 */
export const generateBirthDateTime = (
  data: SubmitData,
  zone: string
): DateTime => {
  const year = Number(data.year);
  const month = Number(data.month);
  const day = Number(data.day);
  const hour = Number(data.hour);
  const minute = Number(data.minute);
  const luxonDate = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0 },
    { zone }
  );
  return luxonDate;
};