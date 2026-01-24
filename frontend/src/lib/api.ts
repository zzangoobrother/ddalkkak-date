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
