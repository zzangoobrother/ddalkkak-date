/**
 * API 클라이언트 함수
 */

import type { CourseInputData, CourseResponse } from "@/types/course";

// API 베이스 URL (환경변수로 관리 가능)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
 * 임시 사용자 ID 관리 (localStorage 기반)
 * SCRUM-10에서 실제 인증으로 교체 예정
 */
function getUserId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let userId = localStorage.getItem("temp_user_id");
  if (!userId) {
    // UUID 생성
    userId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("temp_user_id", userId);
  }
  return userId;
}

/**
 * 코스 저장 API 호출
 */
export async function saveCourse(courseId: string): Promise<void> {
  const userId = getUserId();

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
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
export async function getSavedCourses(): Promise<CourseResponse[]> {
  const userId = getUserId();

  const response = await fetch(`${API_BASE_URL}/courses/saved`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `저장된 코스 조회 실패: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}
