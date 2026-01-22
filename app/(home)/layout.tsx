"use client";

import { Footer } from "@/components/footer";
import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const options = baseOptions();

  if (!pathname.startsWith("/blog")) {
    options.searchToggle = {
      enabled: false,
    };
  }

  if (pathname !== "/about") {
    delete options.githubUrl;
  }

  return (
    <HomeLayout {...options}>
      <div className="flex flex-col min-h-[calc(100vh-var(--fd-nav-height,3.5rem))]">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </HomeLayout>
  );
}
