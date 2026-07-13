import { NextResponse } from 'next/server';
import { getItemsFromArrayCycle } from 'utils';
import { SEXAGENARY_CYCLE, PALACE_BRANCHES } from 'types';
const CalendarChinese = require("date-chinese").CalendarChinese;

export async function POST(request: Request) {
  const origin = request.headers.get('origin');

  // ボディが空・不正 JSON の場合に未処理例外（スタックトレース）を出さない。
  // クライアントが送信中にページを閉じた中断リクエストでも発生し得る
  let req: any;
  try {
    req = await request.json();
    if (!req || typeof req !== 'object') {
      throw new Error('JSON body is not an object');
    }
  } catch {
    console.error("400 Bad Request:", "Invalid or empty JSON body in months API");
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  const cycle = req.cycle;
  if (cycle < 1) {
    console.error("400 Bad Request:", "Invalid cycle");
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  let year = req.year;
  if (year < 1 || year > 60) {
    console.error("400 Bad Request:", "Invalid year");
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  const januaryBranchIndex = req.januaryBranchIndex;
  if (januaryBranchIndex < 0 || januaryBranchIndex > 11) {
    console.error("400 Bad Request:", "Invalid januaryBranchIndex");
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  // 指定の位置から十二支を取得
  const yearBranchIndex = (year - 1) % 12;
  const branchArray = getItemsFromArrayCycle(
    PALACE_BRANCHES,
    (januaryBranchIndex + yearBranchIndex) % 12,
    12,
    true
  );

  // 西暦年を取得
  const cal = new CalendarChinese(cycle, year, 1, false, 1);
  const date: Date = cal.toDate();
  const startYearAd = date.getFullYear();

  // 干支を取得
  const sexagenaryCycle = SEXAGENARY_CYCLE[year - 1];

  // 月情報を取得
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month, i) => {
    let isLeap = false;

    let firstCal = new CalendarChinese(cycle, year, month, false, 1);
    let startDate: Date = firstCal.toDate();
    firstCal = firstCal.fromGregorian(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
    let firstLeap = firstCal.leap;

    let nextCal = new CalendarChinese(cycle, year, month, true, 1);
    const leapDate: Date = nextCal.toDate()
    nextCal = nextCal.fromGregorian(leapDate.getFullYear(), leapDate.getMonth() + 1, leapDate.getDate());
    let nextLeap = nextCal.leap;

    let endDate: Date;
    let endMonth: number;
    let endYear: number = year;
    if (month + 1 > 12) {
      endMonth = 1;
      endYear = year + 1;
    } else {
      endMonth = month + 1;
    }
    const endCal = new CalendarChinese(cycle, endYear, endMonth, false, 1);
    endDate = endCal.toDate();

    // 2033年閏月の特殊ルール対応
    if (cycle === 78 && year === 50) {
      if (month === 7) {
        // 2033年7月を閏月としない
        const endCal = new CalendarChinese(cycle, year, 7, true, 1);
        endDate = endCal.toDate();
        firstLeap = false;
        nextLeap = false;
      } else if (month === 8) {
        // 2033年8月は1月分だけ上にずらす
        const startCal = new CalendarChinese(cycle, year, 7, true, 1);
        startDate = startCal.toDate();
        const endCal = new CalendarChinese(cycle, year, 8, false, 1);
        endDate = endCal.toDate();
      } else if (month > 8 && month < 11) {
        // 2033年9月・10月は1月分だけ上にずらす
        // 2033年10月を閏月としない
        const startCal = new CalendarChinese(cycle, year, month - 1, false, 1);
        startDate = startCal.toDate();
        const endCal = new CalendarChinese(cycle, year, month, false, 1);
        endDate = endCal.toDate();
        firstLeap = false;
        nextLeap = false;
      } else if (month === 11) {
        // 2033年11月を閏月とする
        const startCal = new CalendarChinese(cycle, year, 10, false, 1);
        startDate = startCal.toDate();
        const endCal = new CalendarChinese(cycle, year, 12, false, 1);
        endDate = endCal.toDate();
        firstLeap = false;
        nextLeap = true;
      }
    }

    // 閏月が含まれているかどうか判定
    if (!firstLeap && nextLeap) {
      isLeap = true;
    }

    // 現在の月運であるかどうか判定
    let isCurrentMonth = false;
    const now = new Date();
    if (
      startDate.getTime() <= now.getTime() &&
      endDate.getTime() >= now.getTime()
    ) {
      isCurrentMonth = true;
    }

    return {
      monthIndex: month,
      branch: branchArray[i].value,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isLeap,
      isCurrentMonth
    }
  })

  const response = NextResponse.json(
    {
      status: 200,
      stem: sexagenaryCycle.stem,
      branch: sexagenaryCycle.branch,
      startYearAd,
      endYearAd: startYearAd + 1,
      months
    },
    {
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }
    }
  );
  return response;
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');

  const response = NextResponse.json(
    {
      status: 200
    },
    {
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
  );
  return response;
}
