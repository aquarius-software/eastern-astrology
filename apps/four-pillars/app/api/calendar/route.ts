import { NextResponse } from "next/server";
import {
  getEclipticLongitude,
  utcToJulianDay,
  getSolarTermBySpace,
  isEarthPeriodBySpace
} from "utils";
import {
  getYearPillar,
  getMonthPillar,
  getDayPillar
} from "../pillars";
import { DateTime } from 'luxon';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  // /api/chart とはカウンターを分けるため専用のプレフィックスを使う
  prefix: "@upstash/ratelimit:calendar",
});

type Event = {
  title: string;
  start: string;
  end: string;
};

export async function POST(request: Request) {
  const origin = request.headers.get("origin");

  // ボディが空・不正 JSON の場合に未処理例外（スタックトレース）を出さない。
  // クライアントが送信中にページを閉じた中断リクエストでも発生し得る
  let req: any;
  try {
    req = await request.json();
    if (!req || typeof req !== "object") {
      throw new Error("JSON body is not an object");
    }
  } catch {
    console.error("400 Bad Request:", "Invalid or empty JSON body in calendar API");
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request",
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Content-Type": "text/plain"
      }
    });
  }

  const { startDate: startDateStr, endDate: endDateStr } = req;

  if (!startDateStr || !endDateStr) {
    return new NextResponse(null, {
      status: 400,
      statusText: "One or more required parameters missing.",
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Content-Type": "text/plain"
      }
    });
  }

  // リクエスト回数制限
  const ip = headers().get("x-forwarded-for");
  const { success } = await ratelimit.limit(ip as string);
  if (!success) {
    console.error("Ratelimit Exceeded", ip);
    return new NextResponse(null, {
      status: 429,
      statusText: "Too Many Requests",
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Content-Type": "text/plain"
      }
    });
  }

  const events: Event[] = [];

  try {
    // 文字列にオフセットが含まれていればそれを維持（setZone）、
    // 日付のみの場合は Asia/Tokyo として解釈する。
    // サーバーのタイムゾーン設定に結果が依存しないようにするため
    const startDateTime = DateTime.fromISO(startDateStr, {
      zone: "Asia/Tokyo",
      setZone: true
    });
    const endDateTime = DateTime.fromISO(endDateStr, {
      zone: "Asia/Tokyo",
      setZone: true
    });

    // 二つの日付の差分を取得
    const diff = endDateTime.diff(startDateTime, 'days');
    const diffDays = Math.round(diff.days);
    let previousSolarTermName = "";
    let previousStartDateTime = startDateTime;

    // 最初の日付から1日ごとにデータを取得
    for (let i = 0; i <= diffDays; i++) {
      const nextDateTimeStart = startDateTime.plus({ days: i });
      const nextDateTimeEnd = startDateTime.plus({ days: i + 1 });

      let originalYear = nextDateTimeStart.year;
      const originalMonth = nextDateTimeStart.month;
      const originalHour = nextDateTimeStart.hour;

      let adjustedYear = originalYear;
      let adjustedMonth = originalMonth;

      const nextDateStart = nextDateTimeStart.toJSDate();
      const elon = getEclipticLongitude(nextDateStart);
      const julianDay = utcToJulianDay(nextDateStart);
      const solarTerm = getSolarTermBySpace(nextDateStart);

      if (elon === undefined || !solarTerm) {
        throw new Error(
          `Failed to get the ecliptic longitude or solar term for ${nextDateTimeStart.toISO()}.`
        );
      }

      // 土用判定
      const inEarthPeriod = isEarthPeriodBySpace(elon);

      // 年の調整
      if (originalMonth <= 2 && elon <= 315) {
        adjustedYear--;
      }

      // 月の調整
      if (solarTerm.month + 1 === originalMonth) {
        // 2-12月の節入り日前の場合
        adjustedMonth = originalMonth - 1;
      } else if (solarTerm.month === 12 && originalMonth === 1) {
        // 1月の節入り日前の場合
        adjustedMonth = 12;
        originalYear = originalYear - 1;
      }

      // 年干支を取得
      const yearCycle = getYearPillar(adjustedYear);

      // 月干支を取得
      const monthCycle = getMonthPillar(originalYear, adjustedMonth);

      // 日干支を取得
      const dayCycle = getDayPillar(
        originalHour,
        // ユリウス日を現地の壁時計基準に調整（offsetは分単位、東側が正）
        julianDay + nextDateTimeStart.offset / 1440,
        false
      );

      // 日柱・月柱・年柱
      events.push({
        title: `${dayCycle.stem}${dayCycle.branch}（日）`,
        start: nextDateTimeStart.plus({ milliseconds: 3 }).toISO() || "",
        end: nextDateTimeEnd.toISO() || ""
      });
      events.push({
        title: `${monthCycle.stem}${monthCycle.branch}（月）`,
        start: nextDateTimeStart.plus({ milliseconds: 2 }).toISO() || "",
        end: nextDateTimeEnd.toISO() || ""
      });
      events.push({
        title: `${yearCycle.stem}${yearCycle.branch}（年）`,
        start: nextDateTimeStart.plus({ milliseconds: 1 }).toISO() || "",
        end: nextDateTimeEnd.toISO() || ""
      });

      // 二十四節気
      const title = `${solarTerm.name}${inEarthPeriod ? '（土用）' : ''}`;
      if (previousSolarTermName !== "" && previousSolarTermName !== title) {
        events.push({
          title: previousSolarTermName,
          start: previousStartDateTime.toISO() || "",
          end: nextDateTimeStart.toISO() || ""
        });
        previousStartDateTime = nextDateTimeStart;
      }
      if (i === diffDays) {
        // 残っている節気を最後にまとめる
        events.push({
          title: title,
          start: previousStartDateTime.toISO() || "",
          end: nextDateTimeEnd.toISO() || ""
        });
      }
      previousSolarTermName = title;
    }

    return NextResponse.json(events, {
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      }
    });
  } catch (error: any) {
    console.error(
      "The following error occurred when calling Calendar API. ",
      error
    );
    const message = error.response
      ? `${error.response.status} ${error.response.data}`
      : error.message;

    return NextResponse.json(
      {
        status: 400,
        message
      },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        }
      }
    );
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");

  const response = NextResponse.json(
    {
      status: 200
    },
    {
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    }
  );
  return response;
}
