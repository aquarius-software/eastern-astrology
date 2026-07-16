import { test, expect } from '@playwright/test';

/**
 * 四柱推命 命式作成フォーム（/chart）の「日時一括入力」ピッカーの VRT。
 *
 * MUI X DateTimePicker（jaJP ロケール・landscape・ショートカット
 * 「現在の日時を入力」付き）。テキストフィールドのカレンダーアイコンを
 * クリックするとポップアップ（Popper、body 直下のポータル）が開く。
 *
 * 決定論性の担保（calendar.spec.ts と同じ方式）:
 * - ポップアップは完全クライアントサイド UI。表示月・「今日」の丸・
 *   時刻リストのスクロール位置が現在日時依存のため、
 *   page.clock.setFixedTime でブラウザ時計を固定する。
 * - timezoneId 'Asia/Tokyo' も固定（CI=UTC とローカル=JST の差を吸収）。
 *
 * 撮影はポップアップの Paper（ショートカット・カレンダー・時刻リスト・
 * キャンセル/確定ボタンを含む窓全体）のみ。ページ本体は含めない。
 * ショートカットはクリックしない（値が確定してポップアップが閉じ得るため、
 * 「未選択・今日にアウトライン」の初期表示を基準にする）。
 */
test.use({ timezoneId: 'Asia/Tokyo' });

// 2026-01-15(木) 12:00 JST に固定 → 2026年1月を表示、「今日」= 1/15
const FIXED_NOW = new Date('2026-01-15T12:00:00+09:00');

test('四柱推命 日時一括入力ピッカー', async ({ page }) => {
  await page.clock.setFixedTime(FIXED_NOW);

  await page.goto('/chart');

  // 固定ナビ(position:fixed)の写り込み防止（ポップアップとは重ならないはずだが念のため）
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });

  // ピッカーを開く: フォーム内で唯一の MUI 入力装飾ボタン（カレンダーアイコン）
  await page.locator('.MuiInputAdornment-root button').click();

  // ポップアップの窓（Popper 内の Paper）を撮影対象にする
  const popup = page.locator('.MuiPickerPopper-root .MuiPaper-root');

  // 描画完了を待つ: ショートカットチップ・「今日」の日付セル・確定ボタン
  await expect(popup.getByText('現在の日時を入力')).toBeVisible();
  await expect(popup.getByRole('gridcell', { name: '15' })).toBeVisible();
  await expect(popup.getByRole('button', { name: '確定' })).toBeVisible();

  await expect(popup).toHaveScreenshot('chart-datetime-picker.png');
});
