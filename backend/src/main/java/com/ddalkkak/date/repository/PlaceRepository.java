package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 장소 Repository
 */
@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    /**
     * 카카오 장소 ID로 장소 조회
     */
    Optional<Place> findByKakaoPlaceId(String kakaoPlaceId);

    /**
     * 지역 ID로 장소 목록 조회
     */
    List<Place> findByRegionId(String regionId);

    /**
     * 지역 ID와 데이트 점수 기준으로 장소 목록 조회
     */
    List<Place> findByRegionIdAndDateScoreGreaterThanEqual(String regionId, Integer minDateScore);

    /**
     * 카카오 장소 ID 존재 여부 확인
     */
    boolean existsByKakaoPlaceId(String kakaoPlaceId);
}
