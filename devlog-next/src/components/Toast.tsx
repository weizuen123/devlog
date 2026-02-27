"use client";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-toast-bg text-toast-text px-5 py-3 rounded-lg text-sm font-medium z-[999] shadow-lg animate-slide-up">
      {message}
    </div>
  );
}
