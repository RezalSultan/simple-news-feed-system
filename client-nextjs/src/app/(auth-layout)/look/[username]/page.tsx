import React from "react";
import ProfileSection from "./_components/profile-section";
import { Separator } from "@/components/ui/separator";
import { AllInfoUser } from "@/type/user-type";
import { lookUser } from "@/service/look-user-service";
import { cookies } from "next/headers";
import PostSection from "./_components/post-section";
import { ToastError } from "@/components/client-toaster";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Profile | News Feed System",
};

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const token = (await cookies()).get("token")?.value;
  const currentUser = (await cookies()).get("username")?.value;
  const { username } = await params;

  const result = await lookUser(username, token);
  let profile: AllInfoUser | null = result.data ?? null;

  if ("errors" in result) {
    if (result.statusCode === 403) return redirect("/feed");
    profile = null;
  }

  return (
    <>
      {"errors" in result && result.errors?.message && (
        <ToastError message={result.errors.message} />
      )}
      <main className="w-full sm:px-10 lg:container lg:m-auto xl:px-20">
        <div className="flex w-full items-start justify-center gap-5 py-5">
          <section className="hidden w-full max-w-[150px] lg:block 2xl:max-w-xs"></section>
          <section className="flex-1">
            <ProfileSection token={token} profile={profile} />
            <div className="flex items-center gap-3 py-2">
              <p className="pl-6 text-2xl font-semibold text-nowrap sm:pl-0">
                Post
              </p>
              <Separator className="flex-1" />
            </div>
            <PostSection
              posts={profile?.posts ?? []}
              username={profile?.username ?? ""}
              currentUser={currentUser ?? ""}
            />
          </section>
          <section className="hidden w-full max-w-[150px] lg:block 2xl:max-w-xs"></section>
        </div>
      </main>
    </>
  );
};

export default UserPage;
