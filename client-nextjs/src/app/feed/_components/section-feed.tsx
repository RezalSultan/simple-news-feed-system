import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import ActionToPost from "./feed-ui/action-to-post";
import FeedContents from "./feed-ui/feed-contents";
import { Separator } from "@/components/ui/separator";

const SectionFeed = () => {
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardContent className="flex items-center justify-between">
          <ActionToPost />
        </CardContent>
      </Card>
      <Separator />
      <FeedContents />
    </div>
  );
};

export default SectionFeed;
