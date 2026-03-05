// ─────────────────────────────────────────────────────────────────────────────
//  ContainerScroll — from 21st.dev / Aceternity UI
//  Scroll-driven 3-D card tilt animation using Framer Motion
// ─────────────────────────────────────────────────────────────────────────────

"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ContainerScrollProps {
  titleComponent: React.ReactNode;
  children:       React.ReactNode;
}

export function ContainerScroll({ titleComponent, children }: ContainerScrollProps) {
  const containerRef             = useRef<HTMLDivElement>(null);
  const { scrollYProgress }      = useScroll({ target: containerRef });
  const isMobile                 = useIsMobile();

  const rotate    = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale     = useTransform(scrollYProgress, [0, 1], isMobile ? [0.7, 0.9] : [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      style={{
        height:         isMobile ? "60rem" : "80rem",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        position:       "relative",
        padding:        isMobile ? "8px" : "80px",
      }}
    >
      <div
        style={{
          paddingTop:    isMobile ? "40px"  : "160px",
          paddingBottom: isMobile ? "40px"  : "160px",
          width:         "100%",
          position:      "relative",
          perspective:   "1000px",
        }}
      >
        <ScrollHeader translate={translate}>{titleComponent}</ScrollHeader>
        <ScrollCard rotate={rotate} scale={scale}>{children}</ScrollCard>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScrollHeader({
  translate,
  children,
}: {
  translate: MotionValue<number>;
  children:  React.ReactNode;
}) {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="scroll-title-wrap"
    >
      {children}
    </motion.div>
  );
}

function ScrollCard({
  rotate,
  scale,
  children,
}: {
  rotate:   MotionValue<number>;
  scale:    MotionValue<number>;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  return (
    <motion.div
      style={{
        rotateX:   rotate,
        scale,
        boxShadow: "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
        maxWidth:  900,
        marginTop: "-48px",
        marginLeft:  "auto",
        marginRight: "auto",
        height:    isMobile ? "30rem" : "40rem",
        width:     "100%",
        border:    "4px solid #6C6C6C",
        padding:   isMobile ? "8px" : "24px",
        background: "#222222",
        borderRadius: "30px",
      }}
    >
      <div
        style={{
          height:       "100%",
          width:        "100%",
          overflow:     "hidden",
          borderRadius: "16px",
          background:   "#F8F9FB",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
