import { NextResponse } from 'next/server';

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
    console.error("400 Bad Request:", "Invalid or empty JSON body in Google Timezone API");
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  const latitude = req.latitude;
  const longitude = req.longitude;
  const timestamp = req.timestamp;

  if (!latitude || !longitude || !timestamp)
    return new NextResponse(null, {
      status: 400,
      statusText: 'One or more required parameters missing.',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });

  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude}%2C${longitude}&timestamp=${timestamp}&language=ja&key=${process.env.GOOGLE_TIMEZONE_API_KEY}`;

  try {
    console.log("Google Maps Time Zone API called.")
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Response Code: ${response.status}`);
    }
    const timezoneData = await response.json();

    return NextResponse.json(
      {
        dstOffset: timezoneData.dstOffset,
        errorMessage: timezoneData.errorMessage,
        rawOffset: timezoneData.rawOffset,
        status: timezoneData.status,
        timeZoneId: timezoneData.timeZoneId,
        timeZoneName: timezoneData.timeZoneName
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
  } catch (error: any) {
    console.error('An error occurred when calling the maps API:', error);
    const message = error.response ? `${error.response.status} ${error.response.data}` : error.message;

    return NextResponse.json(
      {
        status: 400,
        message
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
  }
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