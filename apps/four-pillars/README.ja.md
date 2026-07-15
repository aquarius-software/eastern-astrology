# four-pillars アプリケーション構成解説

*🌐 言語: **日本語** | [English](./README.md)*

このドキュメントは、`four-pillars`アプリケーションの構成を初見の開発者向けに解説します。

## 📋 概要

`four-pillars`は、四柱推命（中国占星術）の命式（めいしき）を計算・表示するWebアプリケーションです。ユーザーが生年月日・時刻・出生地を入力すると、四柱推命の詳細な分析結果を表示します。

**技術スタック**:
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Sanity CMS** (ブログ機能)
- **React Hook Form** (フォーム管理)
- **Upstash Redis** (レート制限)

**ポート番号**: 3001

## 📁 ディレクトリ構造

```
apps/four-pillars/
├── app/                          # Next.js App Router
│   ├── (sanity)/                 # Sanity Studio用ルートグループ
│   │   └── studio/               # Sanity Studio UI
│   ├── (website)/                # 公開サイト用ルートグループ
│   │   ├── chart/                # 命式作成ページ（主要機能）
│   │   ├── blog/                 # ブログ一覧
│   │   ├── post/                 # ブログ記事詳細
│   │   ├── calendar/             # カレンダー機能
│   │   ├── list/                 # 保存した命式一覧
│   │   ├── quiz/                 # クイズ機能
│   │   └── ...                   # その他のページ
│   ├── api/                      # API Routes
│   │   ├── chart/                # 命式計算API
│   │   ├── calendar/             # カレンダーAPI
│   │   ├── geocode/              # 地理情報取得API
│   │   ├── timezone/             # タイムゾーン取得API
│   │   └── image/                # 画像生成API（非公開画像生成サービスへのプロキシ）
│   ├── layout.tsx                # ルートレイアウト
│   └── types.ts                  # アプリ固有の型定義
├── components/                   # 共有コンポーネント
│   ├── blog/                     # ブログ関連コンポーネント
│   └── ui/                       # UIコンポーネント
├── context/                      # React Context
│   └── chartContext.tsx          # チャート状態管理
├── lib/                          # ライブラリ・ユーティリティ
│   └── sanity/                   # Sanity CMS設定
├── public/                       # 静的ファイル
├── styles/                       # グローバルスタイル
└── utils/                        # ユーティリティ関数
```

## 🎯 主要機能

### 1. 命式作成（チャート計算）

**パス**: `/chart`

四柱推命の命式を計算・表示する主要機能です。

#### フロントエンド (`app/(website)/chart/`)

- **`page.tsx`**: ページコンポーネント（Server Component）
- **`Chart.tsx`**: メインのチャートコンポーネント（Client Component）
  - フォーム入力の管理
  - API呼び出し
  - 結果表示の制御
- **`ResultView.tsx`**: 計算結果の表示
- **`ResultChart.tsx`**: 命式チャートの可視化
- **`Datetime.tsx`**: 日時入力コンポーネント
- **`BirthPlace.tsx`**: 出生地入力コンポーネント
- **`Gender.tsx`**: 性別選択コンポーネント
- **`AdvancedSettings.tsx`**: 詳細設定（分割方法、日干変更方法など）

#### バックエンド (`app/api/chart/route.ts`)

```typescript
POST /api/chart
```

**処理フロー**:
1. リクエストバリデーション
2. レート制限チェック（Upstash Redis使用）
3. `FourPillarsPersonalInfo`で個人情報を初期化
4. `FourPillarsData`で命式を計算
5. 結果をJSON形式で返却

**レート制限**: 10リクエスト/10秒（IPアドレスベース）

### 2. 四柱推命計算の詳細

#### `FourPillarsPersonalInfo` (`app/api/FourPillarsPersonalInfo.ts`)

個人情報と日時調整を管理するクラスです。

**主要処理**:
- 地方時差の計算
- 均時差の取得
- 調整後日時の計算
- 太陽黄経の取得
- 二十四節気の判定
- 土用期間の判定

#### `FourPillarsData` (`app/api/FourPillarsData.ts`)

四柱推命の命式を計算するメインクラスです。

**主要処理**:
1. **四柱の生成**: 年柱・月柱・日柱・時柱の計算
2. **天干地支の抽出**: 天干（10個）と地支（12個）の取得
3. **干合の計算**: 天干同士の組み合わせ
4. **地支の関係性計算**:
   - 三合会局（さんごうかいきょく）
   - 方合（ほうごう）
   - 支合（しごう）
   - 冲（ちゅう）
   - 破（は）
   - 害（がい）
   - 刑（けい）
5. **大運（たいうん）の計算**: 10年ごとの運勢
6. **年運の計算**: 1年ごとの運勢
7. **五行の構成**: 五行（木・火・土・金・水）のバランス
8. **温度・湿度の計算**: 季節性の指標

### 3. ブログ機能

Sanity CMSを使用したブログ機能です。

**主要ページ**:
- `/blog`: ブログ一覧
- `/post/[slug]`: 記事詳細
- `/category/[category]`: カテゴリー別一覧
- `/author/[author]`: 著者別一覧

**Sanity Studio**: `/studio`でアクセス可能

### 4. カレンダー機能

**パス**: `/calendar`

四柱推命のカレンダーを表示します。

### 5. 保存した命式一覧

**パス**: `/list`

LocalStorageに保存された命式の一覧を表示します。

## 🔄 データフロー

### 命式計算の流れ

```
1. ユーザー入力（Chart.tsx）
   ↓
2. フォームバリデーション（React Hook Form）
   ↓
3. APIリクエスト送信（POST /api/chart）
   ↓
4. サーバー側処理
   ├─ リクエストバリデーション
   ├─ レート制限チェック
   ├─ FourPillarsPersonalInfo.init()
   │  ├─ 地方時差計算
   │  ├─ 均時差取得
   │  ├─ 調整後日時計算
   │  └─ 二十四節気判定
   └─ FourPillarsData.init()
      ├─ 四柱生成
      ├─ 天干地支抽出
      ├─ 干合・支合計算
      ├─ 大運計算
      └─ 五行構成計算
   ↓
5. JSONレスポンス返却
   ↓
6. 結果表示（ResultView.tsx）
   ├─ 命式チャート表示（ResultChart.tsx）
   ├─ 詳細情報表示（ResultInfo.tsx）
   └─ 大運・年運表示（DecadeLuck.tsx, YearlyLucks.tsx）
```

## 🧩 主要コンポーネント

### チャート関連

- **`Chart.tsx`**: メインのフォームコンポーネント
  - React Hook Formでフォーム管理
  - API呼び出しとエラーハンドリング
  - 結果表示の制御

- **`ResultView.tsx`**: 計算結果の表示コンテナ
  - 複数の結果コンポーネントを統合

- **`ResultChart.tsx`**: 命式チャートの可視化
  - 天干地支の表示
  - 干合・支合などの関係性の表示

- **`ResultInfo.tsx`**: 詳細情報の表示
  - 生年月日情報
  - タイムゾーン情報
  - 二十四節気情報

- **`DecadeLuck.tsx`**: 大運の表示
- **`YearlyLucks.tsx`**: 年運の表示

### 入力コンポーネント

- **`Datetime.tsx`**: 日時入力
- **`BirthPlace.tsx`**: 出生地入力（Google Maps Autocomplete使用）
- **`Gender.tsx`**: 性別選択
- **`AdvancedSettings.tsx`**: 詳細設定
  - 分割方法（節切り/空間分割）
  - 日干変更方法
  - 画像生成オプション

### 共有コンポーネント

- **`components/navbar.js`**: ナビゲーションバー
- **`components/footer.js`**: フッター
- **`components/sidebar.js`**: サイドバー（ブログ用）

## 🔌 APIエンドポイント

### `/api/chart` (POST)

命式計算のメインAPI。

**リクエストボディ**:
```typescript
{
  isoDate: string;           // ISO形式の日時
  longitude: number;          // 経度
  latitude: number;           // 緯度
  timezoneOffset: number;     // タイムゾーンオフセット
  gender: Gender;             // 性別
  languageCode: string;       // 言語コード
  utcOffset: number;          // UTCオフセット
  dstOffset: number;          // サマータイムオフセット
  useSpaceMethod: boolean;    // 空間分割法を使用するか
  createImage: boolean;       // 画像生成するか
  isHourUnknown: boolean;     // 生時不明か
  changeDayStem: boolean;     // 日干変更方法
  yearlyLucks?: boolean;      // 年運を取得するか
  yearlyLuckStart?: number;   // 年運開始年
  yearlyLuckEnd?: number;     // 年運終了年
}
```

**レスポンス**:
```typescript
{
  status: 200;
  // FourPillarsDataの全プロパティ
  heavenlyStems: HeavenlyStem[];
  earthlyBranches: EarthlyBranch[];
  decadeLucks: DecadeLuck[];
  // ... その他
}
```

### `/api/calendar` (POST)

カレンダー情報を取得するAPI。

### `/api/geocode/mapbox` (POST)

Mapboxを使用した地理情報取得API。

### `/api/timezone/google` (POST)

Google Timezone APIを使用したタイムゾーン取得API。

### `/api/image` (POST)

命式画像生成API。実際の画像生成（プロンプト組み立て・生成モデル呼び出し）は非公開の外部サービスに隔離されており、このエンドポイントは認証トークンを付けてリクエストを転送する薄いプロキシです。

## 🎨 状態管理

### React Context

**`context/chartContext.tsx`**:
- `isFormView`: フォーム表示フラグ
- `isJapanese`: 日本語表示フラグ

### LocalStorage

保存した命式はLocalStorageに保存され、`/list`ページで一覧表示されます。

## 🔐 セキュリティ

### レート制限

Upstash Redisを使用したレート制限を実装しています。
- 10リクエスト/10秒（スライディングウィンドウ方式）
- IPアドレスベースの制限

### バリデーション

`utils`パッケージの`validateFourPillarsRequest`関数でリクエストをバリデーションします。

## 🛠️ 開発コマンド

```bash
# 開発サーバー起動（ポート3001）
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
- `FourPillarsData`: 命式データの型
- `SubmitData`: フォーム送信データの型
- `OptionData`: 表示オプションの型
- `FourPillarsUrlData`: URLパラメータの型

### `packages/types`

共有型定義パッケージから使用:
- `HeavenlyStem`: 天干
- `EarthlyBranch`: 地支
- `Gender`: 性別
- その他四柱推命関連の型

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
- `MAPBOX_GEOCODING_API_KEY`: Mapbox Geocoding APIキー（サーバー）
- `IMAGE_SERVICE_URL`: 非公開画像生成サービスのベースURL（サーバー専用）
- `SERVICE_SHARED_SECRET`: 画像生成サービスとの共有認証トークン（サーバー専用）

## 📚 参考資料

### 四柱推命の概念

- **四柱**: 年柱・月柱・日柱・時柱の4つの柱
- **天干**: 甲・乙・丙・丁・戊・己・庚・辛・壬・癸（10個）
- **地支**: 子・丑・寅・卯・辰・巳・午・未・申・酉・戌・亥（12個）
- **大運**: 10年ごとの運勢
- **年運**: 1年ごとの運勢
- **干合**: 天干同士の組み合わせ
- **支合**: 地支同士の組み合わせ

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

### デバッグ

- 開発環境では`next.config.js`の`config.optimization.minimize`を`false`に設定できます
- バンドルサイズ分析: `npm run analyze`

## 🔄 今後の拡張

- 複数命式の比較機能
- 命式のPDFエクスポート
- より詳細な運勢分析
- 多言語対応の拡充