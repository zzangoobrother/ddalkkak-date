package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 방문 기록 Repository
 */
@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {

    /**
     * 최근 7일 방문 수가 많은 상위 3개 지역 ID 조회
     */
    @Query("SELECT v.regionId FROM Visit v " +
           "WHERE v.createdAt >= :since " +
           "GROUP BY v.regionId " +
           "ORDER BY COUNT(v.id) DESC " +
           "LIMIT 3")
    List<String> findTop3HotRegionIds(@Param("since") LocalDateTime since);

}
