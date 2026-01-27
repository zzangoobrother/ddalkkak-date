package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.PlaceSearchResponse;
import com.ddalkkak.date.entity.Place;
import com.ddalkkak.date.repository.PlaceRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 장소 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final ObjectMapper objectMapper;

    /**
     * 장소 검색
     *
     * @param query    검색어 (장소명, 카테고리, 주소)
     * @param regionId 지역 ID 필터
     * @param sortBy   정렬 기준 (distance, popularity, rating)
     * @param page     페이지 번호 (0부터 시작)
     * @param size     페이지 크기
     * @return 검색 결과
     */
    public Page<PlaceSearchResponse> searchPlaces(String query, String regionId,
                                                   String sortBy, int page, int size) {
        log.info("장소 검색 시작 - 검색어: {}, 지역: {}, 정렬: {}, 페이지: {}, 크기: {}",
                query, regionId, sortBy, page, size);

        // 정렬 조건 설정
        Sort sort = createSort(sortBy);

        // 페이지 설정
        Pageable pageable = PageRequest.of(page, size, sort);

        // 검색 실행
        Page<Place> placePage;

        if (query == null || query.isBlank()) {
            // 검색어 없음: 지역별 전체 조회
            if (regionId != null && !regionId.isBlank()) {
                placePage = placeRepository.findByRegionId(regionId, pageable);
            } else {
                placePage = placeRepository.findAll(pageable);
            }
        } else {
            // 검색어 있음: 이름/카테고리/주소로 검색
            if (regionId != null && !regionId.isBlank()) {
                placePage = placeRepository.searchByQueryAndRegion(query, regionId, pageable);
            } else {
                placePage = placeRepository.searchByQuery(query, pageable);
            }
        }

        log.info("장소 검색 완료 - 결과 수: {}, 전체 페이지: {}", placePage.getNumberOfElements(), placePage.getTotalPages());

        // DTO 변환
        return placePage.map(this::toSearchResponse);
    }

    /**
     * 유사 장소 추천 (같은 카테고리, 같은 지역, 비슷한 가격대)
     *
     * @param placeId 기준 장소 ID
     * @param limit   결과 개수
     * @return 유사 장소 목록
     */
    public List<PlaceSearchResponse> findSimilarPlaces(Long placeId, int limit) {
        log.info("유사 장소 검색 시작 - 기준 장소 ID: {}, 제한: {}", placeId, limit);

        Place basePlace = placeRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("장소를 찾을 수 없습니다: " + placeId));

        // 같은 카테고리, 같은 지역, 자기 자신 제외
        List<Place> similarPlaces = placeRepository.findSimilarPlaces(
                basePlace.getCategory(),
                basePlace.getRegionId(),
                placeId,
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "dateScore", "rating"))
        );

        log.info("유사 장소 검색 완료 - 결과 수: {}", similarPlaces.size());

        return similarPlaces.stream()
                .map(this::toSearchResponse)
                .collect(Collectors.toList());
    }

    /**
     * Place 엔티티를 PlaceSearchResponse로 변환
     */
    private PlaceSearchResponse toSearchResponse(Place place) {
        return PlaceSearchResponse.builder()
                .id(place.getId())
                .name(place.getName())
                .category(place.getCategory())
                .address(place.getAddress())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                .regionId(place.getRegionId())
                .dateScore(place.getDateScore())
                .moodTags(parseMoodTags(place.getMoodTags()))
                .priceRange(place.getPriceRange())
                .bestTime(place.getBestTime())
                .rating(place.getRating())
                .reviewCount(place.getReviewCount())
                .recommendation(place.getRecommendation())
                .build();
    }

    /**
     * JSON 문자열을 List<String>으로 파싱
     */
    private List<String> parseMoodTags(String moodTagsJson) {
        if (moodTagsJson == null || moodTagsJson.isBlank()) {
            return Collections.emptyList();
        }

        try {
            return objectMapper.readValue(moodTagsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("무드 태그 파싱 실패: {}", moodTagsJson, e);
            return Collections.emptyList();
        }
    }

    /**
     * 정렬 조건 생성
     */
    private Sort createSort(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            // 기본 정렬: 데이트 적합도 + 평점
            return Sort.by(
                    Sort.Order.desc("dateScore"),
                    Sort.Order.desc("rating")
            );
        }

        return switch (sortBy.toLowerCase()) {
            case "popularity" -> Sort.by(Sort.Direction.DESC, "reviewCount", "rating");
            case "rating" -> Sort.by(Sort.Direction.DESC, "rating", "reviewCount");
            case "distance" -> Sort.by(Sort.Direction.ASC, "id"); // 거리 정렬은 추후 구현 (위치 기반 쿼리 필요)
            default -> Sort.by(Sort.Direction.DESC, "dateScore", "rating");
        };
    }
}
