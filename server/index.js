// ─────────────────────────────────────────────────────────────────────────────
//  Vibe Prompt Generator — Express Server
//  Entry point: starts HTTP server, registers middleware, mounts routes
// ─────────────────────────────────────────────────────────────────────────────

import "dotenv/config";
import express   from "express";
import cors      from "cors";
import helmet    from "helmet";
import path      from "path";
import { fileURLToPath } from "url";

import { apiRouter }   from "./routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app       = express();
const PORT      = process.env.PORT || 3001;
const isProd    = process.env.NODE_ENV === "production";

// ─── Security & parsing ───────────────────────────────────────────────────────

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin:      process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "32kb" }));

// ─── API routes ───────────────────────────────────────────────────────────────

app.use("/api", apiRouter);

// ─── Serve built frontend in production ──────────────────────────────────────

if (isProd) {
  const distPath = path.join(__dirname, "../client/dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log("\n  ⚡ Vibe Prompt Generator");
  console.log(`  ➜  Server : http://localhost:${PORT}`);
  if (!isProd) console.log(`  ➜  Client : http://localhost:5173`);
  console.log(`  ➜  Mode   : ${isProd ? "production" : "development"}\n`);
});
