import { test, expect } from '@playwright/test';

/**
 * 四柱推命 カレンダーページ（/calendar）の VRT。
 *
 * /calendar は "use client" の完全クライアントページ（FullCalendar）で、
 * イベントをローカル API（NEXT_PUBLIC_ROUTE_HANDLER_URL/api/calendar、
 * AWS Lambda から移行済み）へのブラウザ内 fetch で取得する。クライアント
 * fetch なので page.route で傍受でき、実 API・Upstash 非依存かつ決定論的に
 * できる（/c の SSR fetch とは対照的）。
 *
 * 実 API のレスポンス形式は「イベントの裸の配列」（旧 Lambda の
 * { events: [...] } 形式とは異なる。クライアントは Array.isArray で判定し、
 * 配列以外は空扱いになるので注意）:
 * (a) 1日につき3イベント
 *   { title: "丙午（年）", start: "…T00:00:00.001+09:00", end: 翌日T00:00:00.000 }
 *   { title: "甲午（月）", start: "…T00:00:00.002+09:00", … }
 *   { title: "癸酉（日）", start: "…T00:00:00.003+09:00", … }
 * （年/月/日の柱。ms .001-.003 は FullCalendar のセル内表示順の制御）
 * (b) 二十四節気（土用付き）の複数日イベント。ms .000 で干支より上に
 *   青い帯として描画される:
 *   { title: "小寒", start: "2026-01-06T00:00:00.000+09:00", end: "2026-01-18T00:00:00.000+09:00" }
 *
 * 決定論性の担保:
 * - page.clock.setFixedTime でブラウザ時計を固定 → 表示月・「今日」枠・
 *   validRange(今年±1年) がすべて固定される。
 * - timezoneId 'Asia/Tokyo' を固定 → CI(UTC) だと +09:00 のイベントが
 *   前日セルに描画されてしまうのを防ぐ（ローカル macOS(JST) と一致させる）。
 * - イベントは実 API を呼ばず計算生成して返す。日干支は実際の60日周期と
 *   一致（アンカー: 2026-06-28 = 癸酉 = 六十干支 index 9、実レスポンスより）。
 *   月干支・年干支は節入り境界を無視した簡易計算（2026-06=甲午/2026=丙午 で
 *   校正済み）。月の途中の切り替わりは実データと異なり得るが VRT には十分。
 * - 二十四節気は天文計算由来で不規則なため計算生成せず、2026年1月表示の
 *   グリッド範囲（2025-12-28〜2026-02-07）を覆う実データ5件を固定で持つ。
 *   FIXED_NOW（表示月）を変える場合は SOLAR_TERMS も差し替えること。
 *
 * page.route の注意:
 * - パターン '**\/calendar' は API の /api/calendar だけでなく、ページ URL
 *   自体（/calendar のドキュメント GET）にもマッチする。POST だけ fulfill し
 *   他は fallback する。
 * - OPTIONS の stub は Lambda 時代（クロスオリジン preflight 対策）の名残。
 *   現在は同一オリジンなので通常飛ばないが、無害なので保険として残す。
 */
test.use({ timezoneId: 'Asia/Tokyo' });

// 2026-01-15(木) 12:00 JST に固定 → 2026年1月を表示、「今日」= 1/15
const FIXED_NOW = new Date('2026-01-15T12:00:00+09:00');

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const ganzhi = (index: number): string => {
  const i = ((index % 60) + 60) % 60;
  return STEMS[i % 10] + BRANCHES[i % 12];
};

// 二十四節気（実 API レスポンスの 2026年1月グリッド範囲分をそのまま固定）
// ms .000 のため各セルで干支 .001-.003 より上（青い帯）に描画される
const SOLAR_TERMS = [
  {
    title: '冬至',
    start: '2025-12-28T00:00:00.000+09:00',
    end: '2026-01-06T00:00:00.000+09:00'
  },
  {
    title: '小寒',
    start: '2026-01-06T00:00:00.000+09:00',
    end: '2026-01-18T00:00:00.000+09:00'
  },
  {
    title: '小寒（土用）',
    start: '2026-01-18T00:00:00.000+09:00',
    end: '2026-01-21T00:00:00.000+09:00'
  },
  {
    title: '大寒（土用）',
    start: '2026-01-21T00:00:00.000+09:00',
    end: '2026-02-05T00:00:00.000+09:00'
  },
  {
    title: '立春',
    start: '2026-02-05T00:00:00.000+09:00',
    end: '2026-02-09T00:00:00.000+09:00'
  }
];

const DAY_MS = 86_400_000;
const JST_OFFSET_MS = 9 * 3_600_000;
// 日干支アンカー: 2026-06-28T00:00+09:00 = 癸酉（index 9）
const ANCHOR_MS = Date.UTC(2026, 5, 27, 15, 0, 0);
const ANCHOR_INDEX = 9;

/** FullCalendar が要求した範囲 [startStr, endStr) の日毎イベントを生成する */
function eventsFor(startStr: string, endStr: string) {
  const events: { title: string; start: string; end: string }[] = [];
  const startMs = new Date(startStr).getTime();
  const endMs = new Date(endStr).getTime();

  const jstDateStr = (ms: number) => {
    const jst = new Date(ms + JST_OFFSET_MS);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${jst.getUTCFullYear()}-${pad(jst.getUTCMonth() + 1)}-${pad(jst.getUTCDate())}`;
  };

  for (let t = startMs; t < endMs; t += DAY_MS) {
    const jst = new Date(t + JST_OFFSET_MS);
    const y = jst.getUTCFullYear();
    const m = jst.getUTCMonth() + 1;

    const diffDays = Math.round((t - ANCHOR_MS) / DAY_MS);
    const dayIndex = ANCHOR_INDEX + diffDays;
    const monthIndex = y * 12 + m + 12; // 2026-06 = 甲午（index 30）で校正
    const yearIndex = y - 4; // 2026 = 丙午（index 42）。立春境界は無視

    const dateStr = jstDateStr(t);
    const nextDateStr = jstDateStr(t + DAY_MS);
    // ms .001(年) → .002(月) → .003(日) の昇順でセル内に縦に並ぶ（実 API と同じ）
    events.push(
      {
        title: `${ganzhi(yearIndex)}（年）`,
        start: `${dateStr}T00:00:00.001+09:00`,
        end: `${nextDateStr}T00:00:00.000+09:00`
      },
      {
        title: `${ganzhi(monthIndex)}（月）`,
        start: `${dateStr}T00:00:00.002+09:00`,
        end: `${nextDateStr}T00:00:00.000+09:00`
      },
      {
        title: `${ganzhi(dayIndex)}（日）`,
        start: `${dateStr}T00:00:00.003+09:00`,
        end: `${nextDateStr}T00:00:00.000+09:00`
      }
    );
  }
  return events;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type'
};

test('四柱推命 カレンダー（2026年1月固定）', async ({ page }) => {
  await page.clock.setFixedTime(FIXED_NOW);

  await page.route('**/calendar', async route => {
    const request = route.request();
    if (request.method() === 'OPTIONS') {
      // CORS preflight（実 API がクロスオリジンの場合に飛ぶ）
      return route.fulfill({ status: 204, headers: CORS_HEADERS });
    }
    if (request.method() !== 'POST') {
      // ページ本体のドキュメント GET などはそのまま通す
      return route.fallback();
    }
    const { startDate, endDate } = request.postDataJSON();
    // ローカル API と同じ「裸の配列」で返す（{events: [...]} だと
    // クライアントの Array.isArray 判定に落ちて空カレンダーになる）
    return route.fulfill({
      status: 200,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
      body: JSON.stringify([...SOLAR_TERMS, ...eventsFor(startDate, endDate)])
    });
  });

  await page.goto('/calendar');

  // 固定ナビ(position:fixed)が要素スクショに被るため隠す
  await page.addStyleTag({ content: 'nav.fixed { display: none !important; }' });

  const calendar = page.locator('.fc');
  // タイトルとイベント描画（stub 応答の反映）を待つ。
  // 二十四節気の帯（週をまたぐと複数セグメントに分割されるため first()）も確認
  await expect(calendar.getByText('2026年1月')).toBeVisible();
  await expect(calendar.locator('.fc-event').first()).toBeVisible();
  await expect(calendar.getByText('冬至').first()).toBeVisible();

  await expect(calendar).toHaveScreenshot('calendar.png');
});
