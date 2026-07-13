import { notFound } from "next/navigation";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { urlForImage } from "@/lib/sanity/image";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import AuthorCard from "@/components/blog/authorCard";
import Sidebar from "@/components/sidebar";
import BreadCrumb from "ui/Breadcrumbs";
import PostCategoryLabel from "@/components/blog/postCategory";
import { Chip } from "@heroui/react";
import { TableOfContents } from "ui/TableOfContents";

// https://kittygiraudel.com/2022/05/19/table-of-contents-with-sanity-portable-text/

/**
 * 指定された抽象構文木（AST）内で、指定された条件に一致するノードをフィルタリングします。
 * 子ノードも再帰的に検索され、一致するすべてのノードがフラットな配列として返されます。
 *
 * @param {Array} ast 検索するノードの配列を含む抽象構文木。
 * @param {Function} match 各ノードに適用されるテスト関数。一致する場合はtrueを返します。
 * @returns {Array} 一致するノードのフラットな配列。
 */
const filter = (ast, match) =>
  ast.reduce((acc, node) => {
    if (match(node)) acc.push(node); // 現在のノードが条件に一致するかテスト
    if (node.children) acc.push(...filter(node.children, match)); // 子ノードがある場合、再帰的にフィルタリングする
    return acc; // 結果の配列を返す
  }, []);

/**
 * Reactコンポーネントのpropsから子要素のテキストを取得して結合します。
 * 子要素が文字列の場合はそのまま取得し、オブジェクトの場合はそのtextプロパティを取得します。
 * textプロパティが存在しない場合は、空の文字列を返します。
 *
 * @param {Object} props 子要素を含むReactコンポーネントのプロパティ。
 * @returns {string} 子要素のテキストを結合した文字列。
 */
const getChildrenText = props =>
  props.children
    .map(node => (typeof node === "string" ? node : node.text || ""))
    .join("");

/**
 * 抽象構文木（AST）から見出し要素を見つけ出し、それらのノードをテキスト情報と共に取得します。
 * 'filter'関数を使用して、見出しに該当するスタイルを持つノードを抽出します。
 * そして、各ノードについて、その子要素からテキストを取得し、新しいオブジェクトにまとめて返します。
 *
 * @param {Array} ast 検索するノードの配列を含む抽象構文木。
 * @returns {Array} 見出しノードとそのテキストを含むオブジェクトの配列。
 */
const findHeadings = ast =>
  filter(ast, node => /h\d/.test(node.style)).map(node => {
    const text = getChildrenText(node); // 子要素からテキストを取得

    return { ...node, text }; // 新しいオブジェクトを作成して返す
  });

/**
 * 抽象構文木（AST）から文書のアウトライン（見出しの階層構造）を解析し、生成します。
 * まず、見出しをすべて見つけ出し、それらの階層レベルに基づいてアウトラインを構築します。
 * 各見出しは、見出しレベルに応じて一意のIDを割り当てられ、その子見出しのリストを保持します。
 *
 * @param {Array} ast 解析対象のノードの配列を含む抽象構文木。
 * @returns {Array} 文書のアウトラインを表すオブジェクトの配列。各オブジェクトは見出し情報と、
 *                  それに関連する下位レベルの見出しリスト（subheadings）を含みます。
 */
const parseOutline = ast => {
  const outline = { subheadings: [] }; // 最初のアウトラインを初期化
  const headings = findHeadings(ast); // ASTから見出しをすべて抽出
  const path = []; // 現在の見出しのパスを追跡
  let lastLevel = 0; // 前の見出しのレベル
  let h2Count = 0; // H2見出しのカウント
  let h3Count = 0; // H3見出しのカウント

  headings.forEach((heading, i) => {
    // 見出しのスタイルに応じたIDを設定
    if (heading.style === "h2") {
      h2Count++;
      h3Count = 0;
      heading.id = `${h2Count}`;
    } else if (heading.style === "h3") {
      h3Count++;
      heading.id = `${h2Count}-${h3Count}`;
    }

    const level = Number(heading.style.slice(1)); // 見出しのレベルを取得
    heading.subheadings = []; // 子見出しリストを初期化

    // パスを適切に更新
    if (level < lastLevel)
      for (let i = lastLevel; i >= level; i--) path.pop();
    else if (level === lastLevel) path.pop();

    // オブジェクトのパスを解決
    const objectPath =
      path.length === 0
        ? path
        : ["subheadings"].concat(
            path.join(".subheadings.").split(".")
          );
    const prop = objectPath.reduce(
      (prev, curr) => prev[curr],
      outline
    );

    // 現在の見出しを適切な場所に挿入
    prop.subheadings.push(heading);
    path.push(prop.subheadings.length - 1);
    lastLevel = level;
  });

  return outline.subheadings; // 完成したアウトラインを返す
};

export default function Post(props) {
  const { loading, post, categories } = props;

  const slug = post?.slug;

  if (!loading && !slug) {
    notFound();
  }
  const imageProps = post?.mainImage
    ? urlForImage(post?.mainImage)
    : null;

  const AuthorimageProps = post?.author?.image
    ? urlForImage(post.author.image)
    : null;

  const outline = parseOutline(post.body);
  const subHeadings = [];
  outline.forEach(heading => {
    subHeadings.push(...heading.subheadings);
  });

  return (
    <>
      <BreadCrumb
        items={[
          {
            label: "ブログ",
            path: "/blog",
            classNames: "whitespace-nowrap"
          },
          {
            label: post.title,
            path: `/${slug}`,
            classNames: "whitespace-normal"
          }
        ]}></BreadCrumb>
      <div className="mx-auto mt-4 flex max-w-screen-xl flex-col gap-5 px-5 lg:flex-row">
        <article className="flex-1 rounded-2xl bg-white px-3 pb-10 pt-4 md:mx-10 md:px-10">
          <div className="prose prose-lg mx-auto my-3 dark:prose-invert prose-h2:scroll-mt-24 prose-h2:border-b-2 prose-h2:border-l-2 prose-h2:border-gray-300 prose-h2:pb-3 prose-h2:pl-4 prose-h2:text-2xl prose-h3:scroll-mt-24 prose-h3:text-xl prose-a:text-blue-500 prose-blockquote:rounded prose-blockquote:bg-gray-100 prose-blockquote:p-4 prose-blockquote:text-base prose-blockquote:not-italic prose-li:leading-7 prose-img:my-4 prose-img:rounded-md prose-h2:md:text-2xl prose-h3:md:text-xl ">
            <div className="flex justify-start">
              <PostCategoryLabel categories={post.categories} />
            </div>
            <h1 className="mb-3 mt-2 text-3xl leading-normal tracking-normal md:text-4xl md:leading-normal">
              {post.title}
            </h1>
            <div className="mt-4 flex justify-end space-x-2 text-gray-500 ">
              <div className="flex flex-row items-center rounded-2xl text-sm md:text-base">
                <div className="flex">
                  {/* <div className="relative h-5 w-5 flex-shrink-0">
                    {AuthorimageProps && (
                      <Link
                        href={`/author/${post.author.slug.current}`}>
                        <Image
                          src={AuthorimageProps.src}
                          alt={post?.author?.name}
                          className="rounded-full object-cover"
                          fill
                          sizes="100vw"
                        />
                      </Link>
                    )}
                  </div> */}
                </div>
              </div>
            </div>
            <div className="relative z-0 mx-auto aspect-[4/3] max-w-screen-lg overflow-hidden lg:rounded-lg">
              {imageProps && (
                <Image
                  src={imageProps.src}
                  alt={post.mainImage?.alt || "Thumbnail"}
                  loading="eager"
                  fill
                  sizes="100vw"
                  className="rounded-md object-cover"
                />
              )}
            </div>
            <h2 className="border-b-2 border-l-2 border-gray-300 pb-3 pl-4 text-2xl md:text-3xl">
              はじめに
            </h2>
            {post.lead && <PortableText value={post.lead} />}
            <h2 className="border-b-2 border-l-2 border-gray-300 pb-3 pl-4 text-2xl md:text-3xl">
              目次
            </h2>
            <div className="rounded-lg bg-gray-50 px-6 py-2">
              <TableOfContents outline={outline} />
            </div>
            {post.body && (
              <PortableText
                value={post.body}
                headings={outline}
                subHeadings={subHeadings}
              />
            )}
            <div className="flex justify-end">
              <span>【記事作成・監修】</span>
              {/* <Link
                prefetch={false}
                className="text-gray-600 no-underline hover:text-blue-500 focus-visible:text-blue-500 focus-visible:ring-2 dark:text-gray-400"
                href={`/author/${post.author.slug.current}`}>
                {post.author.name}
              </Link> */}
              {post.author.name}
              {/* <time
                          className="ml-3 text-gray-500"
                          dateTime={
                            post?.publishedAt || post._createdAt
                          }>
                          {format(
                            parseISO(
                              post?.publishedAt || post._createdAt
                            ),
                            "yyyy年M月d日"
                          )}
                        </time> */}
            </div>
          </div>

          {/* <div className="mb-7 mt-7 flex justify-center">
            <Link
              href="/"
              className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600 dark:text-blue-500 ">
              ← ホームに戻る
            </Link>
          </div> */}
          {/* {post.author && <AuthorCard author={post.author} />} */}
        </article>
        <aside className="sticky top-24 mx-4 self-center sm:mx-10 lg:mx-0 lg:w-96 lg:self-start">
          <Sidebar
            categories={categories}
            // pathPrefix="sidebar"
            related={post.related.filter(
              item => item.slug.current !== slug
            )}
          />
        </aside>
      </div>
    </>
  );
}
