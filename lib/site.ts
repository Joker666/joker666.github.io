import siteData from "./site.json";

export const siteConfig = {
  ...siteData,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? siteData.url,
};
