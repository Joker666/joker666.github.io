"use client";

import { Footer } from "@/components/footer";
import { baseOptions } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const options = baseOptions();

  useEffect(() => {
    const updateScrolledState = () => {
      const nav = document.querySelector("#nd-nav > div");
      const scrollTop = document.scrollingElement?.scrollTop ?? window.scrollY;

      nav?.classList.toggle("is-scrolled", scrollTop > 0);
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    window.addEventListener("resize", updateScrolledState);

    return () => {
      window.removeEventListener("scroll", updateScrolledState);
      window.removeEventListener("resize", updateScrolledState);
      document.querySelector("#nd-nav > div")?.classList.remove("is-scrolled");
    };
  }, []);

  if (!pathname.startsWith("/blog")) {
    options.searchToggle = {
      enabled: false,
    };
  }

  return (
    <HomeLayout {...options} className="[--fd-layout-width:var(--container-4xl)]">
      {pathname === "/" && (
        <style>{`
          #nd-nav nav > a:first-child::after {
            background-color: var(--color-fd-primary);
          }
        `}</style>
      )}
      <div className="flex flex-col min-h-[calc(100vh-var(--fd-nav-height,3.5rem))]">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </HomeLayout>
  );
}
