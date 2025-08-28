// src/app/(main)/feedback/page.tsx
"use client";

import { useState } from "react";

type FeedbackType = "suggestion" | "bug";

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("suggestion");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    const feedbackTypeText =
      feedbackType === "suggestion" ? "건의사항" : "버그신고";

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackType: feedbackTypeText,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error("서버에서 오류가 발생했습니다.");
      }

      setSubmitStatus("success");
      setContent("");
      setFeedbackType("suggestion");
    } catch (error) {
      console.error("피드백 제출 실패:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 전체 레이아웃을 flex-col로 설정하여 자식 요소들이 수직 공간을 채우도록 합니다.
    <div className="h-full flex flex-col p-4">
      <div className="max-w-lg mx-auto w-full flex flex-col flex-grow">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          버그신고 및 건의
        </h1>

        {/* form이 남은 공간을 모두 차지하도록 flex-grow를 추가합니다. */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow space-y-4"
        >
          {/* 글 종류 선택 */}
          <div>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-800 p-1">
              <button
                type="button"
                onClick={() => setFeedbackType("suggestion")}
                className={`w-full h-10 rounded-md text-sm font-semibold transition-colors ${
                  feedbackType === "suggestion"
                    ? "bg-blue-600 text-white"
                    : "bg-transparent text-gray-400 hover:bg-gray-700"
                }`}
              >
                건의사항
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType("bug")}
                className={`w-full h-10 rounded-md text-sm font-semibold transition-colors ${
                  feedbackType === "bug"
                    ? "bg-red-600 text-white"
                    : "bg-transparent text-gray-400 hover:bg-gray-700"
                }`}
              >
                버그신고
              </button>
            </div>
          </div>

          {/* 내용 입력 영역이 남은 공간을 모두 차지하도록 flex-grow를 추가합니다. */}
          <div className="flex flex-col flex-grow">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                feedbackType === "suggestion"
                  ? "추가되었으면 하는 기능이나 개선 아이디어를 자유롭게 작성해주세요."
                  : "어떤 상황에서 버그가 발생했는지 최대한 자세하게 작성해주시면 큰 도움이 됩니다."
              }
              className="w-full h-full flex-grow p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* 제출 버튼 및 상태 메시지 */}
          <div className="flex-shrink-0">
            {/* 상태 메시지 영역의 높이를 고정하여 레이아웃이 밀리는 것을 방지합니다. */}
            <div className="h-5 mb-2 text-right text-sm">
              {submitStatus === "success" && (
                <p className="text-green-400">
                  소중한 의견 감사합니다! 성공적으로 제출되었습니다.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-400">
                  제출에 실패했습니다. 잠시 후 다시 시도해주세요.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "제출 중..." : "제출하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
