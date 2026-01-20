package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.KakaoPlaceDto;
import com.ddalkkak.date.dto.PlaceCurationDto;
import com.ddalkkak.date.entity.Place;
import com.ddalkkak.date.repository.PlaceRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 장소 데이터 수집 서비스
 * Kakao API로 장소 수집 -> Claude AI 큐레이션 -> DB 저장
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PlaceCollectionService {

    private final KakaoLocalApiService kakaoLocalApiService;
    private final PlaceCurationService placeCurationService;
    private final PlaceRepository placeRepository;
    private final ObjectMapper objectMapper;

    /**
     * 특정 지역의 장소 데이터 수집
     *
     * @param regionId    지역 ID
     * @param latitude    지역 중심 위도
     * @param longitude   지역 중심 경도
     * @param radius      검색 반경 (미터)
     * @param categories  수집할 카테고리 그룹 코드 목록
     * @return 수집된 장소 개수
     */
    @Transactional
    public int collectPlacesForRegion(
            String regionId,
            Double latitude,
            Double longitude,
            Integer radius,
            List<String> categories
    ) {
        log.info("지역 장소 데이터 수집 시작: regionId={}, lat={}, lon={}, radius={}",
                regionId, latitude, longitude, radius);

        int totalCollected = 0;

        // 각 카테고리별로 장소 수집
        for (String category : categories) {
            int collected = collectPlacesByCategory(regionId, category, latitude, longitude, radius);
            totalCollected += collected;
            log.info("카테고리 {} 수집 완료: {}개", category, collected);

            // API 호출 제한을 고려한 딜레이 (1초)
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.warn("딜레이 중단: {}", e.getMessage());
            }
        }

        log.info("지역 {} 데이터 수집 완료: 총 {}개", regionId, totalCollected);
        return totalCollected;
    }

    /**
     * 특정 카테고리의 장소 수집
     */
    private int collectPlacesByCategory(
            String regionId,
            String categoryCode,
            Double latitude,
            Double longitude,
            Integer radius
    ) {
        int collectedCount = 0;
        int page = 1;
        boolean hasMore = true;

        while (hasMore && page <= 3) { // 최대 3페이지 (45개)까지 수집
            KakaoPlaceDto.Response response = kakaoLocalApiService.searchPlacesByCategory(
                    categoryCode,
                    String.valueOf(longitude),
                    String.valueOf(latitude),
                    radius,
                    page,
                    15
            );

            if (response == null || response.getDocuments() == null || response.getDocuments().isEmpty()) {
                break;
            }

            // 장소 저장
            for (KakaoPlaceDto.Document document : response.getDocuments()) {
                try {
                    if (savePlaceWithCuration(regionId, document)) {
                        collectedCount++;
                    }

                    // Claude API 호출 제한 고려 (0.5초 딜레이)
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.warn("장소 저장 중 딜레이 중단: {}", e.getMessage());
                } catch (Exception e) {
                    log.error("장소 저장 실패: placeName={}, error={}",
                            document.getPlaceName(), e.getMessage());
                }
            }

            hasMore = !response.getMeta().getIsEnd();
            page++;
        }

        return collectedCount;
    }

    /**
     * 장소 저장 (AI 큐레이션 포함)
     *
     * @param regionId 지역 ID
     * @param document Kakao 장소 문서
     * @return 저장 성공 여부
     */
    private boolean savePlaceWithCuration(String regionId, KakaoPlaceDto.Document document) {
        // 중복 체크
        if (placeRepository.existsByKakaoPlaceId(document.getId())) {
            log.debug("이미 존재하는 장소: kakaoPlaceId={}", document.getId());
            return false;
        }

        // 데이터 검증
        if (!validatePlaceData(document)) {
            log.warn("유효하지 않은 장소 데이터: {}", document.getPlaceName());
            return false;
        }

        try {
            // AI 큐레이션 수행
            PlaceCurationDto.CurationResult curation = placeCurationService.curatePlaceInfo(document);

            // Place 엔티티 생성
            Place place = Place.builder()
                    .kakaoPlaceId(document.getId())
                    .name(document.getPlaceName())
                    .category(document.getCategoryName())
                    .address(document.getAddressName())
                    .roadAddress(document.getRoadAddressName())
                    .phone(document.getPhone())
                    .latitude(Double.parseDouble(document.getY()))
                    .longitude(Double.parseDouble(document.getX()))
                    .regionId(regionId)
                    .build();

            // 큐레이션 정보 추가
            if (curation != null) {
                String moodTagsJson = objectMapper.writeValueAsString(curation.getMoodTags());
                place.updateCuration(
                        curation.getDateScore(),
                        moodTagsJson,
                        curation.getPriceRange(),
                        curation.getBestTime(),
                        curation.getRecommendation()
                );
            }

            placeRepository.save(place);
            log.debug("장소 저장 완료: {}", place.getName());
            return true;

        } catch (JsonProcessingException e) {
            log.error("JSON 변환 실패: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("장소 저장 중 오류: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * 장소 데이터 검증
     */
    private boolean validatePlaceData(KakaoPlaceDto.Document document) {
        if (document.getId() == null || document.getId().isBlank()) {
            return false;
        }
        if (document.getPlaceName() == null || document.getPlaceName().isBlank()) {
            return false;
        }
        if (document.getX() == null || document.getY() == null) {
            return false;
        }
        try {
            Double.parseDouble(document.getX());
            Double.parseDouble(document.getY());
        } catch (NumberFormatException e) {
            return false;
        }
        return true;
    }

    /**
     * 기존 장소에 대한 큐레이션 업데이트
     */
    @Transactional
    public int updateCurationForExistingPlaces() {
        log.info("기존 장소 큐레이션 업데이트 시작");

        List<Place> placesWithoutCuration = placeRepository.findAll().stream()
                .filter(place -> place.getDateScore() == null)
                .toList();

        int updatedCount = 0;
        for (Place place : placesWithoutCuration) {
            try {
                // Kakao 문서 형식으로 변환
                KakaoPlaceDto.Document document = new KakaoPlaceDto.Document(
                        place.getKakaoPlaceId(),
                        place.getName(),
                        place.getCategory(),
                        null, null,
                        place.getPhone(),
                        place.getAddress(),
                        place.getRoadAddress(),
                        String.valueOf(place.getLongitude()),
                        String.valueOf(place.getLatitude()),
                        null, null
                );

                PlaceCurationDto.CurationResult curation = placeCurationService.curatePlaceInfo(document);

                if (curation != null) {
                    String moodTagsJson = objectMapper.writeValueAsString(curation.getMoodTags());
                    place.updateCuration(
                            curation.getDateScore(),
                            moodTagsJson,
                            curation.getPriceRange(),
                            curation.getBestTime(),
                            curation.getRecommendation()
                    );
                    placeRepository.save(place);
                    updatedCount++;
                }

                // API 호출 제한 고려 딜레이
                Thread.sleep(500);
            } catch (Exception e) {
                log.error("큐레이션 업데이트 실패: placeId={}, error={}", place.getId(), e.getMessage());
            }
        }

        log.info("기존 장소 큐레이션 업데이트 완료: {}개", updatedCount);
        return updatedCount;
    }
}
