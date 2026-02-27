/**
 * Export/Import utilities — backup, restore, download.
 */

import { Entry, Settings } from "@/types";

export function exportBackup(entries: Entry[], settings: Settings): void {
  const data = {
    app: "devlog",
    version: 1,
    exportedAt: new Date().toISOString(),
    entries,
    settings: { ...settings, apiKey: "" },
  };
  downloadFile(
    JSON.stringify(data, null, 2),
    `devlog_backup_${new Date().toISOString().split("T")[0]}.json`,
    "application/json"
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
