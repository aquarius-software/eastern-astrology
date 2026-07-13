import { NextResponse } from 'next/server';
import { MapboxGeoCode } from 'types';

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
    console.error("400 Bad Request:", "Invalid or empty JSON body in Mapbox Geocode API");
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  const address = req.address;

  if (!address)
    return new NextResponse(null, {
      status: 400,
      statusText: 'One or more required parameters missing.',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?language=ja&access_token=${process.env.MAPBOX_GEOCODING_API_KEY}`;

  try {
    console.log("Maxbox GeoCoding API called.");
    const response = await fetch(url);
    const geoCodingData = await response.json();
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const feature = geoCodingData.features[0];
    let isJapan = false;
    feature.context.forEach(c => {
      if (c.short_code === "jp") {
        isJapan = true;
      }
    });
    const geoCode: MapboxGeoCode = {
      longitude: feature.center[0],
      latitude: feature.center[1],
      isJapan: isJapan
    }

    return NextResponse.json(
      geoCode,
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
    console.error('An error occurred when calling the GeoCoding API:', error);
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