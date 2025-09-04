// src/hooks/useEventDetails.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useEventDetails(detailId: string | undefined) {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    if (!detailId) {
      setMarkdown("이벤트 정보가 없습니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, "eventDetails", detailId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMarkdown(docSnap.data().markdownContent);
      } else {
        // Firestore에 문서가 없을 경우, 에러를 유발하는 로컬 파일 import 로직을 제거하고
        // 바로 fallback 메시지를 표시하도록 수정합니다.
        console.log(`Firestore document for '${detailId}' not found.`);
        setMarkdown("이벤트에 대한 설명이 아직 없습니다.");
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      setMarkdown("상세 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [detailId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const updateDetails = async (newContent: string) => {
    if (!detailId) {
      console.error("Update failed: detailId is missing.");
      return false;
    }

    console.log(`Attempting to update '${detailId}' with new content...`);

    try {
      const docRef = doc(db, "eventDetails", detailId);
      await setDoc(docRef, { markdownContent: newContent });

      console.log(`Successfully updated '${detailId}' in Firestore.`);
      setMarkdown(newContent);
      return true;
    } catch (error) {
      console.error("!!! Firestore update failed:", error);
      return false;
    }
  };

  return { markdown, loading, updateDetails, refetch: fetchDetails };
}
