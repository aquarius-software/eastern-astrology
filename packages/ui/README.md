# ui パッケージ解説

このドキュメントは、`ui`パッケージの内容を初見の開発者向けに解説します。

## 📋 概要

`ui`は、このモノレポ全体で使用される共有UIコンポーネントライブラリです。`four-pillars`と`purple-star`で再利用されるReactコンポーネントとアイコンを提供します。

**目的**:

- プロジェクト全体で統一されたUIコンポーネントを提供
- コンポーネントの重複を避け、メンテナンス性を向上
- 一貫したデザインシステムを実現
- 四柱推命関連（天干・地支）のアイコンを提供

## 🚀 クイックスタート

```typescript
// デフォルトエクスポートのコンポーネント
import BreadCrumb from 'ui/Breadcrumbs';
import ErrorView from 'ui/ErrorView';

// 名前付きエクスポート（アイコンなど）
import { StemIcon, BranchIcon, SpinnerIcon } from 'ui';

// 使用例
<BreadCrumb items={[{ label: 'ホーム', path: '/' }]} />
<ErrorView message="エラーが発生しました" />
<StemIcon index={1} />
```

## 📁 ディレクトリ構造

```
packages/ui/
├── index.tsx              # エクスポートファイル
├── package.json
├── tsconfig.json
├── Breadcrumbs.tsx        # パンくずリストコンポーネント
├── Button.tsx             # ボタンコンポーネント（サンプル実装）
├── ErrorView.tsx          # エラー表示コンポーネント
├── Header.tsx             # ヘッダーコンポーネント（サンプル実装）
├── TableOfContents.tsx    # 目次コンポーネント
└── icons/                 # アイコンコンポーネント
    ├── BranchIcon.tsx      # 地支アイコン
    ├── ChevronDownIcon.tsx # 下向き矢印アイコン
    ├── LoadingIcon.tsx     # ローディングアイコン
    ├── SpinnerIcon.tsx     # スピナーアイコン
    └── StemIcon.tsx        # 天干アイコン
```

## 📝 主要コンポーネント

### 1. `Breadcrumbs.tsx` - パンくずリスト

ナビゲーションパンくずリストを表示するコンポーネントです。`BreadCrumb`としてデフォルトエクスポートされます。

**特徴**:

- HeroUIの`Breadcrumbs`コンポーネントを使用
- ホームリンクを自動的に含む
- カスタムクラス名のサポート

**型定義**:

```typescript
export type CrumbItem = {
  label: ReactNode;
  path: string;
  classNames?: string;
};

export type BreadcrumbsProps = {
  items: CrumbItem[];
};
```

**使用例**:

```typescript
import BreadCrumb from "ui/Breadcrumbs";

const items = [
  { label: "四柱推命", path: "/chart" },
  { label: "命式作成", path: "/chart/create" }
];

<BreadCrumb items={items} />
```

### 2. `Button.tsx` - ボタン

シンプルなボタンコンポーネントです（現在はサンプル実装）。

```typescript
export const Button = () => {
  return <button onClick={() => alert("boop")}>Boop</button>;
};
```

**注意**: 現在サンプル実装のため、実際の使用には拡張が必要です。

### 3. `ErrorView.tsx` - エラー表示

エラーメッセージを表示するコンポーネントです。デフォルトエクスポートされます。

**特徴**:

- エラーメッセージを中央揃えで表示
- ホームへのリンクを提供
- Heroiconsの`ExclamationCircleIcon`を使用
- ダークモード対応

**使用例**:

```typescript
import ErrorView from "ui/ErrorView";

<ErrorView message="エラーが発生しました" />
```

### 4. `Header.tsx` - ヘッダー

シンプルなヘッダーコンポーネントです（現在はサンプル実装）。

```typescript
export const Header = ({ text }: { text: string }) => {
  return <h1>{text}</h1>;
};
```

**注意**: 現在サンプル実装のため、実際の使用には拡張が必要です。

### 5. `TableOfContents.tsx` - 目次

目次を表示するコンポーネントです。再帰的な構造（サブ見出し）をサポートし、アンカーリンクでページ内ジャンプを行います。

> 補足: `TableOfContents.tsx`はファイルとして存在しますが、現在`index.tsx`からはエクスポートされていません。利用する場合は直接インポートしてください。

## 🎨 アイコンコンポーネント

### 四柱推命関連アイコン

#### `icons/StemIcon.tsx` - 天干アイコン

天干（十干）をSVGで表示するアイコンコンポーネントです。

**特徴**:

- 天干のインデックスを受け取る
- `types`パッケージの`HEAVENLY_STEMS`を使用

**型定義**:

```typescript
interface StemIconProps {
  index: number | undefined;
}
```

**使用例**:

```typescript
import { StemIcon } from "ui";

<StemIcon index={1} /> // 甲を表示
<StemIcon index={2} /> // 乙を表示
```

**対応する天干**: 甲・乙・丙・丁・戊・己・庚・辛・壬・癸

#### `icons/BranchIcon.tsx` - 地支アイコン

地支（十二支）をSVGで表示するアイコンコンポーネントです。

**特徴**:

- 地支のインデックスを受け取る
- `types`パッケージの`EARTHLY_BRANCHES`を使用

**型定義**:

```typescript
interface BranchIconProps {
  index: number | undefined;
}
```

**使用例**:

```typescript
import { BranchIcon } from "ui";

<BranchIcon index={1} /> // 子を表示
<BranchIcon index={2} /> // 丑を表示
```

**対応する地支**: 子・丑・寅・卯・辰・巳・午・未・申・酉・戌・亥

### 汎用アイコン

#### `icons/LoadingIcon.tsx` - ローディングアイコン

ローディング状態を表示するスピナーアイコンです（インライン表示用、`animate-spin`で回転、ダークモード対応）。

```typescript
import { LoadingIcon } from "ui";

<LoadingIcon />
```

#### `icons/SpinnerIcon.tsx` - スピナーアイコン

ボタン内などで使用するスピナーアイコンです（中央揃え、ダークモード対応、アニメーション付き）。

```typescript
import { SpinnerIcon } from "ui";

<button>
  <SpinnerIcon />
  読み込み中...
</button>
```

#### `icons/ChevronDownIcon.tsx` - 下向き矢印アイコン

下向きの矢印アイコンです。小さなサイズ（`h-4 w-4`）で、`fill-current`により現在のテキスト色を継承します。ドロップダウンなどで使用します。

```typescript
import { ChevronDownIcon } from "ui";

<ChevronDownIcon />
```

## 🔧 使用方法

### インポート

```typescript
// デフォルトエクスポート（パス指定でインポート）
import BreadCrumb from "ui/Breadcrumbs";
import ErrorView from "ui/ErrorView";

// 名前付きエクスポート（index.tsx 経由）
import { StemIcon, BranchIcon, LoadingIcon, SpinnerIcon, ChevronDownIcon } from "ui";
```

### エクスポート構造

`index.tsx`では以下をエクスポートしています:

```typescript
export * from './Breadcrumbs';
export * from './Button';
export * from './ErrorView';
export * from './Header';
export * from './icons/LoadingIcon';
export * from './icons/ChevronDownIcon';
export * from './icons/SpinnerIcon';
export * from './icons/StemIcon';
export * from './icons/BranchIcon';
```

> `BreadCrumb`（Breadcrumbs）と`ErrorView`はデフォルトエクスポートのため、`ui/Breadcrumbs` / `ui/ErrorView`のようにパス指定でインポートします。

## 🎯 各アプリケーションでの使用

### `apps/four-pillars` - 四柱推命アプリ

**使用コンポーネント**:

- `BreadCrumb`: パンくずリスト
- `ErrorView`: エラー表示
- `StemIcon` / `BranchIcon`: 天干・地支の表示
- `LoadingIcon` / `SpinnerIcon`: ローディング表示
- `ChevronDownIcon`: ドロップダウン等

**使用例**:

```typescript
// apps/four-pillars/app/(website)/chart/ChartView.tsx
import { StemIcon, BranchIcon } from "ui";

<StemIcon index={stem.index} />
<BranchIcon index={branch.index} />
```

### `apps/purple-star` - 紫微斗数アプリ

**使用コンポーネント**:

- `BreadCrumb`: パンくずリスト
- `ErrorView`: エラー表示
- `ChevronDownIcon`: ドロップダウン等
- `SpinnerIcon`: ローディング表示

## 📦 依存関係

### `package.json`

```json
{
  "name": "ui",
  "version": "0.1.0",
  "main": "./index.tsx",
  "types": "./index.tsx",
  "license": "MIT",
  "scripts": {
    "lint": "eslint ."
  }
}
```

依存パッケージはモノレポのルート`package.json`で一元管理（hoisting）されています。

### 外部依存

- **HeroUI**: `Breadcrumbs`で使用（`@heroui/react`）
- **Heroicons**: `ErrorView`で使用（`@heroicons/react`）
- **Next.js**: `Link`コンポーネントで使用
- **types**: `StemIcon`・`BranchIcon`で使用（`HEAVENLY_STEMS` / `EARTHLY_BRANCHES`）

## 🛠️ 開発時の注意点

### コンポーネントの追加

1. コンポーネントファイルを作成
2. `index.tsx`にエクスポートを追加
3. TypeScript型定義を追加
4. 必要に応じてスタイリングを追加

### スタイリング

- Tailwind CSSを使用
- ダークモード対応（`dark:`プレフィックス）を考慮
- レスポンシブデザインを考慮

### アクセシビリティ

- `aria-label`属性の使用
- セマンティックHTMLの使用

## 💡 ベストプラクティス

1. **再利用性**: 複数のアプリケーションで使用できる汎用的なコンポーネントを作成
2. **型安全性**: TypeScriptの型定義を適切に使用
3. **一貫性**: デザインシステムに沿った実装
4. **アクセシビリティ**: `aria-label`などの付与

## 🐛 トラブルシューティング

1. **コンポーネントが表示されない**
   - `index.tsx`にエクスポートが追加されているか確認
   - インポートパス（デフォルト/名前付き）が正しいか確認
2. **スタイルが適用されない**
   - Tailwind CSSの設定・クラス名・ダークモードクラスを確認
3. **天干・地支アイコンが表示されない**
   - インデックスが有効範囲内か確認
   - `types`パッケージの`HEAVENLY_STEMS` / `EARTHLY_BRANCHES`が正しく解決されているか確認
