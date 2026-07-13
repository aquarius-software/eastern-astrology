# リポジトリ構成解説

このリポジトリは、四柱推命・紫微斗数のWebアプリケーション群を管理する**Turborepoモノレポ**です。

> 占星術（ホロスコープ）アプリと占星術計算APIは別リポジトリへ分離されました。本リポジトリには `four-pillars` と `purple-star` の2アプリが含まれます。

## 📄 ライセンス / License

本リポジトリのオリジナルコード（四柱推命・紫微斗数の計算エンジンおよび各機能）は [MIT License](./LICENSE) の下で公開されています。ただし、ブログ/CMS層など一部は [Stablo テンプレート（Web3Templates）](https://web3templates.com) 由来で、**MIT ではなく Web3Templates のライセンス**に従います。ライセンスの境界の詳細は [NOTICE.md](./NOTICE.md) を参照してください。

This project's original code is licensed under the [MIT License](./LICENSE). Portions derived from the Stablo template (Web3Templates) are governed by a separate license — see [NOTICE.md](./NOTICE.md).

## 🚀 クイックスタート

```bash
# 依存関係のインストール
npm install

# 全アプリケーションを開発モードで起動
npm run dev

# 個別に起動する場合
cd apps/four-pillars && npm run dev   # ポート3001
cd apps/purple-star && npm run dev    # ポート3002
```

## 📁 全体構造

```
astrology/
├── apps/                    # アプリケーション（フロントエンド + 各自のAPIルート）
│   ├── four-pillars/        # 四柱推命Webサイト（ポート3001）
│   └── purple-star/         # 紫微斗数Webサイト（ポート3002）
├── packages/                # 共有パッケージ
│   ├── types/               # TypeScript型定義
│   ├── utils/               # ユーティリティ関数
│   ├── ui/                  # 共有UIコンポーネント
│   └── tsconfig/            # 共有TypeScript設定
├── package.json             # ルートの依存関係管理（npm workspaces）
├── turbo.json               # Turborepoの設定
├── eslint.config.mjs        # ESLint設定（Flat Config）
└── README.md
```

## 🏗️ アーキテクチャ概要

各アプリは**自己完結型のNext.jsアプリ**で、フロントエンドのページと、計算を担う自前のAPIルート（`app/api/`）の両方を持ちます。共通の型・ユーティリティ・UIは `packages/` から共有します。

```
┌─────────────────────────────┐      ┌─────────────────────────────┐
│  four-pillars (ポート3001)   │      │  purple-star (ポート3002)    │
│  ├─ app/(website)/  画面     │      │  ├─ app/(website)/  画面     │
│  ├─ app/api/        計算API  │      │  ├─ app/api/        計算API  │
│  └─ app/(sanity)/   Studio   │      │  └─ Sanity CMS              │
│  ← Sanity CMS               │      │                             │
└──────────────┬──────────────┘      └──────────────┬──────────────┘
               │                                     │
               └──────────────┬──────────────────────┘
                              │ 共通パッケージを利用
                              ▼
                  ┌─────────────────────┐
                  │  packages/          │
                  │  - types  型定義     │
                  │  - utils  ユーティリティ │
                  │  - ui     UIコンポーネント │
                  └─────────────────────┘
```

## 🏗️ モノレポ構成

このプロジェクトは**Turborepo**を使用したモノレポ構成です。複数のアプリケーションと共有パッケージを効率的に管理できます。

### 主な特徴

- **ワークスペース管理**: npm workspacesで依存関係を一元管理
- **ビルド最適化**: Turborepoによる並列ビルドとキャッシング
- **型安全性**: 全プロジェクトでTypeScriptを使用
- **コード共有**: 共通の型定義、ユーティリティ、UIコンポーネントを共有

### 依存関係の流れ

```
apps/four-pillars
  ├─ types (型定義)
  ├─ utils (ユーティリティ)
  └─ ui    (UIコンポーネント)

apps/purple-star
  ├─ types (型定義)
  ├─ utils (ユーティリティ)
  └─ ui    (UIコンポーネント)
```

## 📱 アプリケーション（apps/）

### 1. `four-pillars` - 四柱推命Webサイト

**ポート**: 3001
**技術スタック**: Next.js (App Router), Sanity CMS, Tailwind CSS
**ディレクトリ**: `apps/four-pillars/`

四柱推命（中国占星術）の計算とコンテンツ管理を行うWebサイトです。計算用のAPIルートを内蔵しています。

**主要機能**:

- 四柱推命チャートの計算と表示（天干地支、大運、流年など）
- ブログ機能（Sanity CMS）
- カレンダー機能
- チャート画像生成
- クイズ機能

**API（`app/api/`）**:

- `app/api/chart/` - 四柱推命チャート計算
- `app/api/calendar/` - カレンダー
- `app/api/image/` - チャート画像生成
- `app/api/timezone/`, `app/api/geocode/` - タイムゾーン・ジオコーディング

**特徴**:

- Sanity Studio統合（`/studio`でアクセス、`npm run sanity`で起動） - `app/(sanity)/studio/`
- レート制限（Upstash Redis） - `app/api/chart/route.ts`
- 型定義: `packages/types`（`four-pillars/` サブツリー）を使用
- ユーティリティ: `packages/utils`を使用
- UIコンポーネント: `packages/ui`を使用

**重要なディレクトリ**:

- `app/(website)/chart/` - チャート表示ページ
- `app/(website)/blog/`, `post/`, `category/` - ブログ関連
- `app/(sanity)/studio/` - Sanity Studio設定
- `lib/sanity/` - Sanityクライアント設定

### 2. `purple-star` - 紫微斗数Webサイト

**ポート**: 3002
**技術スタック**: Next.js (App Router), Sanity CMS, Tailwind CSS
**ディレクトリ**: `apps/purple-star/`

紫微斗数（中国占星術の一種）のWebサイトです。`four-pillars`と同様の構成で、計算用のAPIルートを内蔵しています。

**主要機能**:

- 紫微斗数の命盤（ボード）の計算と表示
- ブログ機能（Sanity CMS）
- コンテンツ管理

**API（`app/api/`）**:

- `app/api/board/` - 命盤計算
- `app/api/months/` - 月情報
- `app/api/timezone/` - タイムゾーン

**特徴**:

- `four-pillars`と同様の構成
- Sanity Studio統合（`/studio`でアクセス、`npm run sanity`で起動）
- レート制限（Upstash Redis） - `app/api/board/route.ts`
- 型定義: `packages/types`（`purple-star/` サブツリー）を使用
- ユーティリティ: `packages/utils`を使用
- UIコンポーネント: `packages/ui`を使用

## 📦 共有パッケージ（packages/）

### 1. `types` - 型定義

**ディレクトリ**: `packages/types/`
全アプリケーションで共有されるTypeScript型定義です。エントリは `packages/types/index.ts`（各 `src/*` を re-export）。

**主要な型定義**:

- `src/four-pillars/` - 四柱推命関連の型
  - `HeavenlyStem.ts` - 天干の型定義
  - `EarthlyBranch.ts` - 地支の型定義
  - `types.ts` - 四柱推命の主要型
  - `constants.ts` - 定数定義
- `src/purple-star/` - 紫微斗数関連の型
  - `types.ts` - 紫微斗数の主要型
  - `constants.ts` - 定数定義
- `src/PersonalInfo.ts` - 個人情報の型定義（生年月日、場所など）
- `src/types.ts` - 共通型定義
- `src/constants.ts` - 共通定数

**使用方法**:

```typescript
import { PersonalInfo, HEAVENLY_STEMS, EARTHLY_BRANCHES } from 'types';
```

### 2. `utils` - ユーティリティ関数

**ディレクトリ**: `packages/utils/`
全アプリケーションで使用される共通ユーティリティ関数です。エントリは `packages/utils/index.ts`。

**主要モジュール**:

- `src/astro.ts` - 天文計算（黄経・均時差など、`astronomia`を使用）
- `src/datetime.ts` - 日時処理（旧暦変換など）
- `src/time.ts` - 時間・タイムゾーン処理（年齢計算、サマータイム判定など）
- `src/number.ts` - 数値処理（範囲生成、丸め、度分秒変換など）
- `src/array.ts` - 配列操作（循環取得、ペア生成など）
- `src/validate.ts` - リクエストバリデーション（four-pillars / purple-star 用）

**使用方法**:

```typescript
import { range, roundDecimal, getItemsFromArrayCycle } from 'utils';
```

### 3. `ui` - UIコンポーネント

**ディレクトリ**: `packages/ui/`
共有UIコンポーネントライブラリです。`four-pillars`と`purple-star`で使用されます。エントリは `packages/ui/index.tsx`。

**主要コンポーネント**:

- `Breadcrumbs.tsx` - パンくずリスト
- `Button.tsx` - ボタンコンポーネント
- `Header.tsx` - ヘッダーコンポーネント
- `ErrorView.tsx` - エラー表示コンポーネント
- `TableOfContents.tsx` - 目次コンポーネント
- `icons/` - アイコンコンポーネント
  - `StemIcon.tsx` - 天干アイコン
  - `BranchIcon.tsx` - 地支アイコン
  - `ChevronDownIcon.tsx`, `LoadingIcon.tsx`, `SpinnerIcon.tsx` - 汎用アイコン

**使用方法**:

```typescript
import { Button, Header, StemIcon, BranchIcon } from 'ui';
```

### 4. `tsconfig` - TypeScript設定

**ディレクトリ**: `packages/tsconfig/`
プロジェクト全体で共有されるTypeScriptのベース設定です。

## 🛠️ 開発コマンド

### ルートレベル

```bash
# 全アプリケーションを開発モードで起動
npm run dev

# 全アプリケーションをビルド
npm run build

# リント実行
npm run lint

# コードフォーマット
npm run format
```

### 個別アプリケーション

```bash
# 四柱推命アプリケーション
cd apps/four-pillars
npm run dev      # ポート3001で起動
npm run sanity   # Sanity Studio起動

# 紫微斗数アプリケーション
cd apps/purple-star
npm run dev      # ポート3002で起動
npm run sanity   # Sanity Studio起動
```

## 🔧 技術スタック

### フロントエンド

- **Next.js 14+** - Reactフレームワーク（App Router使用）
- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS** - ユーティリティファーストCSS
- **HeroUI** - UIコンポーネント

### バックエンド（各アプリのAPIルート）

- **Next.js API Routes** - 各アプリ内蔵のAPIエンドポイント
- **astronomia** - 天文計算（`packages/utils/src/astro.ts`）
- **Upstash Redis** - レート制限

### CMS

- **Sanity** - ヘッドレスCMS（four-pillars, purple-star）

### その他

- **Turborepo** - モノレポ管理
- **Luxon / date-fns** - 日時処理

## 📊 データフロー

### 計算の流れ

1. **フロントエンド**（`app/(website)/`）がユーザー入力を受け取る
2. 同一アプリ内の**APIルート**（`app/api/`）にリクエストを送信
3. APIルートが四柱推命／紫微斗数の計算を実行
4. 結果をJSON形式で返却
5. フロントエンドが結果を表示

### レート制限

各アプリのAPIルートで**Upstash Redis**を用いてリクエスト数を制限します。

- four-pillars: `apps/four-pillars/app/api/chart/route.ts`
- purple-star: `apps/purple-star/app/api/board/route.ts`

## 🔐 環境変数

主要な環境変数（完全な一覧は`turbo.json`を参照）:

- `NEXT_PUBLIC_ROUTE_HANDLER_URL` - APIルートのベースURL
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - SanityプロジェクトID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanityデータセット名
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis
- `GOOGLE_MAPS_API_KEY` / `GOOGLE_TIMEZONE_API_KEY` - Google Maps / タイムゾーン
- `MAPBOX_GEOCODING_API_KEY` - Mapbox ジオコーディング
- `IMAGE_SERVICE_URL` - チャート画像生成

## 📝 開発時の注意点

### ポート番号

各アプリケーションは異なるポートで動作します：

- **four-pillars**: 3001
- **purple-star**: 3002

### 依存関係の管理

1. **インストール**: ルートで`npm install`を実行すると、全ワークスペースの依存関係がインストールされます
2. **共有パッケージの変更**: `packages/`内のファイルを変更した場合、依存するアプリケーションを再起動する必要があります
3. **型定義の変更**: `packages/types`を変更すると型チェックに即時反映されますが、ビルドが必要な場合があります

### Sanity設定

`four-pillars`と`purple-star`はSanity CMSを使用します。`sanity.config.ts`で設定を確認できます。

### 開発ワークフロー

1. **新機能の追加**
   - 共有機能は`packages/`に追加
   - アプリ固有の機能は各`apps/`に追加
2. **型定義の追加**
   - アプリ固有の型は各アプリ内に定義
   - 複数アプリで使用する型は`packages/types`に追加
3. **ビルドとテスト**
   - ルートで`npm run build`を実行すると全アプリがビルドされます

## 🚀 デプロイ

各アプリケーションは独立してデプロイ可能です。Vercelなどのプラットフォームで個別にデプロイできます。Turborepoのリモートキャッシングを使用することで、CI/CDパイプラインでのビルド時間を短縮できます。

## 👋 初見の開発者向けガイド

### 最初に理解すべきこと

1. **モノレポ構造**: 複数のアプリケーションと共有パッケージを1つのリポジトリで管理しています
2. **Turborepo**: ビルドとタスクの実行を最適化するツールです
3. **npm workspaces**: 依存関係を一元管理する仕組みです

### 開発を始める手順

1. **リポジトリのクローンとセットアップ**

   ```bash
   git clone <repository-url>
   cd astrology
   npm install
   ```

2. **環境変数の設定**
   - 各アプリケーションのディレクトリに`.env.local`ファイルを作成
   - 必要な環境変数は`turbo.json`を参照

3. **開発サーバーの起動**

   ```bash
   # 全アプリを起動
   npm run dev

   # または個別に起動
   cd apps/four-pillars && npm run dev
   ```

4. **コードの探索**
   - まず`packages/types`で型定義を確認
   - 次に各アプリの`app/api/`で計算ロジックを確認
   - 最後に`app/(website)/`でフロントエンドを確認

### よくある質問

**Q: 共有パッケージを変更したらどうなりますか？**
A: 変更は即座に反映されますが、TypeScriptの型エラーが出る場合は再ビルドが必要です。

**Q: 新しいアプリを追加するには？**
A: `apps/`ディレクトリに新しいNext.jsアプリを作成し、ルート`package.json`のworkspacesに追加します。

## 📚 関連ドキュメント

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
