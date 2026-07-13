import { describe, it, expect } from 'vitest';
import type { ChartRequest, BoardRequest } from 'types';
import { validateFourPillarsRequest, validatePurpleStarRequest } from './validate';

/** 有効な四柱推命リクエストを生成（テストごとに一部を上書きして使う） */
const validChartRequest = (): ChartRequest => ({
  isoDate: '2000-01-01T00:00:00Z',
  latitude: 35.69,
  longitude: 139.7,
  gender: '1',
  languageCode: 'ja',
  utcOffset: 9,
  dstOffset: 0,
  useSpaceMethod: true,
  createImage: false,
  isHourUnknown: false,
  changeDayStem: false,
  yearlyLucks: false
});

/** 有効な紫微斗数リクエストを生成 */
const validBoardRequest = (): BoardRequest => ({
  isoDate: '2000-01-01T00:00:00Z',
  latitude: 35.69,
  longitude: 139.7,
  gender: '1',
  languageCode: 'ja',
  utcOffset: 9,
  dstOffset: 0,
  useSpaceMethod: true,
  school: 's'
});

describe('validateFourPillarsRequest', () => {
  it('有効なリクエストには空文字を返す', () => {
    expect(validateFourPillarsRequest(validChartRequest())).toBe('');
  });

  it('languageCode が空文字なら省略扱いで有効', () => {
    expect(validateFourPillarsRequest({ ...validChartRequest(), languageCode: '' })).toBe('');
  });

  it('gender は "0" も有効', () => {
    expect(validateFourPillarsRequest({ ...validChartRequest(), gender: '0' })).toBe('');
  });

  it('範囲外の年(3000超)はエラーメッセージを返す', () => {
    const error = validateFourPillarsRequest({
      ...validChartRequest(),
      isoDate: '3001-01-01T00:00:00Z'
    });
    expect(error).toMatch(/out of range/);
  });

  it('範囲外の経度はエラー', () => {
    expect(validateFourPillarsRequest({ ...validChartRequest(), longitude: 181 })).toMatch(
      /Invalid longitude/
    );
    expect(validateFourPillarsRequest({ ...validChartRequest(), longitude: -181 })).toMatch(
      /Invalid longitude/
    );
  });

  it('範囲外の緯度はエラー', () => {
    expect(validateFourPillarsRequest({ ...validChartRequest(), latitude: 91 })).toMatch(
      /Invalid latitude/
    );
    expect(validateFourPillarsRequest({ ...validChartRequest(), latitude: -91 })).toMatch(
      /Invalid latitude/
    );
  });

  it('"0"/"1" 以外の gender はエラー', () => {
    expect(validateFourPillarsRequest({ ...validChartRequest(), gender: '2' })).toMatch(
      /Invalid gender/
    );
  });

  it('"ja" 以外の languageCode はエラー', () => {
    expect(validateFourPillarsRequest({ ...validChartRequest(), languageCode: 'en' })).toMatch(
      /Invalid languageCode/
    );
  });

  it('範囲外の utcOffset / dstOffset はエラー', () => {
    expect(validateFourPillarsRequest({ ...validChartRequest(), utcOffset: 15 })).toMatch(
      /Invalid utcOffset/
    );
    expect(validateFourPillarsRequest({ ...validChartRequest(), dstOffset: 2 })).toMatch(
      /Invalid dstOffset/
    );
  });

  it('boolean でないフラグはエラー', () => {
    expect(
      validateFourPillarsRequest({ ...validChartRequest(), useSpaceMethod: 'yes' as any })
    ).toMatch(/Invalid useSpaceMethod/);
    expect(
      validateFourPillarsRequest({ ...validChartRequest(), isHourUnknown: 1 as any })
    ).toMatch(/Invalid isHourUnknown/);
    expect(
      validateFourPillarsRequest({ ...validChartRequest(), changeDayStem: 'true' as any })
    ).toMatch(/Invalid changeDayStem/);
    expect(
      validateFourPillarsRequest({ ...validChartRequest(), yearlyLucks: null as any })
    ).toMatch(/Invalid yearlyLucks/);
  });

  it('createImage が boolean でない場合はエラー', () => {
    expect(
      validateFourPillarsRequest({ ...validChartRequest(), createImage: 'no' as any })
    ).toMatch(/Invalid createImage/);
  });

  it('不正な isoDate はエラーメッセージを返す', () => {
    expect(validateFourPillarsRequest({ ...validChartRequest(), isoDate: 'invalid' })).toBe(
      'Invalid isoDate parameter: invalid'
    );
  });
});

describe('validatePurpleStarRequest', () => {
  it('有効なリクエストには空文字を返す', () => {
    expect(validatePurpleStarRequest(validBoardRequest())).toBe('');
  });

  it('school は "h" も有効', () => {
    expect(validatePurpleStarRequest({ ...validBoardRequest(), school: 'h' })).toBe('');
  });

  it('"s"/"h" 以外の school はエラー', () => {
    expect(validatePurpleStarRequest({ ...validBoardRequest(), school: 'x' })).toMatch(
      /Invalid school/
    );
  });

  it('共通の検証(経度・緯度・gender・offset)も働く', () => {
    expect(validatePurpleStarRequest({ ...validBoardRequest(), longitude: 181 })).toMatch(
      /Invalid longitude/
    );
    expect(validatePurpleStarRequest({ ...validBoardRequest(), latitude: 91 })).toMatch(
      /Invalid latitude/
    );
    expect(validatePurpleStarRequest({ ...validBoardRequest(), gender: '2' })).toMatch(
      /Invalid gender/
    );
    expect(validatePurpleStarRequest({ ...validBoardRequest(), languageCode: 'en' })).toMatch(
      /Invalid languageCode/
    );
    expect(validatePurpleStarRequest({ ...validBoardRequest(), utcOffset: -13 })).toMatch(
      /Invalid utcOffset/
    );
    expect(validatePurpleStarRequest({ ...validBoardRequest(), dstOffset: 2 })).toMatch(
      /Invalid dstOffset/
    );
  });

  it('範囲外の年はエラーメッセージを返す', () => {
    expect(
      validatePurpleStarRequest({ ...validBoardRequest(), isoDate: '3001-01-01T00:00:00Z' })
    ).toMatch(/out of range/);
  });

  it('不正な isoDate はエラーメッセージを返す', () => {
    expect(validatePurpleStarRequest({ ...validBoardRequest(), isoDate: 'invalid' })).toBe(
      'Invalid isoDate parameter: invalid'
    );
  });
});
