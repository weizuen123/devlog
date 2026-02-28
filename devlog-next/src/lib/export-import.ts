/**
 * Export/Import utilities — backup, restore, download.
 */

import { Entry, Settings } from "@/types";

export function exportBackup(entries: Entry[], settings: Settings): void {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const grouped: Record<string, Entry[]> = {};
  for (const entry of [...entries].sort((a, b) =>
    b.date.localeCompare(a.date)
  )) {
    if (!grouped[entry.date]) grouped[entry.date] = [];
    grouped[entry.date].push(entry);
  }

  const lines: string[] = [
    `DEVLOG EXPORT`,
    `Employee  : ${settings.name || "N/A"}`,
    `Department: ${settings.department || "N/A"}`,
    `Exported  : ${today}`,
    `Total     : ${entries.length} entries`,
    "═".repeat(52),
    "",
  ];

  for (const [date, dayEntries] of Object.entries(grouped)) {
    const label = new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    lines.push(`── ${label} ──`);
    for (const e of dayEntries) {
      const cat = e.category.charAt(0).toUpperCase() + e.category.slice(1);
      lines.push(`  [${cat}] ${e.task}`);
    }
    lines.push("");
  }

  const safeName = (settings.name || "devlog").replace(/\s+/g, "_");
  downloadFile(
    lines.join("\n"),
    `devlog_${safeName}_${new Date().toISOString().split("T")[0]}.txt`,
    "text/plain"
  );
}

export async function importBackup(
  file: File,
  existingEntries: Entry[]
): Promise<{ entries: Entry[]; added: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.entries || !Array.isArray(data.entries)) {
          reject(new Error("Invalid backup file."));
          return;
        }
        const existingIds = new Set(existingEntries.map((e) => e.id));
        const newEntries = data.entries.filter(
          (e: Entry) => !existingIds.has(e.id)
        );
        resolve({
          entries: [...existingEntries, ...newEntries],
          added: newEntries.length,
        });
      } catch {
        reject(new Error("Failed to parse backup file."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
}

export function downloadEvaluation(
  text: string,
  settings: Settings,
  year: string
): void {
  const header = [
    `PERFORMANCE EVALUATION — ${year}`,
    `Employee: ${settings.name || "N/A"}`,
    `Designation: ${settings.designation || "N/A"}`,
    `Department: ${settings.department || "N/A"}`,
    `Generated: ${new Date().toLocaleString()}`,
    "═".repeat(60),
    "",
    "",
  ].join("\n");

  const safeName = (settings.name || "Employee").replace(/\s+/g, "_");
  downloadFile(
    header + text,
    `Performance_Eval_${safeName}_${year}.txt`,
    "text/plain"
  );
}

function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
