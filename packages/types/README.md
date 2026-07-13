# types パッケージ解説

このドキュメントは、`types`パッケージの内容を初見の開発者向けに解説します。

## 📋 概要

`types`は、このモノレポ全体で使用されるTypeScript型定義と定数を一元管理する共有パッケージです。四柱推命・紫微斗数に関連する型定義、定数、クラスを提供します。

**目的**:

- プロジェクト全体で統一された型定義を提供
- 四柱推命・紫微斗数の概念を型安全に表現
- 型定義の重複を避け、メンテナンス性を向上

## 📁 ディレクトリ構造

```
packages/types/
├── index.ts                    # エクスポートファイル（全型定義をエクスポート）
├── package.json
└── src/
    ├── types.ts                # 共通型定義
    ├── constants.ts            # 共通定数
    ├── PersonalInfo.ts         # 個人情報の抽象クラス
    ├── four-pillars/           # 四柱推命関連
    │   ├── types.ts            # 四柱推命の型定義
    │   ├── constants.ts        # 四柱推命の定数
    │   ├── HeavenlyStem.ts     # 天干クラス
    │   └── EarthlyBranch.ts    # 地支クラス
    └── purple-star/            # 紫微斗数関連
        ├── types.ts            # 紫微斗数の型定義
        └── constants.ts        # 紫微斗数の定数
```

## 📝 主要な型定義とクラス

### 共通型定義 (`src/types.ts`)

#### 基本型

- **`Stem`**: 十干（甲・乙・丙・丁・戊・己・庚・辛・壬・癸）
- **`Branch`**: 十二支（子・丑・寅・卯・辰・巳・午・未・申・酉・戌・亥）
- **`StemIndex`**: 十干のインデックス（0-9）
- **`BranchIndex`**: 十二支のインデックス（0-11）
- **`SexagenaryCycleName`**: 六十干支の名称（甲子・乙丑など）
- **`FiveElementsId`**: 五行ID（木0・火1・土2・金3・水4）
- **`Gender`**: 性別（'0' = 女性、'1' = 男性、'P' = 不明）
- **`LanguageCode`**: 言語コード（'en'、'ja'など）

#### 共通インターフェース

- **`SexagenaryCycle`**: 六十干支

  ```typescript
  {
    index: number;
    stem: Stem;
    branch: Branch;
    emptyElements: Branch[];
  }
  ```

- **`Prefecture`**: 都道府県データ
- **`TimeZone`**: タイムゾーンデータ
- **`SolarTerm`** / **`Term`** / **`JulianTerm`**: 二十四節気関連データ
- **`DMS`**: 度分秒（Degrees, Minutes, Seconds）
- **`DayHourDuration`**: 時間帯の区間
- **`LocalStorageItem`**: ローカルストレージ保存用アイテム
- **`MapboxGeoCode`**: Mapboxジオコーディング結果

### 個人情報 (`src/PersonalInfo.ts`)

#### `PersonalInfo`クラス

個人情報を管理する抽象クラスです。各アプリの`FourPillarsPersonalInfo` / `PurpleStarPersonalInfo`が継承します。

**主要プロパティ**:

- `birthDate`: 生年月日
- `longitude`: 経度
- `latitude`: 緯度
- `timezoneOffset`: タイムゾーンオフセット
- `utcOffset`: UTCオフセット
- `dstOffset`: サマータイムオフセット
- `gender`: 性別
- `languageCode`: 言語コード
- `adjustedDate`: 調整後日時
- `equationOfTime`: 均時差（`DMS`）

**主要メソッド**:

- `init()`: 初期化（抽象メソッド）
- `getObject()`: オブジェクト化（抽象メソッド）
- `isMale()`: 性別が男性かどうかを判定
- `currentAge()`: 現在の年齢を計算

**使用例**:

```typescript
// 各アプリケーションで継承して使用
class FourPillarsPersonalInfo extends PersonalInfo {
  // 実装
}
```

### 四柱推命 (`src/four-pillars/`)

#### 型定義 (`types.ts`)

- **`FourPillars`**: 四柱（年柱・月柱・日柱・時柱）
- **`PillarPosition`**: 柱の位置
- **`ChangingStar`**: 通変星
- **`TwelveLuck`** / **`TwelveLuckName`**: 十二運（長生・沐浴など）
- **`HiddenStem`**: 蔵干
- **`StemPair`** / **`StemPairName`**: 干合
- **`BranchPair`** / **`BranchPairName`**: 支合
- **`BranchClash`** / **`BranchClashName`**: 冲
- **`BranchBreak`** / **`BranchBreakName`**: 破
- **`BranchHarm`** / **`BranchHarmName`**: 害
- **`BranchPunishment`** / **`BranchPunishmentName`**: 刑
- **`HarmonyBranchCombination`** / **`SeasonalBranchCombination`**: 三合会局・方合
- **`DecadeLuck`** / **`YearlyLuck`**: 大運・流年
- **`DivisionMethod`**: 分割方法（'S' = 節切り、'K' = 空間分割）
- **`DayStemMethod`**: 日干変更方法
- **`ChartRequest`**: チャート計算リクエスト

#### クラス

##### `HeavenlyStem` (`HeavenlyStem.ts`)

天干を表すクラスです。

**主要プロパティ**:

- `value`: 天干の値（'甲'、'乙'など）
- `index`: インデックス
- `isYang`: 陽かどうか
- `elementId`: 五行ID
- `group`: グループ番号
- `combination`: 干合の相手
- `roots`: 根（地支）
- `changingStars`: 通変星の配列
- `twelveLucks`: 十二運の配列
- `temperature` / `humidity`: 温度・湿度

**主要メソッド**:

- `sort()`: 天干ペアをソート

##### `EarthlyBranch` (`EarthlyBranch.ts`)

地支を表すクラスです。

**主要プロパティ**:

- `value`: 地支の値（'子'、'丑'など）
- `index`: インデックス
- `isYang`: 陽かどうか
- `elementId`: 五行ID
- `seasonId`: 季節ID
- `combination`: 支合の相手
- `clash` / `break` / `harm`: 冲・破・害の相手
- `hiddenStems`: 蔵干の配列
- `temperature` / `humidity`: 温度・湿度

**主要メソッド**:

- `sort()`: 地支ペアをソート

#### 定数 (`constants.ts`)

- **`HEAVENLY_STEMS`**: 十干の定数配列
- **`EARTHLY_BRANCHES`**: 十二支の定数配列
- **`HARMONY_COMBINATIONS`** / **`HARMONY_COMBINATIONS_HALF`**: 三合会局
- **`SEASONAL_COMBINATIONS`** / **`SEASONAL_COMBINATIONS_HALF`**: 方合
- **`PUNISHMENTS`**: 刑の定数

### 紫微斗数 (`src/purple-star/`)

#### 型定義 (`types.ts`)

- **`PalaceName`**: 宮名称（'命宮'、'兄弟宮'など）
- **`Palace`** / **`PalaceStem`** / **`PalaceBranch`**: 宮の構造
- **`MajorStarName`**: 主星名称（'紫微星'、'天機星'など）
- **`MinorStarName`**: 副星名称（'文昌星'、'文曲星'など）
- **`Star`**: 星のインターフェース
- **`Luminosity`** / **`LuminosityName`** / **`LuminosityIndex`**: 廟旺（星の輝度）
- **`Division`** / **`DivisionName`**: 五行局
- **`School`**: 流派
- **`LunarMonth`** / **`ChineseDate`**: 中国暦の月・日付
- **`YearlyFortune`**: 流年運
- **`BoardRequest`**: 命盤計算リクエスト

#### 定数 (`constants.ts`)

- **`PALACES_MINI`**: 宮名称の簡易配列
- **`PALACE_STEMS`**: 宮の天干の定数配列
- **`PALACE_BRANCHES`**: 宮の地支の定数配列

### 共通定数 (`src/constants.ts`)

- **`SEXAGENARY_CYCLE`**: 六十干支の定数配列
- **`BRANCHES_MINI`**: 地支の簡易配列
- **`JAPANESE_TIME`** / **`JAPANESE_SUMMER_TIME`**: 日本標準時・サマータイムのタイムゾーン定義
- **`SOLAR_TERMS`**: 二十四節気データの配列
- **`prefectures`**: 都道府県データの配列

## 🔧 使用方法

### インポート

```typescript
// 必要な型・クラス・定数をインポート
import {
  HeavenlyStem,
  EarthlyBranch,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  SEXAGENARY_CYCLE
} from 'types';

// 型のみインポート
import type { Stem, Branch, Palace, PalaceName } from 'types';
```

### 使用例

#### 四柱推命

```typescript
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from 'types';

const stem = HEAVENLY_STEMS.find(s => s.value === '甲');
const branch = EARTHLY_BRANCHES.find(b => b.value === '子');
```

#### 紫微斗数

```typescript
import type { Palace, PalaceName, Star } from 'types';

const palace: Palace = {
  name: '命宮',
  stem: '甲',
  branch: '子',
  // ...
};
```

## 📦 エクスポート構造

### `index.ts`

すべての型定義と定数をエクスポートします：

```typescript
export * from './src/types';
export * from './src/constants';
export * from './src/PersonalInfo';
export * from './src/four-pillars/constants';
export * from './src/four-pillars/types';
export * from './src/four-pillars/EarthlyBranch';
export * from './src/four-pillars/HeavenlyStem';
export * from './src/purple-star/types';
export * from './src/purple-star/constants';
```

## 🎯 各アプリケーションでの使用

### `apps/four-pillars`

四柱推命アプリで使用:

- `HeavenlyStem`
- `EarthlyBranch`
- `Stem`
- `Branch`
- `SexagenaryCycle`
- `HEAVENLY_STEMS`
- `EARTHLY_BRANCHES`
- `SEXAGENARY_CYCLE`

### `apps/purple-star`

紫微斗数アプリで使用:

- `Palace`
- `PalaceName`
- `Star`
- `MajorStarName`
- `MinorStarName`
- `PALACES_MINI`
- `PALACE_STEMS`
- `PALACE_BRANCHES`

## 📚 参考資料

### 四柱推命の概念

- **天干**: 甲・乙・丙・丁・戊・己・庚・辛・壬・癸（10個）
- **地支**: 子・丑・寅・卯・辰・巳・午・未・申・酉・戌・亥（12個）
- **六十干支**: 天干と地支の組み合わせ（60通り）
- **通変星**: 日干から見た他の天干との関係
- **十二運**: 地支から見た日干の強さ
- **蔵干**: 地支に含まれる天干

### 紫微斗数の概念

- **12宮**: 命宮・兄弟宮・夫妻宮・子女宮・財帛宮・疾厄宮・遷移宮・奴僕宮・官禄宮・田宅宮・福德宮・父母宮
- **14主星**: 紫微・天機・太陽・武曲・天同・廉貞・天府・太陰・貪狼・巨門・天相・天梁・七殺・破軍
- **副星**: 主星以外の星（文昌・文曲・左輔・右弼など）
- **五行局**: 水二局・木三局・金四局・土五局・火六局

## 🛠️ 開発時の注意点

### 型の追加

新しい型を追加する場合：

1. 適切なディレクトリに型定義ファイルを作成
2. `index.ts`にエクスポートを追加
3. 必要に応じて定数も追加

### 定数の追加

新しい定数を追加する場合：

1. 適切な`constants.ts`ファイルに追加
2. 型定義も追加
3. `index.ts`にエクスポートを追加

### 後方互換性

型定義を変更する場合は、既存のコードに影響を与えないよう注意してください。

## 🔍 型定義の構造

### 命名規則

- **型 / インターフェース / クラス**: PascalCase（例: `HeavenlyStem`、`Palace`）
- **型エイリアス**: PascalCase（例: `PalaceName`）
- **定数**: UPPER_SNAKE_CASE（例: `HEAVENLY_STEMS`）
- **プロパティ**: camelCase（例: `elementId`）

### 型の分類

1. **基本型**: 文字列リテラル型（例: `Stem`、`Branch`）
2. **インターフェース**: オブジェクトの構造を定義
3. **クラス**: メソッドを持つ型定義
4. **定数**: 実行時に使用される値

## 💡 ベストプラクティス

1. **型の再利用**: 既存の型を可能な限り再利用
2. **型の明確性**: 型名は用途が明確になるように命名
3. **定数の一元管理**: 定数は`types`パッケージで一元管理
4. **ドキュメント**: 複雑な型にはJSDocコメントを追加
