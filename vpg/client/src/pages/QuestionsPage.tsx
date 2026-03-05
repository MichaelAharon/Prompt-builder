import { useState } from "react";
import { motion } from "framer-motion";
import { T, QUESTIONS, type Answers, type GenerateResult } from "@/lib/constants";
import { generatePrompt } from "@/lib/api";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";

interface QuestionsPageProps {
  userInput: string;
  onBack:    () => void;
  onDone:    (result: GenerateResult, answers: Answers) => void;
}

export function QuestionsPage({ userInput, onBack, onDone }: QuestionsPageProps) {
  const [answers,  setAnswers]  = useState<Partial<Answers>>({});
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const completed   = Object.keys(answers).length;
  const total       = QUESTIONS.length;
  const allAnswered = completed === total;

  const handleAnswer = (id: string, option: string) => {
    setAnswers(prev => ({ ...prev, [id]: option }));
  };

  const handleGenerate = async () => {
    if (!allAnswered) return;
    setLoading(true);
    setError("");
    try {
      const result = await generatePrompt({ userInput, answers: answers as Answers });
      onDone(result, answers as Answers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Spinner
          label="Scoring engines · Applying S.C.A.F.F. · Crafting your prompt…"
          sublabel="Usually takes 5–10 seconds"
        />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 600 }}>Define your prompt</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 14, color: T.muted }}>
            {completed} of {total} answered
          </span>
          <div
            style={{
              width:        100,
              height:       4,
              background:   T.border,
              borderRadius: 2,
              overflow:     "hidden",
            }}
          >
            <div
              style={{
                height:       "100%",
                width:        `${(completed / total) * 100}%`,
                background:   T.blue,
                borderRadius: 2,
                transition:   "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Idea pill */}
      <div
        style={{
          background:   T.white,
          border:       `1px solid ${T.border}`,
          borderRadius: 8,
          padding:      "10px 14px",
          marginBottom: 16,
          fontSize:     13,
          color:        T.muted,
        }}
      >
        <strong style={{ color: T.text }}>Your idea: </strong>
        "{userInput.length > 140 ? userInput.slice(0, 140) + "…" : userInput}"
      </div>

      {/* Questions */}
      <Card style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {QUESTIONS.map((q, qi) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qi * 0.04 }}
          >
            <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 500, color: T.text }}>
              <span style={{ color: T.muted, marginRight: 6, fontSize: 12 }}>{qi + 1}.</span>
              {q.label}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {q.options.map(opt => {
                const selected = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(q.id, opt)}
                    style={{
                      height:       34,
                      padding:      "0 14px",
                      borderRadius: 6,
                      cursor:       "pointer",
                      fontFamily:   "inherit",
                      fontSize:     13,
                      fontWeight:   selected ? 500 : 400,
                      border:       `1px solid ${selected ? T.blue : T.inputBorder}`,
                      background:   selected ? T.blue : T.white,
                      color:        selected ? T.white : T.muted,
                      transition:   "all 120ms ease",
                      outline:      "none",
                    }}
                    onMouseEnter={e => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = T.blue;
                        e.currentTarget.style.color = T.blue;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = T.inputBorder;
                        e.currentTarget.style.color = T.muted;
                      }
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Error */}
        {error && (
          <div
            style={{
              padding:      "10px 14px",
              background:   T.errorBg,
              border:       `1px solid ${T.errorBorder}`,
              borderRadius: 6,
              fontSize:     13,
              color:        T.errorText,
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Footer actions */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            paddingTop:     8,
            borderTop:      `1px solid ${T.border}`,
          }}
        >
          <Button variant="secondary" onClick={onBack}>← Back</Button>
          <Button onClick={handleGenerate} disabled={!allAnswered}>
            {allAnswered ? "Generate Prompt" : `${total - completed} question${total - completed !== 1 ? "s" : ""} left`}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
