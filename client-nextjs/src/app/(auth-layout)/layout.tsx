import { Toaster } from "@/components/ui/sonner";
import NavbarMobile from "@/components/navigations/navbar-mobile";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <NavbarMobile />
      <Toaster />
    </>
  );
}
