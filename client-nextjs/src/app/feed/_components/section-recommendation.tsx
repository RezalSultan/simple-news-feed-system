import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecomCard from "@/components/cards/recom-card";

const SectionRecomendation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendation for you</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <RecomCard />
        <RecomCard />
      </CardContent>
    </Card>
  );
};

export default SectionRecomendation;
