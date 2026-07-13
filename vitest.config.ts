import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // 各ファイルの近傍 tsconfig の paths（各アプリの "@/*"）をアプリ単位で解決する。
  plugins: [tsconfigPaths()],
  resolve: {
    // ワークスペースパッケージの package.json "main" が存在しない src/index.ts を
    // 指しているため、実際のバレル (index.ts) へエイリアスで解決させる。
    alias: {
      types: fileURLToPath(new URL('./packages/types/index.ts', import.meta.url)),
      utils: fileURLToPath(new URL('./packages/utils/index.ts', import.meta.url))
    }
  },
  // JSX を自動ランタイム(react/jsx-runtime)で変換する。
  // Next.js アプリの tsconfig は jsx:"preserve" のため、これを指定しないと
  // esbuild が古い React.createElement 形式に変換し "React is not defined" になる。
  esbuild: { jsx: 'automatic' },
  test: {
    // describe / it / expect をインポートなしで使える
    globals: true,
    // ロジック層のユニットテストが中心なので Node 環境。
    // コンポーネントテストを追加する際は 'jsdom' に変更（要 jsdom インストール）。
    environment: 'node',
    // cwd 相対の glob にすることで、リポジトリルートからは全テスト、
    // 各ワークスペースから実行した場合はそのワークスペース配下のみが対象になる
    // （turbo run test による委譲でワークスペース単位にスコープされる）。
    include: ['**/*.{test,spec}.{ts,tsx}'],
    // e2e は Playwright(VRT)用。vitest からは実行しない（test/spec 名の衝突回避）。
    exclude: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      // ui はソース(.ts/.tsx)のみを対象にする（README やログ等の非ソースを拾わないように）
      include: ['packages/*/src/**', 'packages/ui/**/*.{ts,tsx}', 'apps/*/app/api/**'],
      exclude: [
        '**/*.{test,spec}.{ts,tsx}',
        '**/*.d.ts',
        '**/route.ts', // ルートハンドラは外部依存が多く統合テスト領域のため計測外
        '**/*.fixtures.ts', // テストデータ
        '**/constants.ts', // 定数定義（ロジックなし）
        '**/types.ts', // 型・データ定義（ロジックなし）
        'packages/ui/index.tsx', // バレル（再エクスポートのみ・ロジックなし）
        // props を取らず固定SVGを返すだけの静的アイコン（分岐なし・テスト価値が低い）
        'packages/ui/icons/LoadingIcon.tsx',
        'packages/ui/icons/ChevronDownIcon.tsx',
        'packages/ui/icons/SpinnerIcon.tsx'
      ],
      // 実態（行・関数 96〜98%、分岐 89%）に余裕を持たせた下限。
      // これを下回るとテスト実行が失敗し、カバレッジの後退を検知できる。
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90
      }
    }
  }
});
