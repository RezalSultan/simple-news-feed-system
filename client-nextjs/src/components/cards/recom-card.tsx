import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const RecomCard = () => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex cursor-pointer items-center justify-start gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex items-center">
          <p className="font-semibold">Username</p>
        </div>
      </div>
      <Button
        size={"sm"}
        variant={"ghost"}
        className="flex cursor-pointer items-center gap-1 !px-2 !py-1"
      >
        <p className="text-primary text-xs">Follow</p>
      </Button>
    </div>
  );
};

export default RecomCard;
