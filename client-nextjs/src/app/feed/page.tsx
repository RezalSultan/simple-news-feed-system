import React from "react";
import SectionFeed from "./_components/section-feed";
import SectionProfileSummary from "./_components/section-profile-summary";
import SectionRecomendation from "./_components/section-recommendation";

const FeedPage = () => {
  return (
    <main className="w-full sm:px-5 lg:container lg:m-auto xl:px-20">
      <div className="flex w-full items-start justify-center gap-5 py-5">
        <section className="hidden w-full max-w-[200px] sm:block md:max-w-3xs 2xl:max-w-xs">
          <SectionProfileSummary />
        </section>
        <section className="flex-1">
          <SectionFeed />
        </section>
        <section className="hidden w-full lg:block lg:max-w-3xs 2xl:max-w-xs">
          <SectionRecomendation />
        </section>
      </div>
    </main>
  );
};

export default FeedPage;
