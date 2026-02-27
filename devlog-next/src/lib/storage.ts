/**
 * Storage service.
 * ────────────────────────────────────────────
 * Entries  → Supabase (per-user, synced across devices)
 * Settings → localStorage (device-local; includes sensitive apiKey)
 */

import { Entry, Settings } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

// ── Entries (Supabase) ──

export async function loadEntries(): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("entries")
    .select("id, task, category, date")
    .order("date", { ascending: false });
  if (error) throw error;
  return data as Entry[];
}

export async function addEntry(entry: Entry): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("entries").insert({
    id: entry.id,
    user_id: user!.id,
    task: entry.task,
    category: entry.category,
    date: entry.date,
  });
  if (error) throw error;
}

export async function updateEntryDB(
  id: string,
  data: Partial<Entry>
): Promise<void> {
  const { error } = await supabase.from("entries").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteEntryDB(id: string): Promise<void> {
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) throw error;
}

export async function replaceAllEntries(entries: Entry[]): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("entries").delete().eq("user_id", user!.id);
  if (entries.length > 0) {
    const rows = entries.map((e) => ({ ...e, user_id: user!.id }));
    const { error } = await supabase.from("entries").insert(rows);
    if (error) throw error;
  }
}

export async function clearAllEntries(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("entries")
    .delete()
    .eq("user_id", user!.id);
  if (error) throw error;
}

// ── Settings (localStorage) ──

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
