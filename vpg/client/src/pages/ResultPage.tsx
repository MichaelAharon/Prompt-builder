import { motion } from "framer-motion";
import { T, type GenerateResult } from "@/lib/constants";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EngineRow } from "@/components/EngineRow";

interface ResultPageProps {
  result:       GenerateResult;
  onRegenerate: () => void;
  onNew:        () => void;
}

export function ResultPage({ result, onRegenerate, onNew }: ResultPageProps) {
  const { copied, copy } = useCopyToClipboard();
  const { prompt, engineRecs } = result;
  const top = engineRecs[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >

      {/* ── Engine Recommendations ── */}
      <Card>
        <p
          style={{
            margin:        "0 0 2px",
            fontSize:      12,
            fontWeight:    500,
            color:         T.muted,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          AI Engine Recommendation
        </p>
        <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>Best engine for your task</h2>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: T.muted }}>
          Ranked by match to your answers
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {engineRecs.map((rec, i) => (
            <EngineRow key={rec.key} rec={rec} isTop={i === 0} index={i} />
          ))}
        </div>
      </Card>

      {/* ── Generated Prompt ── */}
      <Card>
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "flex-start",
            marginBottom:   16,
          }}
        >
          <div>
            <p
              style={{
                margin:        "0 0 2px",
                fontSize:      12,
                fontWeight:    500,
                color:         T.muted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Generated Prompt
            </p>
            <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>Your prompt</h2>
            <p style={{ margin: 0, fontSize: 14, color: T.muted }}>
              Optimized for <strong style={{ color: T.text }}>{top.engine.name}</strong> · copy and paste to get started
            </p>
          </div>

          <Button
            variant={copied ? "success" : "primary"}
            onClick={() => copy(prompt)}
            style={{ flexShrink: 0, marginLeft: 16 }}
          >
            {copied ? "✓ Copied" : "Copy Prompt"}
          </Button>
        </div>

        <textarea
          readOnly
          value={prompt}
          rows={16}
          style={{
            width:        "100%",
            border:       `1px solid ${T.border}`,
            borderRadius: 6,
            padding:      "12px 14px",
            fontSize:     13,
            lineHeight:   1.7,
            color:        T.text,
            background:   T.bg,
            fontFamily:   "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
            resize:       "vertical",
            outline:      "none",
            cursor:       "text",
            boxSizing:    "border-box",
          }}
        />

        <div
          style={{
            marginTop:    12,
            padding:      "10px 14px",
            background:   T.tipBg,
            border:       `1px solid ${T.tipBorder}`,
            borderRadius: 6,
            fontSize:     13,
            color:        T.tipText,
            lineHeight:   1.5,
          }}
        >
          <strong>Tip:</strong> Paste into {top.engine.name}, review the first output, then iterate.
          Best results come in 2–3 rounds.
        </div>
      </Card>

      {/* ── Footer actions ── */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onRegenerate}>Regenerate</Button>
        <Button onClick={onNew}>+ New Prompt</Button>
      </div>

    </motion.div>
  );
}
