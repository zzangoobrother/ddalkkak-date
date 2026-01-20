"use client";

import { useState, useCallback } from "react";
import type { Region, SelectionMethod } from "@/types/region";
import { SEOUL_DATE_REGIONS } from "@/lib/constants";
import RegionCard from "@/components/RegionCard";
import SearchModal from "@/components/SearchModal";
import { trackEvent } from "@/lib/analytics";

interface DateMapProps {
  onRegionSelect?: (region: Region, method: SelectionMethod) => void;
  onNext?: (region: Region) => void;
}

export default function DateMap({ onRegionSelect, onNext }: DateMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // 지역 선택 핸들러
  const handleRegionSelect = useCallback(
    (region: Region, method: SelectionMethod = "map_card") => {
      // 이미 선택된 지역을 다시 클릭하면 선택 해제
      if (selectedRegion?.id === region.id) {
        setSelectedRegion(null);
        return;
      }

      setSelectedRegion(region);

      // Analytics 이벤트 전송
      trackEvent("region_selected", {
        region_id: region.id,
        region_name: region.name,
        selection_method: method,
        is_hot_region: region.hot,
        available_courses: region.availableCourses,
      });

      if (region.hot) {
        trackEvent("hot_region_clicked", {
          region_id: region.id,
        });
      }

      onRegionSelect?.(region, method);
    },
    [selectedRegion, onRegionSelect]
  );

  // 검색 모달 열기
  const handleSearchOpen = () => {
    setIsSearchModalOpen(true);
  };

  // 검색 결과 선택
  const handleSearchSelect = (region: Region) => {
    setIsSearchModalOpen(false);
    handleRegionSelect(region, "search");
  };

  // 현재 위치 기반 지역 찾기
  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
      return;
    }

    setIsLocationLoading(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      // 실제 구현에서는 좌표 기반으로 가장 가까운 지역을 찾아야 함
      // MVP에서는 간단히 첫 번째 Hot 지역을 추천
      const nearestRegion =
        SEOUL_DATE_REGIONS.find((r) => r.hot) || SEOUL_DATE_REGIONS[0];

      handleRegionSelect(nearestRegion, "gps");

      trackEvent("location_used", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        selected_region: nearestRegion.id,
      });
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("위치 권한이 거부되었습니다. 설정에서 허용해주세요.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("위치 정보를 가져올 수 없습니다.");
            break;
          case error.TIMEOUT:
            alert("위치 요청 시간이 초과되었습니다.");
            break;
        }
      }
    } finally {
      setIsLocationLoading(false);
    }
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (selectedRegion) {
      onNext?.(selectedRegion);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          서울 데이트 맵
        </h1>
        <p className="text-sm text-text-secondary">
          데이트하고 싶은 지역을 선택하세요
        </p>
      </div>

      {/* 검색 & 현재위치 버튼 */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={handleSearchOpen}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          aria-label="지역 검색"
        >
          <svg
            className="w-5 h-5 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-sm text-text-secondary">지역 검색</span>
        </button>

        <button
          type="button"
          onClick={handleLocationClick}
          disabled={isLocationLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="현재 위치로 지역 찾기"
        >
          {isLocationLoading ? (
            <svg
              className="w-5 h-5 text-text-secondary animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
          <span className="text-sm text-text-secondary hidden sm:inline">
            현재 위치
          </span>
        </button>
      </div>

      {/* 3x4 그리드 */}
      <div
        className="grid grid-cols-3 gap-2 sm:gap-3 mb-4"
        role="listbox"
        aria-label="서울 데이트 지역 선택"
      >
        {SEOUL_DATE_REGIONS.map((region) => (
          <RegionCard
            key={region.id}
            region={region}
            isSelected={selectedRegion?.id === region.id}
            isOtherSelected={
              selectedRegion !== null && selectedRegion.id !== region.id
            }
            onSelect={(r) => handleRegionSelect(r, "map_card")}
          />
        ))}
      </div>

      {/* 선택된 지역 정보 */}
      <div
        className={`
          p-4 rounded-xl bg-primary-light mb-4 transition-all duration-300
          ${selectedRegion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
        `}
        aria-live="polite"
      >
        {selectedRegion && (
          <p className="text-sm text-text-primary">
            <span className="font-semibold">{selectedRegion.name}</span>에서{" "}
            <span className="font-semibold text-primary">
              {selectedRegion.availableCourses}개
            </span>{" "}
            데이트 코스가 다른 커플들에게 사랑받고 있어요!
          </p>
        )}
      </div>

      {/* 다음 버튼 */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!selectedRegion}
        className={`
          w-full py-4 rounded-xl font-semibold text-white transition-all duration-200
          ${
            selectedRegion
              ? "bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl"
              : "bg-gray-300 cursor-not-allowed"
          }
        `}
        aria-label={
          selectedRegion
            ? `${selectedRegion.name} 선택 후 다음 단계로`
            : "지역을 선택해주세요"
        }
      >
        {selectedRegion ? "다음" : "지역을 선택해주세요"}
      </button>

      {/* 검색 모달 */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={handleSearchSelect}
      />
    </div>
  );
}
