/**
 * Storage service — localStorage wrapper.
 * ────────────────────────────────────────────
 * All data persistence goes through here.
 * When you add Supabase later, you'll swap these
 * implementations without touching any components.
 *
 * HOW localStorage WORKS:
 * ┌──────────────────────────────────────────────┐
 * │ • Key-value store built into the browser      │
 * │ • Data stored as strings (we JSON.stringify)  │
 * │ • Persists across restarts (~5-10 MB limit)   │
 * │ • NOT synced across devices or browsers       │
 * │ • Lost if user clears browser data            │
 * └──────────────────────────────────────────────┘
 */

import { Entry, Settings } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";

// ── Entries ──

export function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: Entry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save entries:", e);
  }
}

// ── Settings ──

export function getDefaultSettings(): Settings {
  return {
    name: "",
    designation: "",
    department: "",
    year: new Date().getFullYear().toString(),
    apiKey: "",
  };
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return getDefaultSettings();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw
      ? { ...getDefaultSettings(), ...JSON.parse(raw) }
      : getDefaultSettings();
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}

// ── Danger zone ──

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.ENTRIES);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}
