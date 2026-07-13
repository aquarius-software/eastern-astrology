import { test, expect } from '@playwright/test';

/**
 * 紫微斗数の命盤（結果ページ /b）の VRT。
 * 固定の命盤URLで結果を描画する。
 *   t=946695600000 (2000-01-01T03:00:00Z=12:00 JST), b=緯度, l=経度,
 *   o=timezoneOffset(分), s=流派(s=星曜派), f=フラグ(hex; 男性・国内=0x44)
 *
 * 撮影は「命盤グリッド（12宮 + 中央）」に限定する。
 * 各宮の星の配置・干支・大限の開始年齢は生年月日で決まり決定論的。
 *
 * 既知の時刻依存: 各宮右下「開始年齢〜」に付く現在大限の枠線は数え年
 * (asianAge=現在年依存)で決まる。大限は10年区切りのため枠線の位置は
 * 概ね10年単位でしか動かないが、跨いだ時は基準を再生成すること。
 *
 * 注意: /b はサーバー側で /api/board を呼ぶため、CI では
 * NEXT_PUBLIC_ROUTE_HANDLER_URL / Upstash / Sanity の env が必要。
 * purple-star は :3002 で起動するため絶対 URL で開く。
 */
test('紫微斗数 命盤グリッド（結果ページ）', async ({ page }) => {
  // ページ内の MonthlyLucks が /api/months へ POST する。撮影後すぐテストが
  // 終了すると送信中のリクエストが中断され、dev サーバーに JSON パースエラーの
  // スタックトレースが出るため、応答完了を待ってからテストを終える。
  // （goto より先に待ち受けを登録しないと応答を取りこぼす）
  const monthsResponse = page.waitForResponse('**/api/months');

  await page.goto(
    'http://localhost:3002/b?t=946695600000&b=35.69&l=139.7&o=-540&s=s&f=44'
  );

  // 固定ナビ(position:fixed)が要素スクショ上部に被るため隠す
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });

  // 命盤グリッド = 「命盤」見出し(div.section-header)の直後の div
  const board = page
    .locator('div.section-header', { hasText: '命盤' })
    .locator('xpath=following-sibling::div[1]');

  await monthsResponse;
  await expect(board).toHaveScreenshot('board-result.png');
});
