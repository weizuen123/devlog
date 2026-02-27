/**
 * Date formatting utilities.
 */

export function toDateString(d = new Date()): string {
  return d.toISOString().split("T")[0];
}

export function prettyDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-MY", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function monthYear(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-MY", {
    year: "numeric",
    month: "long",
  });
}

export function getYear(dateStr: string): string {
  return dateStr.substring(0, 4);
}
