import { test, expect } from '@playwright/test';

/**
 * 紫微斗数の命盤作成フォーム（/board）の VRT。
 * four-pillars の chart-form と同じ方針で、<form> 要素のみを撮影する。
 *
 * purple-star は :3002 で起動するため、baseURL(:3001) ではなく絶対 URL で開く。
 */
test('紫微斗数 命盤作成フォーム', async ({ page }) => {
  await page.goto('http://localhost:3002/board');

  // 固定ナビ(position:fixed)が要素スクショ上部に被るため隠す
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });

  const form = page.locator('form').first();
  await expect(form).toHaveScreenshot('board-form.png');
});
