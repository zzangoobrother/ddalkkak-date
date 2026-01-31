/**
 * 카카오톡 공유 관련 유틸리티 함수
 */

import type { CourseResponse } from "@/types/course";
import type { KakaoShareOptions } from "@/types/kakao";
import { trackEvent } from "@/lib/analytics";

/**
 * 카카오 SDK 초기화 여부 확인
 */
export const isKakaoInitialized = (): boolean => {
  return typeof window !== "undefined" && window.Kakao?.isInitialized();
};

/**
 * 코스 정보를 카카오톡으로 공유
 * @param course 공유할 코스 정보
 * @returns 공유 성공 여부
 */
export const shareCourseToChatKakao = async (
  course: CourseResponse
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Analytics: 공유 클릭 이벤트
    trackEvent("course_share_clicked", {
      course_id: course.courseId,
      course_name: course.courseName,
      share_method: "kakao",
    });

    // 카카오 SDK 초기화 확인
    if (!isKakaoInitialized()) {
      throw new Error("카카오 SDK가 초기화되지 않았습니다.");
    }

    // 대표 이미지 (첫 번째 장소의 첫 번째 이미지 또는 기본 이미지)
    const defaultImageUrl =
      course.places[0]?.imageUrls?.[0] ||
      "https://via.placeholder.com/800x600?text=Ddalkkak+Date";

    // 현재 페이지 URL (실제로는 코스 상세 페이지 URL로 변경)
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/courses/${course.courseId}`
        : "";

    // 코스 요약 정보 (개선된 포맷)
    const placeCount = course.places.length;
    const placeNames = course.places.slice(0, 3).map((p) => p.name).join(" → ");
    const summary = [
      `📍 ${course.regionName}`,
      `💝 ${course.dateTypeName}`,
      `⏱️ ${formatDuration(course.totalDurationMinutes)}`,
      `🏷️ ${placeCount}곳`,
    ].join(" · ");

    // 장소 미리보기 (최대 3곳)
    const placePreview =
      placeCount > 0
        ? `\n\n${course.places
            .slice(0, 3)
            .map((p, i) => `${i + 1}. ${p.name}`)
            .join("\n")}${placeCount > 3 ? `\n...외 ${placeCount - 3}곳` : ""}`
        : "";

    // 카카오톡 공유 옵션
    const shareOptions: KakaoShareOptions = {
      objectType: "feed",
      content: {
        title: `✨ ${course.courseName}`,
        description: `${course.description || "AI가 추천하는 특별한 데이트 코스"}\n\n${summary}${placePreview}`,
        imageUrl: defaultImageUrl,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: "🎯 코스 자세히 보기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    };

    // 카카오톡 공유 실행
    window.Kakao.Share.sendDefault(shareOptions);

    // Analytics: 공유 성공 이벤트
    trackEvent("course_share_kakao_success", {
      course_id: course.courseId,
      course_name: course.courseName,
    });

    return { success: true };
  } catch (error) {
    console.error("카카오톡 공유 실패:", error);

    // Analytics: 공유 실패 이벤트
    trackEvent("course_share_kakao_failed", {
      course_id: course.courseId,
      course_name: course.courseName,
      error_message: error instanceof Error ? error.message : "알 수 없는 오류",
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    };
  }
};

/**
 * 소요시간 포맷팅 (분 -> "X시간 Y분")
 */
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}시간 ${mins}분`;
  } else if (hours > 0) {
    return `${hours}시간`;
  } else {
    return `${mins}분`;
  }
};
