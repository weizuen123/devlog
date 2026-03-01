"use client";

import { useState } from "react";
import { Settings } from "@/types";
import Modal from "./Modal";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export default function SettingsModal({
  open,
  onClose,
  settings,
  onSave,
}: SettingsModalProps) {
  const [local, setLocal] = useState<Settings>({ ...settings });

  const handleSave = () => {
    onSave(local);
    onClose();
  };

  const set = (key: keyof Settings, value: string) =>
    setLocal((s) => ({ ...s, [key]: value }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="⚙️ Settings"
      subtitle="Your info"
      footer={
        <>
          <button
            onClick={onClose}
            className="flex-1 bg-card border border-border rounded-lg py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg py-2.5 text-sm text-white font-semibold hover:brightness-110 transition-all"
          >
            Save
          </button>
        </>
      }
    >
      {/* Employee info */}
      {(
        [
          ["name", "Employee Name"],
          ["designation", "Designation & Grade"],
          ["department", "Department"],
          ["year", "Evaluation Year"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="mb-3.5">
          <label className="block text-xs text-text-secondary mb-1 font-medium">
            {label}
          </label>
          <input
            value={local[key]}
            onChange={(e) => set(key, e.target.value)}
            className={`bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue ${
              key === "year" ? "w-[120px]" : "w-full"
            }`}
          />
        </div>
      ))}

    </Modal>
  );
}
