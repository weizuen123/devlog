"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-[14px] p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent mb-1">
          DevLog
        </h1>
        <p className="text-text-muted text-[11px] mb-6">
          Daily task tracker → Year-end evaluation
        </p>

        <h2 className="text-[15px] font-semibold mb-4">
          {isSignUp ? "📝 Create account" : "👋 Welcome back"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-sm rounded-lg px-4 py-2.5 hover:brightness-110 transition-all disabled:opacity-50 mt-1"
          >
            {loading
              ? "Please wait..."
              : isSignUp
              ? "Create account"
              : "Sign in"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
          }}
          className="mt-4 text-sm text-text-muted hover:text-text-secondary transition-colors w-full text-center"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
