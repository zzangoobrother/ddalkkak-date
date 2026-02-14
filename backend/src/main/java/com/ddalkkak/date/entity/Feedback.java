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
 * 피드백 엔티티
 * 코스에 대한 사용자 피드백 정보를 저장
 */
@Entity
@Table(name = "feedbacks", indexes = {
        @Index(name = "idx_feedback_course_id", columnList = "course_id"),
        @Index(name = "idx_feedback_user_id", columnList = "user_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_feedback_course_user", columnNames = {"course_id", "user_id"})
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 평가 대상 코스
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    /**
     * 피드백 작성자 ID (카카오 ID)
     */
    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;

    /**
     * 전체 평점 (1~5)
     */
    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating;

    /**
     * 좋았던 점 옵션 (쉼표 구분 문자열)
     */
    @Column(name = "positive_options", length = 500)
    private String positiveOptions;

    /**
     * 아쉬운 점 옵션 (쉼표 구분 문자열)
     */
    @Column(name = "negative_options", length = 500)
    private String negativeOptions;

    /**
     * 자유 텍스트 피드백
     */
    @Column(name = "free_text", length = 100)
    private String freeText;

    /**
     * 생성일시
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 장소별 평가 목록
     */
    @OneToMany(mappedBy = "feedback", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FeedbackPlaceRating> placeRatings = new ArrayList<>();

    /**
     * 장소별 평가 추가
     */
    public void addPlaceRating(FeedbackPlaceRating placeRating) {
        placeRatings.add(placeRating);
        placeRating.setFeedback(this);
    }
}
