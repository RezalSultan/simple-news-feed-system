import React from "react";
import SectionFeed from "./_components/section-feed";
import SectionProfileSummary from "./_components/section-profile-summary";
import SectionRecomendation from "./_components/section-recommendation";
import { cookies } from "next/headers";
import { AllInfoUser } from "@/type/user-type";
import { ToastError } from "@/components/client-toaster";
import { getProfile, getSuggestUser } from "@/service/user-service";

const FeedPage = async () => {
  const token = (await cookies()).get("token")?.value;
  const currentUser = (await cookies()).get("username")?.value;

  const result = await getProfile(token);
  let profile: AllInfoUser | null = result.data ?? null;

  const resultGetSuggestUser = await getSuggestUser(token);

  if ("errors" in result) {
    profile = null;
  }

  return (
    <>
      {"errors" in result && result.errors?.message && (
        <ToastError message={result.errors.message} />
      )}
      <main className="w-full sm:px-5 lg:container lg:m-auto xl:px-20">
        <div className="relative flex w-full items-stretch justify-center gap-5 py-5">
          <section className="sticky top-5 hidden h-full w-full max-w-[200px] sm:block md:max-w-3xs 2xl:max-w-xs">
            <SectionProfileSummary
              token={token}
              profile={profile}
              currentUser={currentUser ?? ""}
            />
          </section>
          <section className="flex-1">
            <SectionFeed token={token} currentUser={currentUser ?? ""} />
          </section>
          <section className="hidden w-full lg:block lg:max-w-3xs 2xl:max-w-xs">
            <SectionRecomendation
              token={token}
              dataUsers={resultGetSuggestUser}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export default FeedPage;
