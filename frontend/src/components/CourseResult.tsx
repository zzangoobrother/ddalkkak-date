"use client";

import type { CourseResponse } from "@/types/course";

interface CourseResultProps {
  course: CourseResponse;
  onReset?: () => void;
}

/**
 * 코스 생성 결과 화면
 */
export default function CourseResult({ course, onReset }: CourseResultProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}시간 ${mins}분`;
    }
    if (hours > 0) {
      return `${hours}시간`;
    }
    return `${mins}분`;
  };

  const formatBudget = (amount: number) => {
    return `${(amount / 10000).toFixed(1)}만원`;
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {course.courseName}
          </h1>
          <p className="text-text-secondary">{course.description}</p>
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
        <div className="space-y-4 mb-8">
          {course.places.map((place, index) => (
            <div
              key={place.placeId}
              className="bg-card rounded-xl p-6 shadow-card"
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

              {/* 추천 메뉴 */}
              {place.recommendedMenu && (
                <div className="bg-background rounded-lg p-3 mb-4">
                  <div className="text-xs text-text-secondary mb-1">
                    추천 메뉴
                  </div>
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
            </div>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <button
            type="button"
            className="w-full py-4 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
            onClick={() => {
              // TODO: 카카오톡 공유 기능
              alert("카카오톡 공유 기능은 추후 구현 예정입니다.");
            }}
          >
            카카오톡으로 공유하기
          </button>
          <button
            type="button"
            onClick={onReset}
            className="w-full py-4 rounded-xl font-semibold text-primary border-2 border-primary hover:bg-primary-light transition-colors"
          >
            새로운 코스 만들기
          </button>
        </div>
      </div>
    </div>
  );
}
