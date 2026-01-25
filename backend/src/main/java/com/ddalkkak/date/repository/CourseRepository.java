package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.Course;
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
}
