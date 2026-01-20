package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 지역 Repository
 */
@Repository
public interface RegionRepository extends JpaRepository<Region, String> {

    /**
     * 표시 순서로 정렬하여 모든 지역 조회
     */
    List<Region> findAllByOrderByDisplayOrderAsc();

}
