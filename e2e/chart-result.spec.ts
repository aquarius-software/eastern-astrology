import { test, expect } from '@playwright/test';

/**
 * 四柱推命の命式（結果ページ /c）の VRT。
 * 固定の命式URL（2000-01-01 12:00 JST・東京・男性・定気法）で結果を描画する。
 *   t=946695600000 (2000-01-01T03:00:00Z=12:00 JST), b=緯度, l=経度, o=timezoneOffset, f=フラグ(hex)
 *
 * 撮影は「命式グリッド（時柱/日柱/月柱/年柱を含む表）」に限定する。
 * このグリッドは生年月日で決まり現在日時に依存しないため決定論的。
 * （大運/歳運の「現在」や満年齢など現在日時依存のセクションは撮影対象外）
 *
 * 注意: /c はサーバー側で /api/chart を呼ぶため、CI では
 * NEXT_PUBLIC_ROUTE_HANDLER_URL / Upstash / Sanity の env が必要。
 */
test('四柱推命 命式グリッド（結果ページ）', async ({ page }) => {
  await page.goto('/c?t=946695600000&b=35.69&l=139.7&o=-540&f=64');

  // 固定ナビ(position:fixed)が要素スクショ上部に被るため隠す
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });

  // 命式グリッド = 「時柱」見出しを含む table
  const chart = page.locator('table:has(th:has-text("時柱"))').first();
  await expect(chart).toHaveScreenshot('chart-result.png');
});
