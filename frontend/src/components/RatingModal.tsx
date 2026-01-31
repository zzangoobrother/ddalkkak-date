"use client";

import { useState } from "react";
import StarRating from "./StarRating";

interface RatingModalProps {
  isOpen: boolean;
  courseName: string;
  currentRating?: number;
  onClose: () => void;
  onSubmit: (rating: number) => void;
  isSubmitting?: boolean;
}

/**
 * 코스 평가 모달
 */
export default function RatingModal({
  isOpen,
  courseName,
  currentRating = 0,
  onClose,
  onSubmit,
  isSubmitting = false,
}: RatingModalProps) {
  const [rating, setRating] = useState(currentRating);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert("평점을 선택해주세요.");
      return;
    }
    onSubmit(rating);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up">
        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            데이트 평가
          </h2>
          <p className="text-sm text-text-secondary">
            {courseName}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            이 데이트는 어떠셨나요?
          </p>
        </div>

        {/* 별점 선택 */}
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl mb-6">
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="lg"
          />
          <div className="mt-4 text-sm text-text-secondary">
            {rating === 0 && "별을 눌러서 평가해주세요"}
            {rating === 1 && "😞 별로였어요"}
            {rating === 2 && "😐 그저 그랬어요"}
            {rating === 3 && "🙂 괜찮았어요"}
            {rating === 4 && "😊 좋았어요"}
            {rating === 5 && "🥰 최고였어요!"}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "평가 중..." : "평가하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
