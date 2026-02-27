"use client";

import { getYear } from "@/lib/date";
import { Entry } from "@/types";
import { Save, Settings as SettingsIcon, Bot, LogOut } from "lucide-react";

interface HeaderProps {
  entries: Entry[];
  filterYear: string;
  onYearChange: (year: string) => void;
  onOpenSettings: () => void;
  onOpenData: () => void;
  onOpenCompile: () => void;
  onSignOut: () => void;
}

export default function Header({
  entries,
  filterYear,
  onYearChange,
  onOpenSettings,
  onOpenData,
  onOpenCompile,
  onSignOut,
}: HeaderProps) {
  const years = [
    ...new Set(entries.map((e) => getYear(e.date))),
  ].sort().reverse();
  if (!years.includes(filterYear)) years.unshift(filterYear);

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-deep">
      <div className="max-w-[820px] mx-auto px-5 flex items-center justify-between gap-3 py-3.5 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            DevLog
          </h1>
          <p className="text-[11px] text-text-muted mt-0.5">
            Daily task tracker → Year-end evaluation
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={filterYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary outline-none focus:border-accent-blue"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenData}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
            title="Backup & Restore"
          >
            <Save size={16} />
          </button>

          <button
            onClick={onOpenSettings}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
            title="Settings"
          >
            <SettingsIcon size={16} />
          </button>

          <button
            onClick={onOpenCompile}
            className="bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-sm rounded-lg px-4 py-1.5 hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <Bot size={15} />
            Compile
          </button>

          <button
            onClick={onSignOut}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
