"use client";

import { useEffect, useState } from "react";
import CourseInputForm from "@/components/CourseInputForm";
import { trackEvent, trackPageView } from "@/lib/analytics";
import type { CourseInputData } from "@/types/course";
import { DATE_TYPE_MAP, BUDGET_PRESET_MAP, REGION_MAP } from "@/lib/constants";

export default function Home() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedData, setCompletedData] = useState<CourseInputData | null>(null);

  // 페이지 진입 시 Analytics 이벤트 전송
  useEffect(() => {
    trackPageView("course_input", "/");
    trackEvent("course_input_started");
  }, []);

  // 코스 입력 완료 핸들러
  const handleComplete = (data: CourseInputData) => {
    setCompletedData(data);
    setIsCompleted(true);

    // TODO: 실제로는 여기서 코스 생성 API를 호출하거나
    // 로딩 화면으로 전환해야 함
    console.log("코스 입력 완료:", data);
  };

  // 다시 시작하기
  const handleReset = () => {
    setIsCompleted(false);
    setCompletedData(null);
    trackEvent("course_input_reset");
  };

  // 완료 화면 (임시)
  if (isCompleted && completedData) {
    const region = REGION_MAP.get(completedData.regionId);
    const dateType = DATE_TYPE_MAP.get(completedData.dateTypeId);
    const budgetPreset = BUDGET_PRESET_MAP.get(completedData.budget.presetId);

    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            코스 생성 준비 완료!
          </h1>
          <div className="bg-card rounded-xl p-6 shadow-card mb-6 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">지역</span>
              <span className="font-semibold text-text-primary">
                {region?.emoji} {region?.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">데이트 유형</span>
              <span className="font-semibold text-text-primary">
                {dateType?.emoji} {dateType?.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">예산</span>
              <span className="font-semibold text-text-primary">
                💰{" "}
                {completedData.budget.presetId === "custom"
                  ? `${((completedData.budget.customAmount || 50000) / 10000).toFixed(0)}만원`
                  : budgetPreset?.label}
              </span>
            </div>
          </div>
          <p className="text-sm text-text-secondary mb-6">
            AI가 최적의 데이트 코스를 찾고 있어요...
            <br />
            (이 화면은 개발 중입니다)
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="w-full py-4 rounded-xl font-semibold text-primary border-2 border-primary hover:bg-primary-light transition-colors"
          >
            다시 선택하기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <CourseInputForm onComplete={handleComplete} />
    </main>
  );
}
