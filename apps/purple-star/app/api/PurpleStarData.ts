import { PurpleStarPersonalInfo } from './PurpleStarPersonalInfo';
import { Palace } from './Palace';
import { getItemsFromArrayCycle, isLongChineseMonth } from 'utils';
import { SEXAGENARY_CYCLE, PALACE_STEMS, PALACE_BRANCHES } from 'types';
import {
  PALACE_NAMES,
  STEM_TABLE,
  DIVISIONS,
  DIVISION_TABLE,
  LUMINOSITY,
  MAJOR_STARS,
  HOURLY_STARS,
  HOURLY_YEARLY_STARS,
  MONTHLY_STARS,
  YEARLY_STEM_STARS,
  YEARLY_STEM_FOUR_STARS,
  YEARLY_BRANCH_STARS,
  PURPLE_STAR_POSITIONS,
  MAJOR_STAR_POSITIONS,
  MAJOR_STAR_STRENGTHS,
  HOURLY_STAR_POSITIONS,
  HOURLY_STAR_STRENGTHS,
  HOURLY_STAR_LUMINOSITY,
  HOURLY_YEARLY_STAR_POSITIONS,
  HOURLY_YEARLY_STAR_STRENGTHS,
  HOURLY_YEARLY_STAR_LUMINOSITY,
  MONTHLY_STAR_POSITIONS,
  MONTHLY_STAR_STRENGTHS,
  MONTHLY_STAR_LUMINOSITY,
  YEARLY_STEM_STAR_POSITIONS,
  YEARLY_STEM_STAR_STRENGTHS,
  YEARLY_STEM_STAR_LUMINOSITY,
  YEARLY_BRANCH_STAR_POSITIONS,
  YEARLY_BRANCH_STAR_STRENGTHS,
  YEARLY_BRANCH_STAR_LUMINOSITY,
  FOUR_STAR_POSITIONS,
  FOUR_STAR_STRENGTHS,
  FOUR_STAR_LUMINOSITY,
  MAJOR_STAR_LUMINOSITY
} from './constants';
import type {
  PalaceBranch,
  Division,
  SexagenaryCycle,
  Star,
  PalaceName,
  Branch
} from 'types';
const CalendarChinese = require('date-chinese').CalendarChinese;
const cal = new CalendarChinese();

export class PurpleStarData {
  constructor(private personalInfo: PurpleStarPersonalInfo) { }

  private year!: SexagenaryCycle;
  private month!: number;
  private day!: number;
  private hour!: PalaceBranch;
  private palaces: Palace[] = [];
  private selfPalaceBranch!: PalaceBranch;
  private division!: Division;
  private isYang!: boolean;
  private selfPalacePosition!: number;
  private bodyPalace!: PalaceName | '';
  private januaryBranchIndex!: number;
  private currentDecadePalaceName!: PalaceName | '';
  private currentYearlyPalaceName!: PalaceName | '';
  private currentDecadePalaceBranch!: Branch | '';
  private currentYearlyPalaceBranch!: Branch | '';
  private currentJanuaryBranchIndex!: Number;

  /**
   * 命盤を初期化して中間情報を取得
   *
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public init(): void {
    const cDate = this.personalInfo.chineseDate;
    let chineseDateYear = cDate.year;
    // 時支の判定には出生地の標準時（UTC + utcOffset）の時刻を使う。
    // getHours() は実行マシンのタイムゾーンに依存するため使わない
    // （CI や本番サーバーが UTC の場合に時支がズレて五行局・命宮が狂う）。
    const { adjustedDate, utcOffset } = this.personalInfo;
    const localMinutesOfDay =
      (adjustedDate.getUTCHours() * 60 +
        adjustedDate.getUTCMinutes() +
        Math.round(utcOffset * 60) +
        1440) % 1440;
    const hours = Math.floor(localMinutesOfDay / 60);

    // 閏月15日で小の月（29日）かつ午前11時以降は翌月生まれ
    // 閏月の16日以降生まれは翌月生まれ
    // 12月の場合は翌年1月に繰り上がり
    if (
      (cDate.isLeapMonth &&
        cDate.day === 15 &&
        !isLongChineseMonth(cDate) &&
        hours >= 11) ||
      (cDate.isLeapMonth && cDate.day >= 16)
    ) {
      cDate.month = cDate.month + 1;
      if (cDate.month > 12) {
        cDate.month = 1;
        chineseDateYear = chineseDateYear + 1 > 60 ? 1 : chineseDateYear + 1;
      }
    }

    this.year = SEXAGENARY_CYCLE[chineseDateYear - 1];
    this.month = cDate.month;

    this.day = cDate.day;
    this.hour = this.getHourBranch(hours);
    cDate.yearStem = this.year.stem;
    cDate.yearBranch = this.year.branch;
    cDate.hourBranch = this.hour.value;

    // 命宮決定
    let selfBranchIndex = (this.hour.selfBranchIndex + (this.month - 1)) % 12;
    const branchArray = getItemsFromArrayCycle(
      PALACE_BRANCHES,
      selfBranchIndex,
      12,
      true
    );
    this.selfPalaceBranch = branchArray[0];

    // 身宮決定
    let bodyBranchIndex = (this.hour.bodyBranchIndex + (this.month - 1)) % 12;
    const bodyBranch = PALACE_BRANCHES[bodyBranchIndex];

    // 五号局決定
    this.division = this.getDivisionName(this.year, this.selfPalaceBranch);

    // 紫微星位置取得
    const purpleStarIndex =
      PURPLE_STAR_POSITIONS[this.day - 1][this.division.index];

    // 年干取得
    const yearStem = PALACE_STEMS.find(stem => stem.value === this.year.stem);

    // 命宮干支取得
    const mainBranch = PALACE_BRANCHES[selfBranchIndex];
    const mainStemIndex = STEM_TABLE[yearStem!.index % 5][mainBranch.index];
    const mainStem = PALACE_STEMS[mainStemIndex];

    // 年支取得
    const yearBranch = PALACE_BRANCHES.find(
      branch => branch.value === this.year.branch
    );

    // 陰陽決定
    this.isYang = yearStem?.isYang ? true : false;

    const majorStarData: Star[][] = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ];
    const minorStarData: Star[][] = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ];

    // 主星配置
    MAJOR_STARS.forEach((star, index) => {
      const newStar = structuredClone(star);
      newStar.childStars = new Array(10).fill({});
      const branchIndex = MAJOR_STAR_POSITIONS[index][purpleStarIndex];
      newStar.strength = MAJOR_STAR_STRENGTHS[index][branchIndex];
      const luminosityIndex = MAJOR_STAR_LUMINOSITY[index][branchIndex];
      newStar.luminosity = LUMINOSITY[luminosityIndex].name;
      majorStarData[branchIndex].push(newStar);
    });

    // 時系諸星配置
    HOURLY_STARS.forEach((star, index) => {
      const newStar = structuredClone(star);
      newStar.childStars = new Array(10).fill({});
      const branchIndex = HOURLY_STAR_POSITIONS[index][this.hour.index];
      newStar.strength = HOURLY_STAR_STRENGTHS[index][branchIndex];
      const luminosityIndex = HOURLY_STAR_LUMINOSITY[index][branchIndex];
      newStar.luminosity = LUMINOSITY[luminosityIndex].name;
      minorStarData[branchIndex].push(newStar);
    });

    // 火星・鈴星配置
    HOURLY_YEARLY_STARS.forEach((star, index) => {
      const newStar = structuredClone(star);
      const branchIndex =
        HOURLY_YEARLY_STAR_POSITIONS[yearBranch!.group][index][this.hour.index];
      newStar.strength = HOURLY_YEARLY_STAR_STRENGTHS[index][branchIndex];
      const luminosityIndex = HOURLY_YEARLY_STAR_LUMINOSITY[index][branchIndex];
      newStar.luminosity = LUMINOSITY[luminosityIndex].name;
      minorStarData[branchIndex].push(newStar);
    });

    // 月系諸星配置
    MONTHLY_STARS.forEach((star, index) => {
      const newStar = structuredClone(star);
      newStar.childStars = new Array(10).fill({});
      const branchIndex = MONTHLY_STAR_POSITIONS[index][this.month - 1];
      newStar.strength = MONTHLY_STAR_STRENGTHS[index][branchIndex];
      const luminosityIndex = MONTHLY_STAR_LUMINOSITY[index][branchIndex];
      newStar.luminosity = LUMINOSITY[luminosityIndex].name;
      minorStarData[branchIndex].push(newStar);
    });

    // 年干系諸星配置
    YEARLY_STEM_STARS.forEach((star, index) => {
      const newStar = structuredClone(star);
      const branchIndex = YEARLY_STEM_STAR_POSITIONS[index][yearStem!.index];
      newStar.strength = YEARLY_STEM_STAR_STRENGTHS[index][branchIndex];
      const luminosityIndex = YEARLY_STEM_STAR_LUMINOSITY[index][branchIndex];
      newStar.luminosity = LUMINOSITY[luminosityIndex].name;
      minorStarData[branchIndex].push(newStar);
    });

    // 年支系諸星配置
    YEARLY_BRANCH_STARS.forEach((star, index) => {
      const newStar = structuredClone(star);
      const branchIndex =
        YEARLY_BRANCH_STAR_POSITIONS[index][yearBranch!.index];
      newStar.strength = YEARLY_BRANCH_STAR_STRENGTHS[index][branchIndex];
      const luminosityIndex = YEARLY_BRANCH_STAR_LUMINOSITY[index][branchIndex];
      newStar.luminosity = LUMINOSITY[luminosityIndex].name;
      minorStarData[branchIndex].push(newStar);
    });

    // 子年斗君決定
    const januaryBranch = (this.hour.index + (13 - this.month)) % 12;
    this.januaryBranchIndex = januaryBranch === 12 ? 0 : januaryBranch;

    // 現在年の1月の干支を取得
    cal.fromDate(new Date());
    const yearBranchIndex = (cal.year % 12 === 0 ? 12 : cal.year % 12) - 1;
    this.currentJanuaryBranchIndex =
      (this.januaryBranchIndex + yearBranchIndex) % 12;

    // 十二宮生成
    this.palaces = branchArray.map((branch, index) => {
      // 十干取得
      const stemIndex = STEM_TABLE[yearStem!.index % 5][branch.index];
      const stem = PALACE_STEMS[stemIndex];

      // 命宮判定
      const isMainPalace = branch.value === mainBranch.value;

      // 身宮判定
      const isBodyPalace = branch.value === bodyBranch.value;

      // 宮生成
      const palace = new Palace(
        PALACE_NAMES[index],
        stem.value,
        stem.index,
        branch.value,
        isMainPalace,
        isBodyPalace,
        branch.boardPosition
      );

      // 身宮取得
      if (isBodyPalace) {
        this.bodyPalace = palace.name;
      }

      // 主星・副星配置
      palace.majorStars.push(...majorStarData[branch.index]);
      palace.minorStars.push(...minorStarData[branch.index]);

      // 四化星配置
      const allStars = [...palace.majorStars, ...palace.minorStars];
      YEARLY_STEM_FOUR_STARS.forEach((fourStar, index) => {
        // 生年四化星配置
        let parentStarName = FOUR_STAR_POSITIONS[index][yearStem!.index];
        let parentStar = allStars.find(star => star.name === parentStarName);
        if (parentStar) {
          fourStar.strength = FOUR_STAR_STRENGTHS[index][branch.index];
          const luminosityIndex = FOUR_STAR_LUMINOSITY[index][branch.index];
          fourStar.luminosity = LUMINOSITY[luminosityIndex].name;
          parentStar.childStar = fourStar;
        }

        // 自化四化星配置
        parentStarName = FOUR_STAR_POSITIONS[index][stem.index];
        const selfParentStar = allStars.find(star => star.name === parentStarName);
        if (selfParentStar) {
          fourStar.strength = FOUR_STAR_STRENGTHS[index][branch.index];
          const luminosityIndex = FOUR_STAR_LUMINOSITY[index][branch.index];
          fourStar.luminosity = LUMINOSITY[luminosityIndex].name;
          selfParentStar.selfChildStar = fourStar;
        }

        // 流出四化星配置
        const triangleBranchIndex = (branch.index + 6) % 12;
        const stemIndex = STEM_TABLE[yearStem!.index % 5][triangleBranchIndex];
        parentStarName = FOUR_STAR_POSITIONS[index][stemIndex];
        const diagonalParentStar = allStars.find(star => star.name === parentStarName);
        if (diagonalParentStar) {
          fourStar.strength = FOUR_STAR_STRENGTHS[index][branch.index];
          const luminosityIndex = FOUR_STAR_LUMINOSITY[index][branch.index];
          fourStar.luminosity = LUMINOSITY[luminosityIndex].name;
          diagonalParentStar.triangleChildStar = fourStar;
        }

        // 命宮四化星配置
        parentStarName = FOUR_STAR_POSITIONS[index][mainStem.index];
        const mainParentStar = allStars.find(star => star.name === parentStarName);
        if (mainParentStar) {
          fourStar.strength = FOUR_STAR_STRENGTHS[index][branch.index];
          const luminosityIndex = FOUR_STAR_LUMINOSITY[index][branch.index];
          fourStar.luminosity = LUMINOSITY[luminosityIndex].name;
          mainParentStar.mainChildStar = fourStar;
        }

        // 全四化星配置
        Array.from({ length: 10 }, (v, i) => i).forEach((i) => {
          parentStarName = FOUR_STAR_POSITIONS[index][i];
          const parentStar = allStars.find(star => star.name === parentStarName);
          if (parentStar) {
            fourStar.strength = FOUR_STAR_STRENGTHS[index][branch.index];
            const luminosityIndex = FOUR_STAR_LUMINOSITY[index][branch.index];
            fourStar.luminosity = LUMINOSITY[luminosityIndex].name;
            parentStar.childStars![i] = fourStar;
          }
        })
      });

      // 星の力量計算
      palace.calculateStarPower();

      // 大限決定
      let palaceIndex: number = 0;
      if (
        (this.personalInfo.isMale() && yearStem!.isYang) ||
        (!this.personalInfo.isMale() && !yearStem!.isYang)
      ) {
        palaceIndex = index;
      } else if (
        (this.personalInfo.isMale() && !yearStem!.isYang) ||
        (!this.personalInfo.isMale() && yearStem!.isYang)
      ) {
        palaceIndex = index === 0 ? 0 : 12 - index;
      }
      palace.startingAge = palaceIndex * 10 + 2 + this.division.index;
      palace.endingAge = palace.startingAge + 9;

      // 現在の大限であるかどうか判定
      const asianAge = this.personalInfo.asianAge;
      if (palace.startingAge <= asianAge && palace.endingAge >= asianAge) {
        palace.isCurrentPalace = true;
        this.currentDecadePalaceName = palace.name;
        this.currentDecadePalaceBranch = palace.branch;
      } else {
        palace.isCurrentPalace = false;
      }

      // 小限決定
      let startIndex: number = 0;
      if (yearBranch!.group === 0) {
        startIndex = 4;
      } else if (yearBranch!.group === 1) {
        startIndex = 10;
      } else if (yearBranch!.group === 2) {
        startIndex = 7;
      } else if (yearBranch!.group === 3) {
        startIndex = 1;
      }
      const branches = getItemsFromArrayCycle(
        PALACE_BRANCHES,
        startIndex,
        12,
        this.personalInfo.isMale()
      );
      const branchIndex =
        branches.findIndex(branch => branch.value === palace.branch) + 1;
      palace.yearlyLucks = [...Array(11)].map((_, i) => {
        const age = branchIndex + i * 12;
        if (age === asianAge) {
          this.currentYearlyPalaceName = palace.name;
          this.currentYearlyPalaceBranch = palace.branch;
        }
        return {
          age: age
        };
      });

      return palace;
    });

    // 十二宮を大限順でソート
    this.palaces.sort((a, b) => (a.startingAge > b.startingAge ? 1 : -1));

    // 運命指数計算
    this.calcDestinyIndex();

    // 流年指数計算
    this.calcYearlyLuckIndex();
  }

  /**
   * 命盤をオブジェクト化
   *
   * @public
   * @returns {Object}
   */
  public getObject(): Object {
    return {
      division: this.division.value,
      isYang: this.isYang,
      palaces: this.palaces,
      selfPalacePosition: this.selfPalacePosition,
      bodyPalace: this.bodyPalace,
      januaryBranchIndex: this.januaryBranchIndex,
      currentDecadePalaceName: this.currentDecadePalaceName,
      currentYearlyPalaceName: this.currentYearlyPalaceName,
      currentDecadePalaceBranch: this.currentDecadePalaceBranch,
      currentYearlyPalaceBranch: this.currentYearlyPalaceBranch,
      currentJanuaryBranchIndex: this.currentJanuaryBranchIndex
    };
  }

  /**
   * 時支を取得
   *
   * @param {number} hour 時間（0-23）
   * @returns {(PalaceBranch | null)} 時干支
   */
  private getHourBranch(hour: number): PalaceBranch {
    // 引数に異常値が来たときのエラー処理（未対応）

    // 時間帯決定
    let hourZone: number = 0;
    if (hour === 23) {
      // 子の刻（23時以降）
      hourZone = 0;
    } else if (hour >= 0 && hour < 23) {
      hour = hour % 2 ? hour + 1 : hour; // 奇数はプラス1、偶数はそのまま
      hourZone = hour / 2;
    }

    // ※indexの境界に注意
    return PALACE_BRANCHES[hourZone];
  }

  /**
   * 五号局取得
   *
   * @private
   * @param {SexagenaryCycle} year
   * @param {PalaceBranch} selfPalaceBranch
   * @returns {string}
   */
  private getDivisionName(
    year: SexagenaryCycle,
    selfPalaceBranch: PalaceBranch
  ): Division {
    const yearStemIndex = ((year.index - 1) % 10) % 5;
    const palaceIndex = Math.floor(selfPalaceBranch.index / 2);
    const divisionIndex = DIVISION_TABLE[yearStemIndex][palaceIndex];
    return DIVISIONS[divisionIndex];
  }

  /**
   * 運命指数計算
   *
   * @private
   */
  private calcDestinyIndex(): void {
    this.palaces.forEach((palace, index) => {
      const fourthPalace = this.palaces[(index + 4) % 12]; // 三合宮
      const sixthPalace = this.palaces[(index + 6) % 12]; // 対宮
      const eighthPalace = this.palaces[(index + 8) % 12]; // 三合宮
      palace.destinyIndex =
        palace.starPower +
        sixthPalace.starPower * 0.5 +
        fourthPalace.starPower * 0.3 +
        eighthPalace.starPower * 0.3;
    });
  }

  /**
   * 流年指数計算
   *
   * @private
   */
  private calcYearlyLuckIndex(): void {
    this.palaces.forEach(palace => {
      palace.yearlyLucks = palace.yearlyLucks.map(yearlyLuck => {
        const decadePalace = this.palaces.find(
          p => p.startingAge <= yearlyLuck.age && p.endingAge >= yearlyLuck.age
        );
        if (decadePalace !== undefined) {
          return {
            ...yearlyLuck,
            luckIndex: decadePalace.destinyIndex * 2 + palace.destinyIndex
          };
        }
        return yearlyLuck;
      });
    });
  }
}
