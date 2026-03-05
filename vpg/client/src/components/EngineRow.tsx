import { motion } from "framer-motion";
import { T, type EngineRec } from "@/lib/constants";

interface EngineRowProps {
  rec:    EngineRec;
  isTop:  boolean;
  index:  number;
}

export function EngineRow({ rec, isTop, index }: EngineRowProps) {
  const { engine, pct, why } = rec;

  return (
    <div
      style={{
        display:    "flex",
        alignItems: "flex-start",
        gap:        16,
        padding:    "14px 16px",
        borderRadius: 8,
        border:     `1px solid ${isTop ? engine.dot + "55" : T.border}`,
        background: isTop ? engine.dot + "08" : T.white,
      }}
    >
      {/* Indicator dot */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, paddingTop: 3, flexShrink: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: engine.dot }} />
        {isTop && (
          <span style={{ fontSize: 10, fontWeight: 600, color: engine.dot, whiteSpace: "nowrap" }}>
            Best
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{engine.name}</span>
            <span style={{ fontSize: 12, color: T.muted, marginLeft: 8 }}>{engine.vendor}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: isTop ? engine.dot : T.muted }}>
            {pct}%
          </span>
        </div>

        {/* Score bar */}
        <div style={{ height: 4, background: "#F3F4F6", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            style={{ height: "100%", background: engine.dot, borderRadius: 2 }}
          />
        </div>

        <p style={{ margin: 0, fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{why}</p>
      </div>

      {/* Open button for best match */}
      {isTop && (
        <a
          href={engine.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flexShrink:     0,
            display:        "inline-flex",
            alignItems:     "center",
            height:         32,
            padding:        "0 14px",
            background:     T.blue,
            color:          T.white,
            borderRadius:   6,
            fontSize:       12,
            fontWeight:     500,
            textDecoration: "none",
            transition:     "background 120ms ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = T.blueHover)}
          onMouseLeave={e => (e.currentTarget.style.background = T.blue)}
        >
          Open →
        </a>
      )}
    </div>
  );
}
