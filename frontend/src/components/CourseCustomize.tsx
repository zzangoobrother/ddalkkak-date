"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CourseResponse, PlaceInCourse } from "@/types/course";
import { formatBudget, formatDuration } from "@/lib/utils";
import Image from "next/image";

interface CourseCustomizeProps {
  course: CourseResponse;
  onSave: (updatedCourse: CourseResponse) => void;
  onCancel: () => void;
}

interface SortablePlaceItemProps {
  place: PlaceInCourse;
  onDelete: (placeId: number) => void;
  onMoveUp: (placeId: number) => void;
  onMoveDown: (placeId: number) => void;
  onReplace: (placeId: number) => void;
  onViewMap: (place: PlaceInCourse) => void;
  onMemoChange: (placeId: number, memo: string) => void;
  isFirst: boolean;
  isLast: boolean;
  canDelete: boolean;
}

/**
 * 드래그 가능한 장소 카드 컴포넌트
 */
function SortablePlaceItem({
  place,
  onDelete,
  onMoveUp,
  onMoveDown,
  onReplace,
  onViewMap,
  onMemoChange,
  isFirst,
  isLast,
  canDelete,
}: SortablePlaceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.placeId });

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [memo, setMemo] = useState(place.memo || "");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMemoChange = (value: string) => {
    if (value.length <= 100) {
      setMemo(value);
      onMemoChange(place.placeId, value);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card rounded-xl p-6 shadow-card mb-4 relative ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      {/* 드래그 핸들 및 장소 정보 */}
      <div className="flex items-start gap-4 mb-4">
        {/* 드래그 핸들 (태블릿/데스크톱만 표시) */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="hidden md:flex flex-shrink-0 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          aria-label="장소 순서 이동"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>

        {/* 화살표 버튼 (모바일만 표시) */}
        <div className="flex md:hidden flex-col gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onMoveUp(place.placeId)}
            disabled={isFirst}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:opacity-50 rounded-lg flex items-center justify-center transition-colors"
            aria-label="위로 이동"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(place.placeId)}
            disabled={isLast}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:opacity-50 rounded-lg flex items-center justify-center transition-colors"
            aria-label="아래로 이동"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* 장소 번호 */}
        <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
          {place.sequence}
        </div>

        {/* 장소 정보 */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary mb-1">
            {place.name}
          </h3>
          <p className="text-sm text-text-secondary mb-2">{place.category}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-secondary">📍</span>
              <span className="text-text-primary">{place.address}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-text-secondary">⏱️</span>
                <span className="text-text-primary">
                  {formatDuration(place.durationMinutes)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary">💰</span>
                <span className="text-text-primary">
                  {formatBudget(place.estimatedCost)}
                </span>
              </div>
            </div>
          </div>

          {/* 장소 이미지 썸네일 */}
          {place.imageUrls && place.imageUrls.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <div className="flex gap-2">
                {place.imageUrls.slice(0, 3).map((imageUrl, imageIndex) => (
                  <div
                    key={imageIndex}
                    className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={imageUrl}
                      alt={`${place.name} 이미지 ${imageIndex + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 액션 메뉴 버튼 */}
        <div className="flex-shrink-0 relative">
          <button
            type="button"
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            aria-label="액션 메뉴"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {/* 액션 메뉴 드롭다운 */}
          {showActionMenu && (
            <>
              {/* 배경 오버레이 (클릭 시 닫기) */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActionMenu(false)}
              />
              {/* 메뉴 */}
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-20">
                <button
                  type="button"
                  onClick={() => {
                    setShowActionMenu(false);
                    onReplace(place.placeId);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  비슷한 장소로 교체
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowActionMenu(false);
                    onViewMap(place);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  지도에서 보기
                </button>
                <hr className="my-2" />
                <button
                  type="button"
                  onClick={() => {
                    setShowActionMenu(false);
                    onDelete(place.placeId);
                  }}
                  disabled={!canDelete}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 메모 입력 필드 */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          메모 (선택사항)
        </label>
        <textarea
          value={memo}
          onChange={(e) => handleMemoChange(e.target.value)}
          placeholder="이 장소에 대한 메모를 입력하세요 (최대 100자)"
          maxLength={100}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
          {memo.length}/100
        </div>
      </div>
    </div>
  );
}

/**
 * 코스 커스터마이징 컴포넌트
 */
export default function CourseCustomize({
  course,
  onSave,
  onCancel,
}: CourseCustomizeProps) {
  const [places, setPlaces] = useState<PlaceInCourse[]>(course.places);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [replaceModalPlaceId, setReplaceModalPlaceId] = useState<number | null>(
    null
  );

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동 후 드래그 시작 (클릭과 구분)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Haversine 공식으로 두 지점 간 거리 계산 (km)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // 지구 반지름 (km)
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // transportToNext 재계산 함수
  const recalculateTransportInfo = (
    places: PlaceInCourse[]
  ): PlaceInCourse[] => {
    return places.map((place, index) => {
      // 마지막 장소는 transportToNext를 빈 문자열로
      if (index === places.length - 1) {
        return { ...place, transportToNext: "" };
      }

      const nextPlace = places[index + 1];
      const distance = calculateDistance(
        place.latitude,
        place.longitude,
        nextPlace.latitude,
        nextPlace.longitude
      );

      // 거리에 따른 이동 수단 및 시간 추정
      let transport: string;
      if (distance < 0.5) {
        transport = `도보 ${Math.ceil(distance * 20)}분`;
      } else if (distance < 2) {
        transport = `도보 ${Math.ceil(distance * 15)}분`;
      } else if (distance < 5) {
        transport = `대중교통 ${Math.ceil(distance * 5)}분`;
      } else {
        transport = `대중교통 ${Math.ceil(distance * 4)}분`;
      }

      return { ...place, transportToNext: transport };
    });
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPlaces((items) => {
        const oldIndex = items.findIndex((item) => item.placeId === active.id);
        const newIndex = items.findIndex((item) => item.placeId === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // sequence 업데이트 및 transportToNext 재계산
        return recalculateTransportInfo(
          newItems.map((item, index) => ({
            ...item,
            sequence: index + 1,
          }))
        );
      });
    }
  };

  // 위로 이동 핸들러
  const handleMoveUp = (placeId: number) => {
    setPlaces((items) => {
      const index = items.findIndex((item) => item.placeId === placeId);

      if (index <= 0) return items;

      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [
        newItems[index],
        newItems[index - 1],
      ];

      return recalculateTransportInfo(
        newItems.map((item, idx) => ({
          ...item,
          sequence: idx + 1,
        }))
      );
    });
  };

  // 아래로 이동 핸들러
  const handleMoveDown = (placeId: number) => {
    setPlaces((items) => {
      const index = items.findIndex((item) => item.placeId === placeId);

      if (index < 0 || index >= items.length - 1) return items;

      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [
        newItems[index + 1],
        newItems[index],
      ];

      return recalculateTransportInfo(
        newItems.map((item, idx) => ({
          ...item,
          sequence: idx + 1,
        }))
      );
    });
  };

  // 장소 삭제 핸들러
  const handleDeletePlace = (placeId: number) => {
    if (places.length <= 2) {
      alert("최소 2개 이상의 장소가 필요합니다.");
      return;
    }

    if (confirm("이 장소를 삭제하시겠습니까?")) {
      const newPlaces = recalculateTransportInfo(
        places
          .filter((p) => p.placeId !== placeId)
          .map((item, index) => ({
            ...item,
            sequence: index + 1,
          }))
      );
      setPlaces(newPlaces);
    }
  };

  // 장소 교체 핸들러
  const handleReplacePlace = (placeId: number) => {
    setReplaceModalPlaceId(placeId);
  };

  // 지도에서 보기 핸들러
  const handleViewMap = (place: PlaceInCourse) => {
    // Kakao/Naver 지도로 링크
    const kakaoMapUrl = `https://map.kakao.com/link/map/${place.name},${place.latitude},${place.longitude}`;
    window.open(kakaoMapUrl, "_blank");
  };

  // 메모 변경 핸들러
  const handleMemoChange = (placeId: number, memo: string) => {
    setPlaces((items) =>
      items.map((item) =>
        item.placeId === placeId ? { ...item, memo } : item
      )
    );
  };

  // 장소 추가 핸들러
  const handleAddPlace = () => {
    if (places.length >= 5) {
      alert("최대 5개까지 장소를 추가할 수 있습니다.");
      return;
    }
    setIsAddingPlace(true);
  };

  // 저장 핸들러
  const handleSave = () => {
    if (places.length < 2) {
      alert("최소 2개 이상의 장소가 필요합니다.");
      return;
    }
    if (places.length > 5) {
      alert("최대 5개까지 장소를 추가할 수 있습니다.");
      return;
    }

    const updatedCourse: CourseResponse = {
      ...course,
      places,
      totalDurationMinutes: places.reduce(
        (sum, p) => sum + p.durationMinutes,
        0
      ),
      totalBudget: places.reduce((sum, p) => sum + p.estimatedCost, 0),
    };
    onSave(updatedCourse);
  };

  // 총 소요시간 및 예산 계산
  const totalDuration = places.reduce((sum, p) => sum + p.durationMinutes, 0);
  const totalBudget = places.reduce((sum, p) => sum + p.estimatedCost, 0);

  // Mock 추천 장소 데이터
  const mockSimilarPlaces: PlaceInCourse[] = [
    {
      placeId: 999,
      name: "비슷한 카페 1",
      category: "카페",
      address: "서울 마포구 홍대입구",
      latitude: 37.5563,
      longitude: 126.9241,
      durationMinutes: 60,
      estimatedCost: 15000,
      recommendedMenu: "아메리카노",
      sequence: 1,
      transportToNext: "",
      description: "조용한 분위기의 카페",
    },
    {
      placeId: 998,
      name: "비슷한 카페 2",
      category: "카페",
      address: "서울 마포구 연남동",
      latitude: 37.5665,
      longitude: 126.9233,
      durationMinutes: 60,
      estimatedCost: 12000,
      recommendedMenu: "라떼",
      sequence: 1,
      transportToNext: "",
      description: "감성 있는 인테리어",
    },
  ];

  const mockRecommendedPlaces: PlaceInCourse[] = [
    {
      placeId: 997,
      name: "추천 레스토랑",
      category: "이탈리안",
      address: "서울 마포구 연남동",
      latitude: 37.5665,
      longitude: 126.9233,
      durationMinutes: 90,
      estimatedCost: 35000,
      recommendedMenu: "파스타",
      sequence: 1,
      transportToNext: "",
      description: "로맨틱한 분위기",
    },
    {
      placeId: 996,
      name: "추천 카페",
      category: "카페",
      address: "서울 마포구 홍대입구",
      latitude: 37.5563,
      longitude: 126.9241,
      durationMinutes: 60,
      estimatedCost: 15000,
      recommendedMenu: "아메리카노",
      sequence: 1,
      transportToNext: "",
      description: "루프탑 뷰가 멋진 곳",
    },
  ];

  const replacePlace = places.find((p) => p.placeId === replaceModalPlaceId);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onCancel}
            className="mb-4 flex items-center gap-2 text-text-secondary hover:text-text-primary"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            뒤로 가기
          </button>

          <h1 className="text-2xl font-bold text-text-primary mb-2">
            코스 수정하기
          </h1>
          <p className="text-text-secondary">
            <span className="hidden md:inline">
              장소를 드래그하여 순서를 변경하거나
            </span>
            <span className="md:hidden">
              화살표 버튼으로 순서를 변경하거나
            </span>
            , 액션 메뉴로 장소를 관리할 수 있습니다.
          </p>
        </div>

        {/* 코스 요약 */}
        <div className="bg-card rounded-xl p-6 shadow-card mb-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">
            {course.courseName}
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-text-secondary mb-1">
                총 소요시간
              </div>
              <div className="font-semibold text-text-primary">
                ⏱️ {formatDuration(totalDuration)}
              </div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-1">총 예산</div>
              <div className="font-semibold text-text-primary">
                💰 {formatBudget(totalBudget)}
              </div>
            </div>
          </div>
          <div className="text-sm text-text-secondary">
            장소 개수: {places.length}/5 (최소 2개, 최대 5개)
          </div>
        </div>

        {/* 장소 목록 (드래그 앤 드롭) */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={places.map((p) => p.placeId)}
            strategy={verticalListSortingStrategy}
          >
            {places.map((place, index) => (
              <SortablePlaceItem
                key={place.placeId}
                place={place}
                onDelete={handleDeletePlace}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onReplace={handleReplacePlace}
                onViewMap={handleViewMap}
                onMemoChange={handleMemoChange}
                isFirst={index === 0}
                isLast={index === places.length - 1}
                canDelete={places.length > 2}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* 장소 추가 버튼 */}
        <button
          type="button"
          onClick={handleAddPlace}
          disabled={places.length >= 5}
          className="w-full py-4 mb-6 rounded-xl font-semibold text-primary border-2 border-primary hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ➕ 새 장소 추가 {places.length >= 5 && "(최대 5개)"}
        </button>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            저장하기
          </button>
        </div>
      </div>

      {/* 장소 교체 모달 */}
      {replaceModalPlaceId !== null && replacePlace && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setReplaceModalPlaceId(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">장소 교체</h3>
            <p className="text-sm text-gray-600 mb-4">
              &quot;{replacePlace.name}&quot;와(과) 비슷한 장소로 교체합니다.
            </p>

            {/* 비슷한 장소 리스트 */}
            <div className="space-y-3">
              {mockSimilarPlaces.map((place) => (
                <button
                  key={place.placeId}
                  type="button"
                  onClick={() => {
                    setPlaces((items) =>
                      recalculateTransportInfo(
                        items.map((item) =>
                          item.placeId === replaceModalPlaceId
                            ? { ...place, placeId: item.placeId, sequence: item.sequence }
                            : item
                        )
                      )
                    );
                    setReplaceModalPlaceId(null);
                  }}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors text-left"
                >
                  <h4 className="font-bold text-text-primary mb-1">
                    {place.name}
                  </h4>
                  <p className="text-sm text-text-secondary mb-2">
                    {place.category}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span>⏱️ {formatDuration(place.durationMinutes)}</span>
                    <span>💰 {formatBudget(place.estimatedCost)}</span>
                  </div>
                  {place.description && (
                    <p className="text-xs text-gray-500 mt-2">
                      {place.description}
                    </p>
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setReplaceModalPlaceId(null)}
              className="w-full mt-4 py-3 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 장소 추가 모달 */}
      {isAddingPlace && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsAddingPlace(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">장소 추가</h3>
            <p className="text-sm text-gray-600 mb-4">
              추천 장소 중 하나를 선택해주세요.
            </p>

            {/* 추천 장소 리스트 */}
            <div className="space-y-3">
              {mockRecommendedPlaces.map((place) => (
                <button
                  key={place.placeId}
                  type="button"
                  onClick={() => {
                    const newPlace = {
                      ...place,
                      placeId: Date.now() + Math.random(),
                      sequence: places.length + 1,
                    };
                    setPlaces((items) =>
                      recalculateTransportInfo([...items, newPlace])
                    );
                    setIsAddingPlace(false);
                  }}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors text-left"
                >
                  <h4 className="font-bold text-text-primary mb-1">
                    {place.name}
                  </h4>
                  <p className="text-sm text-text-secondary mb-2">
                    {place.category}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span>⏱️ {formatDuration(place.durationMinutes)}</span>
                    <span>💰 {formatBudget(place.estimatedCost)}</span>
                  </div>
                  {place.description && (
                    <p className="text-xs text-gray-500 mt-2">
                      {place.description}
                    </p>
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsAddingPlace(false)}
              className="w-full mt-4 py-3 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
