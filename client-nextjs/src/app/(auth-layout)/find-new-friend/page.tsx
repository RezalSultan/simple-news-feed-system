import React from "react";
import { cookies } from "next/headers";
import HeaderFind from "./_components/header";
import GridCardUser from "./_components/grid-card-user";
import { getAllUser } from "@/service/get-all-user-service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find New Friends | News Feed System",
};

const ProfilePage = async () => {
  const token = (await cookies()).get("token")?.value;

  const resultGetSuggestUser = await getAllUser(token);

  return (
    <>
      <main className="w-full sm:px-10 lg:container lg:m-auto xl:px-20">
        <div className="flex w-full items-start justify-center gap-5 py-5">
          <section className="hidden w-full max-w-[150px] lg:block 2xl:max-w-xs"></section>
          <section className="flex-1">
            <HeaderFind />
            <GridCardUser result={resultGetSuggestUser} token={token} />
          </section>
          <section className="hidden w-full max-w-[150px] lg:block 2xl:max-w-xs"></section>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
