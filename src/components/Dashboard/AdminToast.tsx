"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type ToastType = "success" | "error";

let globalShow: ((msg: string, type?: ToastType) => void) | null = null;

export function showToast(msg: string, type: ToastType = "success") {
  globalShow?.(msg, type);
}

export default function AdminToast() {
  const [toast, setToast] = useState<{
    msg: string;
    type: ToastType;
  } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  const show = useCallback((msg: string, type: ToastType = "success") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ msg, type });
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    globalShow = show;
    return () => {
      globalShow = null;
    };
  }, [show]);

  if (!toast) return null;

  return <div className={`adm-toast show t-${toast.type}`}>{toast.msg}</div>;
}
