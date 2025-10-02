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
import LogoutButton from "@/components/logout-button";
import { AllInfoUser } from "@/type/user-type";
import { getInitials } from "@/lib/utils";

const SectionProfileSummary = ({
  token,
  profile,
  currentUser,
}: {
  token?: string;
  profile: AllInfoUser | null;
  currentUser: string;
}) => {
  const numberImage = (profile?.username ?? "").length + 1;
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Simple Feed</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex cursor-pointer items-center justify-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://randomuser.me/api/portraits/men/${numberImage}.jpg`}
              />
              <AvatarFallback>
                {getInitials(profile?.username ?? "A")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{currentUser}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={"/profile"} className="w-full">
            <Button className="w-full">Profile</Button>
          </Link>
        </CardFooter>
      </Card>
      <Card>
        <CardContent className="gap- flex flex-col items-start gap-2">
          <CardTitle className="mb-2 w-full text-center">
            Information Profile
          </CardTitle>
          <CardDescription>
            You following {profile?.following.length ?? 0} friends
          </CardDescription>
          <CardDescription>
            You have {profile?.followers.length ?? 0} followers
          </CardDescription>
          <CardDescription>
            You have {profile?.posts.length ?? 0} posts
          </CardDescription>
        </CardContent>
      </Card>
      <div>
        <LogoutButton token={token} />
      </div>
    </div>
  );
};

export default SectionProfileSummary;
