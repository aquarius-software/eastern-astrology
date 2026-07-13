import { test, expect, type Page } from '@playwright/test';

/**
 * 命式リストページ（/list）の VRT。
 *
 * /list は IndexedDB（localForage: DB "four-pillars" / store "charts" /
 * キー "fp-<uuid>" / 値 {title, url, createdAt(epoch ms)}）を読む
 * 完全クライアントサイドページ（ssr:false）。サーバー状態と違い
 * IndexedDB は page.evaluate で直接注入できるため、
 * 「空状態」と「データあり」の両方を決定論的にテストする。
 *
 * 決定論性:
 * - createdAt は toLocaleDateString("ja-JP") 描画でブラウザの TZ に依存する。
 *   12:00 UTC（JST では同日 21時）を使い、CI(UTC) とローカル(JST) で
 *   同じ日付文字列になるようにしている。
 * - 一覧は createdAt 降順ソートなので固定値で順序も固定。
 *
 * 手順: 先に /list を開く（アプリの localForage が DB/store を作成）→
 * 空状態を確認 → IndexedDB へ注入 → reload で反映。
 */
const DB_NAME = 'four-pillars';
const STORE_NAME = 'charts';
const EMPTY_TEXT = '保存されている命式データはありません。';

// 注入する固定エントリ（createdAt は 12:00 UTC ＝ UTC/JST で同一日付）
const ENTRIES = [
  {
    key: 'fp-vrt-0001',
    value: {
      title: 'テスト命式（一郎）',
      url: '/c?t=946695600000&b=35.69&l=139.7&o=-540&f=64',
      createdAt: Date.UTC(2024, 0, 15, 12, 0, 0) // 2024年1月15日
    }
  },
  {
    key: 'fp-vrt-0002',
    value: {
      title: 'テスト命式（花子）',
      url: '/c?t=946695600000&b=35.69&l=139.7&o=-540&f=44',
      createdAt: Date.UTC(2024, 5, 1, 12, 0, 0) // 2024年6月1日
    }
  }
];

async function openList(page: Page) {
  await page.goto('/list');
  // 固定ナビ(position:fixed)が要素スクショに被るため隠す
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });
  // テーブル描画（= localForage が DB/store を作成済み）まで待つ
  await expect(page.locator('table')).toBeVisible();
}

// テーブル＋ページネーションを含む外側ラッパー（page.tsx の div）を撮影対象にする
function tableWrapper(page: Page) {
  return page.locator('div.mx-auto:has(table)').first();
}

test('命式リスト（空状態）', async ({ page }) => {
  await openList(page);

  await expect(page.getByText(EMPTY_TEXT)).toBeVisible();
  await expect(tableWrapper(page)).toHaveScreenshot('list-empty.png');
});

test('命式リスト（データあり）', async ({ page }) => {
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
  await expect(page.getByText('テスト命式（花子）')).toBeVisible();
  await expect(page.getByText('テスト命式（一郎）')).toBeVisible();

  await expect(tableWrapper(page)).toHaveScreenshot('list-with-data.png');
});
