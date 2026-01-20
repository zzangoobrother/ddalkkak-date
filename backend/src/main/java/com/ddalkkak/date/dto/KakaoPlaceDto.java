package com.ddalkkak.date.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Kakao Local API 장소 검색 응답 DTO
 */
public class KakaoPlaceDto {

    /**
     * Kakao API 응답 전체
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Meta meta;
        private List<Document> documents;
    }

    /**
     * 메타 정보
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Meta {
        @JsonProperty("total_count")
        private Integer totalCount;

        @JsonProperty("pageable_count")
        private Integer pageableCount;

        @JsonProperty("is_end")
        private Boolean isEnd;

        @JsonProperty("same_name")
        private SameName sameName;
    }

    /**
     * 동일 지명 정보
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SameName {
        private List<String> region;

        private String keyword;

        @JsonProperty("selected_region")
        private String selectedRegion;
    }

    /**
     * 장소 문서
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Document {
        /**
         * 장소 ID
         */
        private String id;

        /**
         * 장소명, 업체명
         */
        @JsonProperty("place_name")
        private String placeName;

        /**
         * 카테고리 이름
         */
        @JsonProperty("category_name")
        private String categoryName;

        /**
         * 카테고리 그룹 코드
         */
        @JsonProperty("category_group_code")
        private String categoryGroupCode;

        /**
         * 카테고리 그룹명
         */
        @JsonProperty("category_group_name")
        private String categoryGroupName;

        /**
         * 전화번호
         */
        private String phone;

        /**
         * 지번 주소
         */
        @JsonProperty("address_name")
        private String addressName;

        /**
         * 도로명 주소
         */
        @JsonProperty("road_address_name")
        private String roadAddressName;

        /**
         * X 좌표 (경도, longitude)
         */
        private String x;

        /**
         * Y 좌표 (위도, latitude)
         */
        private String y;

        /**
         * 장소 상세 페이지 URL
         */
        @JsonProperty("place_url")
        private String placeUrl;

        /**
         * 거리 (단위: meter)
         */
        private String distance;
    }
}
