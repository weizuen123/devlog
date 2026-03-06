/**
 * Custom React hooks for state management.
 * ────────────────────────────────────────────
 * useEntries() — manages task entries (CRUD + Supabase persistence)
 * useSettings() — manages user settings (localStorage)
 * useToast() — simple toast notification system
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Entry, Settings, TodoItem } from "@/types";
import {
  loadEntries,
  addEntry as addEntryDB,
  updateEntryDB,
  deleteEntryDB,
  replaceAllEntries,
  loadSettings,
  saveSettings as saveSettingsLS,
  getDefaultSettings,
} from "@/lib/storage";

// ── Entries Hook ──

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadEntries()
      .then((data) => {
        setEntries(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const addEntry = useCallback(async (entry: Entry) => {
    await addEntryDB(entry);
    setEntries((prev) => [...prev, entry]);
  }, []);

  const updateEntry = useCallback(async (id: string, data: Partial<Entry>) => {
    await updateEntryDB(id, data);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    await deleteEntryDB(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const setAllEntries = useCallback(async (newEntries: Entry[]) => {
    await replaceAllEntries(newEntries);
    setEntries(newEntries);
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

// ── Todos Hook ──

const TODOS_KEY = "devlog-todos";

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TODOS_KEY);
      if (raw) setTodos(JSON.parse(raw));
    } catch {}
  }, []);

  const save = (items: TodoItem[]) => {
    setTodos(items);
    localStorage.setItem(TODOS_KEY, JSON.stringify(items));
  };

  const addTodo = useCallback((text: string) => {
    setTodos((prev) => {
      const next = [
        ...prev,
        { id: crypto.randomUUID(), text, done: false, createdAt: new Date().toISOString() },
      ];
      localStorage.setItem(TODOS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      localStorage.setItem(TODOS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem(TODOS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearDone = useCallback(() => {
    setTodos((prev) => {
      const next = prev.filter((t) => !t.done);
      localStorage.setItem(TODOS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { todos, addTodo, toggleTodo, deleteTodo, clearDone };
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
