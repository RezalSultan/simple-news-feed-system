import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { PostWithUsername } from "@/type/post-type";
import { formatTimeAgo, getInitials } from "@/lib/utils";
import Link from "next/link";

const FeedCard = ({
  feed,
  currentUser,
}: {
  feed: PostWithUsername;
  currentUser: string;
}) => {
  const timeFormat = formatTimeAgo(feed.created_at ?? new Date());

  const isMine = feed.username === currentUser;
  const numberImage = isMine
    ? currentUser.length + 1
    : feed.username.length + 7;
  const profileLink = isMine ? "/profile" : `/look/${feed.username}`;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link
            href={profileLink}
            className="flex cursor-pointer items-center justify-start gap-3"
          >
            <Avatar>
              <AvatarImage
                src={`https://randomuser.me/api/portraits/men/${numberImage}.jpg`}
              />
              <AvatarFallback>
                {getInitials(feed.username ?? "A")}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold">{feed.username}</p>
              <span className="bg-muted-foreground h-0.75 w-0.75 rounded-full font-bold"></span>
              <p className="text-muted-foreground text-sm">{timeFormat}</p>
            </div>
          </Link>
        </div>
        <div>{feed.content}</div>
      </CardContent>
    </Card>
  );
};

export default FeedCard;
