"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import { MyCourseTab, SavedCourse } from "@/types/course";
import { shareCourseToChatKakao } from "@/lib/kakao";
import { getSavedCourses, deleteCourse } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

/**
 * 내 코스 페이지
 * - 저장된 코스와 완료한 데이트를 탭으로 구분하여 표시
 * - 최대 50개 제한, 6개월 이상 오래된 코스 정리 안내
 */
export default function MyCoursesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<MyCourseTab>("saved");
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [completedCourses, setCompletedCourses] = useState<SavedCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 코스 데이터 가져오기
  useEffect(() => {
    const fetchCourses = async () => {
      if (!isAuthenticated) {
        router.push("/");
        return;
      }

      try {
        setIsLoading(true);

        // 저장된 코스와 완료한 코스를 병렬로 가져오기
        const [saved, completed] = await Promise.all([
          getSavedCourses("SAVED"),
          getSavedCourses("CONFIRMED"),
        ]);

        setSavedCourses(saved as SavedCourse[]);
        setCompletedCourses(completed as SavedCourse[]);
      } catch (error) {
        console.error("코스 목록 조회 실패:", error);
        // 에러가 발생해도 빈 배열로 표시
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, router]);

  const displayedCourses =
    activeTab === "saved" ? savedCourses : completedCourses;

  // 코스 수정
  const handleEdit = (courseId: string) => {
    // TODO: 코스 수정 페이지로 이동
    router.push(`/customize/${courseId}`);
  };

  // 코스 공유
  const handleShare = async (courseId: string) => {
    const course = displayedCourses.find((c) => c.courseId === courseId);
    if (!course) return;

    const result = await shareCourseToChatKakao(course);

    if (!result.success) {
      alert(
        `카카오톡 공유에 실패했습니다.\n${result.error || "다시 시도해주세요."}`
      );
    }
  };

  // 코스 삭제
  const handleDelete = async (courseId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteCourse(courseId);

      // 상태에서 제거
      setSavedCourses((prev) => prev.filter((c) => c.courseId !== courseId));
      alert("코스가 삭제되었습니다.");
    } catch (error) {
      console.error("코스 삭제 실패:", error);
      alert("코스 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 코스 다시 사용 (완료한 데이트를 다시 사용하여 새 코스 생성)
  const handleReuse = (courseId: string) => {
    const course = displayedCourses.find((c) => c.courseId === courseId);
    if (!course) return;

    // TODO: 코스 정보를 가지고 새로운 코스 생성 플로우로 이동
    router.push(
      `/customize/${courseId}?mode=reuse`
    );
  };

  // 6개월 이상 오래된 코스 확인
  const hasOldCourses = () => {
    const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
    return displayedCourses.some((course) => course.savedAt < sixMonthsAgo);
  };

  // 총 코스 수
  const totalCourses = savedCourses.length + completedCourses.length;

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => router.push("/")}
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
            <h1 className="text-2xl font-bold text-text-primary">내 코스</h1>
            <div className="w-10" /> {/* 헤더 균형 맞추기 */}
          </div>

          {/* 탭 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === "saved"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              저장된 코스
              {savedCourses.length > 0 && (
                <span className="ml-2 text-sm">({savedCourses.length})</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === "completed"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              완료한 데이트
              {completedCourses.length > 0 && (
                <span className="ml-2 text-sm">({completedCourses.length})</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {totalCourses >= 45 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-800 mb-1">
                  코스 개수 제한 안내
                </p>
                <p className="text-sm text-yellow-700">
                  최대 50개까지 저장할 수 있습니다. 현재{" "}
                  <span className="font-bold">{totalCourses}개</span> 저장됨
                </p>
              </div>
            </div>
          </div>
        )}

        {hasOldCourses() && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-xl">💡</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  코스 정리 안내
                </p>
                <p className="text-sm text-blue-700">
                  6개월 이상 지난 코스는 정리를 권장합니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 코스 목록 */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-sm text-text-secondary">코스 목록을 불러오는 중...</p>
          </div>
        ) : displayedCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              {activeTab === "saved" ? "📂" : "✅"}
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {activeTab === "saved"
                ? "아직 저장된 코스가 없어요"
                : "아직 완료한 데이트가 없어요"}
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              {activeTab === "saved"
                ? "마음에 드는 코스를 저장해보세요!"
                : "데이트를 완료하고 추억을 기록해보세요!"}
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              🎯 새 코스 만들기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedCourses.map((course) => (
              <CourseCard
                key={course.courseId}
                course={course}
                onEdit={activeTab === "saved" ? handleEdit : undefined}
                onShare={handleShare}
                onDelete={activeTab === "saved" ? handleDelete : undefined}
                onReuse={activeTab === "completed" ? handleReuse : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
