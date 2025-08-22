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
  startTime: Timestamp;
  profileId: string;
  isEditing?: boolean;
}

export interface Profile {
  id: string;
  nickname: string;
  marchSpeed: number;
}

export function useRallies() {
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // 랠리 데이터 구독
  const subscribeToRallies = useCallback(() => {
    if (unsubscribeRef.current) return;
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

  // 프로필 데이터 구독
  useEffect(() => {
    const q = query(collection(db, "profiles"), orderBy("nickname"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const profilesFromDB: Profile[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Profile)
      );
      setProfiles(profilesFromDB);
    });
    return () => unsubscribe();
  }, []);

  // 랠리 추가
  const addRally = async (minutes: number) => {
    if (!selectedProfileId) {
      alert("먼저 사용할 프로필을 선택해주세요.");
      return;
    }

    const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
    if (!selectedProfile) {
      alert("선택된 프로필을 찾을 수 없습니다.");
      return;
    }

    const startTime = new Date();
    const arrivalTime = new Date(
      startTime.getTime() +
        minutes * 60 * 1000 +
        selectedProfile.marchSpeed * 1000
    );

    await addDoc(collection(db, "rallies"), {
      nickname: selectedProfile.nickname,
      startTime: Timestamp.fromDate(startTime),
      arrivalTime: Timestamp.fromDate(arrivalTime),
      durationMinutes: minutes,
      profileId: selectedProfile.id,
    });
  };

  // 프로필 추가
  const addProfile = async (nickname: string, marchSpeed: number) => {
    await addDoc(collection(db, "profiles"), {
      nickname,
      marchSpeed,
    });
  };

  // 프로필 삭제
  const deleteProfile = async (profileId: string) => {
    if (selectedProfileId === profileId) {
      setSelectedProfileId(null);
    }
    await deleteDoc(doc(db, "profiles", profileId));
  };

  const deleteRally = async (rallyId: string) =>
    await deleteDoc(doc(db, "rallies", rallyId));

  const adjustRallyTime = async (
    rallyId: string,
    rally: Rally,
    milliseconds: number
  ) => {
    const currentStartTime = rally.startTime.toDate();
    const currentArrivalTime = rally.arrivalTime.toDate();

    const newStartTime = new Date(currentStartTime.getTime() + milliseconds);
    const newArrivalTime = new Date(
      currentArrivalTime.getTime() + milliseconds
    );

    await updateDoc(doc(db, "rallies", rallyId), {
      startTime: Timestamp.fromDate(newStartTime),
      arrivalTime: Timestamp.fromDate(newArrivalTime),
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

  // 자동 삭제 로직
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
    profiles,
    errorMessage,
    selectedProfileId,
    setSelectedProfileId,
    addRally,
    addProfile,
    deleteProfile,
    deleteRally,
    adjustRallyTime,
    handleNicknameChange,
    toggleEditMode,
  };
}
