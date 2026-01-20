"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { Region } from "@/types/region";
import { SEOUL_DATE_REGIONS } from "@/lib/constants";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (region: Region) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelect,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 검색 결과 필터링
  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) {
      return SEOUL_DATE_REGIONS;
    }

    const query = searchQuery.toLowerCase().trim();
    return SEOUL_DATE_REGIONS.filter(
      (region) =>
        region.name.toLowerCase().includes(query) ||
        region.tagline.toLowerCase().includes(query) ||
        region.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // 모달 열릴 때 입력 필드에 포커스
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      // 약간의 딜레이 후 포커스 (애니메이션 완료 후)
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 배경 클릭으로 모달 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 지역 선택
  const handleRegionSelect = (region: Region) => {
    onSelect(region);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* 모달 컨텐츠 */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[80vh] flex flex-col animate-slide-up"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2
            id="search-modal-title"
            className="text-lg font-semibold text-text-primary"
          >
            지역 검색
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="검색 모달 닫기"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="p-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
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
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="지역명으로 검색 (예: 홍대, 강남)"
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="지역 검색"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="검색어 지우기"
              >
                <svg
                  className="w-4 h-4 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 검색 결과 목록 */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filteredRegions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-muted">검색 결과가 없습니다</p>
            </div>
          ) : (
            <ul className="space-y-2" role="listbox">
              {filteredRegions.map((region) => (
                <li key={region.id}>
                  <button
                    type="button"
                    onClick={() => handleRegionSelect(region)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl transition-colors text-left"
                    role="option"
                    aria-selected={false}
                    aria-label={`${region.name} 선택`}
                  >
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {region.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">
                          {region.name}
                        </span>
                        {region.hot && (
                          <span className="px-1.5 py-0.5 text-xs font-bold text-white bg-hot-badge rounded">
                            HOT
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-text-secondary">
                        {region.tagline} · {region.availableCourses}개 코스
                      </span>
                    </div>
                    <svg
                      className="w-5 h-5 text-text-muted flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
