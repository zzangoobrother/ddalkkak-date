package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.FeedbackPlaceRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 장소별 평가 Repository
 */
@Repository
public interface FeedbackPlaceRatingRepository extends JpaRepository<FeedbackPlaceRating, Long> {

    /**
     * 코스에 속한 장소별 추천 통계 집계
     * 결과: [placeId, recommendation, count]
     */
    @Query("SELECT fpr.placeId, fpr.recommendation, COUNT(fpr) " +
            "FROM FeedbackPlaceRating fpr " +
            "WHERE fpr.feedback.course.id = :courseId " +
            "GROUP BY fpr.placeId, fpr.recommendation")
    List<Object[]> findPlaceRecommendationStatsByCourseId(@Param("courseId") Long courseId);
}
