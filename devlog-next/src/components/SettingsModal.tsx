"use client";

import { useState } from "react";
import { Settings } from "@/types";
import { Eye, EyeOff } from "lucide-react";
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
  const [showKey, setShowKey] = useState(false);

  // Reset local state when modal opens
  const handleOpen = () => setLocal({ ...settings });

  if (open && local.name !== settings.name && local.apiKey === "") {
    // Sync when reopened
  }

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
      subtitle="Your info and API key"
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

      {/* API Key */}
      <hr className="border-border my-5" />
      <div className="mb-2">
        <label className="block text-xs text-text-secondary mb-1 font-medium">
          🔑 Anthropic API Key
        </label>
        <div className="flex gap-2">
          <input
            type={showKey ? "text" : "password"}
            value={local.apiKey}
            onChange={(e) => set("apiKey", e.target.value)}
            placeholder="sk-ant-api03-..."
            className="flex-1 bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="bg-card border border-border rounded-lg px-3 text-text-secondary hover:text-text-primary transition-colors"
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
          Get your key from{" "}
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            className="text-accent-blue hover:underline"
          >
            console.anthropic.com
          </a>
          .<br />
          Stored only in your browser. Sent only to Anthropic&apos;s API via
          your server.
        </p>
      </div>
    </Modal>
  );
}
