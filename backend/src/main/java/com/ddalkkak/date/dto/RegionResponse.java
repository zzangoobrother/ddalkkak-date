package com.ddalkkak.date.dto;

import com.ddalkkak.date.entity.Region;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * 지역 정보 응답 DTO
 */
@Getter
@AllArgsConstructor
@Builder
public class RegionResponse {

    /**
     * 지역 ID
     */
    private String id;

    /**
     * 지역 이름
     */
    private String name;

    /**
     * 지역 이모지
     */
    private String emoji;

    /**
     * 가용 코스 수
     */
    private Integer availableCourses;

    /**
     * 지역 태그라인
     */
    private String tagline;

    /**
     * HOT 지역 여부
     */
    private Boolean hot;

    /**
     * 그리드 위치
     */
    private Position position;

    /**
     * 그리드 위치 정보
     */
    @Getter
    @AllArgsConstructor
    public static class Position {
        private Integer row;
        private Integer col;
    }

    /**
     * Region 엔티티로부터 RegionResponse 생성
     */
    public static RegionResponse from(Region region, Integer availableCourses, Boolean isHot) {
        return RegionResponse.builder()
                .id(region.getId())
                .name(region.getName())
                .emoji(region.getEmoji())
                .availableCourses(availableCourses)
                .tagline(region.getTagline())
                .hot(isHot)
                .position(new Position(region.getGridRow(), region.getGridCol()))
                .build();
    }

}
