import { test, expect } from '@playwright/test';

/**
 * four-pillars トップページ（/）のファーストビュー VRT。
 *
 * トップは getAllPosts()(Sanity) 由来の記事一覧を含み動的なので、
 * 撮影は静的な <Featured> ヒーロー（ロゴ・キャッチコピー・CTAボタン）に限定する。
 * ヒーローは CMS/現在日時に非依存で決定論的。
 *
 * 背景の固定画像(z-[-1])はセクションの背後に写り込むが static asset なので問題なし。
 * baseURL(:3001) 相対で開く。
 *
 * 背景は priority なし(lazy)＋ next/image のオンデマンド最適化(AVIF/WebP)経由のため、
 * cold な CI(Linux) では最適化が間に合わず「背景未ロードの空白」で安定判定され
 * 基準が背景抜けになりやすい。撮影前に全 <img> のデコード完了を明示的に待つ。
 *
 * ヒーロー内の告知 <h3>（「命式が正常に生成できない…」）は将来変更/削除され得る
 * ため基準に含めない。撮影前に display:none で隠す:
 *  - display:none（visibility:hidden ではない）→ 将来コードから削除されて h3 が
 *    DOM から消えても、詰まったレイアウトと一致し基準が壊れない。
 *  - テキストではなく h3 で指定 → 文言が変わっても隠れ続ける（ヒーロー内の h3 は
 *    この告知だけ。キャッチは h2、ロゴは h1）。
 *  - evaluateAll → 対象0個（将来削除済み）でも no-op でエラーにならない。
 */
test('四柱推命 トップ ファーストビュー', async ({ page }) => {
  await page.goto('/');

  // 固定ナビ(position:fixed)が要素スクショ上部に被るため隠す
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });

  // ヒーロー = キャッチコピーを含む <section>
  const hero = page
    .locator('section', { hasText: '人生を導く羅針盤' })
    .first();

  // 変わり得る告知 <h3> を撮影対象から除外
  await hero
    .locator('h3')
    .evaluateAll(els => els.forEach(el => ((el as HTMLElement).style.display = 'none')));

  // 背景含む全画像のデコード完了を待つ（CI cold での背景抜け対策）
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

  await expect(hero).toHaveScreenshot('home-hero.png');
});
