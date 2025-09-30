"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const ActionToPost = () => {
  const router = useRouter();
  const clickToPost = () => {
    router.push("/posting");
  };
  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-start gap-4"
        onClick={clickToPost}
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">Username</p>
          <p className="text-muted-foreground">Add New Feed</p>
        </div>
      </div>
      <Button
        onClick={clickToPost}
        size={"sm"}
        variant={"secondary"}
        className="cursor-pointer"
        aria-label="add new post"
      >
        <Plus />
      </Button>
    </>
  );
};

export default ActionToPost;
