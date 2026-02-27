"use client";

import { Entry } from "@/types";
import { CATEGORIES } from "@/lib/constants";

interface StatsBarProps {
  entries: Entry[];
  filterYear: string;
}

export default function StatsBar({ entries, filterYear }: StatsBarProps) {
  const yearEntries = entries.filter((e) => e.date.startsWith(filterYear));
  const counts: Record<string, number> = {};
  CATEGORIES.forEach((c) => (counts[c.id] = 0));
  yearEntries.forEach((e) => (counts[e.category] = (counts[e.category] || 0) + 1));

  return (
    <div className="flex gap-2 flex-wrap mb-5">
      {/* Total */}
      <div className="bg-card border border-border rounded-lg px-3.5 py-2.5 flex items-center gap-2">
        <span className="text-lg">📊</span>
        <div>
          <div className="text-lg font-bold text-text-primary">
            {yearEntries.length}
          </div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">
            Total
          </div>
        </div>
      </div>

      {/* Per category */}
      {CATEGORIES.map((c) => (
        <div
          key={c.id}
          className={`bg-card rounded-lg px-3.5 py-2.5 flex items-center gap-2 border transition-opacity ${
            counts[c.id] ? "opacity-100" : "opacity-35"
          }`}
          style={{ borderColor: c.color + "33" }}
        >
          <span className="text-[15px]">{c.icon}</span>
          <div>
            <div className="text-lg font-bold" style={{ color: c.color }}>
              {counts[c.id]}
            </div>
            <div className="text-[10px] text-text-muted uppercase tracking-wide">
              {c.short}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
