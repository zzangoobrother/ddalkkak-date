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

        // 필터링: 평점, 예산 범위 등
        // TODO: 데이트 유형에 맞는 카테고리 필터링 추가
        // TODO: 평점 4.0 이상, 리뷰 50개 이상 필터링 추가
        // TODO: priceRange 파싱하여 예산 범위 필터링 추가
        List<Place> filtered = places.stream()
                .filter(place -> {
                    // 현재는 priceRange가 String이므로 예산 필터링 스킵
                    // 향후 priceRange 파싱 로직 추가 필요
                    return true;
                })
                .limit(20) // 상위 20개만 선택
                .collect(Collectors.toList());

        return filtered;
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
