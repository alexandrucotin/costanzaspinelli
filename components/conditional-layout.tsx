"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isClientRoute = pathname?.startsWith("/cliente");

  // Hide navbar and footer for admin and client dashboard routes
  const shouldShowNavigation = !isAdminRoute && !isClientRoute;

  return (
    <>
      {shouldShowNavigation && <Navigation />}
      {children}
      {shouldShowNavigation && <Footer />}
    </>
  );
}
