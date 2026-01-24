"use client";

import { useEffect, useState } from "react";
import CourseInputForm from "@/components/CourseInputForm";
import CourseLoading from "@/components/CourseLoading";
import CourseResult from "@/components/CourseResult";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { generateMultipleCourses, generateMoreCourses } from "@/lib/api";
import type { CourseInputData, CourseResponse } from "@/types/course";

type PageState = "input" | "loading" | "result" | "error";

export default function Home() {
  const [pageState, setPageState] = useState<PageState>("input");
  const [courseData, setCourseData] = useState<CourseResponse[]>([]);
  const [lastInputData, setLastInputData] = useState<CourseInputData | null>(
    null
  );
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
    setLastInputData(data);

    try {
      trackEvent("course_generation_started", {
        region_id: data.regionId,
        date_type_id: data.dateTypeId,
        budget_preset_id: data.budget.presetId,
      });

      // 3개의 코스 생성
      const responses = await generateMultipleCourses(data);

      setCourseData(responses);
      setPageState("result");

      trackEvent("course_generation_completed", {
        course_count: responses.length,
        total_budget_avg:
          responses.reduce((sum, c) => sum + c.totalBudget, 0) /
          responses.length,
        total_duration_avg:
          responses.reduce((sum, c) => sum + c.totalDurationMinutes, 0) /
          responses.length,
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
    setCourseData([]);
    setLastInputData(null);
    setErrorMessage("");
    trackEvent("course_input_reset");
  };

  // 재시도
  const handleRetry = () => {
    setPageState("input");
    setErrorMessage("");
    trackEvent("course_generation_retry");
  };

  // 더 추천받기
  const handleGenerateMore = async () => {
    if (!lastInputData) return;

    setPageState("loading");
    setErrorMessage("");

    try {
      trackEvent("course_generation_more_started");

      // 추가 코스 생성
      const newCourse = await generateMoreCourses(lastInputData);

      // 기존 코스에 추가 (최대 3개 유지)
      setCourseData((prev) => {
        const updated = [...prev, newCourse];
        return updated.slice(-3); // 최근 3개만 유지
      });
      setPageState("result");

      trackEvent("course_generation_more_completed");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "추가 코스 생성에 실패했습니다.";
      setErrorMessage(message);
      setPageState("error");

      trackEvent("course_generation_more_failed", {
        error: message,
      });
    }
  };

  // 상태별 화면 렌더링
  if (pageState === "loading") {
    return (
      <main className="min-h-screen bg-background">
        <CourseLoading />
      </main>
    );
  }

  if (pageState === "result" && courseData.length > 0) {
    return (
      <main className="min-h-screen bg-background">
        <CourseResult
          courses={courseData}
          onReset={handleReset}
          onGenerateMore={handleGenerateMore}
        />
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
