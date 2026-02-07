"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getCourseById, submitFeedback } from "@/lib/api";
import {
  POSITIVE_FEEDBACK_OPTIONS,
  NEGATIVE_FEEDBACK_OPTIONS,
} from "@/lib/constants";
import type { CourseResponse } from "@/types/course";
import type { PlaceRating, PlaceRecommendation } from "@/types/feedback";
import FeedbackStarSection from "@/components/feedback/FeedbackStarSection";
import FeedbackCheckboxGroup from "@/components/feedback/FeedbackCheckboxGroup";
import PlaceRatingCard from "@/components/feedback/PlaceRatingCard";
import FeedbackTextArea from "@/components/feedback/FeedbackTextArea";

interface FeedbackPageClientProps {
  courseId: string;
}

/**
 * 피드백 페이지 클라이언트 컴포넌트
 */
export default function FeedbackPageClient({ courseId }: FeedbackPageClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // 코스 데이터
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [overallRating, setOverallRating] = useState(0);
  const [selectedPositives, setSelectedPositives] = useState<Set<string>>(new Set());
  const [selectedNegatives, setSelectedNegatives] = useState<Set<string>>(new Set());
  const [placeRatings, setPlaceRatings] = useState<Map<number, PlaceRating>>(new Map());
  const [freeText, setFreeText] = useState("");

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 코스 데이터 로드
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const data = await getCourseById(courseId);

        // 이미 평가한 코스인지 확인
        if (data.rating) {
          setError("already_rated");
          setCourse(data);
          return;
        }

        setCourse(data);

        // 장소별 평가 초기화
        const initialRatings = new Map<number, PlaceRating>();
        data.places.forEach((place) => {
          initialRatings.set(place.placeId, {
            placeId: place.placeId,
            placeName: place.name,
            category: place.category,
            recommendation: null,
          });
        });
        setPlaceRatings(initialRatings);
      } catch (err) {
        console.error("코스 조회 실패:", err);
        setError("load_failed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, isAuthenticated, router]);

  // 체크박스 토글
  const handleTogglePositive = (id: string) => {
    setSelectedPositives((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleNegative = (id: string) => {
    setSelectedNegatives((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 장소 추천 변경
  const handlePlaceRecommendation = (placeId: number, value: PlaceRecommendation) => {
    setPlaceRatings((prev) => {
      const next = new Map(prev);
      const existing = next.get(placeId);
      if (existing) {
        next.set(placeId, { ...existing, recommendation: value });
      }
      return next;
    });
  };

  // 폼 제출
  const handleSubmit = async () => {
    if (overallRating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitFeedback({
        courseId,
        overallRating,
        positiveOptions: Array.from(selectedPositives),
        negativeOptions: Array.from(selectedNegatives),
        placeRatings: Array.from(placeRatings.values()),
        freeText,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("피드백 제출 실패:", err);
      alert("피드백 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm text-text-secondary">코스 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 이미 평가한 코스
  if (error === "already_rated") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            이미 평가를 완료했어요
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            {course?.courseName}에 대한 평가가 이미 등록되어 있어요.
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 코스 로드 실패
  if (error === "load_failed" || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            코스를 찾을 수 없어요
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            코스 정보를 불러오는 데 실패했습니다.
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 제출 성공 화면
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🥰</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            피드백 감사합니다!
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            소중한 의견이 더 좋은 코스 추천에 도움이 돼요.
          </p>
          <button
            type="button"
            onClick={() => router.push("/my-courses")}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            내 코스로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 코스 날짜
  const courseDate = course.confirmedAt
    ? new Date(course.confirmedAt).toLocaleDateString("ko-KR")
    : new Date(course.createdAt).toLocaleDateString("ko-KR");

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-text-primary">
            데이트 피드백
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-32">
        {/* 코스 요약 카드 */}
        <div className="bg-white rounded-xl p-5 shadow-card">
          <h2 className="text-lg font-bold text-text-primary mb-2">
            {course.courseName}
          </h2>
          <div className="flex gap-4 text-sm text-text-secondary">
            <span>{course.regionName}</span>
            <span>{courseDate}</span>
          </div>
        </div>

        {/* 별점 섹션 */}
        <FeedbackStarSection
          rating={overallRating}
          onRatingChange={setOverallRating}
        />

        {/* 좋았던 점 */}
        <FeedbackCheckboxGroup
          title="좋았던 점 (선택)"
          options={POSITIVE_FEEDBACK_OPTIONS}
          selectedIds={selectedPositives}
          onToggle={handleTogglePositive}
        />

        {/* 아쉬운 점 */}
        <FeedbackCheckboxGroup
          title="아쉬운 점 (선택)"
          options={NEGATIVE_FEEDBACK_OPTIONS}
          selectedIds={selectedNegatives}
          onToggle={handleToggleNegative}
        />

        {/* 장소별 평가 */}
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h3 className="text-base font-bold text-text-primary mb-4">
            장소별 평가 (선택)
          </h3>
          <div className="space-y-3">
            {course.places.map((place) => {
              const placeRating = placeRatings.get(place.placeId);
              return (
                <PlaceRatingCard
                  key={place.placeId}
                  placeName={place.name}
                  category={place.category}
                  sequence={place.sequence}
                  recommendation={placeRating?.recommendation ?? null}
                  onRecommendationChange={(value) =>
                    handlePlaceRecommendation(place.placeId, value)
                  }
                />
              );
            })}
          </div>
        </div>

        {/* 자유 텍스트 */}
        <FeedbackTextArea value={freeText} onChange={setFreeText} />
      </div>

      {/* 하단 고정 제출 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || overallRating === 0}
            className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "제출 중..." : "제출하고 포인트 받기 🎁"}
          </button>
        </div>
      </div>
    </div>
  );
}
