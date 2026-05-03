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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-3xl w-full bg-gradient-to-tr from-white/5 to-white/3 backdrop-blur-md border border-white/6 rounded-3xl p-10 shadow-2xl"
      >
        <div className="flex items-start gap-5">
          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-lg">
            <AlertTriangle size={28} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-white">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              An unexpected error occurred. You can try to retry the action or
              return home. If the problem persists, contact support.
            </p>
          </div>
        </div>

        {error?.message ? (
          <pre className="mt-6 text-xs text-slate-300 max-h-44 overflow-auto rounded-md bg-black/20 p-3">
            {error.message}
          </pre>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-slate-900 hover:bg-white/90 transition"
          >
            <RefreshCw size={16} /> Retry
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-transparent border border-white/10 text-white hover:bg-white/4 transition"
          >
            <Home size={16} /> Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
