"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourseById, saveCourse } from "@/lib/api";
import type { CourseResponse, PlaceInCourse } from "@/types/course";
import { formatBudget, formatDuration } from "@/lib/utils";
import PlaceDetailModal from "@/components/PlaceDetailModal";
import LoginModal from "@/components/LoginModal";
import { useAuthStore } from "@/store/authStore";
import { trackEvent } from "@/lib/analytics";
import Image from "next/image";

interface SharePageClientProps {
  courseId: string;
}

/**
 * 코스 공유 페이지 클라이언트 컴포넌트
 */
export default function SharePageClient({ courseId }: SharePageClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceInCourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 코스 정보 로드
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const data = await getCourseById(courseId);
        setCourse(data);

        // Analytics: 공유 페이지 조회 이벤트
        trackEvent("course_viewed_from_share", {
          course_id: data.courseId,
          course_name: data.courseName,
        });
      } catch (err) {
        console.error("코스 조회 실패:", err);
        setError(err instanceof Error ? err.message : "코스를 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  // 장소 클릭 핸들러
  const handlePlaceClick = (place: PlaceInCourse) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPlace(null), 300);
  };

  // "나도 이 코스 저장하기" 버튼 핸들러
  const handleSaveCourse = async () => {
    // 인증 체크
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!course || isSaving) return;

    try {
      setIsSaving(true);
      await saveCourse(course.courseId);
      alert("💾 코스가 저장되었습니다!\n내 코스 페이지에서 확인하실 수 있습니다.");
      router.push("/my-courses");
    } catch (error) {
      console.error("코스 저장 실패:", error);
      alert("코스 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  // "비슷한 코스 만들기" 버튼 핸들러
  const handleCreateSimilarCourse = () => {
    if (!course) return;

    // 홈으로 이동 (쿼리 파라미터로 지역/유형 정보 전달)
    router.push(
      `/?regionId=${course.regionId || ""}&dateTypeId=${course.dateTypeId || ""}`
    );
  };

  // 로그인 성공 후 코스 저장
  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setTimeout(() => {
      handleSaveCourse();
    }, 100);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🎉</div>
          <p className="text-text-secondary">코스 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            코스를 찾을 수 없습니다
          </h1>
          <p className="text-text-secondary mb-6">
            {error || "유효하지 않은 공유 링크입니다."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {course.courseName}
          </h1>
          <p className="text-text-secondary">{course.description}</p>
          <div className="mt-4 inline-block px-4 py-2 bg-primary-light rounded-full text-sm text-primary font-semibold">
            📤 공유받은 코스
          </div>
        </div>

        {/* 코스 요약 */}
        <div className="bg-card rounded-xl p-6 shadow-card mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-text-secondary mb-1">지역</div>
              <div className="font-semibold text-text-primary">
                {course.regionName}
              </div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-1">유형</div>
              <div className="font-semibold text-text-primary">
                {course.dateTypeName}
              </div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-1">총 소요시간</div>
              <div className="font-semibold text-text-primary">
                ⏱️ {formatDuration(course.totalDurationMinutes)}
              </div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-1">총 예산</div>
              <div className="font-semibold text-text-primary">
                💰 {formatBudget(course.totalBudget)}
              </div>
            </div>
          </div>
        </div>

        {/* 장소 목록 */}
        <div className="space-y-4 mb-6">
          {course.places.map((place, index) => (
            <button
              key={place.placeId}
              type="button"
              onClick={() => handlePlaceClick(place)}
              className="w-full bg-card rounded-xl p-6 shadow-card text-left hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* 장소 번호 및 이름 */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {place.sequence}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary mb-1">
                    {place.name}
                  </h3>
                  <p className="text-sm text-text-secondary">{place.category}</p>
                </div>
                <div className="flex-shrink-0 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* 장소 정보 */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-secondary">📍</span>
                  <span className="text-text-primary">{place.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">⏱️</span>
                    <span className="text-text-primary">
                      {formatDuration(place.durationMinutes)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">💰</span>
                    <span className="text-text-primary">
                      {formatBudget(place.estimatedCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 장소 이미지 썸네일 */}
              {place.imageUrls && place.imageUrls.length > 0 && (
                <div className="mb-4 overflow-x-auto">
                  <div className="flex gap-2">
                    {place.imageUrls.map((imageUrl, imageIndex) => (
                      <div
                        key={imageIndex}
                        className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100"
                      >
                        <Image
                          src={imageUrl}
                          alt={`${place.name} 이미지 ${imageIndex + 1}`}
                          fill
                          sizes="96px"
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 추천 메뉴 */}
              {place.recommendedMenu && (
                <div className="bg-background rounded-lg p-3 mb-4">
                  <div className="text-xs text-text-secondary mb-1">추천 메뉴</div>
                  <div className="text-sm font-semibold text-text-primary">
                    {place.recommendedMenu}
                  </div>
                </div>
              )}

              {/* 다음 장소로 이동 */}
              {place.transportToNext && index < course.places.length - 1 && (
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <span className="text-sm text-text-secondary">→</span>
                  <span className="text-sm text-text-primary">
                    {place.transportToNext}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSaveCourse}
            disabled={isSaving}
            className="w-full py-4 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "💾 저장 중..." : "💾 나도 이 코스 저장하기"}
          </button>
          <button
            type="button"
            onClick={handleCreateSimilarCourse}
            className="w-full py-4 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary-light transition-colors"
          >
            ✨ 비슷한 코스 만들기
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl font-semibold text-gray-600 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            🏠 홈으로 가기
          </button>
        </div>
      </div>

      {/* 장소 상세 모달 */}
      <PlaceDetailModal
        place={selectedPlace}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
