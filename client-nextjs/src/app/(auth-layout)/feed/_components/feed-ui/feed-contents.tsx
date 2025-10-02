"use client";

import FeedCard from "@/components/cards/feed-card";
import FeedCardSkeleton from "@/components/skeletons/feed-card-skeleton";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { getFeed } from "@/service/get-feed-service";
import { PostWithUsername } from "@/type/post-type";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const FeedContents = ({
  token,
  currentUser,
}: {
  token?: string;
  currentUser: string;
}) => {
  const { loading, startLoading, stopLoading } = useLoading();
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [feeds, setFeeds] = useState<PostWithUsername[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(page);

  hasMoreRef.current = hasMore;
  pageRef.current = page;

  const fetchData = async () => {
    if (!hasMoreRef.current) return;

    startLoading();
    const result = await getFeed(pageRef.current, limit, token);

    if ("errors" in result) {
      toast.error(result.errors?.message, { position: "top-right" });
      stopLoading();
      return;
    }

    const updateFeeds = () => {
      setFeeds((prev) => {
        const newFeeds = [...prev, ...(result.data?.posts ?? [])];
        const unique = new Map(newFeeds.map((item) => [item.id, item]));
        return Array.from(unique.values());
      });

      if ((result.data?.posts.length ?? 0) < limit) setHasMore(false);
      setPage((prev) => prev + 1);

      stopLoading();
    };

    // simulasi loading handling infinite scroll saat tarik data
    if (feeds.length === 0) {
      updateFeeds();
    } else {
      setTimeout(updateFeeds, 1500);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchData();
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [page]);

  if (!mounted) {
    return (
      <>
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <FeedCardSkeleton key={i} />
          ))}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {feeds.length > 0 ? (
        feeds.map((feed) => (
          <FeedCard key={feed.id} feed={feed} currentUser={currentUser} />
        ))
      ) : (
        <div className="text-muted-foreground/75 flex flex-col items-center justify-center py-10 text-center">
          <p className="text-xl font-semibold">No feeds yet.</p>
          <p className="mt-1 text-base">
            Follow some friends to see their posts here.
          </p>
          <Link href={"/find-new-friend"} className="mt-3 block lg:hidden">
            <Button variant={"secondary"}>Find New Friends</Button>
          </Link>
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-2">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <FeedCardSkeleton key={i} />
            ))}
        </div>
      )}

      <div ref={observerRef} className="h-1"></div>
    </div>
  );
};

export default FeedContents;
