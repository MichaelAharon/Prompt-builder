// ─────────────────────────────────────────────────────────────────────────────
//  API service — wraps all calls to the Express backend
//  In dev, Vite proxies /api → localhost:3001
//  In production, requests go to the same origin
// ─────────────────────────────────────────────────────────────────────────────

import type { Answers, GenerateResult } from "./constants";

export async function generatePrompt(payload: {
  userInput: string;
  answers:   Answers;
}): Promise<GenerateResult> {
  const res = await fetch("/api/generate", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data as GenerateResult;
}

export async function healthCheck(): Promise<{ status: string }> {
  const res  = await fetch("/api/health");
  return res.json();
}
