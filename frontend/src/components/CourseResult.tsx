"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import type { CourseResponse, PlaceInCourse } from "@/types/course";
import { formatBudget, formatDuration } from "@/lib/utils";
import PlaceDetailModal from "./PlaceDetailModal";
import Image from "next/image";

interface CourseResultProps {
  courses: CourseResponse[];
  onReset?: () => void;
  onGenerateMore?: () => void;
}

/**
 * 코스 생성 결과 화면 (스와이프 지원)
 */
export default function CourseResult({
  courses,
  onReset,
  onGenerateMore,
}: CourseResultProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState<PlaceInCourse | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 현재 표시할 코스
  const currentCourse = courses[currentIndex];

  // 스와이프 감지 임계값 (픽셀)
  const swipeThreshold = 50;

  // 스와이프 핸들러
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset } = info;

    // 오른쪽 스와이프 (이전 코스)
    if (offset.x > swipeThreshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    // 왼쪽 스와이프 (다음 코스)
    else if (offset.x < -swipeThreshold && currentIndex < courses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

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

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {currentCourse.courseName}
          </h1>
          <p className="text-text-secondary">{currentCourse.description}</p>
        </div>

        {/* 페이지 인디케이터 */}
        <div className="flex justify-center items-center gap-2 mb-6">
          {courses.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`코스 ${index + 1} 보기`}
            />
          ))}
        </div>

        {/* 스와이프 안내 */}
        {courses.length > 1 && (
          <div className="text-center text-sm text-text-secondary mb-4">
            ← 좌우로 스와이프하여 다른 코스 보기 →
          </div>
        )}

        {/* 코스 카드 (스와이프 가능) */}
        <div className="relative overflow-hidden mb-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* 코스 요약 */}
              <div className="bg-card rounded-xl p-6 shadow-card mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-text-secondary mb-1">지역</div>
                    <div className="font-semibold text-text-primary">
                      {currentCourse.regionName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary mb-1">유형</div>
                    <div className="font-semibold text-text-primary">
                      {currentCourse.dateTypeName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary mb-1">
                      총 소요시간
                    </div>
                    <div className="font-semibold text-text-primary">
                      ⏱️ {formatDuration(currentCourse.totalDurationMinutes)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary mb-1">
                      총 예산
                    </div>
                    <div className="font-semibold text-text-primary">
                      💰 {formatBudget(currentCourse.totalBudget)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 장소 목록 */}
              <div className="space-y-4">
                {currentCourse.places.map((place, index) => (
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
                        <p className="text-sm text-text-secondary">
                          {place.category}
                        </p>
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
                        <span className="text-text-primary">
                          {place.address}
                        </span>
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
                                  // 이미지 로드 실패 시 기본 이미지로 대체
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
                        <div className="text-xs text-text-secondary mb-1">
                          추천 메뉴
                        </div>
                        <div className="text-sm font-semibold text-text-primary">
                          {place.recommendedMenu}
                        </div>
                      </div>
                    )}

                    {/* 다음 장소로 이동 */}
                    {place.transportToNext &&
                      index < currentCourse.places.length - 1 && (
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 더 추천받기 버튼 */}
        {onGenerateMore && (
          <button
            type="button"
            onClick={onGenerateMore}
            className="w-full py-3 mb-4 rounded-xl font-semibold text-primary border-2 border-primary hover:bg-primary-light transition-colors"
          >
            🔄 더 추천받기
          </button>
        )}

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => alert("수정 기능은 추후 구현 예정입니다.")}
            className="py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ✏️ 수정하기
          </button>
          <button
            type="button"
            onClick={() => alert("저장 기능은 추후 구현 예정입니다.")}
            className="py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            💾 저장
          </button>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="w-full py-4 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
            onClick={() => {
              alert("카카오톡 공유 기능은 추후 구현 예정입니다.");
            }}
          >
            📤 카카오톡으로 공유하기
          </button>
          <button
            type="button"
            onClick={() => {
              alert("선택 기능은 추후 구현 예정입니다.");
            }}
            className="w-full py-4 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            ✅ 이 코스로 선택
          </button>
          <button
            type="button"
            onClick={onReset}
            className="w-full py-3 rounded-xl font-semibold text-gray-600 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            🔙 새로운 코스 만들기
          </button>
        </div>
      </div>

      {/* 장소 상세 모달 */}
      <PlaceDetailModal
        place={selectedPlace}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
