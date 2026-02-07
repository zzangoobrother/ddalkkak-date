/**
 * 서울 데이트 맵 상수 정의
 */

import type { Region } from "@/types/region";
import type { DateType, BudgetPreset } from "@/types/course";
import type { FeedbackOption } from "@/types/feedback";

// 서울 12개 데이트 지역 데이터
export const SEOUL_DATE_REGIONS: Region[] = [
  // Row 1: 북부
  {
    id: "jongno",
    name: "종로·광화문",
    emoji: "🏛️",
    availableCourses: 8,
    tagline: "역사와 감성",
    hot: false,
    position: { row: 1, col: 1 },
  },
  {
    id: "seongbuk",
    name: "성북·혜화",
    emoji: "🌳",
    availableCourses: 6,
    tagline: "문화와 예술",
    hot: false,
    position: { row: 1, col: 2 },
  },
  {
    id: "junggu",
    name: "중구·명동",
    emoji: "🏢",
    availableCourses: 12,
    tagline: "도심 속 데이트",
    hot: false,
    position: { row: 1, col: 3 },
  },

  // Row 2: 중부 (Hot 지역 포함)
  {
    id: "mapo",
    name: "마포·홍대",
    emoji: "🎨",
    availableCourses: 15,
    tagline: "힙한 감성",
    hot: true,
    position: { row: 2, col: 1 },
  },
  {
    id: "yongsan",
    name: "용산·이태원",
    emoji: "🗼",
    availableCourses: 10,
    tagline: "이국적 분위기",
    hot: false,
    position: { row: 2, col: 2 },
  },
  {
    id: "gangnam",
    name: "강남·역삼",
    emoji: "💼",
    availableCourses: 18,
    tagline: "세련된 데이트",
    hot: true,
    position: { row: 2, col: 3 },
  },

  // Row 3: 동부 (Hot 지역 포함)
  {
    id: "seongdong",
    name: "성동·성수",
    emoji: "🏭",
    availableCourses: 12,
    tagline: "핫플 성지",
    hot: true,
    position: { row: 3, col: 1 },
  },
  {
    id: "gwangjin",
    name: "광진·건대",
    emoji: "🎓",
    availableCourses: 9,
    tagline: "활기찬 분위기",
    hot: false,
    position: { row: 3, col: 2 },
  },
  {
    id: "songpa",
    name: "송파·잠실",
    emoji: "🎢",
    availableCourses: 11,
    tagline: "놀거리 가득",
    hot: false,
    position: { row: 3, col: 3 },
  },

  // Row 4: 서남부
  {
    id: "yeongdeungpo",
    name: "영등포·여의도",
    emoji: "🏙️",
    availableCourses: 7,
    tagline: "한강뷰 맛집",
    hot: false,
    position: { row: 4, col: 1 },
  },
  {
    id: "seocho",
    name: "서초·교대",
    emoji: "🌸",
    availableCourses: 10,
    tagline: "조용한 데이트",
    hot: false,
    position: { row: 4, col: 2 },
  },
  {
    id: "gangdong",
    name: "강동·천호",
    emoji: "🌊",
    availableCourses: 5,
    tagline: "한강 산책",
    hot: false,
    position: { row: 4, col: 3 },
  },
];

// 그리드 설정
export const GRID_CONFIG = {
  rows: 4,
  cols: 3,
} as const;

// Hot 지역 목록 (빠른 참조용)
export const HOT_REGIONS = SEOUL_DATE_REGIONS.filter((region) => region.hot);

// 지역 ID로 빠른 조회를 위한 맵
export const REGION_MAP = new Map<string, Region>(
  SEOUL_DATE_REGIONS.map((region) => [region.id, region])
);

// ============================================
// 데이트 유형 상수
// ============================================

// 6가지 데이트 유형 카테고리
export const DATE_TYPES: DateType[] = [
  {
    id: "dinner",
    name: "저녁 식사 데이트",
    emoji: "🍽️",
    description: "로맨틱한 분위기의 레스토랑과 야경 중심",
  },
  {
    id: "cafe",
    name: "카페 & 디저트",
    emoji: "☕",
    description: "달콤한 디저트와 함께하는 여유로운 시간",
  },
  {
    id: "culture",
    name: "문화·전시",
    emoji: "🎨",
    description: "함께 감상하며 대화 나누기 좋은 코스",
  },
  {
    id: "activity",
    name: "액티비티·체험",
    emoji: "🏃",
    description: "함께 즐기는 특별한 경험",
  },
  {
    id: "night",
    name: "야경·산책",
    emoji: "🌃",
    description: "밤의 서울을 걸으며 낭만적인 시간",
  },
  {
    id: "special",
    name: "특별한 날",
    emoji: "🎁",
    description: "기념일, 생일에 어울리는 특별한 코스",
  },
];

// 데이트 유형 ID로 빠른 조회를 위한 맵
export const DATE_TYPE_MAP = new Map<string, DateType>(
  DATE_TYPES.map((type) => [type.id, type])
);

// ============================================
// 예산 프리셋 상수
// ============================================

// 5가지 예산 프리셋 옵션
export const BUDGET_PRESETS: BudgetPreset[] = [
  {
    id: "under30k",
    label: "3만원 이하",
    tagline: "부담없이",
    minAmount: 0,
    maxAmount: 30000,
  },
  {
    id: "30k-50k",
    label: "3-5만원",
    tagline: "가볍게",
    minAmount: 30000,
    maxAmount: 50000,
  },
  {
    id: "50k-100k",
    label: "5-10만원",
    tagline: "알차게",
    minAmount: 50000,
    maxAmount: 100000,
  },
  {
    id: "100k-150k",
    label: "10-15만원",
    tagline: "특별하게",
    minAmount: 100000,
    maxAmount: 150000,
  },
  {
    id: "custom",
    label: "직접 입력",
    tagline: "내 맘대로",
    minAmount: 10000,
    maxAmount: 500000,
  },
];

// 예산 프리셋 ID로 빠른 조회를 위한 맵
export const BUDGET_PRESET_MAP = new Map<string, BudgetPreset>(
  BUDGET_PRESETS.map((preset) => [preset.id, preset])
);

// 슬라이더 설정
export const BUDGET_SLIDER_CONFIG = {
  min: 10000, // 최소 1만원
  max: 500000, // 최대 50만원
  step: 5000, // 5천원 단위
  defaultValue: 50000, // 기본값 5만원
} as const;

// ============================================
// 피드백 옵션 상수
// ============================================

// 좋았던 점 옵션
export const POSITIVE_FEEDBACK_OPTIONS: FeedbackOption[] = [
  { id: "good_route", label: "코스 동선이 좋았어요", emoji: "🚶" },
  { id: "good_places", label: "장소 선택이 좋았어요", emoji: "📍" },
  { id: "good_budget", label: "예산에 딱 맞았어요", emoji: "💰" },
  { id: "good_vibe", label: "분위기가 좋았어요", emoji: "✨" },
  { id: "good_food", label: "맛집이 맛있었어요", emoji: "🍽️" },
  { id: "good_experience", label: "특별한 경험이었어요", emoji: "🎉" },
  { id: "good_time", label: "시간 배분이 좋았어요", emoji: "⏰" },
];

// 아쉬운 점 옵션
export const NEGATIVE_FEEDBACK_OPTIONS: FeedbackOption[] = [
  { id: "bad_route", label: "동선이 불편했어요", emoji: "😵" },
  { id: "bad_closed", label: "영업하지 않는 곳이 있었어요", emoji: "🚫" },
  { id: "bad_budget", label: "예산을 초과했어요", emoji: "💸" },
  { id: "bad_crowded", label: "너무 붐볐어요", emoji: "👥" },
  { id: "bad_info", label: "정보가 부족했어요", emoji: "❓" },
  { id: "bad_taste", label: "취향에 안 맞았어요", emoji: "😅" },
  { id: "bad_distance", label: "이동 거리가 길었어요", emoji: "🚗" },
]

// 자유 텍스트 최대 글자 수
export const FEEDBACK_TEXT_MAX_LENGTH = 100;
