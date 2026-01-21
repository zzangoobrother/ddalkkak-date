package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.*;
import com.ddalkkak.date.entity.Place;
import com.ddalkkak.date.entity.Region;
import com.ddalkkak.date.repository.PlaceRepository;
import com.ddalkkak.date.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 코스 생성 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CourseService {

    private final PlaceRepository placeRepository;
    private final RegionRepository regionRepository;

    /**
     * 코스 생성
     */
    @Transactional(readOnly = true)
    public CourseResponse generateCourse(CourseGenerationRequest request) {
        long startTime = System.currentTimeMillis();

        try {
            // 1. 지역 정보 조회
            Region region = regionRepository.findById(request.getRegionId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 지역 ID: " + request.getRegionId()));

            // 2. 데이트 유형 및 예산 정보 파싱
            DateType dateType = DateType.fromId(request.getDateTypeId());
            int minBudget = request.getMinBudget();
            int maxBudget = request.getMaxBudget();

            log.info("코스 생성 시작 - 지역: {}, 데이트 유형: {}, 예산 범위: {}-{}원",
                    region.getName(), dateType.getName(), minBudget, maxBudget);

            // 3. 룰 기반 필터링으로 후보 장소 조회
            List<Place> candidatePlaces = filterPlacesByRules(
                    request.getRegionId(),
                    dateType,
                    minBudget,
                    maxBudget
            );

            log.info("필터링된 후보 장소 수: {}", candidatePlaces.size());

            // 4. LLM을 통한 코스 생성 (현재는 임시 구현)
            // TODO: LLM 통합 후 실제 AI 기반 코스 생성 로직 추가
            CourseResponse course = buildMockCourse(region, dateType, candidatePlaces, minBudget, maxBudget);

            long duration = System.currentTimeMillis() - startTime;
            log.info("코스 생성 완료 - 소요 시간: {}ms", duration);

            return course;

        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("코스 생성 실패 - 소요 시간: {}ms, 에러: {}", duration, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 룰 기반 필터링: 지역, 데이트 유형, 예산 범위에 맞는 장소 조회
     */
    private List<Place> filterPlacesByRules(String regionId, DateType dateType, int minBudget, int maxBudget) {
        // 지역별 모든 장소 조회
        List<Place> places = placeRepository.findByRegionId(regionId);

        log.debug("지역 {} 전체 장소 수: {}", regionId, places.size());

        // 필터링 및 정렬
        List<Place> filtered = places.stream()
                // 1. 평점 필터링: 4.0 이상
                .filter(place -> place.getRating() != null && place.getRating() >= 4.0)
                // 2. 리뷰 수 필터링: 50개 이상
                .filter(place -> place.getReviewCount() != null && place.getReviewCount() >= 50)
                // 3. 데이트 유형별 카테고리 필터링
                .filter(place -> matchesDateTypeCategory(place, dateType))
                // 4. 예산 범위 필터링 (±20% 허용)
                .filter(place -> matchesBudgetRange(place, minBudget, maxBudget))
                // 5. dateScore 기준 내림차순 정렬
                .sorted((p1, p2) -> {
                    Integer score1 = p1.getDateScore() != null ? p1.getDateScore() : 0;
                    Integer score2 = p2.getDateScore() != null ? p2.getDateScore() : 0;
                    return score2.compareTo(score1); // 내림차순
                })
                // 6. 상위 20개만 선택
                .limit(20)
                .collect(Collectors.toList());

        log.info("필터링 결과 - 전체: {}, 평점/리뷰: {}, 카테고리: {}, 예산: {}, 최종: {}",
                places.size(),
                places.stream().filter(p -> p.getRating() != null && p.getRating() >= 4.0
                        && p.getReviewCount() != null && p.getReviewCount() >= 50).count(),
                places.stream().filter(p -> matchesDateTypeCategory(p, dateType)).count(),
                places.stream().filter(p -> matchesBudgetRange(p, minBudget, maxBudget)).count(),
                filtered.size());

        return filtered;
    }

    /**
     * 데이트 유형에 맞는 카테고리인지 확인
     */
    private boolean matchesDateTypeCategory(Place place, DateType dateType) {
        if (place.getCategory() == null) {
            return false;
        }

        String category = place.getCategory().toLowerCase();

        switch (dateType) {
            case DINNER:
                return category.contains("음식점") || category.contains("레스토랑")
                        || category.contains("한식") || category.contains("양식")
                        || category.contains("일식") || category.contains("중식")
                        || category.contains("이탈리안") || category.contains("프렌치");

            case CAFE:
                return category.contains("카페") || category.contains("디저트")
                        || category.contains("베이커리") || category.contains("커피");

            case CULTURE:
                return category.contains("문화") || category.contains("예술")
                        || category.contains("갤러리") || category.contains("박물관")
                        || category.contains("전시") || category.contains("공연")
                        || category.contains("극장") || category.contains("영화");

            case ACTIVITY:
                return category.contains("레저") || category.contains("체험")
                        || category.contains("액티비티") || category.contains("스포츠")
                        || category.contains("방탈출") || category.contains("놀이");

            case NIGHT:
                return category.contains("바") || category.contains("펍")
                        || category.contains("루프탑") || category.contains("전망")
                        || category.contains("야경") || category.contains("공원");

            case SPECIAL:
                // 특별한 날은 모든 카테고리 허용
                return true;

            default:
                return true;
        }
    }

    /**
     * 예산 범위에 맞는지 확인 (±20% 허용)
     */
    private boolean matchesBudgetRange(Place place, int minBudget, int maxBudget) {
        if (place.getPriceRange() == null || place.getPriceRange().isEmpty()) {
            // 가격 정보가 없으면 허용
            return true;
        }

        try {
            PriceRange priceRange = parsePriceRange(place.getPriceRange());

            // ±20% 허용 범위 계산
            int adjustedMinBudget = (int) (minBudget * 0.8);
            int adjustedMaxBudget = (int) (maxBudget * 1.2);

            // 가격대가 예산 범위와 겹치는지 확인
            boolean overlaps = !(priceRange.max < adjustedMinBudget || priceRange.min > adjustedMaxBudget);

            if (!overlaps) {
                log.debug("예산 범위 불일치 - 장소: {}, 가격대: {}-{}, 예산: {}-{} (±20%: {}-{})",
                        place.getName(), priceRange.min, priceRange.max,
                        minBudget, maxBudget, adjustedMinBudget, adjustedMaxBudget);
            }

            return overlaps;

        } catch (Exception e) {
            log.warn("가격대 파싱 실패 - 장소: {}, priceRange: {}, 에러: {}",
                    place.getName(), place.getPriceRange(), e.getMessage());
            // 파싱 실패 시 허용
            return true;
        }
    }

    /**
     * priceRange 문자열을 파싱하여 최소/최대 금액 추출
     */
    private PriceRange parsePriceRange(String priceRangeStr) {
        // "10,000-20,000원" 형식
        if (priceRangeStr.contains("-")) {
            String[] parts = priceRangeStr.replace("원", "").replace(",", "").split("-");
            if (parts.length == 2) {
                int min = Integer.parseInt(parts[0].trim());
                int max = Integer.parseInt(parts[1].trim());
                return new PriceRange(min, max);
            }
        }

        // "30,000원 이상" 형식
        if (priceRangeStr.contains("이상")) {
            String numStr = priceRangeStr.replace("원", "").replace("이상", "").replace(",", "").trim();
            int min = Integer.parseInt(numStr);
            return new PriceRange(min, Integer.MAX_VALUE);
        }

        // "30,000원 이하" 형식
        if (priceRangeStr.contains("이하")) {
            String numStr = priceRangeStr.replace("원", "").replace("이하", "").replace(",", "").trim();
            int max = Integer.parseInt(numStr);
            return new PriceRange(0, max);
        }

        // "30,000원" 단일 금액 형식
        String numStr = priceRangeStr.replace("원", "").replace(",", "").trim();
        int price = Integer.parseInt(numStr);
        // 단일 금액은 ±30% 범위로 간주
        return new PriceRange((int)(price * 0.7), (int)(price * 1.3));
    }

    /**
     * 가격 범위 내부 클래스
     */
    private static class PriceRange {
        final int min;
        final int max;

        PriceRange(int min, int max) {
            this.min = min;
            this.max = max;
        }
    }

    /**
     * 임시 코스 생성 (LLM 통합 전까지 사용)
     */
    private CourseResponse buildMockCourse(Region region, DateType dateType,
                                           List<Place> candidatePlaces, int minBudget, int maxBudget) {
        String courseId = "course-" + UUID.randomUUID().toString().substring(0, 8);

        // 2-3개 장소 선택
        List<PlaceInCourseDto> places = new ArrayList<>();
        int numPlaces = Math.min(candidatePlaces.size(), 3);

        int totalCost = 0;
        int totalDuration = 0;

        for (int i = 0; i < numPlaces; i++) {
            Place place = candidatePlaces.get(i);
            // TODO: priceRange 파싱하여 정확한 금액 계산
            int estimatedCost = 30000 + (i * 10000); // 임시: 30000, 40000, 50000
            int duration = 60 + (i * 30); // 60분, 90분, 120분

            totalCost += estimatedCost;
            totalDuration += duration;

            places.add(PlaceInCourseDto.builder()
                    .placeId(place.getId())
                    .name(place.getName())
                    .category(place.getCategory())
                    .address(place.getAddress())
                    .latitude(place.getLatitude())
                    .longitude(place.getLongitude())
                    .durationMinutes(duration)
                    .estimatedCost(estimatedCost)
                    .recommendedMenu("추천 메뉴") // TODO: LLM으로 생성
                    .sequence(i + 1)
                    .transportToNext(i < numPlaces - 1 ? "도보 " + (5 + i * 5) + "분" : null)
                    .build());
        }

        return CourseResponse.builder()
                .courseId(courseId)
                .courseName(region.getName() + " " + dateType.getName())
                .regionId(region.getId())
                .regionName(region.getName())
                .dateTypeId(dateType.getId())
                .dateTypeName(dateType.getName())
                .totalDurationMinutes(totalDuration)
                .totalBudget(totalCost)
                .description(dateType.getDescription() + " 코스입니다.") // TODO: LLM으로 생성
                .places(places)
                .createdAt(System.currentTimeMillis())
                .build();
    }
}
