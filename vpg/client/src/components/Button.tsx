import React from "react";
import { T } from "@/lib/constants";

type Variant = "primary" | "secondary" | "success";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary:   { background: T.blue,         color: T.white },
  secondary: { background: T.white,        color: T.muted,  border: `1px solid ${T.border}` },
  success:   { background: T.successGreen, color: T.white },
};

export function Button({
  children,
  variant = "primary",
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    height:       40,
    padding:      "0 20px",
    borderRadius: 6,
    fontSize:     14,
    fontWeight:   500,
    cursor:       disabled ? "not-allowed" : "pointer",
    display:      "inline-flex",
    alignItems:   "center",
    justifyContent: "center",
    gap:          6,
    border:       "none",
    outline:      "none",
    fontFamily:   "inherit",
    opacity:      disabled ? 0.4 : 1,
    transition:   "background 120ms ease, transform 80ms, opacity 120ms",
    whiteSpace:   "nowrap",
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      disabled={disabled}
      style={base}
      onMouseEnter={e => {
        if (!disabled) e.currentTarget.style.opacity = "0.88";
        onMouseEnter?.(e);
      }}
      onMouseLeave={e => {
        e.currentTarget.style.opacity = disabled ? "0.4" : "1";
        onMouseLeave?.(e);
      }}
      onMouseDown={e => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.98)";
        onMouseDown?.(e);
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = "scale(1)";
        onMouseUp?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
