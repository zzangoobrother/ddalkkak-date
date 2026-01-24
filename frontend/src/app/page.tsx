"use client";

import { useEffect, useState } from "react";
import CourseInputForm from "@/components/CourseInputForm";
import CourseLoading from "@/components/CourseLoading";
import CourseResult from "@/components/CourseResult";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { generateCourse } from "@/lib/api";
import type { CourseInputData, CourseResponse } from "@/types/course";

type PageState = "input" | "loading" | "result" | "error";

export default function Home() {
  const [pageState, setPageState] = useState<PageState>("input");
  const [courseData, setCourseData] = useState<CourseResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 페이지 진입 시 Analytics 이벤트 전송
  useEffect(() => {
    trackPageView("course_input", "/");
    trackEvent("course_input_started");
  }, []);

  // 코스 입력 완료 핸들러
  const handleComplete = async (data: CourseInputData) => {
    setPageState("loading");
    setErrorMessage("");

    try {
      trackEvent("course_generation_started", {
        region_id: data.regionId,
        date_type_id: data.dateTypeId,
        budget_preset_id: data.budget.presetId,
      });

      const response = await generateCourse(data);

      setCourseData(response);
      setPageState("result");

      trackEvent("course_generation_completed", {
        course_id: response.courseId,
        total_budget: response.totalBudget,
        total_duration: response.totalDurationMinutes,
        place_count: response.places.length,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "코스 생성에 실패했습니다.";
      setErrorMessage(message);
      setPageState("error");

      trackEvent("course_generation_failed", {
        error: message,
      });
    }
  };

  // 다시 시작하기
  const handleReset = () => {
    setPageState("input");
    setCourseData(null);
    setErrorMessage("");
    trackEvent("course_input_reset");
  };

  // 재시도
  const handleRetry = () => {
    setPageState("input");
    setErrorMessage("");
    trackEvent("course_generation_retry");
  };

  // 상태별 화면 렌더링
  if (pageState === "loading") {
    return (
      <main className="min-h-screen bg-background">
        <CourseLoading />
      </main>
    );
  }

  if (pageState === "result" && courseData) {
    return (
      <main className="min-h-screen bg-background">
        <CourseResult course={courseData} onReset={handleReset} />
      </main>
    );
  }

  if (pageState === "error") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="text-6xl mb-6">😢</div>
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            코스 생성 실패
          </h1>
          <p className="text-text-secondary mb-8">{errorMessage}</p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleRetry}
              className="w-full py-4 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              다시 시도하기
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-4 rounded-xl font-semibold text-primary border-2 border-primary hover:bg-primary-light transition-colors"
            >
              처음으로 돌아가기
            </button>
          </div>
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
