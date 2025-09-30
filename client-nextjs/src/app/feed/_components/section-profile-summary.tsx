import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SectionProfileSummary = () => {
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Simple Feed</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex cursor-pointer items-center justify-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Username</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={"/look/mantap"} className="w-full">
            <Button className="w-full">Profile</Button>
          </Link>
        </CardFooter>
      </Card>
      <Card>
        <CardContent className="gap- flex flex-col items-start gap-2">
          <CardTitle className="mb-2 w-full text-center">
            Information Profile
          </CardTitle>
          <CardDescription>You following 3 friends</CardDescription>
          <CardDescription>You have 3 followers</CardDescription>
          <CardDescription>You have 3 posts</CardDescription>
        </CardContent>
      </Card>
      <div>
        <Button variant={"outline"}>Logout</Button>
      </div>
    </div>
  );
};

export default SectionProfileSummary;
