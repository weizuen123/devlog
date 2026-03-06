"use client";

import { useState, useRef } from "react";
import { TodoItem } from "@/types";
import { Trash2, X, CheckSquare } from "lucide-react";

interface TodoPanelProps {
  todos: TodoItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClearDone: () => void;
}

export default function TodoPanel({
  todos,
  onAdd,
  onToggle,
  onDelete,
  onClearDone,
}: TodoPanelProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const pending = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg hover:brightness-110 transition-all"
      >
        <CheckSquare size={16} />
        To-Do
        {pending.length > 0 && (
          <span className="bg-white/20 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none">
            {pending.length}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-[320px] bg-card border-l border-border flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h2 className="text-[15px] font-semibold">
            ✅ To-Do
            {pending.length > 0 && (
              <span className="ml-2 text-[11px] font-normal text-text-muted">
                {pending.length} left
              </span>
            )}
          </h2>
          <div className="flex items-center gap-3">
            {done.length > 0 && (
              <button
                onClick={onClearDone}
                className="text-[11px] text-text-muted hover:text-red-400 transition-colors"
              >
                Clear done
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Add input */}
        <div className="flex gap-2 px-4 py-3 border-b border-border flex-shrink-0">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a task..."
            className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-blue min-w-0"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            Add
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1.5">
          {todos.length === 0 && (
            <p className="text-text-muted text-sm text-center py-10">
              No tasks yet — add one above
            </p>
          )}

          {pending.map((todo) => (
            <TodoRow key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
          ))}

          {pending.length > 0 && done.length > 0 && (
            <div className="h-px bg-border my-1.5" />
          )}

          {done.map((todo) => (
            <TodoRow key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </>
  );
}

function TodoRow({
  todo,
  onToggle,
  onDelete,
}: {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-start gap-2.5 group px-2 py-1.5 rounded-lg hover:bg-input transition-colors">
      <button
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-all ${
          todo.done
            ? "bg-accent-blue border-accent-blue"
            : "border-border hover:border-accent-blue"
        }`}
      >
        {todo.done && (
          <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
            <path
              d="M3.5 8l3 3 5.5-5.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <span
        className={`flex-1 text-sm leading-snug break-words ${
          todo.done ? "line-through text-text-muted" : "text-text-primary"
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-red-400 mt-0.5"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
