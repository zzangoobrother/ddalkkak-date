"use client";

import CourseResult from "@/components/CourseResult";
import type { CourseResponse } from "@/types/course";

// Mock 데이터
const mockCourses: CourseResponse[] = [
  {
    courseId: "test-share-course-123",
    courseName: "마포·홍대 카페 데이트",
    regionId: "mapo",
    regionName: "마포·홍대",
    dateTypeId: "cafe",
    dateTypeName: "카페 & 디저트",
    totalDurationMinutes: 150,
    totalBudget: 45000,
    description: "홍대 감성 카페를 즐기는 달콤한 데이트 코스입니다.",
    createdAt: Date.now(),
    places: [
      {
        placeId: 1,
        name: "감성 카페 루나",
        category: "카페",
        address: "서울 마포구 홍익로 123",
        latitude: 37.5563,
        longitude: 126.9241,
        durationMinutes: 60,
        estimatedCost: 18000,
        recommendedMenu: "시그니처 라떼",
        sequence: 1,
        transportToNext: "도보 10분",
        imageUrls: ["https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Cafe+Luna"],
        openingHours: "10:00 - 22:00",
        needsReservation: false,
        rating: 4.5,
        reviewCount: 245,
      },
      {
        placeId: 2,
        name: "디저트 공방",
        category: "디저트",
        address: "서울 마포구 홍익로 456",
        latitude: 37.5573,
        longitude: 126.9251,
        durationMinutes: 50,
        estimatedCost: 15000,
        recommendedMenu: "딸기 타르트",
        sequence: 2,
        transportToNext: "도보 5분",
        imageUrls: ["https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Dessert"],
        openingHours: "12:00 - 21:00",
        needsReservation: false,
        rating: 4.7,
        reviewCount: 189,
      },
      {
        placeId: 3,
        name: "루프탑 카페 스카이",
        category: "카페",
        address: "서울 마포구 와우산로 789",
        latitude: 37.5583,
        longitude: 126.9261,
        durationMinutes: 40,
        estimatedCost: 12000,
        recommendedMenu: "아메리카노",
        sequence: 3,
        transportToNext: "",
        imageUrls: ["https://via.placeholder.com/300x200/95E1D3/FFFFFF?text=Rooftop"],
        openingHours: "11:00 - 23:00",
        needsReservation: false,
        rating: 4.8,
        reviewCount: 312,
      },
    ],
  },
];

export default function TestSharePage() {
  return (
    <CourseResult
      courses={mockCourses}
      onReset={() => console.log("Reset clicked")}
      onGenerateMore={() => console.log("Generate more clicked")}
    />
  );
}
