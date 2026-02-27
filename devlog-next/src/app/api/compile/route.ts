/**
 * API Route: /api/compile
 * ────────────────────────────────────────────
 * Server-side proxy to Anthropic API.
 *
 * WHY THIS EXISTS:
 * Calling Anthropic's API directly from the browser has CORS issues
 * and exposes the API key in network requests. This route runs on
 * the server, so:
 *   1. No CORS issues
 *   2. API key stays on the server side of the request
 *   3. You can add rate limiting, logging, auth checks later
 *
 * FUTURE: When you add Supabase auth, you can verify the user
 * is logged in before allowing compilation.
 */

import { NextRequest, NextResponse } from "next/server";
import { AI_CONFIG } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": AI_CONFIG.API_VERSION,
      },
      body: JSON.stringify({
        model: AI_CONFIG.MODEL,
        max_tokens: AI_CONFIG.MAX_TOKENS,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error?.message || `Anthropic API error (${response.status})` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = (data.content || [])
      .map((block: any) => block.text || "")
      .join("\n");

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
