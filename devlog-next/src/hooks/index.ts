/**
 * Custom React hooks for state management.
 * ────────────────────────────────────────────
 * useEntries() — manages task entries (CRUD + persistence)
 * useSettings() — manages user settings (load/save)
 * useToast() — simple toast notification system
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Entry, Settings } from "@/types";
import {
  loadEntries,
  saveEntries,
  loadSettings,
  saveSettings as saveSettingsLS,
  getDefaultSettings,
  clearAllData,
} from "@/lib/storage";

// ── Entries Hook ──

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setEntries(loadEntries());
    setLoaded(true);
  }, []);

  const addEntry = useCallback(
    (entry: Entry) => {
      const updated = [...entries, entry];
      setEntries(updated);
      saveEntries(updated);
    },
    [entries]
  );

  const updateEntry = useCallback(
    (id: string, data: Partial<Entry>) => {
      const updated = entries.map((e) =>
        e.id === id ? { ...e, ...data } : e
      );
      setEntries(updated);
      saveEntries(updated);
    },
    [entries]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      const updated = entries.filter((e) => e.id !== id);
      setEntries(updated);
      saveEntries(updated);
    },
    [entries]
  );

  const setAllEntries = useCallback((newEntries: Entry[]) => {
    setEntries(newEntries);
    saveEntries(newEntries);
  }, []);

  return {
    entries,
    loaded,
    addEntry,
    updateEntry,
    deleteEntry,
    setAllEntries,
  };
}

// ── Settings Hook ──

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(getDefaultSettings());

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const updateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    saveSettingsLS(newSettings);
  }, []);

  return { settings, updateSettings };
}

// ── Toast Hook ──

export function useToast() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string, duration = 2600) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  return { toast, showToast };
}
