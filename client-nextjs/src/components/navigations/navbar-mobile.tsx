"use client";

import { Home, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const NavbarMobile = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-background fixed bottom-0 flex h-18 w-full items-center justify-around gap-5 border-t-2 py-5 sm:hidden">
      <Link
        href="/feed"
        className={`flex flex-col items-center justify-center gap-1 ${
          pathname === "/feed" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Home />
        <small>Feed</small>
      </Link>

      <Link
        href="/posting"
        className={`flex flex-col items-center justify-center ${
          pathname === "/posting" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Button
          size="sm"
          variant={pathname === "/posting" ? "default" : "secondary"} // aktif pakai variant default
          className="cursor-pointer"
          aria-label="add new post"
        >
          <Plus />
        </Button>
        <small>Posts</small>
      </Link>

      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center gap-1 ${
          pathname === "/profile" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <User />
        <small>Profile</small>
      </Link>
    </nav>
  );
};

export default NavbarMobile;
