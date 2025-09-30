import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FeedCard = ({ isAppearFollow }: { isAppearFollow: boolean }) => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex cursor-pointer items-center justify-start gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold">Username</p>
              <span className="bg-muted-foreground h-0.75 w-0.75 rounded-full font-bold"></span>
              <p className="text-muted-foreground text-sm">2h</p>
            </div>
          </div>
          {isAppearFollow && (
            <Button
              size={"sm"}
              className="flex cursor-pointer items-center gap-2"
            >
              <p>Follow</p>
            </Button>
          )}
        </div>
        <div>FeedContents</div>
      </CardContent>
    </Card>
  );
};

export default FeedCard;
