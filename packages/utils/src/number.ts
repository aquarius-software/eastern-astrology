/**
 * 連番生成
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 *
 * @param {number} start
 * @param {number} stop
 * @param {number} step
 * @returns {*}
 */
export const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

/**
 * 小数点以下の桁数を指定して四捨五入する
 *
 * @param {number} value
 * @param {number} n
 * @returns {number}
 */
export const roundDecimal = (value: number, n: number): number => {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
};

/**
 * 10進数の数値を60進法の文字列（度°分'形式）に変換
 * 分が一桁の場合は先頭にゼロを追加
 * 
 * @param {number} number - 60進法に変換する10進数の数値
 * @returns {string} 60進法の文字列（度°分'形式）
 * @author ChatGPT 4
 */
export const convertToSexagesimal = (number: number): string => {
  const degrees: number = Math.floor(number); // 整数部分（度数）を取得
  const rawMinutes: number = Math.floor((number - degrees) * 60); // 小数部分を60倍して分数を計算
  const formattedMinutes: string =
    rawMinutes < 10 ? `0${rawMinutes}` : `${rawMinutes}`; // 分が一桁の場合はゼロで埋める
  return `${degrees}°${formattedMinutes}'`; // 結果を「度°分'」の形式で返す
};
