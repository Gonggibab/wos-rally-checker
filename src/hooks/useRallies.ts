// src/hooks/useRallies.ts
"use client";

import { useState, useEffect } from "react";
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
} from "firebase/firestore";

// Rally 타입을 여기서도 정의해줍니다.
export interface Rally {
  id: string;
  arrivalTime: Timestamp;
  nickname: string;
  isEditing?: boolean;
}

export function useRallies() {
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const q = query(collection(db, "rallies"), orderBy("arrivalTime", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ralliesFromDB: Rally[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Rally)
      );
      setRallies(ralliesFromDB);
    });
    return () => unsubscribe();
  }, []);

  const addRally = async (minutes: number) => {
    // minutes 인자 추가
    const arrivalTime = new Date(Date.now() + minutes * 60 * 1000); // 인자를 사용해 시간 계산
    await addDoc(collection(db, "rallies"), {
      nickname: `새로운 ${minutes}분 랠리`, // 닉네임도 동적으로 변경
      arrivalTime: Timestamp.fromDate(arrivalTime),
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
    await updateDoc(doc(db, "rallies", rallyId), {
      arrivalTime: Timestamp.fromDate(newDate),
    });
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

  // 자동 삭제 로직을 여기에 포함
  const now = new Date(); // 자동 삭제 체크를 위한 시간
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
