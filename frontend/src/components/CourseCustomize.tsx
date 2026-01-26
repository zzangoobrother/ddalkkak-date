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
}

/**
 * 드래그 가능한 장소 카드 컴포넌트
 */
function SortablePlaceItem({ place, onDelete }: SortablePlaceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.placeId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card rounded-xl p-6 shadow-card mb-4 ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      {/* 드래그 핸들 및 장소 정보 */}
      <div className="flex items-start gap-4">
        {/* 드래그 핸들 */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex-shrink-0 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
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

        {/* 삭제 버튼 */}
        <button
          type="button"
          onClick={() => onDelete(place.placeId)}
          className="flex-shrink-0 w-10 h-10 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center text-red-600 transition-colors"
          aria-label={`${place.name} 삭제`}
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
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

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPlaces((items) => {
        const oldIndex = items.findIndex((item) => item.placeId === active.id);
        const newIndex = items.findIndex((item) => item.placeId === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // sequence 업데이트
        return newItems.map((item, index) => ({
          ...item,
          sequence: index + 1,
        }));
      });
    }
  };

  // 장소 삭제 핸들러
  const handleDeletePlace = (placeId: number) => {
    if (places.length <= 1) {
      alert("최소 1개 이상의 장소가 필요합니다.");
      return;
    }

    if (confirm("이 장소를 삭제하시겠습니까?")) {
      const newPlaces = places
        .filter((p) => p.placeId !== placeId)
        .map((item, index) => ({
          ...item,
          sequence: index + 1,
        }));
      setPlaces(newPlaces);
    }
  };

  // 저장 핸들러
  const handleSave = () => {
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
            장소를 드래그하여 순서를 변경하거나, 삭제할 수 있습니다.
          </p>
        </div>

        {/* 코스 요약 */}
        <div className="bg-card rounded-xl p-6 shadow-card mb-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">
            {course.courseName}
          </h2>
          <div className="grid grid-cols-2 gap-4">
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
            {places.map((place) => (
              <SortablePlaceItem
                key={place.placeId}
                place={place}
                onDelete={handleDeletePlace}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* 장소 추가 버튼 */}
        <button
          type="button"
          onClick={() => setIsAddingPlace(true)}
          className="w-full py-4 mb-6 rounded-xl font-semibold text-primary border-2 border-primary hover:bg-primary-light transition-colors"
        >
          ➕ 새 장소 추가
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

      {/* 장소 추가 모달 (추후 구현) */}
      {isAddingPlace && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsAddingPlace(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">장소 추가</h3>
            <p className="text-gray-600 mb-4">
              장소 추가 기능은 백엔드 API 연동 후 구현 예정입니다.
            </p>
            <button
              type="button"
              onClick={() => setIsAddingPlace(false)}
              className="w-full py-3 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
