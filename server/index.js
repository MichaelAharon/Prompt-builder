import "dotenv/config";
import express   from "express";
import cors      from "cors";
import helmet    from "helmet";
import path      from "path";
import fs        from "fs";
import { fileURLToPath } from "url";
import { apiRouter } from "./routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app       = express();
const PORT      = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "32kb" }));

app.use("/api", apiRouter);

const distPath = path.join(__dirname, "../client/dist");
console.log("Frontend dist path:", distPath);
console.log("Dist exists:", fs.existsSync(distPath));

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.send("<h2>API running but frontend not built</h2><p><a href='/api/health'>/api/health</a></p>");
  });
}

app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});
