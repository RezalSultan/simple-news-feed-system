import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;

  if (diff < minute) {
    return "1m";
  } else if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return `${mins}m`;
  } else if (diff < day) {
    const hrs = Math.floor(diff / hour);
    return `${hrs}h`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days}d`;
  } else if (diff < month) {
    const weeks = Math.floor(diff / week);
    return `${weeks}w`;
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

export function getInitials(name: string): string {
  const words = name?.trim().split(/\s+/);
  const initials = words
    ?.filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase());
  return initials.join("");
}
