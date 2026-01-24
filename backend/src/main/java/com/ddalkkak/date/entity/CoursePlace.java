package com.ddalkkak.date.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 코스-장소 연관 엔티티
 * 코스에 포함된 장소 정보와 순서, 예상 비용, 추천 메뉴 등을 저장
 */
@Entity
@Table(name = "course_places", indexes = {
        @Index(name = "idx_course_id", columnList = "course_id"),
        @Index(name = "idx_place_id", columnList = "place_id")
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoursePlace {

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 소속 코스
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    /**
     * 장소
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    /**
     * 코스 내 순서 (1부터 시작)
     */
    @Column(nullable = false)
    private Integer sequence;

    /**
     * 해당 장소에서 소요 시간 (분)
     */
    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    /**
     * 예상 비용 (1인 기준)
     */
    @Column(name = "estimated_cost")
    private Integer estimatedCost;

    /**
     * 추천 메뉴/활동
     */
    @Column(name = "recommended_menu", columnDefinition = "TEXT")
    private String recommendedMenu;

    /**
     * 다음 장소로 이동 수단 및 시간
     * 예: "도보 5분", "지하철 10분"
     */
    @Column(name = "transport_to_next", length = 100)
    private String transportToNext;

    /**
     * Course 설정 (양방향 연관관계)
     */
    public void setCourse(Course course) {
        this.course = course;
    }
}
