// ─────────────────────────────────────────────────────────────────────────────
//  Client-side constants, types, and shared data
// ─────────────────────────────────────────────────────────────────────────────

// ─── Design tokens ───────────────────────────────────────────────────────────

export const T = {
  bg:          "#F8F9FB",
  white:       "#FFFFFF",
  text:        "#111827",
  muted:       "#6B7280",
  blue:        "#2563EB",
  blueHover:   "#1D4ED8",
  border:      "#E5E7EB",
  inputBorder: "#D1D5DB",
  errorBg:     "#FEF2F2",
  errorText:   "#DC2626",
  errorBorder: "#FECACA",
  tipBg:       "#EFF6FF",
  tipText:     "#1D4ED8",
  tipBorder:   "#BFDBFE",
  successGreen:"#16A34A",
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Engine {
  name:    string;
  vendor:  string;
  dot:     string;
  url:     string;
  tagline: string;
}

export interface EngineRec {
  key:    string;
  score:  number;
  pct:    number;
  engine: Engine;
  why:    string;
}

export interface GenerateResult {
  prompt:      string;
  engineRecs:  EngineRec[];
  topEngine:   string;
  usage:       { input_tokens: number; output_tokens: number };
}

export interface Answers {
  task_type:     string;
  output_format: string;
  ai_role:       string;
  audience:      string;
  constraints:   string;
  tone:          string;
  iteration:     string;
  [key: string]: string;
}

export interface Question {
  id:      string;
  label:   string;
  options: string[];
}

// ─── Engines ─────────────────────────────────────────────────────────────────

export const ENGINES: Record<string, Engine> = {
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

// ─── Questions ───────────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  {
    id:      "task_type",
    label:   "What type of task is this?",
    options: ["Build a UI / Frontend", "Backend / API", "Full-Stack App", "Data / Analysis", "Content / Writing", "Automation / Script", "Bug Fix / Refactor", "Other"],
  },
  {
    id:      "output_format",
    label:   "What should the output look like?",
    options: ["Working code", "Step-by-step explanation", "A document / report", "A list of options", "A single direct answer", "Code + explanation"],
  },
  {
    id:      "ai_role",
    label:   "What role should the AI play?",
    options: ["Senior developer", "UX designer", "Product manager", "Tech lead / Architect", "Subject matter expert", "Pair programmer", "Code reviewer"],
  },
  {
    id:      "audience",
    label:   "Who will use or read the output?",
    options: ["Just me (vibe coder)", "Junior developer", "Non-technical stakeholder", "End users / customers", "My whole dev team", "Client / external party"],
  },
  {
    id:      "constraints",
    label:   "Any constraints or things to avoid?",
    options: ["Keep it simple / minimal", "No external libraries", "Specific framework only", "No auth/database complexity", "Mobile-first", "Accessibility required", "No constraints"],
  },
  {
    id:      "tone",
    label:   "What tone/style should the AI use?",
    options: ["Concise and direct", "Detailed with comments", "Beginner-friendly", "Production-ready / strict", "Creative / exploratory", "Follow existing patterns"],
  },
  {
    id:      "iteration",
    label:   "Where are you in the process?",
    options: ["Starting from scratch", "Building on existing code", "Fixing something broken", "Improving / refactoring", "Exploring ideas", "Final polish"],
  },
];
