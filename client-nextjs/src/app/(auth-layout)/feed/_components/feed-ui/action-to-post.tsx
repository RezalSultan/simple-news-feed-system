"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { getInitials } from "@/lib/utils";

const ActionToPost = ({ currentUser }: { currentUser: string }) => {
  const router = useRouter();
  const clickToPost = () => {
    router.push("/posting");
  };
  const numberImage = currentUser.length + 1;
  return (
    <>
      <div
        className="hidden cursor-pointer items-center justify-start gap-4 sm:flex"
        onClick={clickToPost}
      >
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={`https://randomuser.me/api/portraits/men/${numberImage}.jpg`}
          />
          <AvatarFallback>{getInitials(currentUser ?? "A")}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{currentUser}</p>
          <p className="text-muted-foreground">Add New Feed</p>
        </div>
      </div>
      <Button
        onClick={clickToPost}
        size={"sm"}
        variant={"secondary"}
        className="hidden cursor-pointer sm:flex"
        aria-label="add new post"
      >
        <Plus />
      </Button>
    </>
  );
};

export default ActionToPost;
