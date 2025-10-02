import FeedCard from "@/components/cards/feed-card";
import { Post } from "@/type/post-type";
import React from "react";

const MyPostSection = ({
  posts,
  username,
  currentUser,
}: {
  posts: Post[];
  username: string;
  currentUser: string;
}) => {
  const postsWithUsername = posts.map((post) => ({
    ...post,
    username,
  }));
  return (
    <div className="flex flex-col gap-2">
      {postsWithUsername.length > 0 ? (
        postsWithUsername.map((post) => (
          <FeedCard key={post.id} feed={post} currentUser={currentUser} />
        ))
      ) : (
        <p className="text-muted-foreground/50 py-5 text-center font-semibold">
          No posts yet. Start posting to see your feed!
        </p>
      )}
    </div>
  );
};

export default MyPostSection;
