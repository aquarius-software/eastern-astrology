import Container from "@/components/container";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { urlForImage } from "@/lib/sanity/image";
import PostList from "@/components/postlist";
import Image from "next/image";
import { notFound } from "next/navigation";
import BreadCrumb from "ui/Breadcrumbs";

export default function Author(props) {
  const { loading, posts, title, category } = props;

  if (!loading && !posts.length) {
    notFound();
  }

  return (
    <>
      <BreadCrumb
        items={[
          {
            label: title,
            path: `/category/${category}`
          }
        ]}></BreadCrumb>
      <Container>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-brand-primary text-3xl font-semibold tracking-tight dark:text-white lg:text-5xl lg:leading-tight">
            {title}
          </h1>
          <p className="mt-1 text-gray-600">{posts.length} 件</p>
        </div>
        <div className="mx-2 mt-20 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
          {posts.map(post => (
            <PostList key={post._id} post={post} aspect="square" />
          ))}
        </div>
      </Container>
    </>
  );
}
