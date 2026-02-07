"use client";

import StarRating from "@/components/StarRating";

interface FeedbackStarSectionProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

// 별점에 따른 이모지 피드백 텍스트
const feedbackTexts: Record<number, string> = {
  0: "별을 눌러서 평가해주세요",
  1: "😞 별로였어요",
  2: "😐 그저 그랬어요",
  3: "🙂 괜찮았어요",
  4: "😊 좋았어요",
  5: "🥰 최고였어요!",
};

/**
 * 피드백 페이지의 별점 섹션
 */
export default function FeedbackStarSection({
  rating,
  onRatingChange,
}: FeedbackStarSectionProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-card">
      <h3 className="text-base font-bold text-text-primary mb-4">
        전체 만족도
      </h3>
      <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl">
        <StarRating
          rating={rating}
          onRatingChange={onRatingChange}
          size="lg"
        />
        <div className="mt-3 text-sm text-text-secondary">
          {feedbackTexts[rating] || ""}
        </div>
      </div>
    </div>
  );
}
