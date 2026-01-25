"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PlaceInCourse } from "@/types/course";
import { formatBudget, formatDuration, openInMap } from "@/lib/utils";

interface PlaceDetailModalProps {
  place: PlaceInCourse | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 장소 상세 정보 모달
 */
export default function PlaceDetailModal({
  place,
  isOpen,
  onClose,
}: PlaceDetailModalProps) {
  if (!place) return null;

  const handleOpenInMap = () => {
    openInMap(place.latitude, place.longitude, place.name);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 백드롭 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto"
          >
            {/* 드래그 핸들 */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            <div className="px-6 pb-8">
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {place.name}
                  </h2>
                  <p className="text-text-secondary mb-2">{place.category}</p>

                  {/* 평점 & 리뷰 수 */}
                  {place.rating !== undefined && place.rating !== null && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-text-primary font-semibold">
                        {place.rating.toFixed(1)}
                      </span>
                      {place.reviewCount !== undefined && place.reviewCount !== null && (
                        <span className="text-text-secondary text-sm">
                          (리뷰 {place.reviewCount.toLocaleString()}개)
                        </span>
                      )}
                    </div>
                  )}

                  {/* 예약 필요 배지 */}
                  {place.needsReservation && (
                    <div className="inline-block">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-md">
                        예약 필수
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>

              {/* 장소 정보 */}
              <div className="space-y-4 mb-6">
                {/* 주소 */}
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">📍</span>
                  <div className="flex-1">
                    <div className="text-sm text-text-secondary mb-1">주소</div>
                    <div className="text-text-primary">{place.address}</div>
                  </div>
                </div>

                {/* 소요 시간 & 예상 비용 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">⏱️</span>
                    <div className="flex-1">
                      <div className="text-sm text-text-secondary mb-1">
                        소요 시간
                      </div>
                      <div className="text-text-primary font-semibold">
                        {formatDuration(place.durationMinutes)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">💰</span>
                    <div className="flex-1">
                      <div className="text-sm text-text-secondary mb-1">
                        예상 비용
                      </div>
                      <div className="text-text-primary font-semibold">
                        {formatBudget(place.estimatedCost)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 추천 메뉴 */}
                {place.recommendedMenu && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🍽️</span>
                    <div className="flex-1">
                      <div className="text-sm text-text-secondary mb-1">
                        추천 메뉴
                      </div>
                      <div className="text-text-primary font-semibold">
                        {place.recommendedMenu}
                      </div>
                    </div>
                  </div>
                )}

                {/* 영업시간 */}
                {place.openingHours && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🕒</span>
                    <div className="flex-1">
                      <div className="text-sm text-text-secondary mb-1">
                        영업시간
                      </div>
                      <div className="text-text-primary">
                        {place.openingHours}
                      </div>
                    </div>
                  </div>
                )}

                {/* 이동 정보 */}
                {place.transportToNext && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🚶</span>
                    <div className="flex-1">
                      <div className="text-sm text-text-secondary mb-1">
                        다음 장소로
                      </div>
                      <div className="text-text-primary">
                        {place.transportToNext}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 지도에서 보기 버튼 */}
              <button
                type="button"
                onClick={handleOpenInMap}
                className="w-full py-4 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                📍 지도에서 보기
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
