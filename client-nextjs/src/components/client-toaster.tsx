"use client";

import { toast } from "sonner";
import { useEffect } from "react";

export const ToastError = ({ message }: { message: string }) => {
  useEffect(() => {
    toast.error(message, { position: "top-right" });
  }, [message]);

  return null;
};
