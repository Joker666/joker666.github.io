import { blogPosts } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const scan = blogPosts.getPages().map(async (page) => {
    const processed = await page.data.getText("processed");
    return `# ${page.data.title}\n\n${processed}`;
  });
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
}
