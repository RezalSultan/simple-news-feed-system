import React from "react";
import ProfileSection from "./_components/profile-section";
import MyPostSection from "./_components/my-post-section";
import { Separator } from "@/components/ui/separator";

const UserPage = () => {
  return (
    <main className="w-full sm:px-10 lg:container lg:m-auto xl:px-20">
      <div className="flex w-full items-start justify-center gap-5 py-5">
        <section className="hidden w-full max-w-[150px] lg:block 2xl:max-w-xs"></section>
        <section className="flex-1">
          <ProfileSection />
          <div className="flex items-center gap-3 py-2">
            <p className="text-2xl font-semibold text-nowrap">My Post</p>
            <Separator className="flex-1" />
          </div>
          <MyPostSection />
        </section>
        <section className="hidden w-full max-w-[150px] lg:block 2xl:max-w-xs"></section>
      </div>
    </main>
  );
};

export default UserPage;
