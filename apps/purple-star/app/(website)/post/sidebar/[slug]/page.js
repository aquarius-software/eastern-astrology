import PostPage from "./sidebar";

import {
  getAllPostsSlugs,
  getPostBySlug,
  getTopCategories
} from "@/lib/sanity/client";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata(props) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/post/${params.slug}`
    }
  };
}
export default async function PostDefault(props) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);
  const categories = await getTopCategories();
  return <PostPage post={post} categories={categories} />;
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
