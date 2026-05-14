"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffffff, #f8fafc, #f1f5f9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          position: "relative",
          maxWidth: "480px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          border: "1px solid #f1f5f9",
          padding: "48px 40px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ffe4e6, #ffedd5)",
            opacity: 0.5,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, #e0e7ff, #e0f2fe)",
            opacity: 0.5,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 10 }}>
          {/* icon */}
          <div
            style={{
              margin: "0 auto 24px",
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f43f5e, #fb923c)",
              color: "#ffffff",
              boxShadow: "0 8px 24px rgba(244,63,94,0.35)",
            }}
          >
            <AlertTriangle size={28} />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: "#64748b",
              lineHeight: 1.6,
              maxWidth: "360px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            An unexpected error occurred. Try again or return home. If the
            problem persists,{" "}
            <Link
              href="/contact"
              style={{ color: "#4f46e5", textDecoration: "underline" }}
            >
              contact support
            </Link>
            .
          </p>

          {error?.message ? (
            <pre
              style={{
                marginTop: "20px",
                fontSize: "11px",
                textAlign: "left",
                color: "#475569",
                maxHeight: "140px",
                overflow: "auto",
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                padding: "14px 16px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {error.message}
            </pre>
          ) : null}

          <div
            style={{
              marginTop: "28px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #f43f5e, #fb923c)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(244,63,94,0.35)",
              }}
            >
              <RefreshCw size={15} /> Try again
            </button>

            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "999px",
                background: "#ffffff",
                color: "#334155",
                fontSize: "14px",
                fontWeight: 600,
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                textDecoration: "none",
              }}
            >
              <Home size={15} /> Go home
            </Link>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
