"use client";

import React from "react";
import { Button } from "./ui/button";
import { useLoading } from "@/hooks/use-loading";
import { useRouter } from "next/navigation";
import { logout } from "@/service/logout-service";
import { toast } from "sonner";

const LogoutButton = ({ token }: { token?: string }) => {
  const { loading, startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const handleLogout = async () => {
    startLoading();
    const result = await logout(token);

    if ("errors" in result) {
      toast.error(result.errors?.message, { position: "top-right" });
      stopLoading();
      return;
    }

    stopLoading();
    router.push("/");
    toast.success(result.message, { position: "top-right" });
  };

  return (
    <Button onClick={handleLogout} disabled={loading} variant={"outline"}>
      Logout
    </Button>
  );
};

export default LogoutButton;
