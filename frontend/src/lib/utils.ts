/**
 * 유틸리티 함수 모음
 */

/**
 * 지도 앱에서 장소 열기
 * @param latitude - 위도
 * @param longitude - 경도
 * @param name - 장소 이름
 */
export function openInMap(
  latitude: number,
  longitude: number,
  name: string
): void {
  // iOS Safari
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // 카카오맵 앱 시도
    const kakaoUrl = `kakaomap://look?p=${latitude},${longitude}`;
    window.location.href = kakaoUrl;

    // 카카오맵이 없으면 네이버 지도로 폴백
    setTimeout(() => {
      const naverUrl = `nmap://place?lat=${latitude}&lng=${longitude}&name=${encodeURIComponent(name)}`;
      window.location.href = naverUrl;
    }, 500);
  }
  // Android
  else if (/Android/i.test(navigator.userAgent)) {
    // 카카오맵 앱 시도
    const kakaoUrl = `kakaomap://look?p=${latitude},${longitude}`;
    window.location.href = kakaoUrl;

    // 카카오맵이 없으면 네이버 지도로 폴백
    setTimeout(() => {
      const naverUrl = `nmap://place?lat=${latitude}&lng=${longitude}&name=${encodeURIComponent(name)}`;
      window.location.href = naverUrl;
    }, 500);
  }
  // 데스크톱 - 웹 버전 열기
  else {
    const kakaoWebUrl = `https://map.kakao.com/link/map/${encodeURIComponent(name)},${latitude},${longitude}`;
    window.open(kakaoWebUrl, "_blank");
  }
}

/**
 * 소요 시간 포맷팅 (분 → 시간/분)
 * @param minutes - 소요 시간 (분)
 * @returns 포맷된 문자열 (예: "2시간 30분")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}시간 ${mins}분`;
  }
  if (hours > 0) {
    return `${hours}시간`;
  }
  return `${mins}분`;
}

/**
 * 금액 포맷팅 (원 → 만원)
 * @param amount - 금액 (원)
 * @returns 포맷된 문자열 (예: "3.5만원")
 */
export function formatBudget(amount: number): string {
  return `${(amount / 10000).toFixed(1)}만원`;
}
