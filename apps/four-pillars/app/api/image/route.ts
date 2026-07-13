import { NextResponse } from 'next/server';

// 画像生成の実処理（プロンプト組み立て・画像生成モデル呼び出し）は
// 非公開サービスに隔離されている。この Route Handler は
// 認証トークンを付けて転送するだけの薄いプロキシ。
const IMAGE_SERVICE_URL = process.env.IMAGE_SERVICE_URL;
const SERVICE_SHARED_SECRET = process.env.SERVICE_SHARED_SECRET;

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');

  // 非公開サービスの設定が無ければ処理しない（デプロイ時の設定漏れを検知）
  if (!IMAGE_SERVICE_URL || !SERVICE_SHARED_SECRET) {
    console.error('500 Image service is not configured (IMAGE_SERVICE_URL / SERVICE_SHARED_SECRET)');
    return NextResponse.json(
      { message: 'Image service not configured' },
      { status: 500, headers: corsHeaders(origin) }
    );
  }

  // ボディが空・不正 JSON の場合に未処理例外（スタックトレース）を出さない。
  // クライアントが送信中にページを閉じた中断リクエストでも発生し得る
  let req: any;
  try {
    req = await request.json();
    if (!req || typeof req !== 'object') {
      throw new Error('JSON body is not an object');
    }
  } catch {
    console.error('400 Bad Request:', 'Invalid or empty JSON body in Image Generation API');
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    });
  }

  // 四柱の各インデックスのみを転送（プロンプト文字列は非公開サービス内で組み立て）
  const { dayIdx, monthIdx, yearIdx, monthBranchIdx, width, height } = req;

  try {
    const response = await fetch(`${IMAGE_SERVICE_URL}/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SERVICE_SHARED_SECRET}`
      },
      body: JSON.stringify({ dayIdx, monthIdx, yearIdx, monthBranchIdx, width, height })
    });

    if (!response.ok) {
      throw new Error(`Image service returned ${response.status}`);
    }

    // 非公開サービスは { imageUrl } を返す。そのままクライアントへ渡す
    const data = await response.json();

    return NextResponse.json(data, { headers: corsHeaders(origin) });
  } catch (error) {
    console.error('Error requesting image service:', error);
    return NextResponse.json(
      { message: 'Image generation failed' },
      { status: 502, headers: corsHeaders(origin) }
    );
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');

  return NextResponse.json(
    { status: 200 },
    {
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
  );
}
