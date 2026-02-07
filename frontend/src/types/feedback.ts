/**
 * 피드백 관련 타입 정의
 */

// 피드백 선택 옵션 (좋았던 점 / 아쉬운 점)
export interface FeedbackOption {
  id: string;
  label: string;
  emoji: string;
}

// 장소 추천/비추 타입
export type PlaceRecommendation = "recommend" | "not_recommend" | null;

// 장소별 평가
export interface PlaceRating {
  placeId: number;
  placeName: string;
  category: string;
  recommendation: PlaceRecommendation;
}

// 피드백 제출 데이터
export interface FeedbackSubmitData {
  courseId: string;
  overallRating: number; // 1~5
  positiveOptions: string[]; // 선택된 좋았던 점 ID 배열
  negativeOptions: string[]; // 선택된 아쉬운 점 ID 배열
  placeRatings: PlaceRating[];
  freeText: string;
}
