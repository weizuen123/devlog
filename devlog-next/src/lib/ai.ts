/**
 * AI Service — Anthropic API integration.
 * ────────────────────────────────────────────
 * Builds the evaluation prompt and calls Claude.
 * Edit buildPrompt() to customize the evaluation format.
 */

import { Entry, Settings, Category } from "@/types";
import { CATEGORIES, VALUES, AI_CONFIG } from "@/lib/constants";

function buildPrompt(entries: Entry[], settings: Settings, year: string): string {
  const grouped: Record<string, Entry[]> = {};
  CATEGORIES.forEach((c) => (grouped[c.id] = []));
  entries.forEach((e) => {
    if (grouped[e.category]) grouped[e.category].push(e);
  });

  const summary = CATEGORIES.map((c) => {
    if (grouped[c.id].length === 0) return null;
    const items = grouped[c.id]
      .map((e) => `- [${e.date}] ${e.task}`)
      .join("\n");
    return `## ${c.label} (${c.weight}%)\n${items}`;
  })
    .filter(Boolean)
    .join("\n\n");

  return `You are helping a software developer compile their year-end performance evaluation. Below are their daily task logs organized by KPI category for the year ${year}.

Employee: ${settings.name || "N/A"}
Designation: ${settings.designation || "N/A"}
Department: ${settings.department || "N/A"}

The performance evaluation has these KPI categories (QUANTITATIVE, weighted):
${CATEGORIES.filter((c) => c.weight > 0)
  .map((c, i) => `${i + 1}. **${c.label} (${c.weight}%)** — ${c.desc}`)
  .join("\n")}

And QUALITATIVE values (each 20%): ${VALUES.join(", ")}

Scoring guide:
- 1 = Not meeting expectation
- 2 = Could be doing more
- 3 = Meeting expectation
- 4 = Exceeding expectation
- 5 = Outstanding

Here are the daily task logs:

${summary}

Please compile this into a well-structured performance evaluation self-assessment. For each KPI category:
1. Write a brief paragraph summarizing achievements
2. List key accomplishments as bullet points (combine similar tasks, highlight impact)
3. Suggest a self-assessment score (1-5) with justification

Then for the Values section, based on the work patterns observed, suggest how the employee demonstrated each value.

Format the output as clean text suitable for pasting into a performance evaluation form. Be specific, use numbers where possible (e.g., "Completed X features", "Resolved Y bugs"), and emphasize impact.`;
}

export async function compileEvaluation(
  entries: Entry[],
  settings: Settings,
  year: string
): Promise<string> {
  if (!settings.apiKey) {
    throw new Error("API key is required. Set it in Settings.");
  }
  if (entries.length === 0) {
    throw new Error(`No entries found for ${year}.`);
  }

  const prompt = buildPrompt(entries, settings, year);

  const response = await fetch("/api/compile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, apiKey: settings.apiKey }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error (${response.status})`);
  }

  const data = await response.json();
  return data.text;
}
