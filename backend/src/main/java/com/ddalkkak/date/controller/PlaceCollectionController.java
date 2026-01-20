package com.ddalkkak.date.controller;

import com.ddalkkak.date.service.PlaceCollectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 장소 데이터 수집 컨트롤러
 * 관리자용 API 엔드포인트
 */
@Slf4j
@RestController
@RequestMapping("/admin/places")
@RequiredArgsConstructor
@Tag(name = "Place Collection", description = "장소 데이터 수집 API (관리자용)")
public class PlaceCollectionController {

    private final PlaceCollectionService placeCollectionService;

    /**
     * 서울 12개 지역 중심 좌표 (위도, 경도)
     */
    private static final Map<String, double[]> REGION_COORDINATES = Map.ofEntries(
            Map.entry("jongno-gwanghwamun", new double[]{37.5720, 126.9769}),      // 종로·광화문
            Map.entry("mapo-hongdae", new double[]{37.5563, 126.9239}),             // 마포·홍대
            Map.entry("seongdong-seongsu", new double[]{37.5443, 127.0557}),       // 성동·성수
            Map.entry("yeongdeungpo-yeouido", new double[]{37.5219, 126.9245}),    // 영등포·여의도
            Map.entry("seongbuk-hyehwa", new double[]{37.5892, 127.0019}),         // 성북·혜화
            Map.entry("yongsan-itaewon", new double[]{37.5347, 126.9946}),         // 용산·이태원
            Map.entry("gwangjin-kondae", new double[]{37.5408, 127.0698}),         // 광진·건대
            Map.entry("seocho-gyodae", new double[]{37.4933, 127.0145}),           // 서초·교대
            Map.entry("junggu-myeongdong", new double[]{37.5636, 126.9850}),       // 중구·명동
            Map.entry("gangnam-yeoksam", new double[]{37.5008, 127.0365}),         // 강남·역삼
            Map.entry("songpa-jamsil", new double[]{37.5133, 127.1028}),           // 송파·잠실
            Map.entry("gangdong-cheonho", new double[]{37.5304, 127.1237})         // 강동·천호
    );

    /**
     * 데이트에 적합한 카테고리 그룹 코드 목록
     * CE7: 카페, FD6: 음식점, CT1: 문화시설, AT4: 관광명소
     */
    private static final List<String> DATE_CATEGORIES = List.of("CE7", "FD6", "CT1", "AT4");

    /**
     * 검색 반경 (미터) - 약 2km
     */
    private static final int SEARCH_RADIUS = 2000;

    @PostMapping("/collect/{regionId}")
    @Operation(summary = "특정 지역 장소 데이터 수집", description = "지정한 지역의 장소 데이터를 Kakao API로 수집하고 Claude AI로 큐레이션")
    public ResponseEntity<Map<String, Object>> collectPlacesForRegion(@PathVariable String regionId) {
        log.info("장소 데이터 수집 요청: regionId={}", regionId);

        double[] coordinates = REGION_COORDINATES.get(regionId);
        if (coordinates == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "존재하지 않는 지역 ID: " + regionId));
        }

        int count = placeCollectionService.collectPlacesForRegion(
                regionId,
                coordinates[0], // latitude
                coordinates[1], // longitude
                SEARCH_RADIUS,
                DATE_CATEGORIES
        );

        Map<String, Object> response = new HashMap<>();
        response.put("regionId", regionId);
        response.put("collectedCount", count);
        response.put("message", "데이터 수집 완료");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/collect-all")
    @Operation(summary = "전체 지역 장소 데이터 수집", description = "서울 12개 지역의 장소 데이터를 순차적으로 수집")
    public ResponseEntity<Map<String, Object>> collectAllRegions() {
        log.info("전체 지역 장소 데이터 수집 시작");

        Map<String, Integer> results = new HashMap<>();
        int totalCount = 0;

        for (Map.Entry<String, double[]> entry : REGION_COORDINATES.entrySet()) {
            String regionId = entry.getKey();
            double[] coordinates = entry.getValue();

            try {
                int count = placeCollectionService.collectPlacesForRegion(
                        regionId,
                        coordinates[0],
                        coordinates[1],
                        SEARCH_RADIUS,
                        DATE_CATEGORIES
                );
                results.put(regionId, count);
                totalCount += count;

                log.info("지역 {} 수집 완료: {}개", regionId, count);

                // 지역 간 딜레이 (2초)
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.warn("수집 중단: {}", e.getMessage());
                break;
            } catch (Exception e) {
                log.error("지역 {} 수집 실패: {}", regionId, e.getMessage());
                results.put(regionId, -1);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalCount", totalCount);
        response.put("results", results);
        response.put("message", "전체 지역 데이터 수집 완료");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update-curation")
    @Operation(summary = "기존 장소 큐레이션 업데이트", description = "큐레이션 정보가 없는 기존 장소들에 대해 Claude AI 분석 수행")
    public ResponseEntity<Map<String, Object>> updateCuration() {
        log.info("기존 장소 큐레이션 업데이트 요청");

        int count = placeCollectionService.updateCurationForExistingPlaces();

        Map<String, Object> response = new HashMap<>();
        response.put("updatedCount", count);
        response.put("message", "큐레이션 업데이트 완료");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/regions")
    @Operation(summary = "수집 가능한 지역 목록 조회", description = "데이터 수집이 가능한 서울 12개 지역 목록")
    public ResponseEntity<Map<String, Object>> getAvailableRegions() {
        Map<String, Object> response = new HashMap<>();
        response.put("regions", REGION_COORDINATES.keySet());
        response.put("categories", DATE_CATEGORIES);
        response.put("searchRadius", SEARCH_RADIUS);

        return ResponseEntity.ok(response);
    }
}
