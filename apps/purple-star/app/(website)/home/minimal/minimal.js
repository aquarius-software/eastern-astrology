import Container from "@/components/container";
import PostList from "@/components/postlist";

export default function MinimalHome({ posts }) {
  return (
    <Container>
      <div className="mt-5 flex items-center justify-center ">
        <h1 className="text-brand-primary text-3xl font-semibold tracking-tight dark:text-white lg:text-5xl lg:leading-tight">
          ブログ
        </h1>
      </div>
      <div className="mx-2 mt-14 grid gap-10 lg:gap-10 ">
        {posts.map(post => (
          <PostList
            key={post._id}
            post={post}
            minimal={true}
            aspect="landscape"
            pathPrefix="minimal"
            fontWeight="large"
            preloadImage={true}
          />
        ))}
      </div>
    </Container>
  );
}
