import { NextResponse } from 'next/server';
import { PurpleStarPersonalInfo } from '../PurpleStarPersonalInfo';
import { PurpleStarData } from '../PurpleStarData';
import { validatePurpleStarRequest } from 'utils';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

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
    console.error("400 Bad Request:", "Invalid or empty JSON body in board API");
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  const message = validatePurpleStarRequest(req);
  if (message) {
    console.error("400 Bad Request:", message);
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  const {
    isoDate,
    longitude,
    latitude,
    timezoneOffset,
    gender,
    languageCode,
    utcOffset,
    dstOffset,
    school,
    useSpaceMethod,
  } = req;

  const utcDate = new Date(isoDate);

  // リクエスト回数制限
  const ip = headers().get("x-forwarded-for");
  const { success } = await ratelimit.limit(ip as string);
  if (!success) {
    console.error("Ratelimit Exceeded", ip);
    return new NextResponse(null, {
      status: 429,
      statusText: 'Too Many Requests',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  // 生年月日情報の計算
  const personalInfo = new PurpleStarPersonalInfo(
    utcDate,
    longitude,
    latitude,
    utcOffset,
    dstOffset,
    timezoneOffset,
    gender,
    languageCode,
    useSpaceMethod,
    school,
  );
  personalInfo.init();
  const personalInfoObj = personalInfo.getObject();

  // 命盤作成
  const purpleStarData = new PurpleStarData(personalInfo);
  purpleStarData.init();
  const purpleStarDataObj = purpleStarData.getObject();

  const response = NextResponse.json(
    {
      status: 200,
      utcDate,
      utcOffset,
      dstOffset,
      timezoneOffset,
      ...personalInfoObj,
      ...purpleStarDataObj
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

// Route Handlers
// https://beta.nextjs.org/docs/routing/route-handlers

// How can I enable CORS on Vercel?
// https://vercel.com/guides/how-to-enable-cors

// Next.js Middleware & Cors | Nextjs 13 tutorial
// https://www.youtube.com/watch?v=h4-2K7nFf7s

// Route Handlers Crash with bcrypt #46493
// https://github.com/vercel/next.js/issues/46493

// serverComponentsExternalPackages
// https://beta.nextjs.org/docs/api-reference/next-config#servercomponentsexternalpackages
