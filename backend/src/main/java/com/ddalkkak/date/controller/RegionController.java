package com.ddalkkak.date.controller;

import com.ddalkkak.date.dto.RegionResponse;
import com.ddalkkak.date.service.RegionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 지역 API 컨트롤러
 */
@Tag(name = "Region", description = "지역 정보 API")
@RestController
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;

    /**
     * 모든 지역 정보 조회
     */
    @Operation(summary = "지역 목록 조회", description = "서울 12개 지역 정보와 가용 코스 수, HOT 지역 정보를 조회합니다")
    @GetMapping
    public ResponseEntity<List<RegionResponse>> getAllRegions() {
        List<RegionResponse> regions = regionService.getAllRegions();
        return ResponseEntity.ok(regions);
    }

}
