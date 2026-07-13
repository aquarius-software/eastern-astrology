import Page from "./default";

import { getAllPagesSlugs, getPageBySlug } from "@/lib/sanity/client";

export async function generateStaticParams() {
  return await getAllPagesSlugs();
}

export async function generateMetadata({ params }) {
  const page = await getPageBySlug(params.slug);
  return {
    title: page.title,
    description: page.excerpt,
    alternates: {
      canonical: `/${params.slug}`
    },
    robots: {
      index: !page.noIndex
    }
  };
}

export default async function PageDefault({ params }) {
  const page = await getPageBySlug(params.slug);
  return <Page page={page} />;
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
