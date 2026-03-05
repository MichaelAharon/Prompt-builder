import React from "react";
import { T } from "@/lib/constants";

interface CardProps {
  children:  React.ReactNode;
  style?:    React.CSSProperties;
  className?: string;
}

export function Card({ children, style, className }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background:   T.white,
        border:       `1px solid ${T.border}`,
        borderRadius: 10,
        padding:      24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
