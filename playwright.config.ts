import { defineConfig, devices } from '@playwright/test';

/**
 * ビジュアルリグレッションテスト(VRT)用の Playwright 設定。
 * vitest（ユニット/コンポーネントテスト）とは別系統で、実ブラウザで描画して
 * スクリーンショットを基準画像と比較する。
 *
 * 重要:
 * - 基準画像(__screenshots__)はフォント描画差を避けるため CI(Linux)/Docker で生成すること。
 *   手元 macOS で生成した基準は CI で必ずズレる。
 * - 対象は「崩れたら困る主要画面」を少数だけ。全ページは誤検知の元。
 */
export default defineConfig({
  testDir: './e2e',
  snapshotDir: './e2e/__screenshots__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',
  // CI は dev サーバーをコールド起動するため、各ページの初回アクセスで
  // オンデマンドコンパイル＋Sanity フェッチが走り、既定の30秒を超えることが
  // ある（例: home の goto タイムアウトフレーク）。テスト全体の制限を延ばす。
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:3001', // four-pillars (next dev -p 3001)
    reducedMotion: 'reduce', // framer-motion 等のアニメーションを抑制
    viewport: { width: 1280, height: 800 }
  },
  // フォント描画の微差を吸収する許容差（CIで基準を作れば本来ほぼ不要。調整可）
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // テスト実行前に対象アプリを起動する。
  // four-pillars は :3001（baseURL）、purple-star は :3002。
  // purple-star の spec は絶対 URL(:3002) で開くため baseURL には含めない。
  webServer: [
    {
      command: 'npm run dev -w four-pillars',
      url: 'http://localhost:3001/chart',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: 'npm run dev -w purple-star',
      url: 'http://localhost:3002/board',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      // purple-star 固有の実行時 env。process.env にマージされる。
      // - /b の SSR は自分自身(:3002)の /api/board を呼ぶ（四柱の :3001 と別）。
      // - *_REVALIDATE_SECONDS 未設定は Number(undefined)=NaN で描画失敗するため既定値を入れる。
      env: {
        NEXT_PUBLIC_ROUTE_HANDLER_URL: 'http://localhost:3002',
        BOARD_API_REVALIDATE_SECONDS: '60',
        REVALIDATE_SECONDS: '60'
      }
    }
  ]
});
