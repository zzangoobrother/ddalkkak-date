/**
 * Analytics 이벤트 트래킹 유틸리티
 *
 * MVP에서는 콘솔 로깅으로 구현하고,
 * 추후 Google Analytics, Mixpanel 등으로 교체 가능
 */

// 이벤트 타입 정의
export type AnalyticsEvent =
  // Step 1: 지역 선택 관련
  | "date_map_viewed"
  | "region_selected"
  | "hot_region_clicked"
  | "location_used"
  | "search_opened"
  | "search_completed"
  // Step 2: 데이트 유형 선택 관련
  | "date_type_selected"
  // Step 3: 예산 선택 관련
  | "budget_selected"
  // 네비게이션 관련
  | "next_step_clicked"
  | "back_step_clicked"
  | "step_completed"
  // 코스 입력 관련
  | "course_input_started"
  | "course_input_completed"
  | "course_input_reset"
  | "course_generation_requested";

// 이벤트 속성 타입
export interface AnalyticsEventProperties {
  // region_selected 이벤트
  region_id?: string;
  region_name?: string;
  selection_method?: "map_card" | "search" | "gps";
  is_hot_region?: boolean;
  available_courses?: number;

  // location_used 이벤트
  latitude?: number;
  longitude?: number;
  selected_region?: string;

  // 일반 속성
  [key: string]: unknown;
}

// 개발 환경 여부 확인
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Analytics 이벤트 전송
 *
 * @param eventName - 이벤트 이름
 * @param properties - 이벤트 속성 (선택사항)
 */
export function trackEvent(
  eventName: AnalyticsEvent,
  properties?: AnalyticsEventProperties
): void {
  // 개발 환경에서는 콘솔에 로깅
  if (isDevelopment) {
    console.log(`[Analytics] ${eventName}`, properties || {});
  }

  // TODO: 실제 Analytics 서비스 연동
  // 예: Google Analytics 4
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', eventName, properties);
  // }

  // 예: Mixpanel
  // if (typeof window !== 'undefined' && window.mixpanel) {
  //   window.mixpanel.track(eventName, properties);
  // }
}

/**
 * 페이지 뷰 트래킹
 *
 * @param pageName - 페이지 이름
 * @param pageUrl - 페이지 URL (선택사항)
 */
export function trackPageView(pageName: string, pageUrl?: string): void {
  if (isDevelopment) {
    console.log(`[Analytics] Page View: ${pageName}`, { url: pageUrl });
  }

  // TODO: 실제 Analytics 서비스 연동
}

/**
 * 사용자 식별 (로그인 시)
 *
 * @param userId - 사용자 ID
 * @param traits - 사용자 특성 (선택사항)
 */
export function identifyUser(
  userId: string,
  traits?: Record<string, unknown>
): void {
  if (isDevelopment) {
    console.log(`[Analytics] Identify User: ${userId}`, traits || {});
  }

  // TODO: 실제 Analytics 서비스 연동
}
