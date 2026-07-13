import {
  Branch,
  BranchClash,
  BranchBreak,
  BranchHarm,
  BranchPair,
  BranchPunishment,
  DecadeLuck,
  DivisionMethod,
  EarthlyBranch,
  Gender,
  HarmonyBranchCombination,
  HeavenlyStem,
  SeasonalBranchCombination,
  SexagenaryCycleName,
  StemPair,
  DayStemMethod,
  DMS,
  Term,
  DayHourDuration
} from "types";

/**
 *
 * @export
 * @interface FourPillarsProps
 * @typedef {FourPillarsProps}
 */
export interface FourPillarsProps {
  result: FourPillarsData;
}

/**
 *
 * @export
 * @interface FourPillarsData
 * @typedef {FourPillarsData}
 */
export interface FourPillarsData {
  heavenlyStems: HeavenlyStem[];
  earthlyBranches: EarthlyBranch[];
  birthDateTime: string;
  isHourUnknown: boolean;
  timeZoneName: string;
  timeZoneId: string;
  gender: Gender;
  currentDecadeLuck: SexagenaryCycleName;
  currentYearlyLuck: SexagenaryCycleName;
  passedYears: number;
  adjustedDate: string;
  eclipticLongitude: number;
  solarTerm: string;
  equationOfTime: DMS;
  inEarthPeriod: boolean;
  utcOffset: number;
  rawOffset: number;
  dstOffset: number;
  localOffsetMinutes: number;
  latitude: string;
  longitude: string;
  timezoneOffset: number;
  useSpaceMethod: boolean;
  createImage: boolean;
  changeDayStem: boolean;
  isJapanese: boolean;
  currentTerm: Term;
  elapsedDays: DayHourDuration;
  startingAge: number;
  currentAge: number;
  luckOrder: number;
  stemPairs: StemPair[];
  branchPairs: BranchPair[];
  threeSeasonalBranches: SeasonalBranchCombination;
  threeHarmonyBranches: HarmonyBranchCombination;
  twoSeasonalBranches: SeasonalBranchCombination[];
  twoHarmonyBranches: HarmonyBranchCombination[];
  branchClashes: BranchClash[];
  branchBreaks: BranchBreak[];
  branchHarms: BranchHarm[];
  branchPunishments: BranchPunishment[];
  emptyPeriods: Branch[];
  currentYear: number;
  decadeLucks: DecadeLuck[];
  imageUrl: string;
  dayStemIndex: number;
  monthStemIndex: number;
  yearStemIndex: number;
  monthBranchIndex: number;
  elementComposition: number[];
  temperature: number;
  humidity: number;
  nickname: string;
}

/**
 * https://stackoverflow.com/questions/71275687/type-of-handlesubmit-parameter-in-react-hook-form
 *
 * @export
 * @typedef {SubmitData}
 */
export type SubmitData = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  autoFill: boolean;
  cityCode: number;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  nickname: string;
  isHourUnknown: boolean;
  gender: Gender;
  divisionMethod: DivisionMethod;
  changeDayStem: DayStemMethod;
  createImage: boolean;
  isJapanese: boolean;
  timeZoneName: string;
  timeZoneId: string;
  rawOffset: number;
  dstOffset: number;
  botcheck: boolean;
};

/**
 *
 * @export
 * @typedef {OptionData}
 */
export type OptionData = {
  showRoots: boolean;
  showChangingStars: boolean;
  showTwelveLucks: boolean;
  showHiddenStems: boolean;
  showWithColor: boolean;
};

/**
 * 
 * @export
 * @typedef {FourPillarsUrlData}
 */
export type FourPillarsUrlData = {
  birthDateTime: string,
  latitude: string,
  longitude: string,
  timezoneOffset: string,
  nickname: string
  isHourUnknown: string,
  gender: string,
  createImage: string,
  useSpaceMethod: string,
  changeDayStem: string,
  isJapanese: string,
  timeZoneId: string,
  rawOffset: string,
  dstOffset: string
}