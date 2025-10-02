"use client";

import RecomCard from "@/components/cards/recom-card";
import { Card, CardContent } from "@/components/ui/card";
import { AppResponse } from "@/type/app-response-type";
import { User } from "@/type/user-type";
import React from "react";
import { toast } from "sonner";

const GridCardUser = ({
  token,
  result,
}: {
  token?: string;
  result: AppResponse<User[]>;
}) => {
  let dataUsers = result.data ?? [];

  if ("errors" in result) {
    toast.error(result.errors?.message, { position: "top-right" });
    dataUsers = [];
  }

  return (
    <>
      {dataUsers.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
          {dataUsers.map((item) => (
            <Card key={item.id}>
              <CardContent>
                <RecomCard token={token} user={item} isFind={true} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground p-5 text-center text-xl font-semibold">
          No friend suggestions yet.
        </p>
      )}
    </>
  );
};

export default GridCardUser;
