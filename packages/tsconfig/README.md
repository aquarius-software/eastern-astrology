# tsconfig パッケージ解説

このドキュメントは、`tsconfig`パッケージの内容を初見の開発者向けに解説します。

## 📋 概要

`tsconfig`は、このモノレポ全体で使用されるTypeScript設定を一元管理する共有パッケージです。複数のアプリケーションとパッケージで一貫したTypeScript設定を保つために使用されます。

**目的**:
- プロジェクト全体で統一されたTypeScript設定を提供
- Next.js、Reactライブラリなど、異なる用途に応じた設定テンプレートを提供
- 設定の重複を避け、メンテナンス性を向上

## 📁 ディレクトリ構造

```
packages/tsconfig/
├── base.json          # ベース設定（全プロジェクト共通）
├── nextjs.json        # Next.js用設定
├── react-library.json # Reactライブラリ用設定
└── package.json       # パッケージ定義
```

## 📝 設定ファイルの詳細

### 1. `base.json` - ベース設定

全プロジェクトで共通する基本的なTypeScript設定です。

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Default",
  "compilerOptions": {
    "composite": false,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "inlineSources": false,
    "isolatedModules": true,
    "moduleResolution": "node",
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveWatchOutput": true,
    "skipLibCheck": true,
    "strict": true
  },
  "exclude": ["node_modules"]
}
```

#### 主要な設定項目

- **`composite: false`**: プロジェクト参照を無効化
- **`declaration: true`**: `.d.ts`ファイルを生成
- **`declarationMap: true`**: 宣言ファイルのソースマップを生成
- **`esModuleInterop: true`**: CommonJSとESモジュールの相互運用性を有効化
- **`forceConsistentCasingInFileNames: true`**: ファイル名の大文字小文字の一貫性を強制
- **`isolatedModules: true`**: 各ファイルを独立したモジュールとして扱う
- **`moduleResolution: "node"`**: Node.jsスタイルのモジュール解決
- **`skipLibCheck: true`**: 型定義ファイルの型チェックをスキップ（ビルド時間短縮）
- **`strict: true`**: 厳格な型チェックを有効化

### 2. `nextjs.json` - Next.js用設定

Next.jsアプリケーション用の設定です。`base.json`を継承しています。

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Next.js",
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "allowJs": true,
    "declaration": false,
    "declarationMap": false,
    "incremental": true,
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "noEmit": true,
    "resolveJsonModule": true,
    "strict": false,
    "target": "es5"
  },
  "include": ["src", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

#### Next.js固有の設定

- **`extends: "./base.json"`**: ベース設定を継承
- **`plugins: [{ "name": "next" }]`**: Next.jsプラグインを使用
- **`allowJs: true`**: JavaScriptファイルの使用を許可
- **`declaration: false`**: 宣言ファイルを生成しない（Next.jsが自動生成）
- **`incremental: true`**: インクリメンタルコンパイルを有効化
- **`jsx: "preserve"`**: JSXをそのまま保持（Next.jsが変換）
- **`lib: ["dom", "dom.iterable", "esnext"]`**: DOMとESNextの型定義を使用
- **`module: "esnext"`**: ESモジュールを使用
- **`noEmit: true`**: JavaScriptファイルを出力しない（Next.jsが処理）
- **`resolveJsonModule: true`**: JSONファイルをモジュールとしてインポート可能
- **`strict: false`**: ベース設定の`strict: true`を上書き（Next.jsの互換性のため）
- **`target: "es5"`**: ES5にコンパイル（ブラウザ互換性のため）

### 3. `react-library.json` - Reactライブラリ用設定

Reactライブラリ（共有コンポーネントなど）用の設定です。`base.json`を継承しています。

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "React Library",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2015", "DOM"],
    "module": "ESNext",
    "target": "es6"
  }
}
```

#### Reactライブラリ固有の設定

- **`extends: "./base.json"`**: ベース設定を継承
- **`jsx: "react-jsx"`**: React 17+の新しいJSX変換を使用
- **`lib: ["ES2015", "DOM"]`**: ES2015とDOMの型定義を使用
- **`module: "ESNext"`**: ESモジュールを使用
- **`target: "es6"`**: ES6にコンパイル

## 🔧 使用方法

### パッケージでの使用例

#### `packages/ui/tsconfig.json`

```json
{
  "extends": "tsconfig/react-library.json",
  "include": ["."],
  "exclude": ["dist", "build", "node_modules"]
}
```

Reactライブラリ用の設定を継承し、UIコンポーネントパッケージで使用されています。

### アプリケーションでの使用

現在、各アプリケーション（`four-pillars`、`purple-star`など）は、`tsconfig`パッケージを直接継承せず、独自の`tsconfig.json`を持っています。これは、各アプリケーションがNext.js固有の設定を必要とするためです。

将来的には、以下のように使用できます：

```json
{
  "extends": "tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}
```

## 📊 設定の継承関係

```
base.json (ベース設定)
├── nextjs.json (Next.js用)
└── react-library.json (Reactライブラリ用)
```

各設定ファイルは`base.json`を継承し、用途に応じた追加設定を定義しています。

## 🎯 各設定の用途

| 設定ファイル | 用途 | 使用例 |
|------------|------|--------|
| `base.json` | 全プロジェクト共通の基本設定 | 直接使用せず、他の設定のベースとして使用 |
| `nextjs.json` | Next.jsアプリケーション | `apps/*`内のNext.jsアプリ |
| `react-library.json` | Reactライブラリ | `packages/ui`など |

## 🔄 設定の優先順位

TypeScriptは設定を以下の順序で適用します：

1. 継承元の設定（`extends`で指定）
2. 現在のファイルの設定（上書き）

**例**: `nextjs.json`は`base.json`を継承し、`strict: false`で`base.json`の`strict: true`を上書きしています。

## 🛠️ 設定のカスタマイズ

### 新しい設定ファイルを追加する場合

例えば、Node.js用の設定を追加する場合：

```json
// packages/tsconfig/node.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Node.js",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2020"],
    "module": "commonjs",
    "target": "ES2020",
    "types": ["node"]
  }
}
```

### 既存の設定を拡張する場合

各アプリケーションやパッケージの`tsconfig.json`で、`tsconfig`パッケージの設定を継承しつつ、追加の設定を定義できます：

```json
{
  "extends": "tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strictNullChecks": true
  }
}
```

## 📚 参考資料

### TypeScript設定の詳細

- [TypeScript Configuration Documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [tsconfig.json Schema](https://json.schemastore.org/tsconfig)
- [Next.js TypeScript Configuration](https://nextjs.org/docs/app/building-your-application/configuring/typescript)

### 関連パッケージ

- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)

## 🐛 トラブルシューティング

### よくある問題

1. **設定が適用されない**
   - `extends`のパスが正しいか確認
   - `tsconfig.json`の場所を確認
   - TypeScriptのバージョンを確認

2. **型エラーが発生する**
   - `strict`モードの設定を確認
   - `lib`の設定が適切か確認
   - 型定義ファイル（`@types/*`）がインストールされているか確認

3. **モジュール解決エラー**
   - `moduleResolution`の設定を確認
   - `paths`の設定が正しいか確認
   - `baseUrl`の設定を確認

### デバッグ

TypeScriptの設定を確認するには：

```bash
# 設定を確認
npx tsc --showConfig

# 型チェックのみ実行（コンパイルしない）
npx tsc --noEmit
```

## 💡 ベストプラクティス

1. **一元管理**: 共通の設定は`tsconfig`パッケージで管理
2. **用途別設定**: 用途に応じた設定ファイルを使用
3. **段階的適用**: 既存のコードベースに新しい設定を適用する場合は、段階的に厳格化
4. **継承の活用**: `extends`を活用して設定の重複を避ける

## 🔍 他のパッケージとの関係

`tsconfig`パッケージは、以下のパッケージと連携します：

- **ESLint設定**: ルートの`eslint.config.mjs`（Flat Config、型チェックと連携）
- **`types`**: 型定義パッケージ
- **`utils`**: ユーティリティパッケージ

## 📝 設定の変更履歴

設定を変更する場合は、以下の点を考慮してください：

1. **後方互換性**: 既存のコードに影響を与えないか
2. **チーム合意**: チーム全体で合意が得られているか
3. **段階的適用**: 大きな変更は段階的に適用する

## 🚀 今後の拡張

以下のような拡張が考えられます：

- **Node.js用設定**: バックエンドAPI用の設定
- **テスト用設定**: テスト環境用の設定
- **ビルド用設定**: 本番ビルド用の最適化設定

## 📋 設定項目の詳細説明

### 重要なコンパイラオプション

#### 型チェック関連

- **`strict: true`**: 厳格な型チェックを有効化
  - `noImplicitAny`: 暗黙の`any`を禁止
  - `strictNullChecks`: `null`と`undefined`の厳格なチェック
  - `strictFunctionTypes`: 関数型の厳格なチェック
  - など

- **`noUnusedLocals: false`**: 未使用のローカル変数を許可
- **`noUnusedParameters: false`**: 未使用のパラメータを許可

#### モジュール関連

- **`moduleResolution: "node"`**: Node.jsスタイルのモジュール解決
- **`esModuleInterop: true`**: CommonJSとESモジュールの相互運用
- **`isolatedModules: true`**: 各ファイルを独立したモジュールとして扱う

#### 出力関連

- **`declaration: true`**: `.d.ts`ファイルを生成
- **`declarationMap: true`**: 宣言ファイルのソースマップを生成
- **`noEmit: true`**: JavaScriptファイルを出力しない（Next.jsなど）

#### その他

- **`skipLibCheck: true`**: 型定義ファイルの型チェックをスキップ（ビルド時間短縮）
- **`forceConsistentCasingInFileNames: true`**: ファイル名の大文字小文字の一貫性を強制
- **`preserveWatchOutput: true`**: ウォッチモードの出力を保持

## 🔄 設定の継承例

### 完全な例

```json
// packages/my-package/tsconfig.json
{
  "extends": "tsconfig/react-library.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "types/*": ["../../packages/types/src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

この設定は：
1. `react-library.json`を継承（`base.json`も間接的に継承）
2. パスエイリアスを追加
3. インクルード/除外パスを指定

