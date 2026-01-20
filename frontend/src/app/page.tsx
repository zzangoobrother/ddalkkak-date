"use client";

import { useEffect } from "react";
import DateMap from "@/components/DateMap";
import { trackEvent, trackPageView } from "@/lib/analytics";
import type { Region, SelectionMethod } from "@/types/region";

export default function Home() {
  // 페이지 진입 시 Analytics 이벤트 전송
  useEffect(() => {
    trackPageView("date_map", "/");
    trackEvent("date_map_viewed");
  }, []);

  // 지역 선택 핸들러
  const handleRegionSelect = (region: Region, method: SelectionMethod) => {
    console.log(`선택된 지역: ${region.name} (${method})`);
  };

  // 다음 단계 핸들러
  const handleNext = (region: Region) => {
    trackEvent("next_step_clicked", {
      region_id: region.id,
      region_name: region.name,
    });
    // TODO: Step 2로 이동 (코스 옵션 선택)
    alert(`${region.name}에서 데이트 코스를 찾아볼게요! (Step 2 준비중)`);
  };

  return (
    <main className="min-h-screen bg-background">
      <DateMap onRegionSelect={handleRegionSelect} onNext={handleNext} />
    </main>
  );
}
