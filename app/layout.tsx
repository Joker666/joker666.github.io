import SearchDialog from "@/components/search";
import { RootProvider } from "fumadocs-ui/provider/next";
import { JetBrains_Mono } from "next/font/google";
import "./global.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-fd-background text-fd-foreground">
        <RootProvider
          search={{
            SearchDialog,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
