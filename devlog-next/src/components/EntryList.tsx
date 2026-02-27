"use client";

import { Entry } from "@/types";
import { CATEGORIES } from "@/lib/constants";
import { prettyDate, monthYear } from "@/lib/date";
import { Pencil, Trash2 } from "lucide-react";

interface EntryListProps {
  entries: Entry[];
  filterYear: string;
  search: string;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
}

function getCat(id: string) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[4];
}

export default function EntryList({
  entries,
  filterYear,
  search,
  onEdit,
  onDelete,
}: EntryListProps) {
  const filtered = entries
    .filter((e) => e.date.startsWith(filterYear))
    .filter(
      (e) => !search || e.task.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  if (filtered.length === 0) {
    return (
      <div className="text-center py-14 text-text-muted">
        <div className="text-[42px] mb-3">📭</div>
        <p className="text-[15px]">No tasks logged for {filterYear} yet.</p>
        <p className="text-sm text-text-dim mt-2">
          Start logging your daily work above!
        </p>
      </div>
    );
  }

  // Group by month → date
  const months: Record<string, Record<string, Entry[]>> = {};
  filtered.forEach((e) => {
    const m = monthYear(e.date);
    if (!months[m]) months[m] = {};
    if (!months[m][e.date]) months[m][e.date] = [];
    months[m][e.date].push(e);
  });

  return (
    <div>
      {Object.entries(months).map(([month, dates]) => (
        <div key={month} className="mb-7 animate-fade-in">
          {/* Month header */}
          <div className="flex items-center gap-3 pb-2 border-b-2 border-[#1e293b] mb-3.5">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              {month}
            </span>
            <span className="text-[11px] text-text-muted bg-card px-2 py-0.5 rounded-full">
              {Object.values(dates).flat().length} tasks
            </span>
          </div>

          {/* Day groups */}
          {Object.entries(dates).map(([date, items]) => (
            <div key={date} className="mb-4">
              <div className="text-xs text-text-muted mb-1.5 font-medium">
                {prettyDate(date)}
              </div>
              {items.map((entry) => {
                const cat = getCat(entry.category);
                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 py-2.5 border-b border-[#12122a]"
                  >
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap mt-0.5 shrink-0"
                      style={{
                        background: cat.color + "18",
                        color: cat.color,
                        border: `1px solid ${cat.color}30`,
                      }}
                    >
                      {cat.icon} {cat.short}
                    </span>
                    <p className="flex-1 text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-wrap">
                      {entry.task}
                    </p>
                    <div className="flex gap-0.5 shrink-0">
                      <button
                        onClick={() => onEdit(entry)}
                        className="text-text-muted hover:text-text-secondary p-1 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this task?"))
                            onDelete(entry.id);
                        }}
                        className="text-text-muted hover:text-accent-red p-1 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
