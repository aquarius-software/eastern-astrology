// const promises = require('@/app/utils/promises');
import { FourPillarsPersonalInfo } from "./FourPillarsPersonalInfo";
import {
  getYearPillar,
  getMonthPillar,
  getDayPillar,
  getHourPillar,
  getChangingStar,
  getTwelveLuck,
  getStemPairs,
  getThreeHarmonyBranches,
  getThreeSeasonalBranches,
  getBranchPairs,
  getBranchClashes,
  getBranchBreaks,
  getBranchHarms,
  getBranchPunishments,
  getTwoHarmonyBranches,
  getTwoSeasonalBranches,
  getRoots
} from "./pillars";
import {
  isLuckOrderForward,
  getStartingAge,
  getDecadeLucks
} from "./luck";
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from "types";
import {
  getAdjustedChineseYear,
  getRangeOfMonth,
  numberOfDaysBetween2Days,
  currentTimeIsInRange
} from "utils";
import type {
  StemPair,
  BranchPair,
  DecadeLuck,
  FourPillars,
  YearlyLuck,
  BranchClash,
  HarmonyBranchCombination,
  SeasonalBranchCombination,
  SexagenaryCycle,
  Branch,
  SexagenaryCycleName,
  BranchBreak,
  BranchHarm,
  BranchPunishment,
  Term,
  DayHourDuration
} from "types";
import { HeavenlyStem, EarthlyBranch } from "types";
import { utcToJulianDay } from "utils";

export class FourPillarsData {
  private year!: SexagenaryCycle;
  private month!: SexagenaryCycle;
  private day!: SexagenaryCycle;
  private hour!: SexagenaryCycle | null;
  private hourStemObj?: HeavenlyStem;
  private dayStemObj?: HeavenlyStem;
  private monthStemObj?: HeavenlyStem;
  private yearStemObj?: HeavenlyStem;
  private hourBranchObj?: EarthlyBranch;
  private dayBranchObj?: EarthlyBranch;
  private monthBranchObj?: EarthlyBranch;
  private yearBranchObj?: EarthlyBranch;
  public stems: HeavenlyStem[] = [];
  public branches: EarthlyBranch[] = [];
  public stemPairs: StemPair[] = [];
  public threeHarmonyBranches: HarmonyBranchCombination | undefined;
  public twoHarmonyBranches: HarmonyBranchCombination[] | undefined;
  public threeSeasonalBranches: SeasonalBranchCombination | undefined;
  public twoSeasonalBranches: SeasonalBranchCombination[] | undefined;
  public branchPairs: BranchPair[] = [];
  public branchClashes: BranchClash[] = [];
  public branchBreaks: BranchBreak[] = [];
  public branchHarms: BranchHarm[] = [];
  public branchPunishments: BranchPunishment[] = [];
  public luckOrder!: boolean;
  public currentTerm!: Term;
  public elapsedDays!: DayHourDuration;
  public startingAge!: number;
  public currentAge!: number;
  public emptyPeriods: Branch[] | undefined = [];
  public decadeLucks: DecadeLuck[] = [];
  public yearlyLucks: YearlyLuck[] = [];
  public currentYear!: number;
  public currentDecadeLuck!: SexagenaryCycleName | "";
  public currentYearlyLuck!: SexagenaryCycleName | "";
  public passedYears!: number | undefined;
  public elementComposition: number[] = [];
  public temperature: number = 0;
  public humidity: number = 0;

  constructor(public personalInfo: FourPillarsPersonalInfo) { }

  /**
   * 四柱を初期化して中間情報を取得
   *
   * @public
   * @returns {void}
   */
  public init(): void {
    // 命式生成
    this.createFourPillars();
    this.currentTerm = getRangeOfMonth(
      this.personalInfo.adjustedDate,
      this.personalInfo.useSpaceMethod
    );
    this.elapsedDays = numberOfDaysBetween2Days(
      this.personalInfo.adjustedDate,
      this.currentTerm.startTime
    );
    this.stems = this.createStemsFromFourPillars();
    this.branches = this.createBranchesFromFourPillars();
    this.stemPairs = getStemPairs(this.stems); // 干合
    this.threeHarmonyBranches = getThreeHarmonyBranches(
      this.branches
    ); // 三合会局
    this.twoHarmonyBranches = getTwoHarmonyBranches(this.branches); // 三合会局半会
    this.threeSeasonalBranches = getThreeSeasonalBranches(
      this.branches
    ); // 方合
    this.twoSeasonalBranches = getTwoSeasonalBranches(this.branches); // 方合半会
    this.branchPairs = getBranchPairs(this.branches); // 支合
    this.branchClashes = getBranchClashes(this.branches); // 冲
    this.branchBreaks = getBranchBreaks(this.branches); // 破
    this.branchHarms = getBranchHarms(this.branches); // 害
    this.branchPunishments = getBranchPunishments(this.branches); // 刑

    // 立運取得
    this.luckOrder = isLuckOrderForward(
      this.personalInfo.gender,
      this.year.stem
    );
    this.startingAge = getStartingAge(
      this.currentTerm,
      this.personalInfo.adjustedDate,
      this.luckOrder
    );

    // 年齢取得
    this.currentAge = this.personalInfo.currentAge();

    // 大運取得
    const fourPillars: FourPillars = this.getFourPillars();
    if (this.personalInfo.isHourUnknown) {
      // 生時不明の場合
      delete fourPillars.hour;
    }
    this.decadeLucks = getDecadeLucks(fourPillars, 13, this);

    // 現大運取得
    for (let i = 0; i < this.decadeLucks.length; i++) {
      const decadeLuck = this.decadeLucks[i];
      if (decadeLuck.inCurrentPeriod) {
        this.currentDecadeLuck = decadeLuck.value;
        this.passedYears = decadeLuck.passedYears;
        break;
      }
    }

    // 現在の調整済み年取得
    this.currentYear = getAdjustedChineseYear(
      new Date(),
      this.personalInfo.useSpaceMethod
    );

    // 現歳運取得
    const yearPillar = getYearPillar(this.currentYear);
    this.currentYearlyLuck = (yearPillar.stem +
      yearPillar.branch) as SexagenaryCycleName;

    // 空亡取得
    this.emptyPeriods = fourPillars.day.emptyElements;

    // 五行数値計算
    this.elementComposition = this.calculateElementComposition();

    // 寒暖計算
    this.temperature = this.calculateTemperature();

    // 燥湿計算
    this.humidity = this.calculateHumidity();
  }

  /**
   * 四柱を取得
   *
   * @public
   * @returns {FourPillars}
   */
  public getFourPillars(): FourPillars {
    const fourPillars: FourPillars = {
      hour: this.hour,
      day: this.day,
      month: this.month,
      year: this.year
    };

    return fourPillars;
  }

  /**
   * 四柱オブジェクトを生成
   *
   * @private
   * @async
   * @returns {Promise<void>}
   */
  private createFourPillars(): void | null {
    const solarTerm = this.personalInfo.solarTerm;
    if (!solarTerm) {
      return null;
    }
    const adjustedDate = this.personalInfo.adjustedDate;
    const timezoneOffset = Number(this.personalInfo.timezoneOffset);
    const localAdjustedDate = new Date(adjustedDate.getTime());
    localAdjustedDate.setMinutes(
      localAdjustedDate.getMinutes() + -timezoneOffset
    );
    let originalYear: number = localAdjustedDate.getUTCFullYear();
    let adjustedYear = originalYear;
    const originalMonth: number = localAdjustedDate.getUTCMonth() + 1;
    let adjustedMonth = originalMonth;
    const hour: number = localAdjustedDate.getUTCHours();
    // let julianDay: number = await promises.swe_utc_to_jd(adjustedDate);
    const julianDay = utcToJulianDay(localAdjustedDate);
    // if (jd.error) {
    //   console.error(jd.error);
    //   return null;
    // }
    // let julianDay = jd.ut;
    // const offset: number = this.personalInfo.utcOffset / 24;
    // const offset: number = 9 / 24; // 日本時間で計算
    // julianDay = julianDay + offset; // 時差調整

    // 立春前の場合は昨年に戻し、節入り日前は前の月に戻す
    if (this.personalInfo.useSpaceMethod) {
      // 定気法
      // 1月または2月で、太陽黄経が315度以下の場合
      if (originalMonth <= 2 && this.personalInfo.elon! <= 315) {
        adjustedYear--;
      }
    } else {
      // 平気法
      // 1月または2月で、二十四節気が冬至か小寒か大寒の場合
      if (
        originalMonth <= 2 &&
        solarTerm.index >= 19 &&
        solarTerm.index <= 21
      ) {
        adjustedYear--;
      }
    }

    if (solarTerm.month + 1 === originalMonth) {
      // 2月から12月までの節入り日前の場合
      adjustedMonth = originalMonth - 1;
    } else if (solarTerm.month === 12 && originalMonth === 1) {
      // 1月の節入り日前の場合
      adjustedMonth = 12;
      originalYear = originalYear - 1;
    }

    // 順番はこのまま
    this.year = getYearPillar(adjustedYear);
    this.month = getMonthPillar(originalYear, adjustedMonth);
    this.day = getDayPillar(
      hour,
      julianDay,
      this.personalInfo.changeDayStem
    );
    this.hour = getHourPillar(
      hour,
      this.day.stem,
      this.personalInfo.changeDayStem
    );
  }

  /**
   * 四柱オブジェクトから天干オブジェクトを生成
   *
   * @returns {HeavenlyStem[]} 天干オブジェクトの配列
   */
  private createStemsFromFourPillars(): HeavenlyStem[] {
    const stems: HeavenlyStem[] = [];

    // 生時不明の場合は追加しない
    if (!this.personalInfo.isHourUnknown && this.hour) {
      this.hourStemObj = HEAVENLY_STEMS.find(
        stem => stem.value === this.hour!.stem
      );
      this.hourStemObj!.position = "hour";
      stems.push({
        index: this.hourStemObj?.index,
        position: "hour",
        value: this.hour.stem,
        elementId: this.hourStemObj?.elementId,
        changingStar: getChangingStar(this.day.stem, this.hour.stem),
        twelveLuck: getTwelveLuck(this.day.stem, this.hour.branch),
        roots: getRoots(
          this.hourStemObj?.roots,
          this.hour.branch,
          this.day.branch,
          this.month.branch,
          this.year.branch
        ),
        description: this.hourStemObj?.description,
        explanation: this.hourStemObj?.explanation
      });
    }

    this.dayStemObj = HEAVENLY_STEMS.find(
      stem => stem.value === this.day.stem
    );
    this.dayStemObj!.position = "day";
    this.monthStemObj = HEAVENLY_STEMS.find(
      stem => stem.value === this.month.stem
    );
    this.monthStemObj!.position = "month";
    this.yearStemObj = HEAVENLY_STEMS.find(
      stem => stem.value === this.year.stem
    );
    this.yearStemObj!.position = "year";

    stems.push(
      {
        index: this.dayStemObj?.index,
        position: "day",
        value: this.day.stem,
        elementId: this.dayStemObj?.elementId,
        changingStar: "",
        twelveLuck: getTwelveLuck(this.day.stem, this.day.branch),
        roots: getRoots(
          this.dayStemObj?.roots,
          this.personalInfo.isHourUnknown
            ? undefined
            : this.hour!.branch,
          this.day.branch,
          this.month.branch,
          this.year.branch
        ),
        description: this.dayStemObj?.description,
        explanation: this.dayStemObj?.explanation
      },
      {
        index: this.monthStemObj?.index,
        position: "month",
        value: this.month.stem,
        elementId: this.monthStemObj?.elementId,
        changingStar: getChangingStar(this.day.stem, this.month.stem),
        twelveLuck: getTwelveLuck(this.day.stem, this.month.branch),
        roots: getRoots(
          this.monthStemObj?.roots,
          this.personalInfo.isHourUnknown
            ? undefined
            : this.hour!.branch,
          this.day.branch,
          this.month.branch,
          this.year.branch
        ),
        description: this.monthStemObj?.description,
        explanation: this.monthStemObj?.explanation
      },
      {
        index: this.yearStemObj?.index,
        position: "year",
        value: this.year.stem,
        elementId: this.yearStemObj?.elementId,
        changingStar: getChangingStar(this.day.stem, this.year.stem),
        twelveLuck: getTwelveLuck(this.day.stem, this.year.branch),
        roots: getRoots(
          this.yearStemObj?.roots,
          this.personalInfo.isHourUnknown
            ? undefined
            : this.hour!.branch,
          this.day.branch,
          this.month.branch,
          this.year.branch
        ),
        description: this.yearStemObj?.description,
        explanation: this.yearStemObj?.explanation
      }
    );

    return stems;
  }

  /**
   * 四柱オブジェクトから地支オブジェクトを生成
   *
   * @returns {EarthlyBranch[]} 地支オブジェクト（蔵干付き）の配列
   */
  private createBranchesFromFourPillars(): EarthlyBranch[] {
    const branches: EarthlyBranch[] = [];

    // 生時不明の場合は追加しない
    if (!this.personalInfo.isHourUnknown && this.hour) {
      this.hourBranchObj = EARTHLY_BRANCHES.find(
        branch => branch.value === this.hour!.branch
      );
      this.hourBranchObj!.position = "hour";
      branches.push({
        index: this.hourBranchObj?.index,
        position: "hour",
        value: this.hour.branch,
        elementId: this.hourBranchObj?.elementId,
        hiddenStems: this.hourBranchObj!.hiddenStems!.map(stem => {
          const inProgress = currentTimeIsInRange(
            this.personalInfo.adjustedDate,
            this.currentTerm.startTime,
            stem.offsetDays as number,
            stem.durationDays as number
          );
          return {
            category: stem.category,
            value: stem.value,
            inProgress,
            changingStar: getChangingStar(this.day.stem, stem.value)
          };
        }),
        description: this.hourBranchObj?.description,
        explanation: this.hourBranchObj?.explanation
      });
    }

    this.dayBranchObj = EARTHLY_BRANCHES.find(
      branch => branch.value === this.day.branch
    );
    this.dayBranchObj!.position = "day";
    this.monthBranchObj = EARTHLY_BRANCHES.find(
      branch => branch.value === this.month.branch
    );
    this.monthBranchObj!.position = "month";
    this.yearBranchObj = EARTHLY_BRANCHES.find(
      branch => branch.value === this.year.branch
    );
    this.yearBranchObj!.position = "year";

    branches.push(
      {
        index: this.dayBranchObj?.index,
        position: "day",
        value: this.day.branch,
        elementId: this.dayBranchObj?.elementId,
        hiddenStems: this.dayBranchObj!.hiddenStems!.map(stem => {
          const inProgress = currentTimeIsInRange(
            this.personalInfo.adjustedDate,
            this.currentTerm.startTime,
            stem.offsetDays as number,
            stem.durationDays as number
          );
          return {
            category: stem.category,
            value: stem.value,
            inProgress,
            changingStar: getChangingStar(this.day.stem, stem.value)
          };
        }),
        description: this.dayBranchObj?.description,
        explanation: this.dayBranchObj?.explanation
      },
      {
        index: this.monthBranchObj?.index,
        position: "month",
        value: this.month.branch,
        elementId: this.monthBranchObj?.elementId,
        hiddenStems: this.monthBranchObj!.hiddenStems!.map(stem => {
          const inProgress = currentTimeIsInRange(
            this.personalInfo.adjustedDate,
            this.currentTerm.startTime,
            stem.offsetDays as number,
            stem.durationDays as number
          );
          return {
            category: stem.category,
            value: stem.value,
            inProgress,
            changingStar: getChangingStar(this.day.stem, stem.value)
          };
        }),
        description: this.monthBranchObj?.description,
        explanation: this.monthBranchObj?.explanation
      },

      {
        index: this.yearBranchObj?.index,
        position: "year",
        value: this.year.branch,
        elementId: this.yearBranchObj?.elementId,
        hiddenStems: this.yearBranchObj!.hiddenStems!.map(stem => {
          const inProgress = currentTimeIsInRange(
            this.personalInfo.adjustedDate,
            this.currentTerm.startTime,
            stem.offsetDays as number,
            stem.durationDays as number
          );
          return {
            category: stem.category,
            value: stem.value,
            inProgress,
            changingStar: getChangingStar(this.day.stem, stem.value)
          };
        }),
        description: this.yearBranchObj?.description,
        explanation: this.yearBranchObj?.explanation
      }
    );

    return branches;
  }

  /**
   * 五行構成の計算
   * @returns {number[]}
   */
  private calculateElementComposition(): number[] {
    // 天干の計算
    const elementComposition = [0, 0, 0, 0, 0];
    const heavenlyStems = [
      this.dayStemObj,
      this.monthStemObj,
      this.yearStemObj
    ];
    if (this.hourStemObj) {
      heavenlyStems.push(this.hourStemObj);
    }
    heavenlyStems.forEach(stem => {
      const elementId = stem?.elementId as number;
      const elementValue = elementComposition[elementId];
      elementComposition[elementId] = elementValue + 1.0;
    });

    // 地支の計算
    const earthlyBranches = [
      this.dayBranchObj,
      this.monthBranchObj,
      this.yearBranchObj
    ];
    if (this.hourBranchObj) {
      earthlyBranches.push(this.hourBranchObj);
    }
    earthlyBranches.forEach(branch => {
      for (let i = 0; i < 5; i++) {
        let elementValue = branch?.elementComposition![i] as number;
        if (branch?.position === "month") {
          // 月支の場合は3倍
          elementValue = elementValue * 3;
        }
        elementComposition[i] = elementComposition[i] + elementValue;
      }
    });

    return elementComposition;
  }

  /**
   * 寒暖の計算
   * @returns {number}
   */
  private calculateTemperature(): number {
    // 天干の計算
    let temperature = 0;
    let divisor = this.hourStemObj ? 10 : 8;
    const heavenlyStems = [
      this.dayStemObj,
      this.monthStemObj,
      this.yearStemObj
    ];
    if (this.hourStemObj) {
      heavenlyStems.push(this.hourStemObj);
    }
    heavenlyStems.forEach(stem => {
      temperature += stem?.temperature as number;
    });

    // 地支の計算
    const earthlyBranches = [
      this.dayBranchObj,
      this.monthBranchObj,
      this.yearBranchObj
    ];
    if (this.hourBranchObj) {
      earthlyBranches.push(this.hourBranchObj);
    }
    earthlyBranches.forEach(branch => {
      let temperatureValue = branch?.temperature as number;
      if (branch?.position === "month") {
        // 月支の場合は3倍
        temperatureValue = temperatureValue * 3;
      }
      temperature += temperatureValue;
    });

    return temperature / divisor;
  }

  /**
   * 燥湿の計算
   * @returns {number}
   */
  private calculateHumidity(): number {
    // 天干の計算
    let humidity = 0;
    let divisor = this.hourStemObj ? 10 : 8;
    const heavenlyStems = [
      this.dayStemObj,
      this.monthStemObj,
      this.yearStemObj
    ];
    if (this.hourStemObj) {
      heavenlyStems.push(this.hourStemObj);
    }
    heavenlyStems.forEach(stem => {
      humidity += stem?.humidity as number;
    });

    // 地支の計算
    const earthlyBranches = [
      this.dayBranchObj,
      this.monthBranchObj,
      this.yearBranchObj
    ];
    if (this.hourBranchObj) {
      earthlyBranches.push(this.hourBranchObj);
    }
    earthlyBranches.forEach(branch => {
      let humidityValue = branch?.humidity as number;
      if (branch?.position === "month") {
        // 月支の場合は3倍
        humidityValue = humidityValue * 3;
      }
      humidity += humidityValue;
    });

    return humidity / divisor;
  }

  /**
   * 四柱情報をオブジェクト化
   *
   * @public
   * @returns {Object}
   */
  public getObject(): Object {
    return {
      heavenlyStems: this.stems,
      earthlyBranches: this.branches,
      stemPairs: this.stemPairs,
      threeHarmonyBranches: this.threeHarmonyBranches,
      twoHarmonyBranches: this.twoHarmonyBranches,
      threeSeasonalBranches: this.threeSeasonalBranches,
      twoSeasonalBranches: this.twoSeasonalBranches,
      branchPairs: this.branchPairs,
      branchClashes: this.branchClashes,
      branchBreaks: this.branchBreaks,
      branchHarms: this.branchHarms,
      branchPunishments: this.branchPunishments,
      emptyPeriods: this.emptyPeriods,
      luckOrder: this.luckOrder,
      currentTerm: this.currentTerm,
      elapsedDays: this.elapsedDays,
      startingAge: this.startingAge,
      currentAge: this.currentAge,
      decadeLucks: this.decadeLucks,
      currentYear: this.currentYear,
      currentDecadeLuck: this.currentDecadeLuck,
      currentYearlyLuck: this.currentYearlyLuck,
      passedYears: this.passedYears,
      elementComposition: this.elementComposition,
      temperature: this.temperature,
      humidity: this.humidity,
      dayStemIndex: this.dayStemObj?.index,
      monthStemIndex: this.monthStemObj?.index,
      yearStemIndex: this.yearStemObj?.index,
      monthBranchIndex: this.monthBranchObj?.index
    };
  }

  /**
   * 年運情報をオブジェクト化
   *
   * @public
   * @returns {Object}
   */
  public getYearlyLuckObject(): Object {
    return {
      yearlyLucks: this.yearlyLucks
    };
  }
}
