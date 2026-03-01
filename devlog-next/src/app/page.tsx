"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Entry } from "@/types";
import { useEntries, useSettings, useToast } from "@/hooks";
import { getDefaultSettings, clearAllEntries } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";

import Header from "@/components/Header";
import EntryForm from "@/components/EntryForm";
import StatsBar from "@/components/StatsBar";
import EntryList from "@/components/EntryList";
import SettingsModal from "@/components/SettingsModal";
import CompileModal from "@/components/CompileModal";
import DataModal from "@/components/DataModal";
import Toast from "@/components/Toast";
import { Search } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { entries, loaded, addEntry, updateEntry, deleteEntry, setAllEntries } =
    useEntries();
  const { settings, updateSettings } = useSettings();
  const { toast, showToast } = useToast();

  // UI state
  const [filterYear, setFilterYear] = useState(
    () => new Date().getFullYear().toString()
  );
  const [search, setSearch] = useState("");
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [modal, setModal] = useState<
    "settings" | "compile" | "data" | null
  >(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-muted">
        Loading DevLog...
      </div>
    );
  }

  return (
    <>
      <Header
        entries={entries}
        filterYear={filterYear}
        onYearChange={setFilterYear}
        onOpenSettings={() => setModal("settings")}
        onOpenData={() => setModal("data")}
        onOpenCompile={() => setModal("compile")}
        onSignOut={async () => {
          await signOut();
          router.replace("/login");
        }}
      />

      <main className="max-w-[820px] mx-auto px-5 pt-6 pb-16">
        {/* Settings prompt */}
        {!settings.name && (
          <div className="bg-[#78350f33] border border-[#f59e0b44] rounded-lg px-4 py-3 text-sm text-amber-300 mb-5 flex items-center gap-2.5">
            <span>👋</span>
            <span>
              Set your name in{" "}
              <button
                onClick={() => setModal("settings")}
                className="text-accent-amber underline"
              >
                Settings
              </button>{" "}
              to get started.
            </span>
          </div>
        )}

        <EntryForm
          editEntry={editEntry}
          onAdd={async (entry) => {
            try {
              await addEntry(entry);
              showToast("Task saved ✓");
            } catch {
              showToast("Failed to save task");
            }
          }}
          onUpdate={async (id, data) => {
            try {
              await updateEntry(id, data);
              setEditEntry(null);
              showToast("Task updated ✓");
            } catch {
              showToast("Failed to update task");
            }
          }}
          onCancelEdit={() => setEditEntry(null)}
        />

        <StatsBar entries={entries} filterYear={filterYear} />

        {/* Search */}
        <div className="mb-4 relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-card border border-border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue"
          />
        </div>

        <EntryList
          entries={entries}
          filterYear={filterYear}
          search={search}
          onEdit={setEditEntry}
          onDelete={async (id) => {
            try {
              await deleteEntry(id);
              showToast("Task deleted");
            } catch {
              showToast("Failed to delete task");
            }
          }}
        />
      </main>

      {/* Modals */}
      <SettingsModal
        open={modal === "settings"}
        onClose={() => setModal(null)}
        settings={settings}
        onSave={(s) => {
          updateSettings(s);
          showToast("Settings saved ✓");
        }}
      />

      <CompileModal
        open={modal === "compile"}
        onClose={() => setModal(null)}
        entries={entries}
        settings={settings}
        filterYear={filterYear}
        showToast={showToast}
      />

      <DataModal
        open={modal === "data"}
        onClose={() => setModal(null)}
        entries={entries}
        settings={settings}
        onEntriesChange={setAllEntries}
        onClearAll={async () => {
          await clearAllEntries();
          await setAllEntries([]);
          updateSettings(getDefaultSettings());
        }}
        showToast={showToast}
      />

      <Toast message={toast} />
    </>
  );
}
