import React from "react";
import PostForm from "./_components/post-form";
import { cookies } from "next/headers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post | News Feed System",
};

const PostingPage = async () => {
  const token = (await cookies()).get("token")?.value;

  return (
    <main className="w-full sm:px-5 lg:container lg:m-auto xl:px-20">
      <div className="flex w-full items-start justify-center gap-5 py-5">
        <section className="hidden w-full max-w-[200px] sm:block md:max-w-3xs 2xl:max-w-xs"></section>
        <section className="flex-1">
          <PostForm token={token} />
        </section>
        <section className="hidden w-full lg:block lg:max-w-3xs 2xl:max-w-xs"></section>
      </div>
    </main>
  );
};

export default PostingPage;
