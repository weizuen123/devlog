"use client";

import { useState } from "react";
import { Entry, Settings, CompileState } from "@/types";
import { compileEvaluation } from "@/lib/ai";
import { downloadEvaluation } from "@/lib/export-import";
import { getYear } from "@/lib/date";
import { ArrowLeft, Copy, Download } from "lucide-react";
import Modal from "./Modal";

interface CompileModalProps {
  open: boolean;
  onClose: () => void;
  entries: Entry[];
  settings: Settings;
  filterYear: string;
  showToast: (msg: string) => void;
}

export default function CompileModal({
  open,
  onClose,
  entries,
  settings,
  filterYear,
  showToast,
}: CompileModalProps) {
  const [state, setState] = useState<CompileState>("idle");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [year, setYear] = useState(filterYear);

  const yearEntries = entries.filter((e) => e.date.startsWith(year));
  const availableYears = [
    ...new Set(entries.map((e) => getYear(e.date))),
  ].sort().reverse();

  const handleCompile = async () => {
    setState("loading");
    setError("");
    setResult("");
    try {
      const text = await compileEvaluation(
        entries.filter((e) => e.date.startsWith(year)),
        settings,
        year
      );
      setResult(text);
      setState("done");
    } catch (err: any) {
      setError(err.message);
      setState("idle");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      showToast("Copied to clipboard ✓");
    } catch {}
  };

  const handleDownload = () => {
    downloadEvaluation(result, settings, year);
  };

  const handleReset = () => {
    setState("idle");
    setResult("");
    setError("");
  };

  // Reset state when modal opens
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setState("idle");
      setResult("");
      setError("");
    }, 200);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="🤖 AI Performance Compiler"
      subtitle="Compile daily logs into evaluation format"
      size="lg"
      footer={
        state === "done" ? (
          <>
            <button
              onClick={handleReset}
              className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              Re-compile
            </button>
            <div className="flex-1" />
            <button
              onClick={handleCopy}
              className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary flex items-center gap-1.5 hover:border-border-hover transition-colors"
            >
              <Copy size={14} />
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="bg-accent-green rounded-lg px-4 py-2.5 text-sm text-white font-semibold flex items-center gap-1.5 hover:brightness-110 transition-all"
            >
              <Download size={14} />
              Download .txt
            </button>
          </>
        ) : undefined
      }
    >
      {/* Idle state */}
      {state === "idle" && (
        <>
          <div className="mb-4">
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">
              Year to compile
            </label>
            <div className="flex items-center gap-3">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-card border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <span className="text-sm text-text-muted">
                {yearEntries.length} entries
              </span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 mb-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              AI will analyze your task logs and organize them into the
              LintraMax Performance Evaluation format:
            </p>
            <ul className="mt-2 pl-5 text-sm text-text-secondary leading-loose list-disc">
              <li>KPI summaries with suggested scores (1-5)</li>
              <li>Key accomplishments as bullet points</li>
              <li>Values assessment based on work patterns</li>
            </ul>
          </div>

          {!settings.apiKey && (
            <div className="bg-[#78350f33] border border-[#f59e0b44] rounded-lg px-4 py-3 text-sm text-amber-300 mb-4 flex items-center gap-2.5">
              <span>🔑</span>
              <span>API key required. Set it in Settings first.</span>
            </div>
          )}

          {error && (
            <div className="bg-[#7f1d1d33] border border-[#7f1d1d] rounded-lg px-4 py-3 text-sm text-red-300 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCompile}
            disabled={!settings.apiKey}
            className="w-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg py-3.5 text-[15px] text-white font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 Compile with AI
          </button>

          <p className="text-center text-[11px] text-text-muted mt-3">
            Uses Claude Sonnet via Anthropic API • ~$0.01-0.05 per
            compilation
          </p>
        </>
      )}

      {/* Loading state */}
      {state === "loading" && (
        <div className="text-center py-14">
          <div className="text-[42px] mb-4 animate-spin-slow inline-block">
            🤖
          </div>
          <p className="text-text-secondary text-[15px]">
            Analyzing your task logs...
          </p>
          <p className="text-text-muted text-sm mt-1">
            This may take 15-30 seconds
          </p>
        </div>
      )}

      {/* Done state */}
      {state === "done" && (
        <pre className="bg-card border border-border rounded-xl p-5 text-sm text-[#cbd5e1] leading-[1.75] whitespace-pre-wrap break-words overflow-y-auto max-h-[52vh] font-mono">
          {result}
        </pre>
      )}
    </Modal>
  );
}
