package com.ddalkkak.date.controller;

import com.ddalkkak.date.dto.PlaceSearchResponse;
import com.ddalkkak.date.service.PlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 장소 검색 API 컨트롤러
 */
@Slf4j
@Tag(name = "Place", description = "장소 검색 API")
@RestController
@RequestMapping("/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    /**
     * 장소 검색
     */
    @Operation(summary = "장소 검색", description = "검색어, 지역, 정렬 기준으로 장소를 검색합니다")
    @GetMapping("/search")
    public ResponseEntity<Page<PlaceSearchResponse>> searchPlaces(
            @Parameter(description = "검색어 (장소명, 카테고리, 주소)")
            @RequestParam(required = false) String query,

            @Parameter(description = "지역 ID 필터")
            @RequestParam(required = false) String regionId,

            @Parameter(description = "정렬 기준 (distance, popularity, rating, 기본값: 데이트 적합도)")
            @RequestParam(required = false, defaultValue = "default") String sortBy,

            @Parameter(description = "페이지 번호 (0부터 시작)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "페이지 크기")
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("장소 검색 요청 - 검색어: {}, 지역: {}, 정렬: {}, 페이지: {}/{}", query, regionId, sortBy, page, size);

        Page<PlaceSearchResponse> result = placeService.searchPlaces(query, regionId, sortBy, page, size);

        log.info("장소 검색 완료 - 결과 수: {}", result.getNumberOfElements());

        return ResponseEntity.ok(result);
    }

    /**
     * 유사 장소 추천
     */
    @Operation(summary = "유사 장소 추천", description = "특정 장소와 유사한 장소를 추천합니다 (같은 카테고리, 같은 지역)")
    @GetMapping("/{placeId}/similar")
    public ResponseEntity<List<PlaceSearchResponse>> getSimilarPlaces(
            @Parameter(description = "기준 장소 ID")
            @PathVariable Long placeId,

            @Parameter(description = "결과 개수")
            @RequestParam(defaultValue = "5") int limit
    ) {
        log.info("유사 장소 추천 요청 - 기준 장소 ID: {}, 제한: {}", placeId, limit);

        List<PlaceSearchResponse> result = placeService.findSimilarPlaces(placeId, limit);

        log.info("유사 장소 추천 완료 - 결과 수: {}", result.size());

        return ResponseEntity.ok(result);
    }
}
