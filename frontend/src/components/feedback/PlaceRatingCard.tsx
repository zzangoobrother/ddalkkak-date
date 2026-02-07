"use client";

import type { PlaceRecommendation } from "@/types/feedback";

interface PlaceRatingCardProps {
  placeName: string;
  category: string;
  sequence: number;
  recommendation: PlaceRecommendation;
  onRecommendationChange: (value: PlaceRecommendation) => void;
}

/**
 * 장소별 추천/비추 평가 카드
 */
export default function PlaceRatingCard({
  placeName,
  category,
  sequence,
  recommendation,
  onRecommendationChange,
}: PlaceRatingCardProps) {
  const handleToggle = (value: "recommend" | "not_recommend") => {
    // 이미 선택된 버튼을 다시 클릭하면 해제
    if (recommendation === value) {
      onRecommendationChange(null);
    } else {
      onRecommendationChange(value);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
          {sequence}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">
            {placeName}
          </p>
          <p className="text-xs text-text-secondary">{category}</p>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0 ml-3">
        <button
          type="button"
          onClick={() => handleToggle("recommend")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            recommendation === "recommend"
              ? "bg-green-100 text-green-700 border-2 border-green-400"
              : "bg-white text-gray-500 border-2 border-gray-200 hover:border-gray-300"
          }`}
        >
          👍 추천
        </button>
        <button
          type="button"
          onClick={() => handleToggle("not_recommend")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            recommendation === "not_recommend"
              ? "bg-red-100 text-red-700 border-2 border-red-400"
              : "bg-white text-gray-500 border-2 border-gray-200 hover:border-gray-300"
          }`}
        >
          👎 아쉬워요
        </button>
      </div>
    </div>
  );
}
