/**
 * Shared TypeScript types for the DevLog app.
 */

/** A single task entry logged by the user. */
export interface Entry {
  id: string;
  task: string;
  category: CategoryId;
  date: string; // YYYY-MM-DD
}

/** KPI category identifiers. */
export type CategoryId =
  | "initiative"
  | "quality"
  | "throughput"
  | "collaboration"
  | "leadership"
  | "other";

/** KPI category definition. */
export interface Category {
  id: CategoryId;
  label: string;
  short: string;
  color: string;
  icon: string;
  weight: number;
  desc: string;
}

/** User settings stored in localStorage. */
export interface Settings {
  name: string;
  designation: string;
  department: string;
  year: string;
  apiKey: string;
}

/** AI compilation state. */
export type CompileState = "idle" | "loading" | "done";

/** A single to-do item (stored in localStorage). */
export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string; // ISO timestamp
}
