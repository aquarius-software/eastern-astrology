import {
  minutesToMilliSeconds,
  getSolarTermBySpace,
  getSolarTermByTime,
  isEarthPeriodBySpace,
  isEarthPeriodByTime,
  getEquationOfTime,
  dmsToDecimalMinutes,
  getEclipticLongitude
} from 'utils';
import { PersonalInfo } from 'types';
import type { LanguageCode, SolarTerm, Gender, DMS } from 'types';

export class FourPillarsPersonalInfo extends PersonalInfo {
  public localOffsetMinutes!: number;
  public equationOfTime!: DMS | undefined;
  public elon!: number | undefined;
  public solarTerm!: SolarTerm | undefined;
  public inEarthPeriod!: boolean;

  constructor(
    birthDate: Date,
    longitude: number,
    latitude: number,
    timezoneOffset: number,
    utcOffset: number,
    dstOffset: number,
    gender: Gender,
    languageCode: LanguageCode,
    public useSpaceMethod: boolean,
    public createImage: boolean,
    public isHourUnknown: boolean,
    public changeDayStem: boolean,
    public yearlyLucks: boolean
  ) {
    super(birthDate, longitude, latitude, timezoneOffset, utcOffset, dstOffset, gender, languageCode);
  }

  public init(): void {
    // 地方時差（分）を取得
    this.localOffsetMinutes = this.longitude * 4 - this.utcOffset * 60;

    // 均時差を取得
    this.equationOfTime = getEquationOfTime(this.birthDate);

    // 調整後日時を取得
    this.adjustedDate = this.getAdjustedDate();

    // 太陽黄経を取得
    this.elon = getEclipticLongitude(this.adjustedDate);

    if (this.useSpaceMethod) {
      // 二十四節気取得
      this.solarTerm = getSolarTermBySpace(this.adjustedDate);
      // 土用判定
      this.inEarthPeriod = isEarthPeriodBySpace(this.elon);
    } else {
      // 二十四節気取得
      this.solarTerm = getSolarTermByTime(this.adjustedDate);
      // 土用判定
      this.inEarthPeriod = isEarthPeriodByTime(this.adjustedDate);
    }
  }

  /**
   * 調整後日時を取得
   *
   * @returns {Date} 調整後日時
   */
  private getAdjustedDate(): Date {
    // コピー作成
    const adjustedDate = new Date(this.birthDate.getTime());

    // 分の調整（サマータイム・均時差・地方時差）
    const timeToAdd = dmsToDecimalMinutes(this.equationOfTime!) + this.localOffsetMinutes - this.dstOffset * 60;
    const minutesToAdd = Math.floor(timeToAdd);
    adjustedDate.setMinutes(this.birthDate.getMinutes() + minutesToAdd);

    // 秒の調整
    const secondsToAdd = Math.floor((timeToAdd - Math.floor(timeToAdd)) * 60);
    adjustedDate.setSeconds(this.birthDate.getSeconds() + secondsToAdd);

    // ミリ秒の調整（必要かどうかは微妙）
    const millisecondsToAdd = minutesToMilliSeconds(timeToAdd);
    adjustedDate.setMilliseconds(
      this.birthDate.getMilliseconds() + millisecondsToAdd
    );

    return adjustedDate;
  }

  /**
   * 生年月日情報をオブジェクト化
   *
   * @public
   * @returns {Object}
   */
  public getObject(): Object {
    return {
      longitude: this.longitude,
      latitude: this.latitude,
      timezoneOffset: this.timezoneOffset,
      gender: this.gender,
      languageCode: this.languageCode,
      localOffsetMinutes: this.localOffsetMinutes,
      equationOfTime: this.equationOfTime,
      adjustedDate: this.adjustedDate,
      eclipticLongitude: this.elon,
      solarTerm: this.solarTerm!.name,
      inEarthPeriod: this.inEarthPeriod,
    };
  }
}
