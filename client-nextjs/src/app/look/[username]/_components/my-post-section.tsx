import FeedCard from "@/components/cards/feed-card";
import React from "react";

const MyPostSection = () => {
  return (
    <div className="flex flex-col gap-2">
      <FeedCard isAppearFollow={false} />
      <FeedCard isAppearFollow={false} />
    </div>
  );
};

export default MyPostSection;
