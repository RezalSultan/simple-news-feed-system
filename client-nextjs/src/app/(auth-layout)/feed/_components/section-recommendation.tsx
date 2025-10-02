"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RecomCard from "@/components/cards/recom-card";
import { User } from "@/type/user-type";
import { AppResponse } from "@/type/app-response-type";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SectionRecomendation = ({
  token,
  dataUsers,
}: {
  token?: string;
  dataUsers: AppResponse<User[]>;
}) => {
  let data = dataUsers.data ?? [];

  if ("errors" in dataUsers) {
    toast.error(dataUsers.errors?.message, { position: "top-right" });
    data = [];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendation for you</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((item) => (
            <RecomCard key={item.id} token={token} user={item} />
          ))
        ) : (
          <small className="text-muted-foreground text-center">
            No recommendations available at the moment.
          </small>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href={"/find-new-friend"}>
          <Button variant={"secondary"}>Find New Friends</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SectionRecomendation;
