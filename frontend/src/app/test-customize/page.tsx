"use client";

import CourseCustomize from "@/components/CourseCustomize";
import type { CourseResponse } from "@/types/course";

// Mock 데이터
const mockCourseData: CourseResponse = {
  courseId: "test-course-123",
  courseName: "강남 로맨틱 데이트",
  regionId: "gangnam",
  regionName: "강남·역삼",
  dateTypeId: "dinner",
  dateTypeName: "저녁 식사 데이트",
  totalDurationMinutes: 180,
  totalBudget: 80000,
  description: "강남 지역의 로맨틱한 저녁 데이트 코스입니다.",
  places: [
    {
      placeId: 1,
      name: "더 플레이트",
      category: "레스토랑",
      address: "서울 강남구 테헤란로 123",
      latitude: 37.5012,
      longitude: 127.0396,
      durationMinutes: 90,
      estimatedCost: 50000,
      recommendedMenu: "스테이크 세트",
      sequence: 1,
      transportToNext: "도보 10분",
      imageUrls: ["https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Restaurant"],
      openingHours: "11:00 - 22:00",
      needsReservation: true,
      rating: 4.5,
      reviewCount: 328,
    },
    {
      placeId: 2,
      name: "카페 루프탑",
      category: "카페",
      address: "서울 강남구 테헤란로 456",
      latitude: 37.5022,
      longitude: 127.0406,
      durationMinutes: 60,
      estimatedCost: 20000,
      recommendedMenu: "시그니처 라떼",
      sequence: 2,
      transportToNext: "도보 5분",
      imageUrls: ["https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Cafe"],
      openingHours: "10:00 - 23:00",
      needsReservation: false,
      rating: 4.3,
      reviewCount: 156,
    },
    {
      placeId: 3,
      name: "한강공원 산책로",
      category: "공원",
      address: "서울 강남구 영동대로 789",
      latitude: 37.5032,
      longitude: 127.0416,
      durationMinutes: 30,
      estimatedCost: 10000,
      recommendedMenu: "간식 (편의점)",
      sequence: 3,
      transportToNext: "",
      imageUrls: ["https://via.placeholder.com/300x200/95E1D3/FFFFFF?text=Park"],
      openingHours: "24시간",
      needsReservation: false,
      rating: 4.7,
      reviewCount: 892,
    },
  ],
  createdAt: Date.now(),
  status: "DRAFT",
};

export default function TestCustomizePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CourseCustomize
        course={mockCourseData}
        onSave={(updatedCourse) => {
          console.log("저장:", updatedCourse);
          alert("코스가 저장되었습니다!");
        }}
        onCancel={() => {
          console.log("취소됨");
        }}
      />
    </div>
  );
}
