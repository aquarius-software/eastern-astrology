# purple-star アプリケーション構成解説

このドキュメントは、`purple-star`アプリケーションの構成を初見の開発者向けに解説します。

## 📋 概要

`purple-star`は、紫微斗数（しびとすう）という中国占星術の命盤（めいばん）を計算・表示するWebアプリケーションです。ユーザーが生年月日・時刻・出生地を入力すると、紫微斗数の詳細な命盤を表示します。

**技術スタック**:

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Sanity CMS** (ブログ機能)
- **React Hook Form** (フォーム管理)
- **Upstash Redis** (レート制限)

**ポート番号**: 3002

## 📁 ディレクトリ構造

```
apps/purple-star/
├── app/                          # Next.js App Router
│   ├── (sanity)/                 # Sanity Studio用ルートグループ
│   │   └── studio/               # Sanity Studio UI
│   ├── (website)/                # 公開サイト用ルートグループ
│   │   ├── board/                # 命盤作成ページ（主要機能）
│   │   ├── b/                    # 命盤結果表示ページ（URLパラメータ版）
│   │   ├── blog/                 # ブログ一覧
│   │   ├── post/                 # ブログ記事詳細
│   │   ├── list/                 # 保存した命盤一覧
│   │   └── ...                   # その他のページ
│   ├── api/                      # API Routes
│   │   ├── board/                # 命盤計算API
│   │   ├── months/               # 月運計算API
│   │   ├── timezone/             # タイムゾーン取得API
│   │   ├── PurpleStarData.ts     # 命盤計算クラス
│   │   ├── PurpleStarPersonalInfo.ts  # 個人情報クラス
│   │   ├── Palace.ts             # 宮（きゅう）クラス
│   │   └── constants.ts          # 定数定義
│   ├── layout.tsx                # ルートレイアウト
│   └── types.ts                  # アプリ固有の型定義
├── components/                   # 共有コンポーネント
│   ├── blog/                     # ブログ関連コンポーネント
│   └── ui/                       # UIコンポーネント
├── context/                      # React Context
│   └── boardContext.tsx          # 命盤状態管理
├── lib/                          # ライブラリ・ユーティリティ
│   └── sanity/                   # Sanity CMS設定
├── public/                       # 静的ファイル
├── styles/                       # グローバルスタイル
└── utils/                        # ユーティリティ関数
```

## 🎯 主要機能

### 1. 命盤作成（ボード計算）

**パス**: `/board`

紫微斗数の命盤を計算・表示する主要機能です。

#### フロントエンド (`app/(website)/board/`)

- **`page.tsx`**: ページコンポーネント（Server Component）
- **`Board.tsx`**: メインのボードコンポーネント（Client Component）
  - フォーム入力の管理
  - API呼び出し
  - 結果表示の制御
- **`ResultView.tsx`**: 計算結果の表示コンテナ
- **`ResultBoard.tsx`**: 命盤の可視化（12宮の表示）
- **`PalaceView.tsx`**: 各宮の詳細表示
- **`PalaceDetail.tsx`**: 宮の詳細情報
- **`CentralView.tsx`**: 中央部分の表示
- **`Datetime.tsx`**: 日時入力コンポーネント
- **`BirthPlace.tsx`**: 出生地入力コンポーネント
- **`Gender.tsx`**: 性別選択コンポーネント
- **`SchoolSelect.tsx`**: 流派選択コンポーネント
- **`AdvancedSettings.tsx`**: 詳細設定

#### バックエンド (`app/api/board/route.ts`)

```typescript
POST / api / board;
```

**処理フロー**:

1. リクエストバリデーション
2. レート制限チェック（Upstash Redis使用）
3. `PurpleStarPersonalInfo`で個人情報を初期化
4. `PurpleStarData`で命盤を計算
5. 結果をJSON形式で返却

**レート制限**: 10リクエスト/10秒（IPアドレスベース）

### 2. 紫微斗数計算の詳細

#### `PurpleStarPersonalInfo` (`app/api/PurpleStarPersonalInfo.ts`)

個人情報と日時調整を管理するクラスです。

**主要処理**:

- 地方時差の計算
- 均時差の取得
- 調整後日時の計算
- 太陽黄経の取得
- 中国暦（農暦）への変換
- 閏月の処理

#### `PurpleStarData` (`app/api/PurpleStarData.ts`)

紫微斗数の命盤を計算するメインクラスです。

**主要処理**:

1. **中国暦の取得**: 西暦から中国暦（干支年・月・日）への変換
2. **命宮の決定**: 生月と生時から命宮を決定
3. **身宮の決定**: 生月と生時から身宮を決定
4. **五号局の決定**: 年干と命宮から五号局（水二局・木三局など）を決定
5. **紫微星の配置**: 日と五号局から紫微星の位置を決定
6. **主星の配置**: 14主星（紫微・天機・太陽・武曲・天同・廉貞・天府・太陰・貪狼・巨門・天相・天梁・七殺・破軍）の配置
7. **時系諸星の配置**: 時系の星（文昌・文曲・天空・地劫など）の配置
8. **月系諸星の配置**: 月系の星（左輔・右弼・天刑・天姚など）の配置
9. **年干系諸星の配置**: 年干系の星（禄存・擎羊・陀羅など）の配置
10. **年支系諸星の配置**: 年支系の星（天馬・紅鸞・天喜など）の配置
11. **四化星の配置**: 化禄・化権・化科・化忌の配置
12. **宮の作成**: 12宮（命宮・兄弟宮・夫妻宮・子女宮・財帛宮・疾厄宮・遷移宮・奴僕宮・官禄宮・田宅宮・福德宮・父母宮）の作成
13. **大限の計算**: 10年ごとの運勢（大限）
14. **年運の計算**: 1年ごとの運勢

#### `Palace` (`app/api/Palace.ts`)

12宮を表すクラスです。

**主要プロパティ**:

- `name`: 宮名（命宮・兄弟宮など）
- `stem`: 天干
- `branch`: 地支
- `majorStars`: 主星の配列
- `minorStars`: 副星の配列
- `starPower`: 星の力（主星と副星の強度の合計）
- `yearlyLucks`: 年運の配列

### 3. ブログ機能

Sanity CMSを使用したブログ機能です。

**主要ページ**:

- `/blog`: ブログ一覧
- `/post/[slug]`: 記事詳細
- `/category/[category]`: カテゴリー別一覧
- `/author/[author]`: 著者別一覧

**Sanity Studio**: `/studio`でアクセス可能

### 4. 保存した命盤一覧

**パス**: `/list`

LocalStorageに保存された命盤の一覧を表示します。

### 5. 月運・周期運の表示

**コンポーネント**:

- `MonthlyLucks.tsx`: 月運の表示
- `PeriodicLucks.tsx`: 周期運の表示

## 🔄 データフロー

### 命盤計算の流れ

```
1. ユーザー入力（Board.tsx）
   ↓
2. フォームバリデーション（React Hook Form）
   ↓
3. APIリクエスト送信（POST /api/board）
   ↓
4. サーバー側処理
   ├─ リクエストバリデーション
   ├─ レート制限チェック
   ├─ PurpleStarPersonalInfo.init()
   │  ├─ 地方時差計算
   │  ├─ 均時差取得
   │  ├─ 調整後日時計算
   │  └─ 中国暦変換
   └─ PurpleStarData.init()
      ├─ 命宮・身宮決定
      ├─ 五号局決定
      ├─ 紫微星配置
      ├─ 主星配置
      ├─ 時系・月系・年干系・年支系諸星配置
      ├─ 四化星配置
      ├─ 12宮作成
      └─ 大限・年運計算
   ↓
5. JSONレスポンス返却
   ↓
6. 結果表示（ResultView.tsx）
   ├─ 命盤表示（ResultBoard.tsx）
   │  ├─ 12宮の表示（PalaceView.tsx）
   │  ├─ 星の配置表示
   │  └─ 中央部分（CentralView.tsx）
   ├─ 詳細情報表示（ResultInfo.tsx）
   └─ 月運・周期運表示（MonthlyLucks.tsx, PeriodicLucks.tsx）
```

## 🧩 主要コンポーネント

### ボード関連

- **`Board.tsx`**: メインのフォームコンポーネント
  - React Hook Formでフォーム管理
  - API呼び出しとエラーハンドリング
  - 結果表示の制御

- **`ResultView.tsx`**: 計算結果の表示コンテナ
  - 複数の結果コンポーネントを統合

- **`ResultBoard.tsx`**: 命盤の可視化
  - 12宮のグリッド表示
  - 各宮の星の配置表示
  - 対角線・三角形の線の表示（DiagonalLine.tsx, TriangleLine.tsx）

- **`PalaceView.tsx`**: 各宮の表示
  - 宮名・天干・地支の表示
  - 主星・副星の表示
  - 星の強度・輝度の表示

- **`PalaceDetail.tsx`**: 宮の詳細情報
  - 星の詳細情報
  - 大限・年運の情報

- **`CentralView.tsx`**: 中央部分の表示
  - 命宮・身宮の情報
  - 五号局の情報

- **`ResultInfo.tsx`**: 詳細情報の表示
  - 生年月日情報
  - タイムゾーン情報
  - 中国暦情報

- **`MonthlyLucks.tsx`**: 月運の表示
- **`PeriodicLucks.tsx`**: 周期運の表示

### 入力コンポーネント

- **`Datetime.tsx`**: 日時入力
- **`BirthPlace.tsx`**: 出生地入力（Google Maps Autocomplete使用）
- **`Gender.tsx`**: 性別選択
- **`SchoolSelect.tsx`**: 流派選択（三合派・飛星派など）
- **`AdvancedSettings.tsx`**: 詳細設定（`SchoolSelect` による流派選択を内包）

### 共有コンポーネント

- **`components/navbar.js`**: ナビゲーションバー
- **`components/footer.js`**: フッター
- **`components/sidebar.js`**: サイドバー（ブログ用）

## 🔌 APIエンドポイント

### `/api/board` (POST)

命盤計算のメインAPI。

**リクエストボディ**:

```typescript
{
  isoDate: string; // ISO形式の日時
  longitude: number; // 経度
  latitude: number; // 緯度
  timezoneOffset: number; // タイムゾーンオフセット
  gender: Gender; // 性別
  languageCode: string; // 言語コード
  utcOffset: number; // UTCオフセット
  dstOffset: number; // サマータイムオフセット
  school: string; // 流派（三合派・飛星派など）
  useSpaceMethod: boolean; // 空間分割法を使用するか
}
```

**レスポンス**:

```typescript
{
  status: 200;
  // PurpleStarDataの全プロパティ
  palaces: Palace[];
  division: string;
  selfPalacePosition: number;
  bodyPalace: PalaceName;
  // ... その他
}
```

### `/api/months` (POST)

月運計算API。

### `/api/timezone/google` (POST)

Google Timezone APIを使用したタイムゾーン取得API。

## 🎨 状態管理

### React Context

**`context/boardContext.tsx`**:

- `isFormView`: フォーム表示フラグ
- `isJapanese`: 日本語表示フラグ
- `currentMonth`: 現在選択中の月
- `currentPalace`: 現在選択中の宮
- `showChildStar`: 副星表示フラグ
- `showSelfChildStar`: 自宮副星表示フラグ
- `showDiagonalChildStar`: 対角副星表示フラグ
- `showMainChildStar`: 主星副星表示フラグ

### LocalStorage

保存した命盤はLocalStorageに保存され、`/list`ページで一覧表示されます。

## 🔐 セキュリティ

### レート制限

Upstash Redisを使用したレート制限を実装しています。

- 10リクエスト/10秒（スライディングウィンドウ方式）
- IPアドレスベースの制限

### バリデーション

`utils`パッケージの`validatePurpleStarRequest`関数でリクエストをバリデーションします。

## 🛠️ 開発コマンド

```bash
# 開発サーバー起動（ポート3002）
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# Sanity Studio起動
npm run sanity

# Sanityデータインポート
npm run sanity-import

# Sanityデータエクスポート
npm run sanity-export

# バンドルサイズ分析
npm run analyze

# リント
npm run lint
```

> **Note:** 公開リポジトリには Sanity のデータセットシード（`lib/sanity/data/production.tar.gz`）は含まれていません。`npm run sanity-import` を利用する場合は、自身の Sanity プロジェクトから `npm run sanity-export` でエクスポートを用意してください。

## 📦 依存関係

### 主要な依存パッケージ

- **Next.js**: Webフレームワーク
- **React Hook Form**: フォーム管理
- **Tailwind CSS**: スタイリング
- **@heroui/react**: UIコンポーネント
- **next-sanity**: Sanity CMS統合
- **@upstash/ratelimit**: レート制限
- **@upstash/redis**: Redis接続
- **date-chinese**: 中国暦変換
- **types**: 共有型定義パッケージ
- **utils**: 共有ユーティリティパッケージ

## 🔧 設定ファイル

### `next.config.js`

- 画像最適化設定
- TypeScript/ESLintエラーの無視設定（本番環境）
- バンドルアナライザー統合
- 外部パッケージのトランスパイル設定

### `sanity.config.ts`

Sanity Studioの設定:

- プロジェクトID・データセット
- プラグイン設定
- スキーマ定義

### `tailwind.config.js`

Tailwind CSSの設定:

- カスタムカラー
- フォント設定
- プラグイン設定

## 📝 型定義

### `app/types.ts`

アプリ固有の型定義:

- `PurpleStarData`: 命盤データの型
- `PurpleStarSubmitData`: フォーム送信データの型
- `PurpleStarUrlData`: URLパラメータの型

### `packages/types`

共有型定義パッケージから使用:

- `Palace`: 宮の型
- `PalaceName`: 宮名の型
- `Star`: 星の型
- `Gender`: 性別
- `ChineseDate`: 中国暦の型
- その他紫微斗数関連の型

## 🚀 デプロイ

Vercelなどのプラットフォームでデプロイ可能です。

**必要な環境変数**:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: SanityプロジェクトID
- `NEXT_PUBLIC_SANITY_DATASET`: Sanityデータセット名
- `NEXT_PUBLIC_SANITY_API_VERSION`: Sanity APIバージョン
- `UPSTASH_REDIS_REST_URL`: Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis トークン
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps APIキー（住所オートコンプリート）
- `GOOGLE_TIMEZONE_API_KEY`: Google Time Zone APIキー（サーバー）

## 📚 参考資料

### 紫微斗数の概念

- **命盤**: 12宮に星を配置した盤面
- **12宮**: 命宮・兄弟宮・夫妻宮・子女宮・財帛宮・疾厄宮・遷移宮・奴僕宮・官禄宮・田宅宮・福德宮・父母宮
- **14主星**: 紫微・天機・太陽・武曲・天同・廉貞・天府・太陰・貪狼・巨門・天相・天梁・七殺・破軍
- **副星**: 主星以外の星（文昌・文曲・左輔・右弼など）
- **四化星**: 化禄・化権・化科・化忌
- **五号局**: 水二局・木三局・金四局・土五局・火六局
- **大限**: 10年ごとの運勢
- **年運**: 1年ごとの運勢
- **命宮**: 生まれた時の宮
- **身宮**: 後天的な性格を表す宮

### 技術ドキュメント

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🐛 トラブルシューティング

### よくある問題

1. **レート制限エラー**: 10秒以内に10回以上のリクエストを送信すると429エラーが返ります
2. **タイムゾーンエラー**: 正確なタイムゾーン情報が必要です
3. **地理情報取得エラー**: Google Maps APIキーが必要です
4. **中国暦変換エラー**: 閏月の処理でエラーが発生する場合があります

### デバッグ

- 開発環境ではコンソールログで計算過程を確認できます
- バンドルサイズ分析: `npm run analyze`

## 🔄 今後の拡張

- 複数命盤の比較機能
- 命盤のPDFエクスポート
- より詳細な運勢分析
- 流派別の計算方法の追加
- 多言語対応の拡充

## 🔍 four-pillarsとの違い

`purple-star`と`four-pillars`は似た構造ですが、以下の違いがあります:

1. **占星術システム**: 紫微斗数 vs 四柱推命
2. **計算方法**: 命盤（12宮） vs 命式（四柱）
3. **星の概念**: 紫微斗数は星を配置、四柱推命は天干地支を使用
4. **流派**: 紫微斗数は流派（三合派・飛星派など）を選択可能
5. **表示方法**: 12宮のグリッド表示 vs 四柱の縦型表示
