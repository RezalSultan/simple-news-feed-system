import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import LogoutButton from "@/components/logout-button";
import { AllInfoUser } from "@/type/user-type";
import { getInitials } from "@/lib/utils";

const ProfileSection = ({
  token,
  profile,
}: {
  token?: string;
  profile: AllInfoUser | null;
}) => {
  const numberImage = (profile?.username ?? "").length + 1;
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
          <div className="relative flex flex-col items-start justify-start">
            <p className="text-xl font-semibold">{profile?.username}</p>
            <div className="text-muted-foreground flex flex-nowrap items-center gap-2 text-base text-nowrap">
              <p>{profile?.followers.length ?? 0} followers</p>
              <span className="bg-muted-foreground h-0.75 w-0.75 rounded-full font-bold"></span>
              <p>{profile?.following.length ?? 0} following</p>
              <span className="bg-muted-foreground h-0.75 w-0.75 rounded-full font-bold"></span>
              <p>{profile?.posts.length ?? 0} posts</p>
            </div>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={`https://randomuser.me/api/portraits/men/${numberImage}.jpg`}
            />
            <AvatarFallback>
              {getInitials(profile?.username ?? "A")}
            </AvatarFallback>
          </Avatar>
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-wrap justify-start gap-3">
            <Link href={"/posting"}>
              <Button>
                <Plus className="text-primary-foreground" /> Add Post
              </Button>
            </Link>
            <Link href={"/find-new-friend"}>
              <Button variant={"secondary"}>Find New Friends</Button>
            </Link>
            <div className="flex grow justify-end">
              <LogoutButton token={token} />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSection;
