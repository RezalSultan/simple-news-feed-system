"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { User } from "@/type/user-type";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { followUser } from "@/service/follow-user-service";
import { toast } from "sonner";

const RecomCard = ({
  token,
  user,
  isFind,
}: {
  token?: string;
  user: User;
  isFind?: boolean;
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();

  const numberImage = user.username.length + 7;

  const handleFollow = async () => {
    const result = await followUser(user.id, token);
    if ("errors" in result) {
      toast.error(result.errors?.message, { position: "top-right" });
      return;
    }

    toast.success(result.message, { position: "top-right" });
    setIsFollowing(true);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <Link
        href={`/look/${user.username}`}
        className="flex cursor-pointer items-center justify-start gap-2"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={`https://randomuser.me/api/portraits/men/${numberImage}.jpg`}
          />
          <AvatarFallback>{getInitials(user.username ?? "A")}</AvatarFallback>
        </Avatar>
        <div className="flex items-center">
          <p className="font-semibold">{user.username}</p>
        </div>
      </Link>
      {isFind ? (
        <Button
          size={"sm"}
          onClick={handleFollow}
          className="text-primary-foreground flex cursor-pointer items-center"
        >
          {isFollowing ? <Check /> : <Plus />}{" "}
          {isFollowing ? "Following" : "Follow"}
        </Button>
      ) : (
        <Button
          size={"sm"}
          onClick={handleFollow}
          variant={"ghost"}
          className="flex cursor-pointer items-center gap-1 !px-2 !py-1"
        >
          <p
            className={`${isFollowing ? "text-muted-foreground" : "text-primary"} text-xs`}
          >
            {isFollowing ? "Following" : "Follow"}
          </p>
        </Button>
      )}
    </div>
  );
};

export default RecomCard;
