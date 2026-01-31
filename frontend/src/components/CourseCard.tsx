"use client";

import { SavedCourse } from "@/types/course";
import { formatBudget, formatDuration } from "@/lib/utils";

interface CourseCardProps {
  course: SavedCourse;
  onEdit?: (courseId: string) => void;
  onShare?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  onReuse?: (courseId: string) => void;
}

/**
 * 내 코스 페이지의 코스 카드 컴포넌트
 */
export default function CourseCard({
  course,
  onEdit,
  onShare,
  onDelete,
  onReuse,
}: CourseCardProps) {
  const isCompleted = course.status === "CONFIRMED";
  const displayDate = isCompleted
    ? course.confirmedAt
      ? new Date(course.confirmedAt).toLocaleDateString("ko-KR")
      : "-"
    : new Date(course.savedAt).toLocaleDateString("ko-KR");

  return (
    <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow">
      {/* 코스 이름 및 상태 */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-text-primary flex-1">
          {course.courseName}
        </h3>
        {isCompleted && (
          <span className="flex-shrink-0 ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            완료
          </span>
        )}
      </div>

      {/* 코스 정보 그리드 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="text-xs text-text-secondary mb-1">지역</div>
          <div className="text-sm font-semibold text-text-primary">
            {course.regionName}
          </div>
        </div>
        <div>
          <div className="text-xs text-text-secondary mb-1">
            {isCompleted ? "완료일" : "저장일"}
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {displayDate}
          </div>
        </div>
        <div>
          <div className="text-xs text-text-secondary mb-1">소요시간</div>
          <div className="text-sm font-semibold text-text-primary">
            ⏱️ {formatDuration(course.totalDurationMinutes)}
          </div>
        </div>
        <div>
          <div className="text-xs text-text-secondary mb-1">예산</div>
          <div className="text-sm font-semibold text-text-primary">
            💰 {formatBudget(course.totalBudget)}
          </div>
        </div>
      </div>

      {/* 장소 미리보기 */}
      <div className="mb-4 p-3 bg-background rounded-lg">
        <div className="text-xs text-text-secondary mb-2">
          코스 ({course.places.length}곳)
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {course.places.map((place, index) => (
            <div
              key={place.placeId}
              className="flex-shrink-0 flex items-center gap-1 text-xs"
            >
              <span className="text-primary font-semibold">{place.sequence}</span>
              <span className="text-text-primary truncate max-w-[100px]">
                {place.name}
              </span>
              {index < course.places.length - 1 && (
                <span className="text-text-secondary">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        {isCompleted ? (
          <>
            {/* 완료한 데이트: 다시 사용, 공유 */}
            <button
              type="button"
              onClick={() => onReuse?.(course.courseId)}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold text-primary bg-primary-light hover:bg-primary/20 transition-colors"
            >
              🔄 다시 사용
            </button>
            <button
              type="button"
              onClick={() => onShare?.(course.courseId)}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              📤 공유
            </button>
          </>
        ) : (
          <>
            {/* 저장된 코스: 수정, 공유, 삭제 */}
            <button
              type="button"
              onClick={() => onEdit?.(course.courseId)}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold text-primary bg-primary-light hover:bg-primary/20 transition-colors"
            >
              ✏️ 수정
            </button>
            <button
              type="button"
              onClick={() => onShare?.(course.courseId)}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              📤 공유
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(course.courseId)}
              className="py-2 px-4 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}
