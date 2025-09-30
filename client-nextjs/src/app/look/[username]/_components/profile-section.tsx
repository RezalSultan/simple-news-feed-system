import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

const ProfileSection = () => {
  return (
    <div className="flex flex-col gap-2">
      <Card className="!py-3">
        <CardContent className="gap- flex flex-col items-start gap-2">
          <div className="!flex items-center gap-3">
            <Link href={"/feed"}>
              <Button
                variant={"ghost"}
                className="!h-10 rounded-full"
                aria-label="back feeds"
              >
                <ArrowLeft />
              </Button>
            </Link>
            <div>
              <CardTitle>Profile</CardTitle>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-between gap-6">
          <div className="relative flex cursor-pointer flex-col items-start justify-start">
            <p className="text-xl font-semibold">Username</p>
            <div className="text-muted-foreground flex flex-nowrap items-center gap-2 text-base text-nowrap">
              <p>3 followers</p>
              <span className="bg-muted-foreground h-0.75 w-0.75 rounded-full font-bold"></span>
              <p>3 following</p>
              <span className="bg-muted-foreground h-0.75 w-0.75 rounded-full font-bold"></span>
              <p>3 posts</p>
            </div>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-start gap-4">
            <Link href={"/look/mantap"}>
              <Button>
                <Plus className="text-primary-foreground" /> Add Post
              </Button>
            </Link>
            <Button variant={"outline"}>Logout</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSection;
