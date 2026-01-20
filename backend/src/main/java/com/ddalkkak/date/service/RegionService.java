package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.RegionResponse;
import com.ddalkkak.date.entity.Region;
import com.ddalkkak.date.repository.RegionRepository;
import com.ddalkkak.date.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 지역 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RegionService {

    private final RegionRepository regionRepository;
    private final VisitRepository visitRepository;

    /**
     * 모든 지역 정보 조회
     * - Hot 지역 판별 (최근 7일 방문 수 기준 상위 3개)
     * - 가용 코스 수 계산 (현재는 0으로 반환, 추후 코스 엔티티 구현 시 수정)
     */
    public List<RegionResponse> getAllRegions() {
        log.debug("모든 지역 정보 조회 시작");

        // 모든 지역 조회
        List<Region> regions = regionRepository.findAllByOrderByDisplayOrderAsc();

        // Hot 지역 ID 조회 (최근 7일 방문 수 기준 상위 3개)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<String> hotRegionIds = visitRepository.findTop3HotRegionIds(sevenDaysAgo);
        Set<String> hotRegionIdSet = new HashSet<>(hotRegionIds);

        log.debug("Hot 지역 ID: {}", hotRegionIds);

        // RegionResponse로 변환
        List<RegionResponse> responses = regions.stream()
                .map(region -> {
                    boolean isHot = hotRegionIdSet.contains(region.getId());
                    // TODO: 가용 코스 수 계산 (현재는 0으로 반환)
                    int availableCourses = 0;
                    return RegionResponse.from(region, availableCourses, isHot);
                })
                .collect(Collectors.toList());

        log.debug("지역 정보 조회 완료: {} 건", responses.size());
        return responses;
    }

}
