/**
 * Sanity の GROQ-powered Webhook を受け取り、更新されたコンテンツに対応する
 * ルートをオンデマンドで再検証する（App Router の Route Handler）。
 *
 * Webhook の設定手順（sanity.io/manage の API セクション、または `npx sanity hook create`）:
 * 1. URL: https://YOUR_NEXTJS_SITE_URL/api/revalidate
 * 2. Dataset: 対象のデータセット（既定は "all datasets"）
 * 3. Trigger on: "Create" / "Update" / "Delete"
 * 4. Filter: _type == "post" || _type == "author" || _type == "settings"
 * 5. Projection: 空のまま
 * 6. HTTP method: POST / API version: v2021-03-25 / Include drafts: No
 * 7. Secret: SANITY_REVALIDATE_SECRET と同じ値
 *
 * 旧実装は Pages Router の `res.revalidate()` を使っていたが、これは対象パスへ
 * 内部的に HTTP リクエストを飛ばす方式のため、パスが存在しないと 404 で失敗した。
 * App Router の `revalidatePath()` はキャッシュエントリを直接無効化する。
 */

import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { createClient, groq, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/lib/sanity/config";

/** 記事の詳細ページは /post/[slug]（単数形）。複数形にすると存在しないパスになる */
type StaleRoute = "/" | `/post/${string}`;

type StaleRoutesBody = {
  _type: string;
  _id: string;
  slug?: {
    current: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<StaleRoutesBody>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      const message = "Invalid signature";
      console.error(message);
      return new NextResponse(message, { status: 401 });
    }

    if (typeof body?._id !== "string" || !body._id) {
      const message = "Invalid _id";
      console.error(message, { body });
      return new NextResponse(message, { status: 400 });
    }

    const staleRoutes = await queryStaleRoutes(body);
    for (const route of staleRoutes) {
      revalidatePath(route);
    }

    console.log(`Updated routes: ${staleRoutes.join(", ")}`);
    return NextResponse.json({ revalidated: true, routes: staleRoutes });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      err instanceof Error ? err.message : "Unexpected error",
      { status: 500 }
    );
  }
}

async function queryStaleRoutes(
  body: StaleRoutesBody
): Promise<StaleRoute[]> {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false
  });

  // 削除された可能性を先に処理する
  if (body._type === "post") {
    const exists = await client.fetch(groq`*[_id == $id][0]`, { id: body._id });
    if (!exists) {
      const staleRoutes: StaleRoute[] = ["/"];
      if (body.slug?.current) {
        staleRoutes.push(`/post/${body.slug.current}`);
      }
      return staleRoutes;
    }
  }

  switch (body._type) {
    case "author":
      return await queryStaleAuthorRoutes(client, body._id);
    case "post":
      return await queryStalePostRoutes(client, body._id);
    case "settings":
      return await queryAllRoutes(client);
    default:
      throw new TypeError(`Unknown type: ${body._type}`);
  }
}

/** サイト全体に影響する設定（settings）が変わった場合に全ページを再検証する */
async function queryAllRoutes(client: SanityClient): Promise<StaleRoute[]> {
  const slugs = await client.fetch<string[]>(
    groq`*[_type == "post"].slug.current`
  );

  return ["/", ...slugs.map(slug => `/post/${slug}` as StaleRoute)];
}

/** 著者が更新されたら、その著者の記事ページとトップページを再検証する */
async function queryStaleAuthorRoutes(
  client: SanityClient,
  id: string
): Promise<StaleRoute[]> {
  const slugs = await client.fetch<string[]>(
    groq`*[_type == "author" && _id == $id] {
    "slug": *[_type == "post" && references(^._id)].slug.current
  }["slug"][]`,
    { id }
  );

  if (slugs.length > 0) {
    return ["/", ...slugs.map(slug => `/post/${slug}` as StaleRoute)];
  }

  return [];
}

/** 記事が更新されたら、その記事ページとトップページのみを再検証する */
async function queryStalePostRoutes(
  client: SanityClient,
  id: string
): Promise<StaleRoute[]> {
  const slugs = await client.fetch<string[]>(
    groq`*[_type == "post" && _id == $id].slug.current`,
    { id }
  );

  return ["/", ...slugs.map(slug => `/post/${slug}` as StaleRoute)];
}
