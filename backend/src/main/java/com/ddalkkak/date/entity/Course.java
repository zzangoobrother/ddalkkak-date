package com.ddalkkak.date.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 코스 엔티티
 * AI가 생성한 데이트 코스 정보를 저장
 */
@Entity
@Table(name = "courses", indexes = {
        @Index(name = "idx_course_id", columnList = "course_id"),
        @Index(name = "idx_region_id", columnList = "region_id"),
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    /**
     * 코스 Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 코스 ID (외부에 노출되는 UUID 기반 ID)
     */
    @Column(name = "course_id", nullable = false, unique = true, length = 50)
    private String courseId;

    /**
     * 코스 이름
     */
    @Column(name = "course_name", nullable = false, length = 200)
    private String courseName;

    /**
     * 지역 ID
     */
    @Column(name = "region_id", nullable = false, length = 50)
    private String regionId;

    /**
     * 데이트 유형 ID
     */
    @Column(name = "date_type_id", nullable = false, length = 50)
    private String dateTypeId;

    /**
     * 총 소요 시간 (분)
     */
    @Column(name = "total_duration_minutes")
    private Integer totalDurationMinutes;

    /**
     * 총 예산 (원)
     */
    @Column(name = "total_budget")
    private Integer totalBudget;

    /**
     * 코스 설명
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * 사용자 ID (로그인 사용자의 경우, nullable)
     */
    @Column(name = "user_id", length = 100)
    private String userId;

    /**
     * 생성일시
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 코스에 포함된 장소 목록 (순서대로)
     */
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequence ASC")
    @Builder.Default
    private List<CoursePlace> coursePlaces = new ArrayList<>();

    /**
     * 코스에 장소 추가
     */
    public void addCoursePlace(CoursePlace coursePlace) {
        coursePlaces.add(coursePlace);
        coursePlace.setCourse(this);
    }

    /**
     * userId 설정 (코스 저장 시 사용)
     */
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
