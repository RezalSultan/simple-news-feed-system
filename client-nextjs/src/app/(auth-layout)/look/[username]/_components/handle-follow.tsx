"use client";

import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { followUser } from "@/service/follow-user-service";
import { toast } from "sonner";
import { unfollowUser } from "@/service/unfollow-user-service";

const HandleFollow = ({
  token,
  userId,
  isFollowing,
}: {
  token?: string;
  userId: bigint;
  isFollowing: boolean;
}) => {
  const router = useRouter();

  const handleFollow = async () => {
    const result = await followUser(userId, token);
    if ("errors" in result) {
      toast.error(result.errors?.message, { position: "top-right" });
      return;
    }

    toast.success(result.message, { position: "top-right" });
    router.refresh();
  };

  const handleUnFollow = async () => {
    const result = await unfollowUser(userId, token);
    if ("errors" in result) {
      toast.error(result.errors?.message, { position: "top-right" });
      return;
    }

    toast.success(result.message, { position: "top-right" });
    router.refresh();
  };

  return (
    <div className="flex w-full justify-start gap-4">
      {isFollowing ? (
        <Button onClick={handleUnFollow} variant={"secondary"}>
          <Check className="text-secondary-foreground" /> Following
        </Button>
      ) : (
        <Button onClick={handleFollow}>
          <Plus className="text-primary-foreground" /> Follow
        </Button>
      )}
    </div>
  );
};

export default HandleFollow;
