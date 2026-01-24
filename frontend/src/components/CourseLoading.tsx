"use client";

import { useEffect, useState } from "react";

const loadingMessages = [
  "AI가 최적의 데이트 코스를 찾고 있어요...",
  "주변 맛집을 탐색 중이에요...",
  "동선을 최적화하고 있어요...",
  "특별한 장소를 추천 중이에요...",
];

/**
 * 코스 생성 로딩 화면
 */
export default function CourseLoading() {
  const [messageIndex, setMessageIndex] = useState(0);

  // 3초마다 메시지 변경
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        {/* 로딩 애니메이션 */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-primary-light rounded-full" />
          <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            ✨
          </div>
        </div>

        {/* 로딩 메시지 */}
        <h2 className="text-xl font-bold text-text-primary mb-2">
          {loadingMessages[messageIndex]}
        </h2>
        <p className="text-sm text-text-secondary">
          잠시만 기다려주세요 (약 10-15초 소요)
        </p>

        {/* 진행 바 */}
        <div className="mt-8 w-full h-2 bg-card rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
