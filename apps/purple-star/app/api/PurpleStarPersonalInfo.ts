import { minutesToMilliSeconds } from 'utils';
import { PersonalInfo } from 'types';
import type { ChineseDate, LanguageCode, Gender } from 'types';
const CalendarChinese = require('date-chinese').CalendarChinese;
import { calculateAsianAge } from 'utils';

export class PurpleStarPersonalInfo extends PersonalInfo {
  public localOffsetMinutes!: number;
  public chineseDate!: ChineseDate;
  public asianAge!: number;

  constructor(
    birthDate: Date,
    longitude: number,
    latitude: number,
    utcOffset: number,
    dstOffset: number,
    timezoneOffset: number,
    gender: Gender,
    languageCode: LanguageCode,
    public useSpaceMethod: boolean,
    public school: string
  ) {
    super(birthDate, longitude, latitude, timezoneOffset, utcOffset, dstOffset, gender, languageCode);
  }

  public async init(): Promise<void> {
    // 地方時差（分）を取得
    // this.localOffsetMinutes = (this.longitude - 135) * 4;
    this.localOffsetMinutes = this.longitude * 4 - this.utcOffset * 60;

    // 調整後日時を取得
    this.adjustedDate = this.getAdjustedDate();

    // 旧暦を取得
    const adjustedChineseDate = new Date(this.adjustedDate.getTime());
    // 子時を翌日扱いとするために2時間プラス（date-chineseは北京時間を使用しているので注意）
    adjustedChineseDate.setTime(adjustedChineseDate.getTime() + (2 * 60 * 60 * 1000));
    this.chineseDate = this.getChineseDate(adjustedChineseDate);

    // 数え年計算
    this.asianAge = calculateAsianAge(this.adjustedDate);
  }

  /**
   * 調整後日時を取得
   *
   * @returns {Date} 調整後日時
   */
  private getAdjustedDate(): Date {
    // コピー作成
    const adjustedDate = new Date(this.birthDate.getTime());

    // 分の調整（サマータイム・地方時差）
    const timeToAdd = this.localOffsetMinutes - this.dstOffset * 60;
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
   * 旧暦を取得
   *
   * @public
   * @param {Date} date
   * @returns {ChineseDate}
   */
  public getChineseDate(date: Date): ChineseDate {
    let cal = new CalendarChinese();
    cal.fromDate(date);
    return {
      cycle: cal.cycle,
      year: cal.year,
      month: cal.month,
      isLeapMonth: cal.leap,
      day: cal.day
    };
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
      isMale: this.isMale(),
      languageCode: this.languageCode,
      localOffsetMinutes: this.localOffsetMinutes,
      equationOfTime: this.equationOfTime,
      adjustedDate: this.adjustedDate,
      chineseDate: this.chineseDate,
      asianAge: this.asianAge,
      school: this.school,
    };
  }
}
