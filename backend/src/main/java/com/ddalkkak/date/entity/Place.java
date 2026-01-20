package com.ddalkkak.date.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 장소 엔티티
 * Kakao Local API에서 수집한 기본 정보와 Claude AI가 분석한 큐레이션 정보를 포함
 */
@Entity
@Table(name = "places", indexes = {
        @Index(name = "idx_region_id", columnList = "region_id"),
        @Index(name = "idx_kakao_place_id", columnList = "kakao_place_id"),
        @Index(name = "idx_date_score", columnList = "date_score")
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Place {

    /**
     * 장소 ID (Primary Key)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 카카오 장소 ID
     */
    @Column(name = "kakao_place_id", nullable = false, unique = true, length = 50)
    private String kakaoPlaceId;

    /**
     * 장소 이름
     */
    @Column(nullable = false, length = 200)
    private String name;

    /**
     * 카테고리 (예: "음식점 > 카페", "문화,예술 > 영화관")
     */
    @Column(nullable = false, length = 100)
    private String category;

    /**
     * 주소
     */
    @Column(nullable = false, length = 300)
    private String address;

    /**
     * 도로명 주소
     */
    @Column(name = "road_address", length = 300)
    private String roadAddress;

    /**
     * 전화번호
     */
    @Column(length = 20)
    private String phone;

    /**
     * 위도
     */
    @Column(nullable = false)
    private Double latitude;

    /**
     * 경도
     */
    @Column(nullable = false)
    private Double longitude;

    /**
     * 소속 지역 ID (FK to Region)
     */
    @Column(name = "region_id", nullable = false, length = 50)
    private String regionId;

    /**
     * 데이트 적합도 점수 (1-10)
     * Claude AI가 분석한 점수
     */
    @Column(name = "date_score")
    private Integer dateScore;

    /**
     * 무드 태그 (최대 3개, JSON 배열 형식 저장)
     * 예: ["로맨틱", "조용한", "아늑한"]
     */
    @Column(name = "mood_tags", columnDefinition = "TEXT")
    private String moodTags;

    /**
     * 1인당 예상 가격대
     * 예: "10,000-20,000원", "30,000원 이상"
     */
    @Column(name = "price_range", length = 50)
    private String priceRange;

    /**
     * 추천 시간대
     * 예: "저녁", "오후", "점심"
     */
    @Column(name = "best_time", length = 50)
    private String bestTime;

    /**
     * 한 줄 추천 이유
     */
    @Column(columnDefinition = "TEXT")
    private String recommendation;

    /**
     * 생성일시
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 수정일시
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * AI 큐레이션 정보 업데이트
     */
    public void updateCuration(Integer dateScore, String moodTags, String priceRange,
                               String bestTime, String recommendation) {
        this.dateScore = dateScore;
        this.moodTags = moodTags;
        this.priceRange = priceRange;
        this.bestTime = bestTime;
        this.recommendation = recommendation;
    }
}
