import { useState } from "react";
import { motion } from "framer-motion";
import { T } from "@/lib/constants";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

interface InputPageProps {
  onNext: (userInput: string) => void;
}

export function InputPage({ onNext }: InputPageProps) {
  const [value, setValue] = useState("");
  const isValid = value.trim().length >= 5;

  const handleSubmit = () => {
    if (isValid) onNext(value.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 600 }}>
        What do you want to build?
      </h1>
      <p style={{ margin: "0 0 24px", fontSize: 14, color: T.muted }}>
        Describe your idea in plain language — no technical jargon needed.
      </p>

      <Card>
        <textarea
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && isValid) handleSubmit();
          }}
          placeholder="e.g. I want a dashboard showing my Shopify sales with charts, a date filter, and a dark theme..."
          rows={5}
          style={{
            width:        "100%",
            border:       `1px solid ${T.inputBorder}`,
            borderRadius: 6,
            padding:      "10px 12px",
            fontSize:     14,
            lineHeight:   1.5,
            color:        T.text,
            background:   T.white,
            resize:       "vertical",
            fontFamily:   "inherit",
            outline:      "none",
            transition:   "border-color 120ms, box-shadow 120ms",
            boxSizing:    "border-box",
          }}
          onFocus={e => {
            e.target.style.borderColor = T.blue;
            e.target.style.boxShadow   = "0 0 0 3px rgba(37,99,235,0.1)";
          }}
          onBlur={e => {
            e.target.style.borderColor = T.inputBorder;
            e.target.style.boxShadow   = "none";
          }}
        />

        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            marginTop:      16,
          }}
        >
          <span style={{ fontSize: 12, color: T.muted }}>⌘↵ to continue</span>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Continue →
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
