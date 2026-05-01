import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Rafi Hasan via email.",
};

export default function ContactPage() {
  return (
    <main className="container max-w-4xl mx-auto py-12 px-4">
      <p className="mb-4 text-fd-muted-foreground">Feel free to reach out to me via email:</p>
      <a href="mailto:mr.k779@outlook.com" className="text-lg font-medium text-fd-primary hover:underline">
        mr.k779@outlook.com
      </a>
    </main>
  );
}
