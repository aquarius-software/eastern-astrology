import type { DMS, Gender, LanguageCode } from 'types';
import { DateTime } from "luxon";

/**
 * 生年月日データの抽象クラス
 *
 * @export
 * @abstract
 * @class PersonalInfo
 * @typedef {PersonalInfo}
 */
export abstract class PersonalInfo {
  constructor(
    public birthDate: Date,
    public longitude: number,
    public latitude: number,
    public timezoneOffset: number,
    public utcOffset: number,
    public dstOffset: number,
    public gender: Gender,
    public languageCode: LanguageCode
  ) { }

  public adjustedDate!: Date;
  public equationOfTime!: DMS | undefined;

  public abstract init(): void;
  public abstract getObject(): Object;

  /**
   * 性別が男性かどうかを判定するメソッド
   * @returns {boolean} 性別が男性の場合は true、それ以外の場合は false
   * @throws {Error} 性別データが無効な場合に例外をスローする
   */
  public isMale(): boolean {
    if (this.gender === '1') {
      return true;
    } else if (this.gender === '0') {
      return false;
    } else {
      throw new Error('Invalid gender data.');
    }
  }

  /**
   * 現在の年齢を計算して返すメソッド
   * @returns {number} 現在の年齢
   */
  public currentAge(): number {
    return Math.floor(-(DateTime.fromJSDate(this.birthDate).diffNow('years').years));
  }
}
