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
    console.error("400 Bad Request:", "Invalid or empty JSON body in Geonames Timezone API");
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

  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString('sv-SE');  // sv-SEロケールはYYYY-MM-DD形式
  const url = `https://secure.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&date=${dateStr}&username=aquarius_software`;

  try {
    console.log("GeoNames Time Zone API called.")
    const response = await fetch(url);
    const timezoneData = await response.json();
    if (!response.ok || timezoneData.status) {
      throw new Error(timezoneData.status.message);
    }
    const timezoneDataResponse = {
      dstOffset: (timezoneData.dates[1].offsetToGmt - timezoneData.gmtOffset) * 60 * 60,
      rawOffset: timezoneData.rawOffset * 60 * 60,
      status: "OK",
      timeZoneId: timezoneData.timezoneId,
      timeZoneName: timezoneData.timezoneId
    };

    return NextResponse.json(
      timezoneDataResponse,
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