package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.Course;
import com.ddalkkak.date.entity.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 코스 Repository
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    /**
     * courseId로 코스 조회
     */
    Optional<Course> findByCourseId(String courseId);

    /**
     * userId로 코스 목록 조회 (최신순)
     */
    List<Course> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * courseId와 userId로 코스 조회 (저장 여부 확인용)
     */
    Optional<Course> findByCourseIdAndUserId(String courseId, String userId);

    /**
     * 사용자가 저장한 코스 중 특정 상태의 코스만 조회
     */
    List<Course> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, CourseStatus status);

    /**
     * 사용자가 저장한 코스 수 조회 (DRAFT 제외)
     */
    long countByUserIdAndStatusNot(String userId, CourseStatus status);

    /**
     * 사용자 ID와 코스 ID로 코스 삭제 (본인 코스만 삭제 가능)
     */
    void deleteByCourseIdAndUserId(String courseId, String userId);

    /**
     * shareId로 코스 조회 (공유 페이지용)
     */
    Optional<Course> findByShareId(String shareId);
}
