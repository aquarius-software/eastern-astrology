import { test, expect, type Page } from '@playwright/test';

/**
 * 四柱推命 命式結果ページ /c のグラフ（chart.js / canvas）の VRT。
 *   - 五行構成: Pie（elementComposition 由来）
 *   - 寒暖・燥湿: 横棒 Bar ×2（temperature / humidity 由来）
 * いずれも生年月日で決まり現在日時に非依存で決定論的。
 *
 * URL は chart-result と同じ固定命式（2000-01-01 12:00 JST 男性・定気法）。
 *
 * 注意点:
 * - 各グラフは light/dark の2版が DOM にあり dark 版は `hidden`。DOM 上 light が
 *   先なので `.first()` で可視の light 版を撮る。
 * - chart.js はマウント時にアニメーションする。reducedMotion は canvas/JS
 *   アニメには効かないが、toHaveScreenshot が連続フレーム一致で安定判定するため
 *   アニメーション完了後に撮影される。
 * - /c は SSR で /api/chart を呼ぶため CI では env（ROUTE_HANDLER/Upstash/Sanity）が必要。
 */
const CHART_URL = '/c?t=946695600000&b=35.69&l=139.7&o=-540&f=64';

async function openChart(page: Page) {
  await page.goto(CHART_URL);
  // 固定ナビ(position:fixed)が要素スクショに被るため隠す
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });
}

test('四柱推命 五行構成グラフ', async ({ page }) => {
  await openChart(page);

  const section = page
    .locator('div.section-container', { hasText: '五行構成' })
    .first();
  await expect(section.locator('canvas')).toBeVisible();

  await expect(section).toHaveScreenshot('five-elements.png');
});

test('四柱推命 寒暖・燥湿グラフ', async ({ page }) => {
  await openChart(page);

  const section = page
    .locator('div.section-container', { hasText: '寒暖・燥湿' })
    .first();
  await expect(section.locator('canvas').first()).toBeVisible();

  await expect(section).toHaveScreenshot('temperature-humidity.png');
});
