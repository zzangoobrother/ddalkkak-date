/**
 * API 클라이언트 함수
 */

import type { CourseInputData, CourseResponse } from "@/types/course";
import { useAuthStore } from "@/store/authStore";
import { refreshAccessToken } from "@/lib/auth";

// API 베이스 URL (환경변수로 관리 가능)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * 인증이 필요한 API 호출 헬퍼 (자동 토큰 갱신 지원)
 */
async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const state = useAuthStore.getState();
  const accessToken = state.tokens?.accessToken;
  const refreshToken = state.tokens?.refreshToken;

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  // Authorization 헤더 추가
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  // 첫 번째 요청
  let response = await fetch(url, { ...options, headers });

  // 401 에러 시 토큰 갱신 시도
  if (response.status === 401 && refreshToken) {
    try {
      // Refresh Token으로 새로운 Access Token 발급
      const newTokens = await refreshAccessToken(refreshToken);

      // 새로운 토큰 저장
      state.refreshTokens(newTokens);

      // 새로운 Access Token으로 재시도
      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${newTokens.accessToken}`,
      };

      response = await fetch(url, { ...options, headers: retryHeaders });
    } catch (error) {
      // Refresh Token도 만료되었으면 로그아웃
      console.error("토큰 갱신 실패:", error);
      state.logout();
      throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

  return response;
}

/**
 * 코스 생성 API 호출
 */
export async function generateCourse(
  inputData: CourseInputData
): Promise<CourseResponse> {
  const requestBody = {
    regionId: inputData.regionId,
    dateTypeId: inputData.dateTypeId,
    budgetPresetId: inputData.budget.presetId,
    customAmount: inputData.budget.customAmount,
  };

  const response = await fetch(`${API_BASE_URL}/courses/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `코스 생성 실패: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

/**
 * 추가 코스 추천 API 호출 (더 추천받기)
 */
export async function generateMoreCourses(
  inputData: CourseInputData
): Promise<CourseResponse> {
  // 동일한 입력으로 새로운 코스 생성
  return generateCourse(inputData);
}

/**
 * 여러 코스를 한 번에 생성 (3개)
 */
export async function generateMultipleCourses(
  inputData: CourseInputData
): Promise<CourseResponse[]> {
  // 병렬로 3개의 코스 생성 요청
  const promises = Array.from({ length: 3 }, () => generateCourse(inputData));
  return Promise.all(promises);
}

/**
 * 코스 저장 API 호출
 */
export async function saveCourse(courseId: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/courses/${courseId}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `코스 저장 실패: ${response.statusText}`);
  }
}

/**
 * 저장된 코스 목록 조회 API 호출
 */
export async function getSavedCourses(
  status?: "CONFIRMED" | "SAVED"
): Promise<CourseResponse[]> {
  const queryParam = status ? `?status=${status}` : "";

  const response = await fetchWithAuth(
    `${API_BASE_URL}/courses/saved${queryParam}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `저장된 코스 조회 실패: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

/**
 * 코스 확정
 */
export async function confirmCourse(courseId: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/courses/${courseId}/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `코스 확정 실패: ${response.statusText}`);
  }
}

/**
 * 코스 삭제
 */
export async function deleteCourse(courseId: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/courses/${courseId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `코스 삭제 실패: ${response.statusText}`);
  }
}

/**
 * 코스 평가 (별점 부여)
 */
export async function rateCourse(courseId: string, rating: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/courses/${courseId}/rate?rating=${rating}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `코스 평가 실패: ${response.statusText}`);
  }
}
