package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 피드백 Repository
 */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    /**
     * 코스 ID와 사용자 ID로 피드백 조회 (중복 확인용)
     */
    Optional<Feedback> findByCourse_IdAndUserId(Long courseId, String userId);

    /**
     * 코스의 평균 평점 조회
     */
    @Query("SELECT AVG(f.overallRating) FROM Feedback f WHERE f.course.id = :courseId")
    Double findAverageRatingByCourseId(@Param("courseId") Long courseId);

    /**
     * 코스의 피드백 수 조회
     */
    long countByCourse_Id(Long courseId);

    /**
     * 코스의 모든 피드백 조회
     */
    List<Feedback> findByCourse_Id(Long courseId);

    /**
     * 코스의 평점 분포 조회
     */
    @Query("SELECT f.overallRating, COUNT(f) FROM Feedback f WHERE f.course.id = :courseId GROUP BY f.overallRating")
    List<Object[]> findRatingDistributionByCourseId(@Param("courseId") Long courseId);
}
