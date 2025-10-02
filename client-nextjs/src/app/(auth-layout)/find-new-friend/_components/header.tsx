import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeaderFind = () => {
  return (
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
            <CardTitle>Find New Friends</CardTitle>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeaderFind;
