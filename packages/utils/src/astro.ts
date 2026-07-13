const base = require('astronomia/base');
const eqtime = require('astronomia/eqtime');
const julian = require('astronomia/julian');
const sexagesimal = require('astronomia/sexagesimal');
const planetposition = require('astronomia/planetposition');
const earth = require('astronomia/data/vsop87Bearth');
const solar = require('astronomia/solar');
import { DMS } from "types";
import { isValidDate } from "./time";

/**
 * 太陽黄経を取得
 *
 * @param {Date} date 取得する日時
 * @returns {number | null} 太陽黄経（0 - 360）
 */
export const getEclipticLongitude = (date: Date): number | undefined => {
  if (!isValidDate(date)) {
    return undefined;
  }

  const j = julian.DateToJD(date);
  const tl = solar.trueLongitude(base.J2000Century(j));
  const degree = tl.lon * (180 / Math.PI);

  return degree;
};

/**
 * 均時差を取得
 *
 * @param {Date} date 均時差を取得する日時
 * @returns {DMS} 均時差のDMS（度・分・秒）
 */
export const getEquationOfTime = (date: Date): DMS | undefined => {
  if (!isValidDate(date)) {
    return undefined;
  }

  const planet = new planetposition.Planet(earth.default);
  const j = julian.DateToJD(date);
  const eq = eqtime.e(j, planet);
  const dms = new sexagesimal.HourAngle(eq).toDMS();

  return {
    neg: dms[0],
    d: dms[1],
    m: dms[2],
    s: dms[3],
  };
};
