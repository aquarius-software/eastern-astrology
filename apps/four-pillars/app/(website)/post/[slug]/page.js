import PostPage from "./sidebar.js";

import { getAllPostsSlugs, getPostBySlug } from "@/lib/sanity/client";

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
  return <PostPage post={post} />;
}
