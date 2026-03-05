import { T } from "@/lib/constants";

interface SpinnerProps {
  label?: string;
  sublabel?: string;
}

export function Spinner({
  label    = "Generating your prompt…",
  sublabel,
}: SpinnerProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "48px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width:        20,
            height:       20,
            borderRadius: "50%",
            border:       `2.5px solid ${T.border}`,
            borderTopColor: T.blue,
            animation:    "spin 0.8s linear infinite",
            flexShrink:   0,
          }}
        />
        <span style={{ fontSize: 14, color: T.muted }}>{label}</span>
      </div>
      {sublabel && (
        <p style={{ fontSize: 12, color: T.border, margin: 0 }}>{sublabel}</p>
      )}
    </div>
  );
}
