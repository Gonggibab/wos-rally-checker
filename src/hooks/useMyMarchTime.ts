// src/hooks/useMyMarchTime.ts
"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "myMarchTime";

export function useMyMarchTime() {
  const [myMarchTime, setMyMarchTime] = useState<number>(30); // 기본값 30초
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedTime = localStorage.getItem(STORAGE_KEY);
      if (storedTime !== null) {
        setMyMarchTime(Number(storedTime));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
    setIsLoaded(true); // 로딩 완료
  }, []);

  const saveMyMarchTime = (time: number) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(time));
      setMyMarchTime(time);
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }
  };

  return { myMarchTime, saveMyMarchTime, isLoaded };
}
