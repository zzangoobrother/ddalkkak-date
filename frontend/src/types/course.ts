/**
 * 코스 생성 입력 관련 타입 정의
 */

// 데이트 유형 ID
export type DateTypeId =
  | "dinner"
  | "cafe"
  | "culture"
  | "activity"
  | "night"
  | "special";

// 데이트 유형 정보
export interface DateType {
  id: DateTypeId;
  name: string; // 표시 이름 (예: '저녁 식사 데이트')
  emoji: string; // 아이콘 이모지
  description: string; // 설명 (예: '로맨틱한 분위기의 레스토랑과 야경 중심')
}

// 예산 프리셋 ID
export type BudgetPresetId =
  | "under30k"
  | "30k-50k"
  | "50k-100k"
  | "100k-150k"
  | "custom";

// 예산 프리셋 정보
export interface BudgetPreset {
  id: BudgetPresetId;
  label: string; // 표시 라벨 (예: '3만원 이하')
  tagline: string; // 태그라인 (예: '부담없이')
  minAmount: number; // 최소 금액 (원)
  maxAmount: number; // 최대 금액 (원)
}

// 예산 선택 상태
export interface BudgetSelection {
  presetId: BudgetPresetId;
  customAmount?: number; // 직접 입력 시 금액
}

// 코스 생성 입력 데이터
export interface CourseInputData {
  regionId: string;
  dateTypeId: DateTypeId;
  budget: BudgetSelection;
}

// 코스 생성 스텝
export type CourseInputStep = 1 | 2 | 3;

// 코스 입력 폼 상태
export interface CourseInputState {
  currentStep: CourseInputStep;
  regionId: string | null;
  dateTypeId: DateTypeId | null;
  budget: BudgetSelection | null;
}

// 코스 내 장소 정보
export interface PlaceInCourse {
  placeId: number;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  durationMinutes: number;
  estimatedCost: number;
  recommendedMenu: string;
  sequence: number;
  transportToNext: string;
  imageUrls?: string[]; // 장소 이미지 URL 목록 (최대 3장)
  openingHours?: string; // 영업시간
  needsReservation?: boolean; // 예약 필요 여부
  rating?: number; // 평점 (0.0 ~ 5.0)
  reviewCount?: number; // 리뷰 수
}

// 코스 생성 응답
export interface CourseResponse {
  courseId: string;
  courseName: string;
  regionId: string;
  regionName: string;
  dateTypeId: string;
  dateTypeName: string;
  totalDurationMinutes: number;
  totalBudget: number;
  description: string;
  places: PlaceInCourse[];
  createdAt: number;
  status?: string; // "DRAFT" | "SAVED" | "CONFIRMED"
  confirmedAt?: number; // timestamp
}
