import { test, expect, type Page } from '@playwright/test';

/**
 * 紫微斗数 命盤リストページ（/list）の VRT。
 *
 * four-pillars の e2e/list.spec.ts と同じ方式（詳細コメントはそちら参照）。
 * 差分:
 *  - purple-star は :3002 の絶対 URL で開く
 *  - IndexedDB は DB "purple-star" / store "boards" / キー "ps-<uuid>"
 *  - 空状態の文言は「保存されている命盤データはありません。」
 *  - page.tsx の構造上、ラッパー div.mx-auto には見出し「命盤リスト」も
 *    含まれる（静的テキストなので撮影に含めて問題なし）
 */
const LIST_URL = 'http://localhost:3002/list';
const DB_NAME = 'purple-star';
const STORE_NAME = 'boards';
const EMPTY_TEXT = '保存されている命盤データはありません。';

// 注入する固定エントリ（createdAt は 12:00 UTC ＝ UTC/JST で同一日付）
const ENTRIES = [
  {
    key: 'ps-vrt-0001',
    value: {
      title: 'テスト命盤（一郎）',
      url: '/b?t=946695600000&b=35.69&l=139.7&o=-540&s=s&f=44',
      createdAt: Date.UTC(2024, 0, 15, 12, 0, 0) // 2024年1月15日
    }
  },
  {
    key: 'ps-vrt-0002',
    value: {
      title: 'テスト命盤（花子）',
      url: '/b?t=946695600000&b=35.69&l=139.7&o=-540&s=s&f=4',
      createdAt: Date.UTC(2024, 5, 1, 12, 0, 0) // 2024年6月1日
    }
  }
];

async function openList(page: Page) {
  await page.goto(LIST_URL);
  // 固定ナビ(position:fixed)が要素スクショに被るため隠す
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });
  // テーブル描画（= localForage が DB/store を作成済み）まで待つ
  await expect(page.locator('table')).toBeVisible();
}

// 見出し＋テーブル＋ページネーションを含む外側ラッパーを撮影対象にする
function tableWrapper(page: Page) {
  return page.locator('div.mx-auto:has(table)').first();
}

test('紫微斗数 命盤リスト（空状態）', async ({ page }) => {
  await openList(page);

  await expect(page.getByText(EMPTY_TEXT)).toBeVisible();
  await expect(tableWrapper(page)).toHaveScreenshot('board-list-empty.png');
});

test('紫微斗数 命盤リスト（データあり）', async ({ page }) => {
  await openList(page);
  // 空状態表示 = 初回読み込み完了（store 作成済み）を確認してから注入
  await expect(page.getByText(EMPTY_TEXT)).toBeVisible();

  await page.evaluate(
    async ({ dbName, storeName, entries }) => {
      const db: IDBDatabase = await new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName);
        req.onupgradeneeded = () => {
          // 念のため（通常はアプリの localForage が作成済み）
          if (!req.result.objectStoreNames.contains(storeName)) {
            req.result.createObjectStore(storeName);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        entries.forEach(entry => store.put(entry.value, entry.key));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      db.close();
    },
    { dbName: DB_NAME, storeName: STORE_NAME, entries: ENTRIES }
  );

  await page.reload();
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });

  // 注入した2件（createdAt 降順: 花子→一郎）が表示されるまで待つ
  await expect(page.getByText('テスト命盤（花子）')).toBeVisible();
  await expect(page.getByText('テスト命盤（一郎）')).toBeVisible();

  await expect(tableWrapper(page)).toHaveScreenshot('board-list-with-data.png');
});
