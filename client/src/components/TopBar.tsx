import { T } from "@/lib/constants";
import { Button } from "./Button";

interface TopBarProps {
  step:        string;
  onNew:       () => void;
  onGetStarted: () => void;
}

export function TopBar({ step, onNew, onGetStarted }: TopBarProps) {
  return (
    <div
      style={{
        height:       56,
        background:   T.white,
        borderBottom: `1px solid ${T.border}`,
        display:      "flex",
        alignItems:   "center",
        justifyContent: "space-between",
        padding:      "0 32px",
        position:     "sticky",
        top:          0,
        zIndex:       50,
      }}
    >
      {/* Logo */}
      <span style={{ fontSize: 15, fontWeight: 600, color: T.text, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        Vibe Prompt Generator
      </span>

      {/* Right action */}
      {step === "hero" && (
        <Button onClick={onGetStarted} style={{ height: 36, padding: "0 16px", fontSize: 13 }}>
          Get Started →
        </Button>
      )}
      {(step === "questions" || step === "result") && (
        <Button variant="secondary" onClick={onNew} style={{ height: 36, padding: "0 14px", fontSize: 13 }}>
          + New Prompt
        </Button>
      )}
    </div>
  );
}
