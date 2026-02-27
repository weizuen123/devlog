"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: "sm" | "lg";
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = "sm",
  footer,
  children,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === "lg" ? "max-w-[740px]" : "max-w-[460px]";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={`bg-base border border-border rounded-2xl w-full ${maxW} overflow-hidden animate-slide-up ${
          size === "lg" ? "max-h-[90vh] flex flex-col" : ""
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-[17px] font-semibold">{title}</h3>
            {subtitle && (
              <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-secondary p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={`px-6 py-5 ${size === "lg" ? "overflow-y-auto flex-1" : ""}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-border flex gap-2.5 flex-wrap">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
