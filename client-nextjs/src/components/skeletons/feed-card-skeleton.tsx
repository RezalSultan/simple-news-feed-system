import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const FeedCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>

        <Skeleton className="h-20 w-full rounded" />
      </CardContent>
    </Card>
  );
};

export default FeedCardSkeleton;
