# utils パッケージ解説

このドキュメントは、`utils`パッケージの内容を初見の開発者向けに解説します。

## 📋 概要

`utils`は、このモノレポ全体で使用される共通ユーティリティ関数を提供する共有パッケージです。四柱推命・紫微斗数の計算、日時処理、数値処理、配列操作、バリデーションなどの汎用的な関数を提供します。

**目的**:
- プロジェクト全体で統一されたユーティリティ関数を提供
- 関数の重複を避け、メンテナンス性を向上
- 四柱推命・紫微斗数の計算ロジックを一元管理

## 📁 ディレクトリ構造

```
packages/utils/
├── index.ts              # エクスポートファイル（全関数をエクスポート）
├── package.json
├── tsconfig.json
└── src/
    ├── array.ts          # 配列操作関数
    ├── astro.ts          # 天文計算関連関数（黄経・均時差）
    ├── calendar.ts       # 暦・二十四節気・干支・旧暦の計算関数
    ├── number.ts         # 数値処理関数
    ├── time.ts           # 汎用の日時ユーティリティ（検証・加算減算・変換など）
    └── validate.ts       # バリデーション関数
```

## 📝 主要モジュール

### 1. `array.ts` - 配列操作

配列を操作するためのユーティリティ関数です。

#### `getItemsFromArrayCycle<T>`

配列の指定位置から指定個数を順番に取得し、最後に到達したら最初から再び循環します。

**シグネチャ**:
```typescript
export const getItemsFromArrayCycle = <T>(
  array: T[],
  startIndex: number,
  num: number,
  isForward: boolean
): T[]
```

**パラメータ**:
- `array`: 取得元の配列
- `startIndex`: 取得開始位置
- `num`: 取得する個数
- `isForward`: 正順は`true`、逆順は`false`

**使用例**:
```typescript
import { getItemsFromArrayCycle } from "utils";

const array = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// インデックス3（卯）から5個を正順で取得
const result = getItemsFromArrayCycle(array, 3, 5, true);
// ['卯', '辰', '巳', '午', '未']
```

**実装の詳細**:
- 再帰的に処理を行い、配列の最後に到達したら最初から再開
- 逆順の場合は配列を反転してから処理
- 四柱推命や紫微斗数で、十二支や十干を循環的に取得する際に使用

#### `makePairs<T>`

配列の隣同士をペアにした二次元配列を作成します。

**シグネチャ**:
```typescript
export const makePairs = <T>(array: T[]): T[][]
```

**使用例**:
```typescript
import { makePairs } from "utils";

const array = [1, 2, 3, 4];
const pairs = makePairs(array);
// [[1, 2], [2, 3], [3, 4]]
```

**実装の詳細**:
- `reduce`メソッドを使用して隣同士の要素をペア化
- 四柱推命で干合や支合を計算する際に使用

### 2. `astro.ts` - 天文計算

四柱推命の計算（二十四節気・地方時など）に必要な天文学的な関数です。`astronomia`パッケージを使用します。

#### `getEclipticLongitude`

太陽黄経（0-360度）を取得します。

**シグネチャ**:
```typescript
export const getEclipticLongitude = (date: Date): number | undefined
```

**使用例**:
```typescript
import { getEclipticLongitude } from "utils";

const date = new Date('2024-01-01');
const longitude = getEclipticLongitude(date);
// 280.5 (度)
```

**実装の詳細**:
- `astronomia`パッケージの`julian`と`solar`モジュールを使用
- ユリウス日を計算し、J2000.0からの世紀数を求める
- 太陽の真の黄経を計算して度に変換
- 四柱推命で二十四節気を判定する際に使用

#### `getEquationOfTime`

均時差（Equation of Time）を取得します。

**シグネチャ**:
```typescript
export const getEquationOfTime = (date: Date): DMS | undefined
```

**戻り値**: `DMS`型（度・分・秒）のオブジェクト

**使用例**:
```typescript
import { getEquationOfTime } from "utils";

const date = new Date('2024-01-01');
const eot = getEquationOfTime(date);
// { neg: false, d: 0, m: 3, s: 23 }
```

**実装の詳細**:
- `astronomia`パッケージの`eqtime`モジュールを使用
- 地球のVSOP87Bデータを使用して均時差を計算
- 60進法（度・分・秒）形式で返す
- 四柱推命で地方時を計算する際に使用

### 3. `time.ts` / `calendar.ts` - 日時・暦処理

日時・暦・二十四節気に関する処理を行う関数です。役割によって2ファイルに分かれています。

- **`time.ts`** … 占いに依存しない汎用の日時ユーティリティ。`isValidYearMonthDay` / `isValidDate` / `isInvalidDate` / `adjustDate` / `minutesToMilliSeconds` / `addDays` / `subtractDays` / `dmsToDecimalMinutes` / `utcToJulianDay` / `numberOfDaysBetween2Days` / `currentTimeIsInRange` / `getDaysInMonth` / `getMaxDaysInMonth` / `formatTime`（`luxon`・`astronomia` を使用）
- **`calendar.ts`** … 暦・二十四節気・干支・旧暦のドメイン計算。`calculateAsianAge` / `isDuringSummerTimeJp` / `getSolarTermBySpace` / `getSolarTermByTime` / `getRangeOfMonth` / `isEarthPeriodBySpace` / `isEarthPeriodByTime` / `getLichunFromYearBySpace` / `getLichunFromYearByTime` / `getYearRangeFromDate` / `getAdjustedChineseYear` / `isLongChineseMonth` / `fromChineseYearToBcYear`（`astronomy-engine`・`date-chinese`・`luxon` を使用）

以下では両ファイルの関数をまとめて解説します（各関数がどちらのファイルにあるかは上記を参照）。

#### `isInvalidDate`

Dateオブジェクトが無効かどうかを判定します。

**シグネチャ**:
```typescript
export const isInvalidDate = (date: Date): boolean
```

**使用例**:
```typescript
import { isInvalidDate } from "utils";

const date = new Date('invalid');
if (isInvalidDate(date)) {
  console.log('無効な日付です');
}
```

#### `fromChineseYearToBcYear`

干支の周期と年から西暦年を計算します。

**シグネチャ**:
```typescript
export const fromChineseYearToBcYear = (cycle: number, year: number): number
```

**使用例**:
```typescript
import { fromChineseYearToBcYear } from "utils";

const bcYear = fromChineseYearToBcYear(1, 1);
// -2636 (= (1 * 60 + 1) - 2697)
```

**実装の詳細**:
- 中国暦の周期（60年）と年から西暦年を計算
- 基準年は紀元前2697年

#### `isValidYearMonthDay`

年・月・日が正しく、範囲内（1〜3000）にあるかどうかを判定します。

**シグネチャ**:
```typescript
export const isValidYearMonthDay = (
  year: number,
  month: number,
  day: number
): boolean
```

**使用例**:
```typescript
import { isValidYearMonthDay } from "utils";

if (isValidYearMonthDay(2024, 2, 29)) {
  console.log('有効な日付です');
}
```

#### `isValidDate`

Dateオブジェクトが有効であるかどうかを判定します。

**シグネチャ**:
```typescript
export const isValidDate = (date: Date): boolean
```

**使用例**:
```typescript
import { isValidDate } from "utils";

const date = new Date('2024-01-01');
if (isValidDate(date)) {
  console.log('有効な日付です');
}
```

#### `calculateAsianAge`

旧暦により現在の数え年を計算します。

**シグネチャ**:
```typescript
export const calculateAsianAge = (birthDate: Date): number
```

**使用例**:
```typescript
import { calculateAsianAge } from "utils";

const birthDate = new Date('2000-01-01');
const age = calculateAsianAge(birthDate);
// 数え年（生まれた年を1歳として計算）
```

**実装の詳細**:
- `date-chinese`パッケージを使用して中国暦を計算
- 60年周期（干支）を考慮して年齢を計算

#### `isDuringSummerTimeJp`

サマータイム判定（日本）を行います。

**シグネチャ**:
```typescript
export const isDuringSummerTimeJp = (date: Date): boolean
```

**使用例**:
```typescript
import { isDuringSummerTimeJp } from "utils";

const date = new Date('1948-07-01');
if (isDuringSummerTimeJp(date)) {
  console.log('サマータイム期間中です');
}
```

**実装の詳細**:
- 日本のサマータイム期間（1948-1951年）を判定
- 四柱推命で過去の日時を計算する際に使用

#### `adjustDate`

調整後日時を取得します（均時差と地方時差を考慮）。

**シグネチャ**:
```typescript
export const adjustDate = (
  date: Date,
  eot: number,
  offsetMinutes: number
): Date
```

**パラメータ**:
- `date`: 調整前日時
- `eot`: 均時差（分）
- `offsetMinutes`: 地方時差（分）

**使用例**:
```typescript
import { adjustDate, getEquationOfTime, dmsToDecimalMinutes } from "utils";

const date = new Date('2024-01-01');
const eot = getEquationOfTime(date);
const eotMinutes = dmsToDecimalMinutes(eot!);
const adjusted = adjustDate(date, eotMinutes, 0);
```

**実装の詳細**:
- 均時差と地方時差を加算して日時を調整
- 分・秒・ミリ秒を個別に調整

#### `minutesToMilliSeconds`

分をミリ秒に変換します。

**シグネチャ**:
```typescript
export const minutesToMilliSeconds = (minutes: number): number
```

**使用例**:
```typescript
import { minutesToMilliSeconds } from "utils";

const ms = minutesToMilliSeconds(1.5);
// 30000 (ミリ秒)
```

#### `getSolarTermBySpace`

二十四節気を取得（定気法）します。

**シグネチャ**:
```typescript
export const getSolarTermBySpace = (date: Date): SolarTerm | undefined
```

**使用例**:
```typescript
import { getSolarTermBySpace } from "utils";

const date = new Date('2024-01-01');
const solarTerm = getSolarTermBySpace(date);
// { name: '小寒', index: 23, ... }
```

**実装の詳細**:
- `astronomy-engine`パッケージの`SunPosition`と`SearchSunLongitude`を使用
- 太陽黄経を15度ごとに分割して二十四節気を判定
- 定気法（太陽の実際の位置に基づく）を使用

#### `getSolarTermByTime`

二十四節気を取得（平気法）します。

**シグネチャ**:
```typescript
export const getSolarTermByTime = (date: Date): SolarTerm
```

**使用例**:
```typescript
import { getSolarTermByTime } from "utils";

const date = new Date('2024-01-01');
const solarTerm = getSolarTermByTime(date);
// { name: '小寒', index: 23, ... }
```

**実装の詳細**:
- `astronomy-engine`パッケージの`Seasons`を使用
- 冬至から冬至までの期間を24等分して二十四節気を判定
- 平気法（時間を均等に分割する）を使用

#### `getRangeOfMonth`

節入り日時と節終了日時を取得します。

**シグネチャ**:
```typescript
export const getRangeOfMonth = (date: Date, bySpace: boolean): Term
```

**パラメータ**:
- `date`: 取得する日時
- `bySpace`: 定気法は`true`、平気法は`false`

**使用例**:
```typescript
import { getRangeOfMonth } from "utils";

const date = new Date('2024-01-01');
const term = getRangeOfMonth(date, true);
// { startTime: Date, endTime: Date }
```

**実装の詳細**:
- 指定した日時の二十四節気を取得
- 中気の場合は前の節気を取得
- 節気の場合は次の節気を取得

#### `isEarthPeriodBySpace`

土用判定（定気法）を行います。

**シグネチャ**:
```typescript
export const isEarthPeriodBySpace = (elon: number | undefined): boolean
```

**使用例**:
```typescript
import { isEarthPeriodBySpace, getEclipticLongitude } from "utils";

const date = new Date('2024-01-01');
const elon = getEclipticLongitude(date);
if (isEarthPeriodBySpace(elon)) {
  console.log('土用期間中です');
}
```

**実装の詳細**:
- 太陽黄経が27-45度、117-135度、207-225度、297-315度の範囲内か判定
- 四立（立春・立夏・立秋・立冬）の前18日間が土用

#### `isEarthPeriodByTime`

土用判定（平気法）を行います。

**シグネチャ**:
```typescript
export const isEarthPeriodByTime = (date: Date): boolean
```

**使用例**:
```typescript
import { isEarthPeriodByTime } from "utils";

const date = new Date('2024-01-01');
if (isEarthPeriodByTime(date)) {
  console.log('土用期間中です');
}
```

#### `getLichunFromYearBySpace`

指定した年の立春日時を定気法で取得します。

**シグネチャ**:
```typescript
export const getLichunFromYearBySpace = (year: number): Date | undefined
```

**使用例**:
```typescript
import { getLichunFromYearBySpace } from "utils";

const lichun = getLichunFromYearBySpace(2024);
// 2024年の立春の日時
```

**実装の詳細**:
- 太陽黄経315度の日時を求める
- 四柱推命で年の境界を判定する際に使用

#### `getLichunFromYearByTime`

指定した年の立春日時を平気法で取得します。

**シグネチャ**:
```typescript
export const getLichunFromYearByTime = (year: number): Date
```

**使用例**:
```typescript
import { getLichunFromYearByTime } from "utils";

const lichun = getLichunFromYearByTime(2024);
// 2024年の立春の日時（平気法）
```

**実装の詳細**:
- 前年の冬至から今年の冬至までの期間を24等分
- 3/24を足して立春を算出

#### `getYearRangeFromDate`

指定した日の立春〜立春の期間を定気法で取得します。

**シグネチャ**:
```typescript
export const getYearRangeFromDate = (
  date: Date
): { startDate: string, endDate: string }
```

**使用例**:
```typescript
import { getYearRangeFromDate } from "utils";

const date = new Date('2024-06-01');
const range = getYearRangeFromDate(date);
// { startDate: '2024-02-04T...', endDate: '2025-02-03T...' }
```

#### `getAdjustedChineseYear`

調整された中国暦の年を取得します。

**シグネチャ**:
```typescript
export const getAdjustedChineseYear = (date: Date, bySpace: boolean): number
```

**使用例**:
```typescript
import { getAdjustedChineseYear } from "utils";

const date = new Date('2024-01-15');
const year = getAdjustedChineseYear(date, true);
// 立春前の場合は2023を返す
```

**実装の詳細**:
- 立春前の場合は前年に戻す
- 定気法と平気法で判定方法が異なる

#### `addDays`

指定した日数を日付に加算します。

**シグネチャ**:
```typescript
export const addDays = (date: Date, days: number): Date
```

**使用例**:
```typescript
import { addDays } from "utils";

const date = new Date('2024-01-01');
const newDate = addDays(date, 7);
// 2024-01-08
```

#### `subtractDays`

指定した日数を日付から減算します。

**シグネチャ**:
```typescript
export const subtractDays = (date: Date, days: number): Date
```

**使用例**:
```typescript
import { subtractDays } from "utils";

const date = new Date('2024-01-08');
const newDate = subtractDays(date, 7);
// 2024-01-01
```

#### `dmsToDecimalMinutes`

DMS（度・分・秒）を10進法の分に変換します。

**シグネチャ**:
```typescript
export const dmsToDecimalMinutes = (dms: DMS): number
```

**使用例**:
```typescript
import { dmsToDecimalMinutes } from "utils";

const dms = { neg: false, d: 0, m: 3, s: 23 };
const minutes = dmsToDecimalMinutes(dms);
// 3.383... (分)
```

#### `utcToJulianDay`

ユリウス日を取得します。

**シグネチャ**:
```typescript
export const utcToJulianDay = (utcDate: Date): number
```

**使用例**:
```typescript
import { utcToJulianDay } from "utils";

const date = new Date('2024-01-01');
const jd = utcToJulianDay(date);
// 2460310.5
```

#### `isLongChineseMonth`

月（旧暦）の日数が29日（小の月）であるか30日（大の月）であるか判定します。

**シグネチャ**:
```typescript
export const isLongChineseMonth = (chineseDate: ChineseDate): boolean
```

**使用例**:
```typescript
import { isLongChineseMonth } from "utils";

const chineseDate = { cycle: 120, year: 1, month: 1, day: 1, isLeapMonth: false };
if (isLongChineseMonth(chineseDate)) {
  console.log('大の月（30日）です');
}
```

#### `numberOfDaysBetween2Days`

二つの日付の間の日数を取得します。

**シグネチャ**:
```typescript
export const numberOfDaysBetween2Days = (
  date1: Date,
  date2: Date
): DayHourDuration
```

**使用例**:
```typescript
import { numberOfDaysBetween2Days } from "utils";

const date1 = new Date('2024-01-01');
const date2 = new Date('2024-01-08');
const duration = numberOfDaysBetween2Days(date1, date2);
// { days: 7, hours: 0 }
```

#### `currentTimeIsInRange`

日時が指定した範囲内にあるかどうか判定します。

**シグネチャ**:
```typescript
export const currentTimeIsInRange = (
  currentDate: Date,
  startDate: Date,
  offsetDays: number,
  durationDays: number
): boolean
```

**使用例**:
```typescript
import { currentTimeIsInRange } from "utils";

const current = new Date('2024-01-05');
const start = new Date('2024-01-01');
if (currentTimeIsInRange(current, start, 0, 7)) {
  console.log('範囲内です');
}
```

#### `getDaysInMonth`

指定した年と月の日数を取得します。

**シグネチャ**:
```typescript
export function getDaysInMonth(year: number, month: number): number
```

**使用例**:
```typescript
import { getDaysInMonth } from "utils";

const days = getDaysInMonth(2024, 2);
// 29 (うるう年)
```

#### `getMaxDaysInMonth`

指定した月の最大日数を取得します。

**シグネチャ**:
```typescript
export function getMaxDaysInMonth(month: number): number
```

**使用例**:
```typescript
import { getMaxDaysInMonth } from "utils";

const maxDays = getMaxDaysInMonth(1); // 2月
// 29
```

#### `formatTime`

指定された秒数を分と秒の形式に変換します。

**シグネチャ**:
```typescript
export function formatTime(time: number): string
```

**使用例**:
```typescript
import { formatTime } from "utils";

const time = formatTime(125);
// "2:05"
```

### 4. `number.ts` - 数値処理

数値に関する処理を行う関数です。

#### `range`

連番を生成します。

**シグネチャ**:
```typescript
export const range = (start: number, stop: number, step: number): number[]
```

**使用例**:
```typescript
import { range } from "utils";

const numbers = range(1, 10, 1);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

#### `roundDecimal`

小数点以下の桁数を指定して四捨五入します。

**シグネチャ**:
```typescript
export const roundDecimal = (value: number, n: number): number
```

**使用例**:
```typescript
import { roundDecimal } from "utils";

const rounded = roundDecimal(3.14159, 2);
// 3.14
```

#### `convertToSexagesimal`

10進数の数値を60進法の文字列（度°分'形式）に変換します。

**シグネチャ**:
```typescript
export const convertToSexagesimal = (number: number): string
```

**使用例**:
```typescript
import { convertToSexagesimal } from "utils";

const sexagesimal = convertToSexagesimal(30.5);
// "30°30'"
```

**実装の詳細**:
- 度と分を計算
- 分が一桁の場合は先頭にゼロを追加

### 5. `calendar.ts` - 暦・二十四節気・干支処理

四柱推命・紫微斗数の中核となる暦計算モジュールです。上記「3. 日時・暦処理」で解説した関数のうち、二十四節気（`getSolarTermBySpace` / `getSolarTermByTime`、`getRangeOfMonth`）、土用（`isEarthPeriodBySpace` / `isEarthPeriodByTime`）、立春・干支年（`getLichunFromYearBySpace` / `getLichunFromYearByTime`、`getYearRangeFromDate`、`getAdjustedChineseYear`、`fromChineseYearToBcYear`）、旧暦（`calculateAsianAge`、`isLongChineseMonth`）、日本のサマータイム（`isDuringSummerTimeJp`）を実装しています（`astronomy-engine`・`date-chinese`・`luxon` を使用）。

### 6. `validate.ts` - バリデーション

APIリクエストのバリデーションを行う関数です。

#### `validateFourPillarsRequest`

四柱推命リクエスト内のパラメータに対してバリデーションを行います。

**シグネチャ**:
```typescript
export const validateFourPillarsRequest = (request: ChartRequest): string
```

**戻り値**: エラーメッセージ（エラーがない場合は空文字列）

**使用例**:
```typescript
import { validateFourPillarsRequest } from "utils";

const request = {
  isoDate: '2024-01-01T00:00:00Z',
  longitude: 139.7,
  latitude: 35.69,
  gender: '1',
  // ...
};

const error = validateFourPillarsRequest(request);
if (error) {
  console.error(error);
}
```

**バリデーション項目**:
- `isoDate`: 有効な日付かどうか
- `longitude`: -180〜180の範囲内か
- `latitude`: -90〜90の範囲内か
- `gender`: '0'または'1'か
- `languageCode`: 'ja'か（オプショナル）
- `utcOffset`: -12〜14の範囲内か
- `dstOffset`: 0〜1の範囲内か
- `useSpaceMethod`: ブール値か
- `createImage`: ブール値か（オプショナル）
- `isHourUnknown`: ブール値か
- `changeDayStem`: ブール値か
- `yearlyLucks`: ブール値か

#### `validatePurpleStarRequest`

紫微斗数リクエスト内のパラメータに対してバリデーションを行います。

**シグネチャ**:
```typescript
export const validatePurpleStarRequest = (request: BoardRequest): string
```

**戻り値**: エラーメッセージ（エラーがない場合は空文字列）

**使用例**:
```typescript
import { validatePurpleStarRequest } from "utils";

const request = {
  isoDate: '2024-01-01T00:00:00Z',
  longitude: 139.7,
  latitude: 35.69,
  gender: '1',
  school: 's',
  // ...
};

const error = validatePurpleStarRequest(request);
if (error) {
  console.error(error);
}
```

**バリデーション項目**:
- `isoDate`: 有効な日付かどうか
- `longitude`: -180〜180の範囲内か
- `latitude`: -90〜90の範囲内か
- `gender`: '0'または'1'か
- `languageCode`: 'ja'か（オプショナル）
- `utcOffset`: -12〜14の範囲内か
- `dstOffset`: 0〜1の範囲内か
- `school`: 's'または'h'か

## 🔧 使用方法

### インポート

```typescript
// 個別にインポート
import { getEclipticLongitude, getEquationOfTime } from "utils";
import { isValidDate, adjustDate } from "utils";
import { validateFourPillarsRequest } from "utils";

// または index.ts から
import { 
  getEclipticLongitude,
  getEquationOfTime,
  isValidDate,
  adjustDate,
  validateFourPillarsRequest
} from "utils";
```

### エクスポート構造

`index.ts`で全関数をエクスポート:

```typescript
export * from './src/array';
export * from './src/astro';
export * from './src/calendar';
export * from './src/number';
export * from './src/time';
export * from './src/validate';
```

## 🎯 各アプリケーションでの使用

### `apps/four-pillars`

四柱推命アプリで使用:
- `getEclipticLongitude`: 太陽黄経の取得
- `getEquationOfTime`: 均時差の取得
- `getSolarTermBySpace` / `getSolarTermByTime`: 二十四節気の取得
- `getRangeOfMonth`: 節入り日時の取得
- `isEarthPeriodBySpace` / `isEarthPeriodByTime`: 土用判定
- `adjustDate`: 日時の調整
- `getItemsFromArrayCycle`: 配列の循環取得
- `validateFourPillarsRequest`: リクエストバリデーション
- `formatTime`: 時間のフォーマット

**使用例**:
```typescript
// apps/four-pillars/app/api/FourPillarsPersonalInfo.ts
import {
  getEclipticLongitude,
  getEquationOfTime,
  adjustDate,
  dmsToDecimalMinutes
} from 'utils';

const elon = getEclipticLongitude(date);
const eot = getEquationOfTime(date);
const eotMinutes = dmsToDecimalMinutes(eot!);
const adjusted = adjustDate(date, eotMinutes, offsetMinutes);
```

### `apps/purple-star`

紫微斗数アプリで使用:
- `validatePurpleStarRequest`: リクエストバリデーション
- `getItemsFromArrayCycle`: 配列の循環取得
- `isLongChineseMonth`: 旧暦の大小月判定

## 📦 依存関係

### `package.json`

```json
{
  "name": "utils",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

依存パッケージはモノレポのルート`package.json`で一元管理（hoisting）されています。

### 外部依存

- **astronomia**: 天文学計算（`astro.ts`・`time.ts`で使用）
- **astronomy-engine**: 天文学計算（`calendar.ts`で使用）
- **date-chinese**: 中国暦計算（`calendar.ts`で使用）
- **luxon**: 日時処理（`time.ts`・`calendar.ts`で使用）
- **types**: 型定義パッケージ

## 🛠️ 開発時の注意点

### 関数の追加

新しい関数を追加する場合：

1. 適切なモジュールファイルに追加
2. `index.ts`にエクスポートを追加（既に`export *`で全エクスポートされている場合は不要）
3. TypeScript型定義を追加
4. JSDocコメントを追加

### テスト

関数を追加する場合は、適切なテストを追加することを推奨します。

### パフォーマンス

- 天文学計算は計算コストが高いため、必要に応じてキャッシュを検討
- 配列操作は大きな配列に対しては注意が必要

## 💡 ベストプラクティス

1. **再利用性**: 複数のアプリケーションで使用できる汎用的な関数を作成
2. **型安全性**: TypeScriptの型定義を適切に使用
3. **エラーハンドリング**: 無効な入力に対して適切にエラーを返す
4. **ドキュメント**: JSDocコメントで関数の説明を追加
5. **パフォーマンス**: 計算コストの高い関数は最適化を検討

## 🚀 今後の拡張

以下のような拡張が考えられます：

- **キャッシュ機能**: 計算結果のキャッシュ
- **エラーハンドリング**: より詳細なエラーメッセージ
- **テスト**: ユニットテストの追加
- **最適化**: パフォーマンスの改善
- **新しい関数**: その他のユーティリティ関数

## 📚 参考資料

### 関連パッケージ

- **astronomia**: 天文学計算ライブラリ
- **astronomy-engine**: 天文学計算ライブラリ
- **date-chinese**: 中国暦計算ライブラリ
- **luxon**: 日時処理ライブラリ
- **types**: 型定義パッケージ

### 天文学の概念

- **太陽黄経**: 太陽の黄道座標系での経度（0-360度）
- **均時差**: 真太陽時と平均太陽時の差
- **二十四節気**: 1年を24等分した季節の区分
- **定気法**: 太陽の実際の位置に基づく二十四節気の計算方法
- **平気法**: 時間を均等に分割する二十四節気の計算方法
- **土用**: 四立（立春・立夏・立秋・立冬）の前18日間
- **立春**: 二十四節気の最初（太陽黄経315度）

## 🔍 関数の分類

### 天文学計算

- `getEclipticLongitude`
- `getEquationOfTime`
- `getSolarTermBySpace`
- `getSolarTermByTime`
- `isEarthPeriodBySpace`
- `isEarthPeriodByTime`
- `getLichunFromYearBySpace`
- `getLichunFromYearByTime`
- `utcToJulianDay`

### 日時処理

- `isValidDate`
- `isValidYearMonthDay`
- `adjustDate`
- `addDays`
- `subtractDays`
- `numberOfDaysBetween2Days`
- `currentTimeIsInRange`
- `getDaysInMonth`
- `getMaxDaysInMonth`
- `formatTime`

### 中国暦関連

- `calculateAsianAge`
- `fromChineseYearToBcYear`
- `isLongChineseMonth`
- `getAdjustedChineseYear`
- `getYearRangeFromDate`

### 配列操作

- `getItemsFromArrayCycle`
- `makePairs`

### 数値処理

- `range`
- `roundDecimal`
- `convertToSexagesimal`
- `dmsToDecimalMinutes`
- `minutesToMilliSeconds`

### バリデーション

- `validateFourPillarsRequest`
- `validatePurpleStarRequest`

## 🐛 トラブルシューティング

### よくある問題

1. **計算結果が正しくない**
   - 入力値が有効か確認
   - タイムゾーンの設定を確認
   - 計算方法（定気法/平気法）を確認

2. **日付が無効と判定される**
   - `isValidDate`で日付の有効性を確認
   - タイムゾーンの設定を確認

3. **バリデーションエラーが発生する**
   - リクエストパラメータの型を確認
   - 値の範囲を確認

### デバッグ

関数をデバッグするには：

```typescript
// コンソールログを追加
console.log('Input:', input);
console.log('Output:', output);

// 中間値を確認
const intermediate = calculateIntermediate(input);
console.log('Intermediate:', intermediate);
```

