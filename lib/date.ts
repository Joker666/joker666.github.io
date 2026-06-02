export function formatPostDate(date: Date | string, month: "long" | "short" = "long") {
  return new Date(date).toLocaleDateString("en-US", {
    month,
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
