// src/hooks/useClock.ts
"use client";

import { useState, useEffect } from "react";

export function useClock() {
  const [now, setNow] = useState<Date>(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => date.toISOString().substr(11, 8);

  return { now, isMounted, formatTime };
}
