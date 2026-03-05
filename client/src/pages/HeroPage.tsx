import { T, ENGINES, QUESTIONS } from "@/lib/constants";
import { ContainerScroll } from "@/components/ContainerScroll";
import { Button } from "@/components/Button";

interface HeroPageProps {
  onGetStarted: () => void;
}

// Preview of the tool shown inside the 3-D scroll card
function ToolPreview({ onGetStarted }: { onGetStarted: () => void }) {
  const sampleQuestions = QUESTIONS.slice(0, 3);

  return (
    <div
      style={{
        height:         "100%",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "24px 32px",
        background:     "#F8F9FB",
        gap:            20,
        textAlign:      "center",
        overflow:       "hidden",
      }}
    >
      {/* Engine pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {Object.values(ENGINES).map(e => (
          <div
            key={e.name}
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        6,
              padding:    "5px 12px",
              background: T.white,
              border:     `1px solid ${T.border}`,
              borderRadius: 20,
              fontSize:   12,
              color:      T.muted,
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: e.dot }} />
            {e.name}
          </div>
        ))}
      </div>

      {/* Sample questions preview */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 520 }}>
        {sampleQuestions.map((q, i) => (
          <div
            key={q.id}
            style={{
              background:   T.white,
              border:       `1px solid ${T.border}`,
              borderRadius: 8,
              padding:      "10px 14px",
              textAlign:    "left",
            }}
          >
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 7 }}>
              {i + 1}. {q.label}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {q.options.slice(0, 3).map((opt, oi) => (
                <span
                  key={opt}
                  style={{
                    padding:      "3px 10px",
                    background:   oi === 0 ? T.blue : "#F9FAFB",
                    color:        oi === 0 ? T.white : T.muted,
                    borderRadius: 5,
                    fontSize:     11,
                    border:       `1px solid ${oi === 0 ? T.blue : T.border}`,
                    fontWeight:   oi === 0 ? 500 : 400,
                  }}
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onGetStarted} style={{ height: 42, padding: "0 24px", fontSize: 14 }}>
        Try it now →
      </Button>
    </div>
  );
}

export function HeroPage({ onGetStarted }: HeroPageProps) {
  return (
    <ContainerScroll
      titleComponent={
        <div style={{ marginBottom: 32, padding: "0 16px" }}>
          {/* Badge */}
          <div
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          6,
              padding:      "4px 14px",
              background:   "#EFF6FF",
              border:       `1px solid #BFDBFE`,
              borderRadius: 20,
              fontSize:     12,
              fontWeight:   500,
              color:        T.blue,
              marginBottom: 20,
            }}
          >
            ⚡ Powered by Claude · S.C.A.F.F. Framework
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize:    "clamp(32px, 6vw, 72px)",
              fontWeight:  700,
              lineHeight:  1.1,
              color:       T.text,
              marginBottom: 16,
            }}
          >
            Turn your ideas into
            <br />
            <span style={{ color: T.blue }}>perfect AI prompts</span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize:    "clamp(14px, 2vw, 18px)",
              color:       T.muted,
              maxWidth:    560,
              margin:      "0 auto 28px",
              lineHeight:  1.6,
            }}
          >
            Describe what you want to build. Answer 7 quick questions.
            Get a structured S.C.A.F.F. prompt and the best AI engine to run it on.
          </p>

          {/* CTAs */}
          <div
            style={{
              display:        "flex",
              gap:            12,
              justifyContent: "center",
              flexWrap:       "wrap",
              marginBottom:   16,
            }}
          >
            <Button
              onClick={onGetStarted}
              style={{ height: 48, padding: "0 28px", fontSize: 16, fontWeight: 600 }}
            >
              Build my prompt →
            </Button>

            <div
              style={{
                height:     48,
                padding:    "0 20px",
                borderRadius: 8,
                background: T.white,
                border:     `1px solid ${T.border}`,
                fontSize:   13,
                color:      T.muted,
                display:    "flex",
                alignItems: "center",
                gap:        12,
              }}
            >
              {Object.values(ENGINES).map(e => (
                <span key={e.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: e.dot }} />
                  {e.name}
                </span>
              ))}
            </div>
          </div>

          {/* Social proof hint */}
          <p style={{ fontSize: 12, color: T.border, margin: 0 }}>
            ~$0.001 per run · Scroll down to see the tool
          </p>
        </div>
      }
    >
      <ToolPreview onGetStarted={onGetStarted} />
    </ContainerScroll>
  );
}
