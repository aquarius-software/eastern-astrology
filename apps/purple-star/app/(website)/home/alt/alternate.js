import Container from "@/components/container";
import PostList from "@/components/postlist";

export default function AltHome({ posts }) {
  return (
    <>
      <Container>
        <div className="grid ">
          {posts.slice(0, 1).map(post => (
            <PostList
              key={post._id}
              post={post}
              minimal={true}
              aspect="landscape"
              fontWeight="large"
              preloadImage={true}
            />
          ))}
        </div>
        <div className="mx-2 mt-20 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
          {posts.slice(1).map(post => (
            <PostList key={post._id} post={post} aspect="square" />
          ))}
        </div>
      </Container>
    </>
  );
}
