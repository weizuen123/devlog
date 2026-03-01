"use client";

import { useRef } from "react";
import { Entry, Settings } from "@/types";
import { exportBackup, importBackup } from "@/lib/export-import";
import { Download, Upload, Trash2, Info } from "lucide-react";
import Modal from "./Modal";

interface DataModalProps {
  open: boolean;
  onClose: () => void;
  entries: Entry[];
  settings: Settings;
  onEntriesChange: (entries: Entry[]) => void;
  onClearAll: () => void;
  showToast: (msg: string) => void;
}

export default function DataModal({
  open,
  onClose,
  entries,
  settings,
  onEntriesChange,
  onClearAll,
  showToast,
}: DataModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportBackup(entries, settings);
    showToast("Backup exported ✓");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { entries: merged, added } = await importBackup(file, entries);
      onEntriesChange(merged);
      showToast(`Imported ${added} new entries ✓`);
      onClose();
    } catch (err: any) {
      showToast(err.message);
    }
    // Reset file input
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClear = () => {
    if (confirm("Delete ALL entries and settings? This cannot be undone!")) {
      onClearAll();
      onClose();
      showToast("All data cleared");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="💾 Backup & Restore"
      subtitle="Export or import your task data"
    >
      {/* Info */}
      <div className="bg-[#1e3a5f33] border border-[#3b82f644] rounded-lg px-4 py-3 text-sm text-blue-300 mb-5 flex items-start gap-2.5">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>
          Data is stored <strong>online</strong> and synced to your account.
          Export regularly to keep a local backup.
        </span>
      </div>

      {/* Export */}
      <div className="mb-5">
        <label className="block text-xs text-text-secondary mb-2 font-medium">
          Export
        </label>
        <p className="text-sm text-text-secondary mb-2.5">
          Download all {entries.length} entries as a text file.
        </p>
        <button
          onClick={handleExport}
          className="bg-accent-green rounded-lg px-4 py-2 text-sm text-white font-semibold flex items-center gap-1.5 hover:brightness-110 transition-all"
        >
          <Download size={14} />
          Export Backup (.txt)
        </button>
      </div>

      <hr className="border-border my-5" />

      {/* Import */}
      <div className="mb-5">
        <label className="block text-xs text-text-secondary mb-2 font-medium">
          Import
        </label>
        <p className="text-sm text-text-secondary mb-2.5">
          Import from a backup file. Duplicate entries are skipped.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".txt"
          onChange={handleImport}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-text-secondary flex items-center gap-1.5 hover:text-text-primary hover:border-border-hover transition-colors"
        >
          <Upload size={14} />
          Import Backup (.txt)
        </button>
      </div>

      <hr className="border-border my-5" />

      {/* Danger */}
      <div>
        <label className="block text-xs text-accent-red mb-2 font-medium">
          Danger Zone
        </label>
        <button
          onClick={handleClear}
          className="bg-accent-red rounded-lg px-4 py-2 text-sm text-white flex items-center gap-1.5 hover:brightness-110 transition-all"
        >
          <Trash2 size={14} />
          Clear All Data
        </button>
      </div>
    </Modal>
  );
}
