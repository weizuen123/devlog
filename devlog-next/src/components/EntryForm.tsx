"use client";

import { useState, useEffect, useRef } from "react";
import { Entry, CategoryId } from "@/types";
import { CATEGORIES } from "@/lib/constants";
import { toDateString } from "@/lib/date";

interface EntryFormProps {
  editEntry: Entry | null;
  onAdd: (entry: Entry) => void;
  onUpdate: (id: string, data: Partial<Entry>) => void;
  onCancelEdit: () => void;
}

export default function EntryForm({
  editEntry,
  onAdd,
  onUpdate,
  onCancelEdit,
}: EntryFormProps) {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState<CategoryId>("quality");
  const [date, setDate] = useState(toDateString());
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Populate form when editing
  useEffect(() => {
    if (editEntry) {
      setTask(editEntry.task);
      setCategory(editEntry.category);
      setDate(editEntry.date);
      inputRef.current?.focus();
    }
  }, [editEntry]);

  const handleSubmit = () => {
    if (!task.trim()) return;

    if (editEntry) {
      onUpdate(editEntry.id, {
        task: task.trim(),
        category,
        date,
      });
    } else {
      onAdd({
        id: crypto.randomUUID(),
        task: task.trim(),
        category,
        date,
      });
    }

    // Reset form
    setTask("");
    setCategory("quality");
    setDate(toDateString());
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-card border border-border rounded-[14px] p-5 mb-6">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[15px] font-semibold">
          {editEntry ? "✏️ Edit Task" : "📝 Log Today's Task"}
        </h2>
        {editEntry && (
          <button
            onClick={() => {
              onCancelEdit();
              setTask("");
              setCategory("quality");
              setDate(toDateString());
            }}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="flex gap-2.5 mb-3 flex-wrap">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue [color-scheme:dark]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryId)}
          className="bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue flex-1 min-w-[160px]"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2.5 max-sm:flex-col">
        <textarea
          ref={inputRef}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="What did you work on? (Enter to save, Shift+Enter for new line)"
          className="flex-1 bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue resize-y leading-relaxed"
        />
        <button
          onClick={handleSubmit}
          className={`self-end whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110 ${
            editEntry
              ? "bg-accent-amber text-black"
              : "bg-gradient-to-r from-accent-blue to-accent-purple text-white"
          }`}
        >
          {editEntry ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}
