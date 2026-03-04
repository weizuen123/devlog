"use client";

import { Entry, Settings } from "@/types";
import { exportBackup } from "@/lib/export-import";
import { Download, Trash2, Info } from "lucide-react";
import Modal from "./Modal";

interface DataModalProps {
  open: boolean;
  onClose: () => void;
  entries: Entry[];
  settings: Settings;
  onClearAll: () => void;
  showToast: (msg: string) => void;
}

export default function DataModal({
  open,
  onClose,
  entries,
  settings,
  onClearAll,
  showToast,
}: DataModalProps) {
  const handleExport = () => {
    exportBackup(entries, settings);
    showToast("Backup exported ✓");
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
