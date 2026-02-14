package com.ddalkkak.date.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 장소별 평가 엔티티
 * 피드백 내 개별 장소에 대한 추천/비추천 정보를 저장
 */
@Entity
@Table(name = "feedback_place_ratings", indexes = {
        @Index(name = "idx_fpr_feedback_id", columnList = "feedback_id"),
        @Index(name = "idx_fpr_place_id", columnList = "place_id")
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackPlaceRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 소속 피드백
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feedback_id", nullable = false)
    private Feedback feedback;

    /**
     * 평가 대상 장소 ID
     */
    @Column(name = "place_id", nullable = false)
    private Long placeId;

    /**
     * 추천 여부 (RECOMMEND, NOT_RECOMMEND)
     */
    @Column(name = "recommendation", nullable = false, length = 20)
    private String recommendation;

    /**
     * Feedback 설정 (양방향 연관관계)
     */
    public void setFeedback(Feedback feedback) {
        this.feedback = feedback;
    }
}
