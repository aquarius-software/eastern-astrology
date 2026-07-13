import Link from "next/link";
import Container from "@/components/container";
import { notFound } from "next/navigation";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { parseISO, format } from "date-fns";
import BreadCrumb from "ui/Breadcrumbs";

export default function Page(props) {
  const { loading, page } = props;

  const slug = page?.slug;

  if (!loading && !slug) {
    notFound();
  }

  return (
    <>
      <BreadCrumb
        items={[
          {
            label: page.title,
            path: `/${slug}`
          }
        ]}></BreadCrumb>

      <Container className="!pt-0">
        <div className="mx-auto mb-4 mt-8 max-w-screen-md">
          <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
            {page.title}
          </h1>
          {/* <div className="mt-3 flex justify-center space-x-3 text-gray-500 ">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center space-x-2 text-sm">
                  <time
                    className="text-gray-500 dark:text-gray-400"
                    dateTime={page?.publishedAt || page._createdAt}>
                    {format(
                      parseISO(page?.publishedAt || page._createdAt),
                      "最終更新日 yyyy年M月d日"
                    )}
                  </time>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </Container>

      <Container>
        <article className="mx-auto mt-0 max-w-screen-md rounded-xl bg-white pb-5 pt-10">
          <div className="prose mx-auto my-3 px-3 dark:prose-invert prose-a:text-blue-600">
            {page.body && <PortableText value={page.body} />}
          </div>
          <div className="mb-7 mt-7 flex justify-center">
            <Link
              href="/"
              prefetch={false}
              className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600 dark:text-blue-500 ">
              ← ホームに戻る
            </Link>
          </div>
        </article>
      </Container>
    </>
  );
}
