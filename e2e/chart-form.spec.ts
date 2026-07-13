import { test, expect } from '@playwright/test';

/**
 * 四柱推命 入力フォームの初期表示の VRT。
 * 外部APIに依存しにくい「フォーム初期状態」を最初の対象にして、VRT パイプラインを確立する。
 *
 * 初回は基準画像が無いため、CI(Linux) 上で `--update-snapshots` を実行して
 * 基準を生成・コミットする（手元 macOS で生成しないこと）。
 */
test('四柱推命 入力フォームの初期表示', async ({ page }) => {
  await page.goto('/chart');

  // ナビは position:fixed で画面上部に固定されており、フォームの要素スクショ時に
  // 上部へ被さって写り込む（生年月日の見出しが隠れる）。撮影前に CSS で隠す。
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });

  // CMS 由来のヘッダー/フッターを避け、入力フォーム本体だけを撮影対象にする。
  // （toHaveScreenshot は要素の表示を自動で待つ）
  const form = page.locator('form').first();
  await expect(form).toHaveScreenshot('chart-form.png');
});
