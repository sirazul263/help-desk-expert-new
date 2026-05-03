"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "96px",
        right: "24px",
        zIndex: 9999,
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "var(--color-brand)",
        color: "#fff",
        fontSize: "1.4rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.3s, transform 0.3s",
        transform: visible ? "translateY(0)" : "translateY(10px)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      ↑
    </button>
  );
}
