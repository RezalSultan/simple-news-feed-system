import FeedCard from "@/components/cards/feed-card";
import React from "react";

const FeedContents = () => {
  return (
    <div className="flex flex-col gap-2">
      <FeedCard isAppearFollow={true} />
      <FeedCard isAppearFollow={true} />
    </div>
  );
};

export default FeedContents;
