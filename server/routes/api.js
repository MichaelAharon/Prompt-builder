// ─────────────────────────────────────────────────────────────────────────────
//  API Router
//  GET  /api/health        — health check
//  POST /api/generate      — generate prompt + engine recommendations
// ─────────────────────────────────────────────────────────────────────────────

import { Router }     from "express";
import rateLimit      from "express-rate-limit";
import Anthropic      from "@anthropic-ai/sdk";
import { scoreEngines, getRanked, getWhyText, QUESTION_IDS } from "../constants.js";

export const apiRouter = Router();

// ─── Anthropic client ─────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Rate limiter: 20 requests / 15 min / IP ─────────────────────────────────

const limiter = rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            20,
  standardHeaders: true,
  legacyHeaders:   false,
  message:        { error: "Too many requests — please wait a few minutes and try again." },
});

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(body) {
  if (!body.userInput || typeof body.userInput !== "string" || body.userInput.trim().length < 5)
    return "userInput must be at least 5 characters.";
  if (!body.answers || typeof body.answers !== "object")
    return "answers object is required.";
  for (const key of QUESTION_IDS) {
    if (!body.answers[key] || typeof body.answers[key] !== "string")
      return `Missing required answer: ${key}`;
  }
  return null;
}

// ─── GET /api/health ──────────────────────────────────────────────────────────

apiRouter.get("/health", (_req, res) => {
  res.json({
    status:    "ok",
    timestamp: new Date().toISOString(),
    model:     "claude-sonnet-4-20250514",
  });
});

// ─── POST /api/generate ───────────────────────────────────────────────────────

apiRouter.post("/generate", limiter, async (req, res) => {
  // 1. Validate
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });

  const { userInput, answers } = req.body;

  // 2. Score engines (deterministic, instant)
  const scores    = scoreEngines(answers);
  const ranked    = getRanked(scores);
  const maxScore  = 18;
  const engineRecs = ranked.map(({ key, score, engine }) => ({
    key,
    score,
    pct:    Math.min(100, Math.round((score / maxScore) * 100)),
    engine,
    why:    getWhyText(key, answers),
  }));

  const topEngine  = ranked[0].engine.name;
  const qSummary   = QUESTION_IDS
    .map(k => `- ${k.replace(/_/g, " ")}: ${answers[k]}`)
    .join("\n");

  // 3. Build system prompt
  const systemPrompt = `You are an expert prompt engineer specializing in vibe coding and AI-assisted development.

Given a plain-language idea and the user's clarifying answers, craft the PERFECT structured prompt optimized for ${topEngine}.

The prompt MUST include ALL of these sections with clear labeled headers:

ROLE
Define the AI's exact persona, expertise level, and point of view.

SITUATION
Project context, current tech stack, existing codebase state, and relevant background.

CHALLENGE
The precise task to accomplish — specific, measurable, unambiguous.

AUDIENCE
Who will use, review, or be affected by the output.

FORMAT
Exact output structure: file names, code style, length, language, organization.

CONSTRAINTS
Explicit list of what to include AND what to avoid. Be specific.

THINK FIRST
Instruct the AI to reason step-by-step before writing any output. Chain-of-thought.

DO NOT
Hard list of 3–5 things the AI must never do in this response.

SUCCESS CRITERIA
One clear sentence: the output is complete and correct when [measurable condition].

Rules:
- Output ONLY the prompt text.
- No preamble, no "Here is your prompt", no markdown code fences.
- Use plain section headers (e.g. "ROLE", "SITUATION") not markdown headers.
- Write for a developer who will copy-paste this directly into ${topEngine}.`;

  // 4. Call Anthropic
  try {
    const message = await anthropic.messages.create({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system:     systemPrompt,
      messages:   [{
        role:    "user",
        content: `Plain-language idea: "${userInput.trim()}"\n\nClarifying answers:\n${qSummary}\n\nGenerate the perfect prompt optimized for ${topEngine}.`,
      }],
    });

    const promptText = message.content
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("")
      .trim();

    // 5. Respond
    return res.json({
      prompt:      promptText,
      engineRecs,
      topEngine,
      usage:       message.usage,  // { input_tokens, output_tokens }
    });

  } catch (apiErr) {
    console.error("[Anthropic Error]", apiErr.status, apiErr.message);

    if (apiErr.status === 401)
      return res.status(401).json({ error: "Invalid API key. Check ANTHROPIC_API_KEY in your .env file." });
    if (apiErr.status === 429)
      return res.status(429).json({ error: "Anthropic rate limit reached. Please wait a moment." });
    if (apiErr.status === 529)
      return res.status(503).json({ error: "Anthropic API is temporarily overloaded. Try again in a moment." });

    return res.status(500).json({ error: "Failed to generate prompt. Please try again." });
  }
});
