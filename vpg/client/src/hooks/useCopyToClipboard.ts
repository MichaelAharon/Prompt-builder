// ─────────────────────────────────────────────────────────────────────────────
//  useCopyToClipboard
//  Two-layer copy: modern Clipboard API with textarea execCommand fallback
//  Works inside sandboxed iframes and older browsers
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";

export function useCopyToClipboard(resetMs = 2200) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((text: string) => {
    const fallback = () => {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
      document.body.appendChild(el);
      el.focus();
      el.select();
      el.setSelectionRange(0, el.value.length);
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), resetMs);
      } catch {
        // silent fail
      }
      document.body.removeChild(el);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), resetMs);
        })
        .catch(fallback);
    } else {
      fallback();
    }
  }, [resetMs]);

  return { copied, copy };
}
