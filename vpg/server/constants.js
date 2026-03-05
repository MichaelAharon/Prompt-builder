// ─────────────────────────────────────────────────────────────────────────────
//  Shared constants: engines, questions, scoring
// ─────────────────────────────────────────────────────────────────────────────

export const ENGINES = {
  claude: {
    name:    "Claude",
    vendor:  "Anthropic",
    dot:     "#F59E0B",
    url:     "https://claude.ai",
    tagline: "Complex coding, reasoning & precise instruction-following",
  },
  chatgpt: {
    name:    "ChatGPT",
    vendor:  "OpenAI",
    dot:     "#10B981",
    url:     "https://chatgpt.com",
    tagline: "Creative writing, versatile tasks & broad knowledge",
  },
  gemini: {
    name:    "Gemini",
    vendor:  "Google",
    dot:     "#3B82F6",
    url:     "https://gemini.google.com",
    tagline: "Research, real-time data & Google Workspace integration",
  },
};

export const QUESTION_IDS = [
  "task_type",
  "output_format",
  "ai_role",
  "audience",
  "constraints",
  "tone",
  "iteration",
];

export function scoreEngines(answers) {
  const s    = { claude: 0, chatgpt: 0, gemini: 0 };
  const task = (answers.task_type     || "").toLowerCase();
  const out  = (answers.output_format || "").toLowerCase();
  const role = (answers.ai_role       || "").toLowerCase();
  const tone = (answers.tone          || "").toLowerCase();
  const iter = (answers.iteration     || "").toLowerCase();
  const aud  = (answers.audience      || "").toLowerCase();

  // Task type
  if (task.includes("ui") || task.includes("frontend"))                                                { s.claude += 3; s.chatgpt += 2; }
  if (task.includes("backend") || task.includes("api"))                                                { s.claude += 5; }
  if (task.includes("full-stack"))                                                                     { s.claude += 3; s.chatgpt += 2; }
  if (task.includes("data") || task.includes("analysis"))                                              { s.gemini += 5; s.claude += 2; }
  if (task.includes("content") || task.includes("writing"))                                            { s.chatgpt += 5; s.gemini += 1; }
  if (task.includes("automation") || task.includes("script"))                                          { s.claude += 4; s.chatgpt += 1; }
  if (task.includes("bug") || task.includes("refactor"))                                               { s.claude += 5; }
  if (task.includes("other"))                                                                          { s.chatgpt += 2; s.claude += 1; s.gemini += 1; }

  // Output format
  if (out.includes("working code") || out.includes("code +"))                                         { s.claude += 4; }
  if (out.includes("step-by-step"))                                                                    { s.claude += 2; s.chatgpt += 2; }
  if (out.includes("document") || out.includes("report"))                                              { s.gemini += 4; s.chatgpt += 2; }
  if (out.includes("list"))                                                                            { s.chatgpt += 2; s.gemini += 1; }
  if (out.includes("single direct"))                                                                   { s.claude += 2; s.chatgpt += 1; }

  // Role
  if (role.includes("developer") || role.includes("architect") || role.includes("pair programmer"))   { s.claude += 3; }
  if (role.includes("ux designer"))                                                                    { s.chatgpt += 3; s.gemini += 1; }
  if (role.includes("product manager"))                                                                { s.chatgpt += 2; s.gemini += 2; }
  if (role.includes("subject matter"))                                                                 { s.gemini += 3; s.chatgpt += 2; }
  if (role.includes("tech lead"))                                                                      { s.claude += 3; }

  // Tone
  if (tone.includes("production-ready") || tone.includes("strict"))                                   { s.claude += 3; }
  if (tone.includes("creative") || tone.includes("exploratory"))                                       { s.chatgpt += 3; }
  if (tone.includes("beginner-friendly"))                                                              { s.chatgpt += 2; }
  if (tone.includes("detailed"))                                                                       { s.claude += 1; s.gemini += 1; }

  // Iteration
  if (iter.includes("exploring") || iter.includes("ideas"))                                           { s.chatgpt += 2; s.gemini += 2; }
  if (iter.includes("building on existing") || iter.includes("refactor") || iter.includes("broken"))  { s.claude += 3; }
  if (iter.includes("final polish"))                                                                   { s.claude += 2; }

  // Audience
  if (aud.includes("non-technical") || aud.includes("client") || aud.includes("stakeholder"))         { s.chatgpt += 2; s.gemini += 1; }
  if (aud.includes("dev team"))                                                                        { s.claude += 2; }
  if (aud.includes("end users"))                                                                       { s.chatgpt += 2; }

  return s;
}

export function getRanked(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([key, score]) => ({ key, score, engine: ENGINES[key] }));
}

export function getWhyText(key, answers) {
  const task = (answers.task_type     || "").toLowerCase();
  const out  = (answers.output_format || "").toLowerCase();
  const tone = (answers.tone          || "").toLowerCase();

  if (key === "claude") {
    if (task.includes("backend") || task.includes("api") || task.includes("bug") || task.includes("refactor"))
      return "Leads at complex code tasks, debugging, and strict instruction-following.";
    if (task.includes("frontend") || task.includes("ui"))
      return "Strong at component architecture, clean UI patterns, and precise code output.";
    if (tone.includes("production"))
      return "Excels at production-grade, well-structured output with minimal hallucination.";
    return "Best overall for precise technical tasks and nuanced instructions.";
  }
  if (key === "chatgpt") {
    if (task.includes("content") || task.includes("writing"))
      return "Industry leader for creative content, copywriting, and marketing output.";
    return "Versatile and reliable across a wide range of general-purpose tasks.";
  }
  if (key === "gemini") {
    if (task.includes("data") || task.includes("analysis"))
      return "Integrates with Google Sheets and excels at structured data reasoning.";
    if (out.includes("report") || out.includes("document"))
      return "Powerful for research-style documents, especially with Google Workspace.";
    return "Strong at real-time research, factual queries, and multimodal tasks.";
  }
  return "";
}
