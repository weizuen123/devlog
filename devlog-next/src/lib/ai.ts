/**
 * Evaluation compiler — template-based, no AI required.
 * Groups entries by KPI category and formats a self-assessment.
 */

import { Entry, Settings } from "@/types";
import { CATEGORIES, VALUES } from "@/lib/constants";

function suggestScore(count: number): string {
  if (count === 0) return "N/A";
  if (count <= 2) return "3 — Meeting expectation";
  if (count <= 6) return "4 — Exceeding expectation";
  return "5 — Outstanding";
}

export async function compileEvaluation(
  entries: Entry[],
  settings: Settings,
  year: string
): Promise<string> {
  if (entries.length === 0) {
    throw new Error(`No entries found for ${year}.`);
  }

  const grouped: Record<string, Entry[]> = {};
  CATEGORIES.forEach((c) => (grouped[c.id] = []));
  entries.forEach((e) => {
    if (grouped[e.category]) grouped[e.category].push(e);
  });

  const lines: string[] = [];

  // KPI sections
  for (const cat of CATEGORIES) {
    const catEntries = grouped[cat.id];
    if (cat.weight === 0 && catEntries.length === 0) continue;

    const weightLabel = cat.weight > 0 ? ` (${cat.weight}%)` : "";
    lines.push(`${"─".repeat(56)}`);
    lines.push(`${cat.icon}  ${cat.label.toUpperCase()}${weightLabel}`);
    lines.push("");

    if (catEntries.length === 0) {
      lines.push("  No entries recorded for this category.");
    } else {
      lines.push(`  Total activities: ${catEntries.length}`);
      lines.push("");
      for (const e of catEntries) {
        lines.push(`  • [${e.date}] ${e.task}`);
      }
      if (cat.weight > 0) {
        lines.push("");
        lines.push(`  Suggested score : ${suggestScore(catEntries.length)}`);
      }
    }
    lines.push("");
  }

  // Values section
  lines.push(`${"─".repeat(56)}`);
  lines.push(`🌟  VALUES ASSESSMENT`);
  lines.push("");
  for (const value of VALUES) {
    lines.push(`  ${value}`);
    lines.push(`  ${"·".repeat(40)}`);
    lines.push("");
  }

  // Summary
  const scored = CATEGORIES.filter((c) => c.weight > 0);
  lines.push(`${"─".repeat(56)}`);
  lines.push(`📊  SUMMARY`);
  lines.push("");
  lines.push(`  Employee   : ${settings.name || "N/A"}`);
  lines.push(`  Department : ${settings.department || "N/A"}`);
  lines.push(`  Year       : ${year}`);
  lines.push(`  Total logs : ${entries.length} entries`);
  lines.push("");
  for (const cat of scored) {
    const count = grouped[cat.id].length;
    lines.push(
      `  ${cat.short.padEnd(12)}: ${count} entries → ${suggestScore(count)}`
    );
  }

  return lines.join("\n");
}
