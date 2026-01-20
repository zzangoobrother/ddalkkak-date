/**
 * 서울 데이트 맵 상수 정의
 */

import type { Region } from "@/types/region";

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
