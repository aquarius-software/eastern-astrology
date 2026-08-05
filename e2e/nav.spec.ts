import { test, expect } from '@playwright/test';

/**
 * four-pillars 固定ナビゲーションバーの VRT。
 *
 * ⚠️ この spec だけ nav を隠さない。
 * 他の spec は `nav.fixed { display: none }` でナビを消してから撮影している
 * （position:fixed のナビが要素スクショに被るため）。その結果ナビの描画は
 * VRT の対象外になっており、実際 Tailwind v4 移行時に「メニューのアイコンが
 * 折り返してナビが縦に伸び、本文側の mt-20 を超えて重なる」不具合が
 * 全件パスのまますり抜けた。ここはその穴を塞ぐための spec なので、
 * ナビ自体が撮影対象になる。
 *
 * 目的: HeroUI v3 への移行に備えた基準の確保。
 * ナビ内の `無料` バッジは HeroUI の <Chip> で、v3 では複合コンポーネント方式
 * への変更が入るため、移行前後の差分をここで検出する。
 *
 * 撮影範囲は <nav> 全体（幅 1280px）。ロゴ〜「メニュー」の右端までに加えて
 * ナビ自身の背景色・影・パディングも基準に含めるため。右側の余白は
 * 常に白（検索欄と ModeSwitch はコメントアウト済み）で不安定要素はない。
 *
 * 決定論性:
 * - ロゴは Sanity の settings.logo 由来（cdn.sanity.io → next/image）。
 *   CMS でロゴ画像を差し替えると基準が壊れるが、それは実際の見た目の変更
 *   なので想定通り。撮影前に <img> のデコード完了を待つ（CI cold でロゴが
 *   抜けた状態で基準化されるのを防ぐ）。
 * - メニュー項目は navbaralt.js のハードコード。CMS/現在日時に非依存。
 * - ドロップダウンは閉じた状態で撮る。**クリックしてはいけない**:
 *   Headless UI が閉じる際にボタンへフォーカスを戻し、Chrome が
 *   :focus-visible と判定してリングが出るため、状態が安定しない。
 * - モバイル用のハンバーガー（lg:hidden）は viewport 1280 では非表示。
 *
 * /chart を開くのは、playwright.config.ts の webServer が起動判定に
 * 使っている URL でコンパイル済み＝warm になっているため。ナビ自体は
 * (website) 配下の全ページで共通。
 */
test('四柱推命 ナビゲーションバー', async ({ page }) => {
  await page.goto('/chart');

  // `nav` だけでは一意にならない。HeroUI の <Breadcrumbs> が既定で
  // <nav> を描画するため（dist で `Component = as || "nav"`）、
  // パンくずの「命式作成」項目まで拾って strict mode 違反になる。
  // 他の spec がナビを隠すのに使っている `nav.fixed` と同じ指定に揃える。
  const nav = page.locator('nav.fixed');

  // ナビの中身が揃ってから撮る。HeroUI の <Chip> が消える/描画されない類の
  // 退行は、スクショの差分より先にここで落ちた方が原因が読みやすい。
  // ロール指定にしているのは、テキスト一致だと祖先要素にもマッチして
  // strict mode 違反になり得るため。ロールは HeroUI v3 でも変わらない想定。
  await expect(
    nav.getByRole('link', { name: /命式作成/ })
  ).toBeVisible();
  await expect(nav.getByText('無料').first()).toBeVisible();
  await expect(
    nav.getByRole('button', { name: /メニュー/ })
  ).toBeVisible();

  // ロゴ画像のデコード完了を待つ（CI cold でのロゴ抜け対策）
  await page.waitForLoadState('load');
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images).map(img =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise(res => {
              img.onload = res;
              img.onerror = res;
            })
      )
    )
  );

  await expect(nav).toHaveScreenshot('nav.png');
});
