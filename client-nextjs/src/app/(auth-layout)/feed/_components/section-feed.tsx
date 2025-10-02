import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import ActionToPost from "./feed-ui/action-to-post";
import FeedContents from "./feed-ui/feed-contents";
import { Separator } from "@/components/ui/separator";

const SectionFeed = ({
  token,
  currentUser,
}: {
  token?: string;
  currentUser: string;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardContent className="flex items-center justify-between">
          <h2 className="block w-full text-center sm:hidden">
            Welcome to Simple Feed
          </h2>
          <ActionToPost currentUser={currentUser} />
        </CardContent>
      </Card>
      <Separator />
      <FeedContents token={token} currentUser={currentUser} />
    </div>
  );
};

export default SectionFeed;
