import { useState, useRef } from "react";
import { T, type GenerateResult } from "@/lib/constants";
import { TopBar }       from "@/components/TopBar";
import { HeroPage }     from "@/pages/HeroPage";
import { InputPage }    from "@/pages/InputPage";
import { QuestionsPage} from "@/pages/QuestionsPage";
import { ResultPage }   from "@/pages/ResultPage";

type Step = "hero" | "input" | "questions" | "result";

export default function App() {
  const [step,      setStep]      = useState<Step>("hero");
  const [userInput, setUserInput] = useState("");
  const [result,    setResult]    = useState<GenerateResult | null>(null);

  const toolRef = useRef<HTMLDivElement>(null);

  const scrollToTool = () => {
    setStep("input");
    setTimeout(() => {
      toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const reset = () => {
    setStep("input");
    setUserInput("");
    setResult(null);
    setTimeout(() => {
      toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <div
      style={{
        minHeight:  "100vh",
        background: T.bg,
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        color:      T.text,
      }}
    >
      {/* ── Sticky top bar ── */}
      <TopBar step={step} onNew={reset} onGetStarted={scrollToTool} />

      {/* ── Hero (ContainerScroll) — kept mounted so scroll animation works ── */}
      <div style={{ display: step === "hero" ? "block" : "none" }}>
        <HeroPage onGetStarted={scrollToTool} />
      </div>

      {/* ── Tool steps ── */}
      <div
        ref={toolRef}
        style={{ display: step === "hero" ? "none" : "block" }}
      >
        <main
          style={{
            maxWidth: 720,
            margin:   "0 auto",
            padding:  "32px 24px 64px",
          }}
        >
          {step === "input" && (
            <InputPage
              onNext={val => {
                setUserInput(val);
                setStep("questions");
              }}
            />
          )}

          {step === "questions" && (
            <QuestionsPage
              userInput={userInput}
              onBack={() => setStep("input")}
              onDone={(res) => {
                setResult(res);
                setStep("result");
              }}
            />
          )}

          {step === "result" && result && (
            <ResultPage
              result={result}
              onRegenerate={() => setStep("questions")}
              onNew={reset}
            />
          )}
        </main>

        <footer
          style={{
            textAlign: "center",
            padding:   "0 0 32px",
            fontSize:  12,
            color:     T.border,
          }}
        >
          S.C.A.F.F. · Anthropic Prompt Engineering · dair-ai/Prompt-Engineering-Guide
        </footer>
      </div>

      {/* Inline style for scroll-title centering */}
      <style>{`
        .scroll-title-wrap {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
