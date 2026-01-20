/**
 * 서울 데이트 맵 지역 관련 타입 정의
 */

// 그리드 위치 타입
export interface GridPosition {
  row: number; // 1-4
  col: number; // 1-3
}

// 지역 타입
export interface Region {
  id: string; // 고유 식별자 (예: 'mapo', 'gangnam')
  name: string; // 지역명 (예: '마포·홍대')
  emoji: string; // 대표 이모지 (예: '🎨')
  availableCourses: number; // 가용 코스 수
  tagline: string; // 태그라인 (예: '힙한 감성')
  hot: boolean; // Hot 지역 여부
  position: GridPosition; // 그리드 위치
}

// 지역 선택 방법
export type SelectionMethod = "map_card" | "search" | "gps";

// 지역 선택 이벤트 데이터
export interface RegionSelectionEvent {
  regionId: string;
  regionName: string;
  selectionMethod: SelectionMethod;
  isHotRegion: boolean;
  availableCourses: number;
}

// DateMap 상태
export interface DateMapState {
  selectedRegion: Region | null;
  isSearchModalOpen: boolean;
  isLocationLoading: boolean;
}

// 검색 결과 아이템
export interface SearchResultItem {
  region: Region;
  matchScore: number; // 검색어와의 매칭 점수
}
