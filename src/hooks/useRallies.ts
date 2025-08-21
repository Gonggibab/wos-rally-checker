// src/hooks/useRallies.ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";

export interface Rally {
  id: string;
  arrivalTime: Timestamp;
  nickname: string;
  durationMinutes: number;
  startTime: Timestamp; // 1. '랠리 켜진 시간'을 저장할 필드 추가
  isEditing?: boolean;
}

export function useRallies() {
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  const subscribeToRallies = useCallback(() => {
    if (unsubscribeRef.current) return;
    // 3. 정렬 기준을 arrivalTime -> startTime으로 변경
    const q = query(collection(db, "rallies"), orderBy("startTime", "desc"));
    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
      const ralliesFromDB: Rally[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Rally)
      );
      setRallies(ralliesFromDB);
    });
  }, []);

  const unsubscribeFromRallies = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  useEffect(() => {
    subscribeToRallies();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        unsubscribeFromRallies();
      } else {
        subscribeToRallies();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribeFromRallies();
    };
  }, [subscribeToRallies, unsubscribeFromRallies]);

  const addRally = async (minutes: number) => {
    // 2. 랠리를 추가할 때 startTime도 함께 저장
    const startTime = new Date();
    const arrivalTime = new Date(startTime.getTime() + minutes * 60 * 1000);
    await addDoc(collection(db, "rallies"), {
      nickname: `새로운 ${minutes}분 랠리`,
      startTime: Timestamp.fromDate(startTime),
      arrivalTime: Timestamp.fromDate(arrivalTime),
      durationMinutes: minutes,
    });
  };

  const deleteRally = async (rallyId: string) =>
    await deleteDoc(doc(db, "rallies", rallyId));

  const adjustRallyTime = async (
    rallyId: string,
    currentArrivalTime: Timestamp,
    milliseconds: number
  ) => {
    const newDate = new Date(
      currentArrivalTime.toDate().getTime() + milliseconds
    );
    await updateDoc(doc(db, "rallies", rallyId), { arrivalTime: newDate });
  };

  const handleNicknameChange = async (rallyId: string, newNickname: string) => {
    if (newNickname.length > 12) {
      setErrorMessage("별명은 12자를 초과할 수 없습니다.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    await updateDoc(doc(db, "rallies", rallyId), { nickname: newNickname });
  };

  const toggleEditMode = (rallyId: string) => {
    setRallies(
      rallies.map((r) =>
        r.id === rallyId
          ? { ...r, isEditing: !r.isEditing }
          : { ...r, isEditing: false }
      )
    );
  };

  useEffect(() => {
    const deleteTimer = setInterval(() => {
      rallies.forEach((rally) => {
        if (rally.arrivalTime.toDate().getTime() <= new Date().getTime()) {
          deleteRally(rally.id);
        }
      });
    }, 1000);
    return () => clearInterval(deleteTimer);
  }, [rallies]);

  return {
    rallies,
    errorMessage,
    addRally,
    deleteRally,
    adjustRallyTime,
    handleNicknameChange,
    toggleEditMode,
  };
}
