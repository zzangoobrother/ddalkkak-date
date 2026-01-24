package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
     * userId로 코스 목록 조회
     */
    // List<Course> findByUserIdOrderByCreatedAtDesc(String userId);
}
