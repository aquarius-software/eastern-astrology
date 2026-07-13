/**
 * 配列の指定の位置から、指定した個数を順番を指定して取得する。最後に到達したら、最初から再び循環する。
 * https://stackoverflow.com/questions/37911429/recursive-function-maintain-a-global-counter-without-using-a-global-variable
 *
 * @template T
 * @param {T[]} array 取得元の配列
 * @param {number} startIndex 取得開始位置
 * @param {number} num 取得する個数
 * @param {boolean} isForward 正順はtrue、逆順はfalse
 * @returns {T[]} 結果の配列
 */
export const getItemsFromArrayCycle = <T>(
  array: T[],
  startIndex: number,
  num: number,
  isForward: boolean
): T[] => {
  const resultArray: T[] = [];
  if (num <= 0) return resultArray;

  let sourceArray = [...array]; // 配列のコピー
  sourceArray = isForward ? sourceArray : sourceArray.reverse(); // 逆順の場合は逆にする
  startIndex = isForward ? startIndex : sourceArray.length - startIndex - 1;

  // 実質的な処理を行う内部関数（無限ループに注意）
  const innerFunc = (index: number, num: number) => {
    if (num <= 0 || index < 0) return;
    // 配列の長さを超えた場合は最後まで
    const slicedArray = sourceArray.slice(index, index + num);
    if (slicedArray.length <= 0) return;
    resultArray.push(...slicedArray);
    num -= slicedArray.length;
    if (num <= 0) return;
    innerFunc(0, num); // 再帰呼び出し（位置は最初から）
  };

  innerFunc(startIndex, num);
  return resultArray;
};

/**
 * 配列の隣同士をペアにした二次元配列作成
 * e.g. [1, 2, 3, 4] => [[1, 2], [2, 3], [3, 4]]
 *
 * @template T
 * @param {T[]} array 元の配列
 * @returns {T[][]}  隣同士をペアにした二次元配列
 */
export const makePairs = <T>(array: T[]): T[][] => {
  if (array.length < 2) return [];
  
  const pairs: T[][] = [];
  array.reduce((prev, curr) => {
    pairs.push([prev, curr]);
    return curr;
  });

  return pairs;
};